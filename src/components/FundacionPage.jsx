import React from 'react';
import {
  HeartHandshake, Users, Sprout, Landmark, Award, Stethoscope,
  MessageCircle, ArrowRight, GraduationCap, MapPin, Globe2, RefreshCcw
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   La Fundación — labor social de la Fundación Social Gimnasio
   Emocional Mentes Brillantes (entidad sin ánimo de lucro).
   Contenido basado en la información entregada por la dirección
   de la Fundación (julio 2026).
   ═══════════════════════════════════════════════════════════════ */

const CONTACT_EMAIL = 'fundacionsocial@gimnasioemocionalmb.com';
const CONTACT_PHONE = '+57 311 260 2355';

const STATS = [
  { value: '2016', label: 'Labor continua desde' },
  { value: '+5.000', label: 'Personas al año, presencial' },
  { value: '181', label: 'Familias acompañadas' },
  { value: 'Semanal', label: 'Encuentros gratuitos híbridos' }
];

const SOCIAL_WORK = [
  {
    icon: HeartHandshake,
    title: 'Encuentros comunitarios gratuitos',
    text: 'Cada semana realizamos encuentros presenciales de acceso libre en la Biblioteca Pública Carlos E. Restrepo (Bogotá), con transmisión virtual para personas dentro y fuera de Colombia: la Sala de Reducción del Ego y la Mentoría de Pasos, en cortesía para la comunidad.'
  },
  {
    icon: Users,
    title: 'Formación a lideresas y funcionarias',
    text: 'Talleres de oratoria, comunicación asertiva y liderazgo con sororidad para lideresas sociales y funcionarias del Distrito, en articulación con la Secretaría Distrital de la Mujer y el Comité Local Operativo de Mujer y Género (COLMYG).'
  },
  {
    icon: Landmark,
    title: 'Ferias de servicios y fechas emblemáticas',
    text: 'Participamos con nuestras metodologías en ferias de servicios y conmemoraciones en el Congreso de la República, las alcaldías locales de Antonio Nariño y Kennedy y la Casa de Igualdad de Oportunidades para las Mujeres (CIOM).'
  },
  {
    icon: Sprout,
    title: 'Salud mental, territorio y ambiente',
    text: 'En 2025, mediante presupuestos participativos con la Alcaldía Local de Antonio Nariño, co-creamos el proyecto de huertas urbanas con enfoque de género en la Huerta Comunitaria La Siempre Viva, hoy liderado por una egresada de nuestra metodología.'
  },
  {
    icon: Stethoscope,
    title: 'Prescripción social en salud',
    text: 'Estamos inscritos y viabilizados en la estrategia Más Bienestar 2026 de la Secretaría Distrital de Salud de Bogotá: profesionales de la salud pueden referir pacientes a nuestros espacios de apoyo psicoemocional gratuito.'
  },
  {
    icon: GraduationCap,
    title: 'Multiplicadoras de bienestar',
    text: 'Certificamos a mujeres que replican estas herramientas en sus hogares, comunidades y organizaciones — entre ellas la Fundación Calma, la Escuela Shama y la Huerta La Siempre Viva — multiplicando el impacto del modelo.'
  }
];

const RECOGNITIONS = [
  {
    year: '2025',
    title: 'Ministerio del Interior',
    text: 'Labor destacada en la revista institucional "Defensoras de nuestra Colombia" por la protección y prevención de violencias de género y la construcción de cultura de paz.'
  },
  {
    year: '2025 · 2026',
    title: 'Cumbre Global de Salud Mental',
    text: 'Seleccionados dos años consecutivos como ponentes, presentando el modelo como referente de inclusión social.'
  },
  {
    year: '2026',
    title: 'Secretaría Distrital de Salud',
    text: 'Organización inscrita, certificada y viabilizada en la estrategia Más Bienestar de prescripción social, junto a la Alcaldía Local de Antonio Nariño.'
  }
];

const ALLIES = [
  'Congreso de la República',
  'Ministerio del Interior',
  'Secretaría Distrital de la Mujer',
  'Secretaría Distrital de Salud',
  'Alcaldía Local de Antonio Nariño',
  'Alcaldía Local de Kennedy',
  'CIOM',
  'BibloRed',
  'SENA · Fondo Emprender',
  'Fundación Calma',
  'Escuela Shama',
  'Huerta La Siempre Viva',
  'Vipassana',
  'Mitra Latinoamérica'
];

const SERVE = [
  'Lideresas sociales, funcionarias públicas, mujeres cuidadoras y madres cabeza de hogar',
  'Familias en contextos de vulnerabilidad o riesgo psicosocial',
  'Niños, niñas, jóvenes y personas adultas mayores',
  'Una comunidad digital que nos acompaña desde Colombia y el exterior'
];

export default function FundacionPage(props) {
  const { GlobalStyles, Navbar, Footer, waNumber, onOpenTest } = props;

  const handleWA = () => {
    const text = encodeURIComponent('Hola, quiero conocer la labor social de la Fundación Social Gimnasio Emocional Mentes Brillantes.');
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  return (
    <>
      <GlobalStyles />
      <div className="noise-overlay"></div>
      <Navbar onOpenTest={onOpenTest} />

      <main className="bg-[#F2F0E9]">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pb-20 pt-32 md:px-12 md:pt-44">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#E2C17D]/[0.14] blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-[#2E4036]/[0.08] blur-3xl"></div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <span className="mb-5 inline-block rounded-full border border-[#2E4036]/15 bg-white px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#2E4036]">
              Entidad sin ánimo de lucro · Desde 2016
            </span>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-[#1A1A1A] md:text-6xl">
              Una fundación que entrena <span className="font-serif font-normal italic text-[#2E4036]">bienestar emocional</span> en comunidad
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-[#1A1A1A]/75 md:text-lg">
              La <strong className="font-bold">Fundación Social Gimnasio Emocional Mentes Brillantes</strong> (NIT 901.002.849-3, Bogotá, Colombia)
              entrega herramientas de inteligencia emocional, prevención de violencias y empoderamiento social a comunidades de Bogotá
              y a una comunidad digital dentro y fuera del país, con enfoque de género y diferencial.
            </p>
          </div>

          {/* Stats */}
          <div className="relative z-10 mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-3xl border border-[#2E4036]/10 bg-white p-6 text-center shadow-[0_18px_38px_rgba(46,64,54,0.08)]">
                <p className="font-heading text-3xl font-bold text-[#2E4036]">{s.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#1A1A1A]/55">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Labor social ─────────────────────────────────────── */}
        <section className="bg-white px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <span className="mb-4 block text-center font-mono text-xs font-bold uppercase tracking-widest text-[#CC5833]">
              Labor social gratuita
            </span>
            <h2 className="mx-auto max-w-3xl text-center font-heading text-3xl font-bold text-[#1A1A1A] md:text-5xl">
              Lo que hacemos por la comunidad, <span className="font-serif font-normal italic text-[#2E4036]">sin costo</span>
            </h2>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SOCIAL_WORK.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-[2rem] border border-[#2E4036]/10 bg-[#F7F4ED] p-7 transition-shadow hover:shadow-[0_22px_44px_rgba(46,64,54,0.12)]">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E4036] text-[#E2C17D]">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">{item.title}</h3>
                    <p className="mt-3 text-sm font-light leading-relaxed text-[#1A1A1A]/70">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── A quién servimos ─────────────────────────────────── */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-[#CC5833]">
                A quién servimos
              </span>
              <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] md:text-4xl">
                Personas y territorios <span className="font-serif font-normal italic text-[#2E4036]">en el centro</span>
              </h2>
              <ul className="mt-8 space-y-4">
                {SERVE.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] font-light leading-relaxed text-[#1A1A1A]/75">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#CC5833]"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-[#2E4036]/10 bg-white p-7 shadow-[0_18px_38px_rgba(46,64,54,0.08)]">
                <div className="mb-4 flex items-center gap-3">
                  <MapPin size={20} className="text-[#2E4036]" />
                  <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Cobertura presencial</h3>
                </div>
                <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/70">
                  Bogotá, con nodo comunitario en la Biblioteca Pública Carlos E. Restrepo (localidad Antonio Nariño) y articulación
                  con las demás localidades a través de ferias de servicios, casas de igualdad y entornos institucionales.
                </p>
              </div>
              <div className="rounded-[2rem] border border-[#2E4036]/10 bg-white p-7 shadow-[0_18px_38px_rgba(46,64,54,0.08)]">
                <div className="mb-4 flex items-center gap-3">
                  <Globe2 size={20} className="text-[#2E4036]" />
                  <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Comunidad digital</h3>
                </div>
                <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/70">
                  El modelo híbrido (encuentros virtuales, transmisiones y contenidos educativos) acompaña a personas en toda Colombia
                  y en el exterior que se formaron con nosotros y hoy replican las herramientas donde viven.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Cómo nos sostenemos ──────────────────────────────── */}
        <section className="bg-[#2E4036] px-6 py-20 text-[#F2F0E9] md:px-12 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E2C17D] text-[#2E4036]">
              <RefreshCcw size={26} />
            </div>
            <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-[#E2C17D]">
              Cómo nos sostenemos
            </span>
            <h2 className="font-heading text-3xl font-bold md:text-5xl">
              Un modelo solidario de <span className="font-serif font-normal italic text-[#E2C17D]">subsidios cruzados</span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base font-light leading-relaxed text-white/80 md:text-lg">
              Los espacios comunitarios — encuentros semanales, talleres territoriales, meditación y alfabetización emocional —
              son <strong className="font-bold text-white">100% gratuitos</strong> para la población vulnerable. Los procesos de certificación
              y los talleres contratados por empresas e instituciones aplican tarifa plena, y{' '}
              <strong className="font-bold text-white">el 100% de los excedentes se reinvierte en la labor social</strong>: becas para mujeres
              sin recursos, sostenimiento de los espacios gratuitos, tecnología para la comunidad digital y materiales educativos de libre acceso.
            </p>
            <p className="mt-5 font-serif text-xl italic text-[#E2C17D] md:text-2xl">
              Así, quien puede pagar cofinancia el bienestar de quien no puede.
            </p>
          </div>
        </section>

        {/* ── Reconocimientos ──────────────────────────────────── */}
        <section className="bg-white px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <span className="mb-4 block text-center font-mono text-xs font-bold uppercase tracking-widest text-[#CC5833]">
              Reconocimientos
            </span>
            <h2 className="mx-auto max-w-3xl text-center font-heading text-3xl font-bold text-[#1A1A1A] md:text-5xl">
              Validación <span className="font-serif font-normal italic text-[#2E4036]">institucional</span>
            </h2>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {RECOGNITIONS.map(({ year, title, text }) => (
                <article key={title} className="rounded-[2rem] border border-[#2E4036]/10 bg-[#F7F4ED] p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <Award size={22} className="text-[#CC5833]" />
                    <span className="font-mono text-xs font-bold text-[#2E4036]">{year}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">{title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-[#1A1A1A]/70">{text}</p>
                </article>
              ))}
            </div>

            {/* Aliados */}
            <div className="mt-16 text-center">
              <p className="mb-6 font-mono text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/50">
                Hemos trabajado en articulación con
              </p>
              <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2.5">
                {ALLIES.map((ally) => (
                  <span key={ally} className="rounded-full border border-[#2E4036]/15 bg-[#F2F0E9] px-4 py-2 text-xs font-medium text-[#2E4036]">
                    {ally}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Transparencia ────────────────────────────────────── */}
        <section className="px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-5xl">
            <span className="mb-4 block text-center font-mono text-xs font-bold uppercase tracking-widest text-[#CC5833]">
              Transparencia
            </span>
            <h2 className="mx-auto max-w-3xl text-center font-heading text-3xl font-bold text-[#1A1A1A] md:text-4xl">
              Datos abiertos y <span className="font-serif font-normal italic text-[#2E4036]">verificables</span>
            </h2>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <div className="rounded-[2rem] border border-[#2E4036]/10 bg-white p-7">
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Identidad legal</h3>
                <ul className="mt-4 space-y-2 text-sm font-light leading-relaxed text-[#1A1A1A]/75">
                  <li><strong className="font-bold">Razón social:</strong> Fundación Social Mentes Brillantes</li>
                  <li><strong className="font-bold">NIT:</strong> 901.002.849-3</li>
                  <li><strong className="font-bold">Naturaleza:</strong> Entidad sin ánimo de lucro (ESAL) colombiana</li>
                  <li><strong className="font-bold">Domicilio:</strong> Bogotá, Colombia</li>
                  <li><strong className="font-bold">Labor continua desde:</strong> 2016</li>
                </ul>
              </div>
              <div className="rounded-[2rem] border border-[#2E4036]/10 bg-white p-7">
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Validaciones externas</h3>
                <ul className="mt-4 space-y-2 text-sm font-light leading-relaxed text-[#1A1A1A]/75">
                  <li>Organización verificada en <strong className="font-bold">Google para Organizaciones sin Fines de Lucro</strong> (validación Goodstack, 2026).</li>
                  <li>Registrada en <strong className="font-bold">TechSoup Colombia</strong> (programa de tecnología para ESAL).</li>
                  <li>Inscrita y viabilizada en la estrategia <strong className="font-bold">Más Bienestar 2026</strong> de la Secretaría Distrital de Salud de Bogotá.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-[2rem] border border-[#2E4036]/10 bg-[#F7F4ED] p-7 text-center">
              <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/75">
                ¿Necesitas nuestro certificado de existencia, informes de gestión o soportes de la labor social?
                Escríbenos a{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-[#2E4036] underline decoration-[#2E4036]/30 underline-offset-4">{CONTACT_EMAIL}</a>{' '}
                o por WhatsApp al <strong className="font-bold">{CONTACT_PHONE}</strong> y te los compartimos.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] md:text-4xl">
              ¿Quieres participar o llevar este modelo a tu comunidad?
            </h2>
            <p className="mt-4 text-base font-light text-[#1A1A1A]/70">
              Escríbenos y te contamos cómo unirte a los encuentros gratuitos, referir a alguien que lo necesite o articular un proyecto con la Fundación.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleWA}
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white btn-magnetic shadow-lg"
              >
                <MessageCircle size={18} /> Escribir por WhatsApp
              </button>
              <a
                href="/#procesos"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#CC5833] transition-colors hover:text-[#2E4036]"
              >
                Conocer los procesos <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
