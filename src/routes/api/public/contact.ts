import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const OWNER_EMAIL = "dieviv.24@gmail.com";

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: "Datos inválidos", details: parsed.error.flatten() },
            { status: 400 },
          );
        }

        const { name, phone, email, message } = parsed.data;

        // 1. Guardar en la base de datos (siempre)
        const SUPABASE_URL = process.env.SUPABASE_URL!;
        const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: { persistSession: false },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              if (
                SUPABASE_KEY.startsWith("sb_") &&
                h.get("Authorization") === `Bearer ${SUPABASE_KEY}`
              ) {
                h.delete("Authorization");
              }
              h.set("apikey", SUPABASE_KEY);
              return fetch(input, { ...init, headers: h });
            },
          },
        });

        const { data: inserted, error: dbError } = await supabase
          .from("contact_submissions")
          .insert({
            name,
            phone: phone || null,
            email: email || null,
            message: message || null,
          })
          .select("id, created_at")
          .single();

        if (dbError) {
          console.error("[contact] DB insert failed:", dbError);
          return Response.json(
            { error: "No se pudo guardar el mensaje" },
            { status: 500 },
          );
        }

        // 2. Enviar correo al dueño (dinámico: activo en cuanto exista el helper de plantillas)
        let emailStatus: "sent" | "not_configured" | "failed" = "not_configured";
        try {
          // @ts-expect-error - módulo opcional generado al configurar el dominio de correo
          const mod = await import("@/lib/email-templates/send-email").catch(() => null);
          if (mod?.sendTemplateEmail) {
            const result = await mod.sendTemplateEmail(
              "contact-notification",
              OWNER_EMAIL,
              {
                templateData: {
                  name,
                  phone: phone || "",
                  email: email || "",
                  message: message || "",
                  receivedAt: inserted.created_at,
                },
                idempotencyKey: `contact-${inserted.id}`,
              },
            );
            emailStatus = result.sent ? "sent" : "failed";
          }
        } catch (err) {
          console.error("[contact] email send failed:", err);
          emailStatus = "failed";
        }

        return Response.json({ ok: true, id: inserted.id, emailStatus, ownerEmail: OWNER_EMAIL });
      },
    },
  },
});