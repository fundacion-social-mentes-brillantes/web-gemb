import React from 'react';
import { Mail, MessageCircle, MapPin, Clock, HeartHandshake, Users, Building2, ArrowRight } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Contacto y participación — Fundación Social Mentes Brillantes.
   Muestra cómo participar de forma gratuita, cómo apoyar la labor
   y los datos institucionales de contacto.
   ═══════════════════════════════════════════════════════════════ */

const CONTACT_EMAIL = 'fundacionsocial@gimnasioemocionalmb.com';
const CONTACT_PHONE = '+57 311 260 2355';
const WA_LINK_BASE = 'https://wa.me/573112602355?text=';

const CHANNELS = [
  {
    icon: Mail,
    title: 'Correo institucional',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    note: 'Para articulaciones, alianzas, prensa, certificados e informes.'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: CONTACT_PHONE,
    href: `${WA_LINK_BASE}${encodeURIComponent('Hola, quiero información sobre la Fundación Social Mentes Brillantes.')}`,
    note: 'Atención de lunes a viernes. Escríbenos y te orientamos.'
  },
  {
    icon: MapPin,
    title: 'Sede de encuentros',
    value: 'Biblioteca Pública Carlos E. Restrepo',
    note: 'Localidad Antonio Nariño, Bogotá, Colombia. Espacio público de acceso libre.'
  },
  {
    icon: Building2,
    title: 'Datos institucionales',
    value: 'Fundación Social Mentes Brillantes · NIT 901.002.849-3',
    note: 'Entidad sin ánimo de lucro (ESAL) colombiana, con labor continua desde 2016.'
  }
];

const WAYS = [
  {
    icon: Users,
    title: 'Participa en los encuentros gratuitos',
    text: 'La Sala de Reducción del Ego y la Mentoría de Pasos son de acceso libre y no tienen costo. Se realizan cada semana de forma presencial en Bogotá y con conexión virtual para quienes están en otras ciudades o países.',
    action: 'Pedir el horario y el enlace',
    message: 'Hola, quiero participar en los encuentros comunitarios gratuitos de la Fundación. ¿Me comparten horario y enlace?'
  },
  {
    icon: HeartHandshake,
    title: 'Apoya la labor social',
    text: 'Puedes aportar como voluntaria o voluntario (facilitación, logística, comunicación), donar materiales o hacer un aporte económico destinado a las becas y a los espacios gratuitos. Te enviamos la información y el soporte del destino de tu aporte.',
    action: 'Quiero apoyar la Fundación',
    message: 'Hola, quiero apoyar la labor social de la Fundación (voluntariado, donación o materiales). ¿Me cuentan cómo?'
  },
  {
    icon: Building2,
    title: 'Articula un proyecto institucional',
    text: 'Trabajamos con alcaldías, secretarías, bibliotecas, colegios, empresas y otras organizaciones para llevar la metodología a comunidades. Escríbenos y coordinamos una reunión.',
    action: 'Proponer una articulación',
    message: 'Hola, represento a una entidad u organización y quiero articular un proyecto con la Fundación.'
  }
];

