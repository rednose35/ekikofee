import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero.jpg";
import matchaImg from "@/assets/matcha.jpg";
import taiyakiImg from "@/assets/taiyaki.jpg";
import mochisImg from "@/assets/mochis.jpg";
import coffeeImg from "@/assets/coffee.jpg";
import interiorImg from "@/assets/interior.jpg";
import matchaLatteImg from "@/assets/matcha-latte.jpg";
import taiyakiHandImg from "@/assets/taiyaki-hand.jpg";
import seatingImg from "@/assets/seating.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const services = [
  { title: "Matcha", desc: "Grado ceremonial de Uji, Japón.", img: matchaImg },
  { title: "Taiyaki", desc: "Clásico relleno de anko o crema.", img: taiyakiImg },
  { title: "Mochis", desc: "Suavidad artesanal en cada bocado.", img: mochisImg },
  { title: "Especialidad", desc: "Granos peruanos seleccionados.", img: coffeeImg },
];

const reviews = [
  { name: "Rafaela G.", text: "Los mejores Mochis de Lima. Comida 5/5, Servicio 5/5." },
  { name: "Marcia M.", text: "Todo estaba muy rico y fresco, el lugar es pequeño pero súper cálido y tranquilo. El matcha uno de los mejores." },
  { name: "Laura Jiménez", text: "Experiencia increíble. Silencioso, agradable para conversar. Ideal para ir en grupo pequeño." },
];

function Index() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <div className="bg-background text-foreground font-display selection:bg-primary/20">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-extrabold tracking-tighter text-xl">EKI KOFFEE</span>
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-tight uppercase">
            <a href="#servicios" className="hover:text-primary transition-colors">Servicios</a>
            <a href="#nosotros" className="hover:text-primary transition-colors">Nosotros</a>
            <a href="#galeria" className="hover:text-primary transition-colors">Galería</a>
          </div>
          <a href="#contacto" className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-bold hover:brightness-110 transition-all">Visítanos</a>
        </div>
      </nav>

      {/* Hero */}
      <section id="contacto" className="relative pt-12 pb-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-reveal">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] text-balance mb-6">
              Matcha, <span className="font-serif italic font-bold text-accent">Mochis</span> & Ritual.
            </h1>
            <p className="text-xl text-muted-foreground max-w-[45ch] text-pretty leading-relaxed mb-8">
              Un rincón artesanal en el corazón de Lima donde la tradición japonesa se encuentra con el alma peruana.
            </p>
            <div className="rounded-2xl overflow-hidden ring-1 ring-border shadow-xl aspect-[16/10] hidden lg:block">
              <img src={heroImg} alt="Interior de Eki Koffee" width={1024} height={640} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="lg:col-span-5 animate-reveal">
            <div className="bg-card p-8 rounded-2xl ring-1 ring-border shadow-xl">
              <h2 className="text-xl font-bold mb-6 tracking-tight">Pide información o reserva</h2>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!form.phone.trim() && !form.email.trim()) {
                    setStatus("error");
                    setErrorMsg("Ingresa tu teléfono o correo para poder contactarte.");
                    return;
                  }
                  setStatus("sending");
                  setErrorMsg("");
                  try {
                    const res = await fetch("/api/public/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(form),
                    });
                    if (!res.ok) throw new Error("send_failed");
                    setStatus("sent");
                    setForm({ name: "", phone: "", email: "", message: "" });
                  } catch {
                    setStatus("error");
                    setErrorMsg("No se pudo enviar. Intenta de nuevo en unos segundos.");
                  }
                }}
              >
                <input
                  required
                  maxLength={100}
                  type="text"
                  placeholder="Nombre completo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <input
                  maxLength={30}
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <input
                  maxLength={255}
                  type="email"
                  placeholder="Correo electrónico (opcional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <p className="text-xs text-muted-foreground -mt-2">
                  Déjanos al menos un teléfono o correo para responderte.
                </p>
                <textarea
                  maxLength={2000}
                  placeholder="Cuéntanos qué necesitas: reserva, evento, cantidad, fecha, etc."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                />
                {status === "error" && (
                  <p className="text-sm text-destructive" role="alert">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-60"
                >
                  {status === "sending"
                    ? "Enviando..."
                    : status === "sent"
                      ? "¡Gracias! Te contactaremos"
                      : "Enviar Mensaje"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="border-y border-border py-8 bg-card/50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-8 items-center text-center">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Valoración Google</span>
            <span className="text-2xl font-extrabold tracking-tight italic">5.0 / 5.0 ★</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Comunidad</span>
            <span className="text-2xl font-extrabold tracking-tight italic">3 Reseñas</span>
          </div>
          <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Ubicación</span>
            <span className="text-2xl font-extrabold tracking-tight italic">San Miguel, Lima</span>
          </div>
        </div>
      </div>

      {/* Services */}
      <section id="servicios" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
              Nuestra Carta <br />
              <span className="font-serif italic text-primary">Especializada</span>
            </h2>
            <p className="font-mono text-xs uppercase text-muted-foreground max-w-xs">
              Elaborado a mano diariamente con insumos de origen.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {services.map((s) => (
              <div key={s.title} className="group relative aspect-[4/5] overflow-hidden rounded-xl">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold tracking-tight">{s.title}</h3>
                  <p className="text-sm opacity-90">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="nosotros" className="py-24 bg-primary text-primary-foreground px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-5xl font-extrabold tracking-tighter mb-8 leading-none">
                ¿Por qué <br />Eki Koffee?
              </h2>
              <p className="opacity-80 text-lg max-w-md leading-relaxed">
                No somos solo una cafetería; somos un espacio de pausa y reconexión en Lima.
              </p>
            </div>
            <div className="space-y-12">
              {[
                { n: "01", t: "Artesanía Diaria", d: "Cada taiyaki se hornea al momento y cada matcha se bate con precisión ritual." },
                { n: "02", t: "Fusión Cultural", d: "Unimos la estética japonesa con la calidez del servicio limeño tradicional." },
                { n: "03", t: "Ambiente Cálido", d: "Un espacio diseñado para la conversación tranquila y el disfrute consciente." },
              ].map((it) => (
                <div key={it.n} className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-full border border-primary-foreground/20 flex items-center justify-center font-mono text-sm">
                    {it.n}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight italic">{it.t}</h3>
                    <p className="opacity-80">{it.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="galeria" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {[interiorImg, matchaLatteImg, taiyakiHandImg, seatingImg, mochisImg, matchaImg].map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden break-inside-avoid">
                <img src={src} alt="Eki Koffee" loading="lazy" width={800} height={1000} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-16 text-center">
            Lo que dicen <span className="font-serif italic text-accent">de nosotros</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {reviews.map((r) => (
              <div key={r.name} className="space-y-4">
                <div className="flex text-accent gap-1 text-sm">★★★★★</div>
                <p className="text-lg font-serif italic text-pretty">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-6xl md:text-7xl font-extrabold tracking-tighter italic">Visítanos hoy.</h2>
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground font-serif italic">Intisuyo 216, Lima 15088</p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Abierto de Martes a Domingo</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://maps.google.com/?q=Intisuyo+216+Lima+15088"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground text-background px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all"
            >
              Ver Mapa
            </a>
            <a
              href="#contacto"
              className="border border-border px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-card transition-all"
            >
              Hacer Reserva
            </a>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border text-center">
        <p className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest">
          © 2024 Eki Koffee Lima — Artesanía en cada taza.
        </p>
      </footer>
    </div>
  );
}