export default function ContactoPage(props) {
  const { GlobalStyles, Navbar, Footer, onOpenTest } = props;

  const openWA = (message) => {
    window.open(`${WA_LINK_BASE}${encodeURIComponent(message)}`, '_blank', 'noopener');
  };

  return (
    <>
      <GlobalStyles />
      <div className="noise-overlay"></div>
      <Navbar onOpenTest={onOpenTest} darkAtTop />

      <main className="bg-[#F2F0E9]">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-12 md:pt-44">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#E2C17D]/[0.14] blur-3xl"></div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <span className="mb-5 inline-block rounded-full border border-[#2E4036]/15 bg-white px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#2E4036]">
              Contacto y participación
            </span>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-[#1A1A1A] md:text-5xl">
              Hablemos, <span className="font-serif font-normal italic text-[#2E4036]">o simplemente ven</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-[#1A1A1A]/75 md:text-lg">
              Los espacios comunitarios de la <strong className="font-bold">Fundación Social Mentes Brillantes</strong> son
              gratuitos y abiertos: no necesitas pagar nada ni tener un proceso activo para participar. Aquí encuentras
              cómo asistir, cómo apoyar la labor y cómo contactarnos.
            </p>
          </div>
        </section>

        {/* ── Formas de participar ─────────────────────────────── */}
        <section className="bg-white px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="mx-auto max-w-3xl text-center font-heading text-3xl font-bold text-[#1A1A1A] md:text-4xl">
              Tres formas de <span className="font-serif font-normal italic text-[#2E4036]">estar</span>
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {WAYS.map((way) => {
                const Icon = way.icon;
                return (
                  <article key={way.title} className="flex flex-col rounded-[2rem] border border-[#2E4036]/10 bg-[#F7F4ED] p-7">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E4036] text-[#E2C17D]">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">{way.title}</h3>
                    <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-[#1A1A1A]/70">{way.text}</p>
                    <button
                      type="button"
                      onClick={() => openWA(way.message)}
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#2E4036] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#243328]"
                    >
                      {way.action} <ArrowRight size={16} />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Encuentros gratuitos ─────────────────────────────── */}
        <section className="px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-[#2E4036]/12 bg-white p-8 shadow-[0_18px_38px_rgba(46,64,54,0.08)] md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <Clock size={22} className="text-[#CC5833]" />
              <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] md:text-3xl">Encuentros comunitarios gratuitos</h2>
            </div>
            <div className="space-y-5 text-[15px] font-light leading-relaxed text-[#1A1A1A]/75">
              <p>
                <strong className="font-bold text-[#1A1A1A]">Sala de Reducción del Ego</strong> y{' '}
                <strong className="font-bold text-[#1A1A1A]">Mentoría de Pasos</strong>: encuentros semanales de entrenamiento
                emocional y espiritual, sin costo y sin requisitos de inscripción previa.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-[#2E4036]" />
                  <span>
                    <strong className="font-bold">Presencial:</strong> Biblioteca Pública Carlos E. Restrepo, localidad
                    Antonio Nariño, Bogotá. Es un espacio público de entrada libre.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle size={17} className="mt-0.5 shrink-0 text-[#2E4036]" />
                  <span>
                    <strong className="font-bold">Virtual:</strong> transmitimos los encuentros para personas en otras
                    ciudades de Colombia y en el exterior.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={17} className="mt-0.5 shrink-0 text-[#2E4036]" />
                  <span>
                    <strong className="font-bold">Horario:</strong> los encuentros son semanales y las fechas se coordinan
                    por WhatsApp. Escríbenos y te confirmamos el día, la hora y el enlace vigentes.
                  </span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => openWA('Hola, quiero el horario y el enlace de los encuentros comunitarios gratuitos de la Fundación.')}
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#20bd5a]"
              >
                <MessageCircle size={17} /> Pedir horario por WhatsApp
              </button>
            </div>
          </div>
        </section>

        {/* ── Canales ──────────────────────────────────────────── */}
        <section className="bg-[#2E4036] px-6 py-20 text-[#F2F0E9] md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="mx-auto max-w-3xl text-center font-heading text-3xl font-bold md:text-4xl">
              Datos de <span className="font-serif font-normal italic text-[#E2C17D]">contacto</span>
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {CHANNELS.map((ch) => {
                const Icon = ch.icon;
                const inner = (
                  <>
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E2C17D] text-[#2E4036]">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#E2C17D]">{ch.title}</h3>
                    <p className="mt-2 font-heading text-lg font-bold text-white">{ch.value}</p>
                    <p className="mt-2 text-sm font-light leading-relaxed text-white/65">{ch.note}</p>
                  </>
                );
                return ch.href ? (
                  <a
                    key={ch.title}
                    href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined}
                    rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="rounded-[2rem] border border-white/12 bg-white/[0.04] p-7 transition-colors hover:bg-white/[0.08]"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={ch.title} className="rounded-[2rem] border border-white/12 bg-white/[0.04] p-7">
                    {inner}
                  </div>
                );
              })}
            </div>

            <p className="mx-auto mt-10 max-w-3xl text-center text-sm font-light leading-relaxed text-white/60">
              Tratamos tus datos según nuestra{' '}
              <a href="/politica-de-privacidad" className="font-bold text-[#E2C17D] underline decoration-[#E2C17D]/40 underline-offset-4">
                política de tratamiento de datos personales
              </a>{' '}
              (Ley 1581 de 2012).
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
