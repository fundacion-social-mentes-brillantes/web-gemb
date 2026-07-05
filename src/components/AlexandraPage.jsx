import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, ArrowUpRight, MessageCircle, Sparkles, Quote, ChevronDown,
  CheckCircle2, Star, Users, Feather, Brain, Handshake, LifeBuoy, BarChart3,
  GraduationCap, Library, Building2, Landmark, Mail, Phone, Instagram,
  Facebook, BookOpen, Award, Mic, Leaf, Heart, Pause, Play
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   ALEXANDRA ORTEGA · Página "¿Quién es Alexandra?"
   Hoja de vida viva: reveals por scroll, contadores, línea de
   tiempo interactiva, selector de servicios por institución,
   acordeón del modelo y marquesina de instituciones.
   ═══════════════════════════════════════════════════════════════ */

const AX_STYLES = `
  .ax-script { font-family: 'Great Vibes', cursive; }

  .ax-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.85s ease, transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: var(--ax-d, 0s);
  }
  .ax-reveal.is-in { opacity: 1; transform: none; }

  @keyframes ax-ring-spin { to { transform: rotate(360deg); } }
  .ax-ring {
    background: conic-gradient(from 0deg, rgba(226,193,125,0), rgba(226,193,125,0.85), rgba(204,88,51,0.55), rgba(226,193,125,0));
    animation: ax-ring-spin 14s linear infinite;
  }

  @keyframes ax-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
  }
  .ax-float { animation: ax-float 7s ease-in-out infinite; }

  @keyframes ax-word-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .ax-word { display: inline-block; animation: ax-word-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

  @keyframes ax-swap {
    from { opacity: 0; transform: translateY(18px) scale(0.99); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .ax-swap { animation: ax-swap 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }

  @keyframes ax-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .ax-marquee-track {
    display: flex;
    width: max-content;
    animation: ax-marquee 32s linear infinite;
  }
  .ax-marquee:hover .ax-marquee-track,
  .ax-marquee:focus-within .ax-marquee-track,
  .ax-marquee-track.is-paused { animation-play-state: paused; }

  @keyframes ax-scroll-dot {
    0% { opacity: 0; transform: translateY(0); }
    35% { opacity: 1; }
    100% { opacity: 0; transform: translateY(16px); }
  }
  .ax-scroll-dot { animation: ax-scroll-dot 1.8s ease-in-out infinite; }

  .ax-book { transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease; }
  .ax-book:hover { transform: translateY(-10px) rotate(0deg) !important; box-shadow: 0 24px 45px rgba(26,26,26,0.28); }

  @media (prefers-reduced-motion: reduce) {
    .ax-reveal { opacity: 1; transform: none; transition: none; }
    .ax-ring, .ax-float, .ax-word, .ax-swap, .ax-marquee-track, .ax-scroll-dot { animation: none !important; }
    .ax-marquee-track { width: auto; }
    .ax-marquee-track > div { flex-wrap: wrap; justify-content: center; row-gap: 0.5rem; }
    .ax-marquee-track > div[aria-hidden="true"] { display: none; }
  }
`;

/* ── Datos (contenido íntegro de la hoja de vida) ─────────────── */

const HERO_ROLES = ['Tallerista', 'Conferencista', 'Formadora en salud mental', 'Psicóloga', 'Coach Ontológica'];

const STATS = [
  { value: 2016, isYear: true, label: 'Inicio de una trayectoria continua liderando procesos en salud mental y comunidad' },
  { value: 176, prefix: '+', label: 'Mujeres formadas como replicadoras de bienestar con la técnica GEMB' },
  { value: 7, prefix: '+', label: 'Años acompañando procesos de duelo humano y de mascotas' },
  { value: 2025, isYear: true, label: 'Ponente en la Cumbre Global de Salud Mental por la metodología GEMB' }
];

const PILLARS = ['Inteligencia emocional', 'Prevención en salud mental', 'Liderazgo consciente', 'Enfoque de género', 'Duelo y resignificación', 'Construcción de paz'];

const TIMELINE = [
  {
    year: '2016',
    tag: 'El origen',
    title: 'Inicio del liderazgo social y terapéutico',
    text: 'Comienza procesos de formación en inteligencia emocional y acompañamiento comunitario, con participación sostenida en el COLMYEG de Antonio Nariño y en presupuestos participativos del territorio.'
  },
  {
    year: '2019',
    tag: 'Alianza territorial',
    title: 'Articulación con la Biblioteca Carlos E. Restrepo',
    text: 'Inicia un trabajo articulado con la Biblioteca Pública Carlos E. Restrepo, acompañando a sus usuarios en procesos de lectura, estudio y comprensión de la mente, las emociones y la conducta humana.'
  },
  {
    year: '2023',
    tag: 'Reconocimiento',
    title: 'Reconocimiento como lideresa incidente',
    text: 'Diplomado en Formulación de Proyectos con Enfoque de Género (UNAD) y reconocimiento por su liderazgo social y su participación en los derechos de las mujeres.'
  },
  {
    year: '2024',
    tag: 'Proyecto en territorio',
    title: 'Huertas Urbanas con Enfoque de Género',
    text: 'Impulsa el proyecto 32766 desde presupuestos participativos, orientado al fortalecimiento emocional, económico, ambiental y cultural de mujeres y comunidad en el territorio.'
  },
  {
    year: '2025',
    tag: 'Hito global',
    title: 'Ponente en la Cumbre Global de Salud Mental',
    text: 'Invitada como ponente por la metodología Gimnasio Emocional Mentes Brillantes, presentada como movimiento pedagógico y terapéutico para la alfabetización emocional y la prevención en salud mental.'
  },
  {
    year: '2026',
    tag: 'Incidencia distrital',
    title: 'Círculo de Estado Abierto de Bogotá',
    text: 'La Fundación Social GEMB es invitada a participar en este espacio de articulación con organizaciones, postulando su modelo de prevención y fortalecimiento de la salud mental como herramienta de construcción de paz territorial.'
  }
];

const SUMMIT_IDEAS = [
  'Vivimos con mucha información, pero poco autoconocimiento. La mente también necesita entrenamiento.',
  'GEMB fortalece músculos invisibles: paciencia, tolerancia, empatía, resiliencia y amor propio.',
  'La salud mental no es solo ausencia de ansiedad o depresión, sino el arte de vivir bien.',
  'Cada persona entrenada emocionalmente puede convertirse en un territorio de paz que transforma familias y comunidades.'
];

const AREAS = [
  { icon: Brain, title: 'Gestión emocional', text: 'Programas vivenciales y mindfulness para regular, comprender y entrenar las emociones.' },
  { icon: Feather, title: 'Duelo y resignificación', text: 'Más de 7 años acompañando pérdidas humanas y de mascotas hacia nuevos comienzos.' },
  { icon: Star, title: 'Liderazgo y enfoque de género', text: 'Formación y empoderamiento de lideresas sociales con educación de enfoque de género.' },
  { icon: Mic, title: 'Comunicación asertiva', text: 'Oratoria, facilitación y conferencias de alto impacto social.' },
  { icon: Users, title: 'Empoderamiento femenino', text: 'Redes de mujeres y multiplicadoras de bienestar, derechos, paz, arte y cultura.' },
  { icon: LifeBuoy, title: 'Manejo de adicciones', text: 'Acompañamiento terapéutico con la técnica de 12 pasos, avalada por la OMS.' },
  { icon: Handshake, title: 'Resolución de conflictos', text: 'Mediación, conciliación y construcción de paz en comunidad.' },
  { icon: BarChart3, title: 'Proyectos sociales', text: 'Formulación y co-creación de iniciativas comunitarias y presupuestos participativos.' }
];

const AUDIENCES = [
  { id: 'bibliotecas', label: 'Bibliotecas', icon: Library, message: 'Hola, represento una biblioteca y quiero una propuesta de talleres o conferencias con Alexandra Ortega.' },
  { id: 'colegios', label: 'Colegios y educación', icon: GraduationCap, message: 'Hola, represento una institución educativa y quiero una propuesta de talleres o conferencias con Alexandra Ortega.' },
  { id: 'empresas', label: 'Empresas y equipos', icon: Building2, message: 'Hola, represento una empresa y quiero una propuesta de bienestar emocional con Alexandra Ortega.' },
  { id: 'entidades', label: 'Entidades y fundaciones', icon: Landmark, message: 'Hola, represento una entidad y quiero una propuesta de formación en salud mental con Alexandra Ortega.' }
];

const SERVICES = [
  { title: 'Talleres de inteligencia emocional', text: 'Procesos vivenciales para reconocer, comprender y entrenar las emociones.', fit: ['bibliotecas', 'colegios', 'empresas', 'entidades'] },
  { title: 'Prevención en salud mental comunitaria', text: 'Estrategias de cuidado colectivo y detección temprana del malestar emocional.', fit: ['bibliotecas', 'colegios', 'entidades'] },
  { title: 'Duelo y resignificación de pérdidas', text: 'Acompañamiento de pérdidas humanas y de mascotas hacia nuevos comienzos.', fit: ['bibliotecas', 'colegios', 'entidades'] },
  { title: 'Comunicación asertiva y convivencia', text: 'Herramientas para el diálogo, la convivencia y la resolución pacífica de conflictos.', fit: ['colegios', 'empresas', 'entidades'] },
  { title: 'Liderazgo femenino y enfoque de género', text: 'Formación de lideresas y promoción de la equidad en el territorio.', fit: ['entidades', 'empresas'] },
  { title: 'Autocuidado para mujeres cuidadoras', text: 'Espacios de descanso emocional y autocuidado para quienes cuidan a otros.', fit: ['entidades', 'empresas'] },
  { title: 'Formación de formadoras', text: 'Estrategia para capacitar mujeres como multiplicadoras de bienestar y derechos.', fit: ['entidades'] },
  { title: 'Círculos de lectura emocional', text: 'Lectura y diálogo sobre la mente, las emociones y el desarrollo humano.', fit: ['bibliotecas', 'colegios'] },
  { title: 'Conferencias: personas como territorios de paz', text: 'Charlas inspiradoras sobre salud mental, convivencia y paz sostenible.', fit: ['bibliotecas', 'colegios', 'empresas', 'entidades'] },
  { title: 'Bienestar a través del arte y la cultura', text: 'Procesos que integran arte, cultura y participación ciudadana al cuidado emocional.', fit: ['bibliotecas', 'entidades'] }
];

const MODEL = [
  { title: 'Efectividad', text: 'Resultados medidos por participación, permanencia, testimonios de transformación y evidencias de cambio personal, familiar y social. Cuenta con una red viva de personas entrenadas para mitigar el ruido emocional y prevenir violencias.' },
  { title: 'Eficiencia', text: 'Planeación colaborativa con roles definidos en dirección metodológica, acompañamiento psicológico, coaching, logística, contenidos y atención comunitaria, con seguimiento financiero, operativo y administrativo.' },
  { title: 'Relevancia', text: 'Nace de procesos de apoyo mutuo y lectura emocional y evoluciona hacia una metodología territorial propia. A través de "Formar Formadoras", capacita mujeres como multiplicadoras de bienestar, derechos, paz, arte y cultura.' },
  { title: 'Enfoque diferencial', text: 'Contempla a mujeres cuidadoras, madres cabeza de hogar, jóvenes, personas mayores, personas con discapacidad y comunidad LGTBQ+, atendiendo duelos, dependencia emocional, violencias y barreras frente a la salud mental.' },
  { title: 'Sostenibilidad', text: 'Funciona con un modelo mixto de economía social: talleres, mentorías y servicios privados, subsidios cruzados, alianzas institucionales, espacios comunitarios, procesos gratuitos y gestión de recursos públicos o de fomento cuando aplica.' }
];

const INSTITUTIONS = [
  'Secretaría Distrital de la Mujer',
  'Ministerio del Interior',
  'Fuerzas Armadas de Colombia',
  'Secretaría de Salud de Bogotá',
  'Alcaldía Local de Antonio Nariño',
  'Biblioteca Carlos E. Restrepo · BibloRed',
  'COLMYEG de Antonio Nariño'
];

const HONORS = [
  { title: 'Lideresa incidente', text: 'Reconocida por la Alcaldía Local de Antonio Nariño por su liderazgo social y su participación en los derechos de las mujeres.' },
  { title: 'Defensoras de Nuestra Colombia', text: 'Preseleccionada en 2026 por el Ministerio del Interior para la revista nacional "Defensoras de Nuestra Colombia".' },
  { title: 'Gala de Control Social', text: 'Reconocimiento en la categoría Paz y Reconciliación, como hito de incidencia territorial.' },
  { title: 'COLMYEG · desde 2016', text: 'Participación sostenida en escenarios locales de mujer y equidad de género en Antonio Nariño.' },
  { title: 'Presupuestos participativos', text: 'Representante de proyectos comunitarios, entre ellos el 32766 "Huertas Urbanas con Enfoque de Género".' },
  { title: 'Seguridad y paz para las mujeres', text: 'Participación en escenarios de seguridad para las mujeres y de construcción de convivencia en el Distrito Capital.' }
];

const EDUCATION = [
  { title: 'Psicología', detail: 'Politécnico Grancolombiano' },
  { title: 'Psicología clínica infantil', detail: 'Especialización profesional' },
  { title: 'Coach Ontológica', detail: 'Certificación profesional' },
  { title: 'Diplomado en Formulación de Proyectos con Enfoque de Género', detail: 'UNAD · 2023' },
  { title: 'Diplomado en Innovación Pública y Formulación de Proyectos', detail: 'OEI y Alcaldía Mayor · 2022' },
  { title: 'Entrenadora Élite en Oratoria y Transformación Personal', detail: 'Total Potentials' },
  { title: 'Acompañamiento del duelo humano y de mascotas', detail: '+7 años de experiencia' }
];

const BOOKS = [
  { label: 'Meditaciones', gradient: 'from-[#2E4036] to-[#1A1A1A]', rotate: '-rotate-3' },
  { label: 'Desarrollo personal', gradient: 'from-[#CC5833] to-[#8a3a20]', rotate: 'rotate-2' },
  { label: 'Empoderamiento', gradient: 'from-[#E2C17D] to-[#b5924e]', rotate: '-rotate-2' }
];

const ALEXANDRA_EMAIL = 'yaosproactiva@hotmail.com';
const ALEXANDRA_TEL = '+573208413878';

/* ── Piezas dinámicas ─────────────────────────────────────────── */

const ROLES_STATIC = 'tallerista, conferencista y formadora en salud mental';

const RotatingRole = () => {
  const [index, setIndex] = useState(0);
  const [settled, setSettled] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  /* Rota una sola vuelta y se detiene en la frase completa,
     para no dejar contenido en movimiento indefinido. */
  useEffect(() => {
    if (settled) return undefined;
    let count = 0;
    const id = window.setInterval(() => {
      count += 1;
      if (count >= HERO_ROLES.length) {
        window.clearInterval(id);
        setSettled(true);
        return;
      }
      setIndex(count);
    }, 2600);
    return () => window.clearInterval(id);
  }, [settled]);

  if (settled) {
    return <span className="text-[#E2C17D]">{ROLES_STATIC}</span>;
  }

  return (
    <span className="inline-flex min-h-[1.6em] items-center overflow-hidden">
      <span key={index} className="ax-word text-[#E2C17D]">{HERO_ROLES[index]}</span>
    </span>
  );
};

const Counter = ({ value, prefix = '', isYear = false }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (isYear || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      el.textContent = `${prefix}${value}`;
      return undefined;
    }

    let raf = 0;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);
        const start = performance.now();
        const duration = 1600;
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = `${prefix}${Math.round(eased * value)}`;
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });

    el.textContent = `${prefix}0`;
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, prefix, isYear]);

  return <span ref={ref}>{`${prefix}${value}`}</span>;
};

const SectionEyebrow = ({ children, light = false }) => (
  <span className={`ax-reveal font-mono text-xs font-bold uppercase tracking-[0.22em] ${light ? 'text-[#E2C17D]' : 'text-[#CC5833]'}`}>
    {children}
  </span>
);

/* ── Página ───────────────────────────────────────────────────── */

const AlexandraPage = (props) => {
  const { GlobalStyles, Navbar, Footer, waNumber, onOpenTest } = props;
  const pageRef = useRef(null);
  const progressRef = useRef(null);
  const photoRef = useRef(null);
  const [activeMilestone, setActiveMilestone] = useState(TIMELINE.length - 1);
  const [audience, setAudience] = useState(null);
  const [openModel, setOpenModel] = useState(0);
  const [marqueePaused, setMarqueePaused] = useState(false);

  const handleWA = (message) => {
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  /* Reveals por scroll (IntersectionObserver, sin GSAP) */
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return undefined;

    const reveals = root.querySelectorAll('.ax-reveal');
    reveals.forEach((el) => {
      const siblings = el.parentElement
        ? [...el.parentElement.children].filter((child) => child.classList.contains('ax-reveal'))
        : [el];
      const index = siblings.indexOf(el);
      el.style.setProperty('--ax-d', `${Math.min(index * 0.09, 0.45)}s`);
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Barra de progreso de lectura */
  useEffect(() => {
    const onScroll = () => {
      const bar = progressRef.current;
      if (!bar) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Parallax suave de la foto del hero */
  const handleHeroPointer = (event) => {
    const photo = photoRef.current;
    if (!photo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    photo.style.transform = `translate(${x * -14}px, ${y * -10}px)`;
  };

  const resetHeroPointer = () => {
    if (photoRef.current) photoRef.current.style.transform = 'translate(0, 0)';
  };

  const milestone = TIMELINE[activeMilestone];
  const activeAudience = AUDIENCES.find((item) => item.id === audience) || null;

  return (
    <>
      <GlobalStyles />
      <style dangerouslySetInnerHTML={{ __html: AX_STYLES }} />
      <div className="noise-overlay"></div>

      {/* Barra de progreso de lectura */}
      <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#E2C17D] via-[#CC5833] to-[#E2C17D]"
        ></div>
      </div>

      <Navbar onOpenTest={onOpenTest} />

      <main ref={pageRef} className="bg-[#F2F0E9] text-[#1A1A1A]">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          className="relative min-h-[100dvh] overflow-hidden bg-[#1A1A1A] px-6 pb-24 pt-44 text-white md:px-12"
          onMouseMove={handleHeroPointer}
          onMouseLeave={resetHeroPointer}
        >
          <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(46,64,54,0.97),rgba(26,26,26,0.98)_52%,rgba(204,88,51,0.35))]"></div>
          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
          <div className="ax-float absolute -left-32 top-24 h-96 w-96 rounded-full bg-[#E2C17D]/[0.14] blur-3xl"></div>
          <div className="ax-float absolute -right-24 bottom-10 h-[28rem] w-[28rem] rounded-full bg-[#CC5833]/[0.16] blur-3xl" style={{ animationDelay: '-3.5s' }}></div>

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.8fr]">
            <div>
              <a
                href="/"
                className="ax-reveal mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F2F0E9] transition-colors hover:bg-white/[0.12]"
              >
                &larr; Volver a GEMB
              </a>

              <div className="ax-reveal mb-7 inline-flex items-center gap-2 rounded-full border border-[#E2C17D]/25 bg-[#E2C17D]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#E2C17D]">
                <Sparkles size={14} />
                La fundadora · Gimnasio Emocional Mentes Brillantes
              </div>

              <h1 className="ax-reveal leading-none">
                <span className="ax-script block text-[4rem] text-[#E2C17D] sm:text-[5rem] md:text-[6rem]">Alexandra</span>
                <span className="mt-1 block font-heading text-5xl font-bold uppercase tracking-[0.08em] text-white sm:text-6xl md:text-7xl">Ortega</span>
              </h1>

              <p className="ax-reveal mt-6 font-serif text-2xl italic text-[#F2F0E9] md:text-3xl">
                Las emociones <em className="text-[#E2C17D]">también se entrenan.</em>
              </p>

              <p className="ax-reveal mt-4 text-base font-light text-[#F2F0E9]/85 md:text-lg">
                Psicóloga y coach ontológica, creadora de la técnica GEMB. Hoy acompaña a personas, comunidades e instituciones como <RotatingRole />
              </p>

              <div className="ax-reveal mt-9 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleWA('Hola, quiero contactar a Alexandra Ortega, fundadora de Gimnasio Emocional Mentes Brillantes.')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-sm font-bold text-white shadow-[0_14px_32px_rgba(37,211,102,0.24)] transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle size={18} />
                  Hablar con Alexandra
                </button>
                <a
                  href="#servicios-alexandra"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F2F0E9]/30 px-7 py-4 text-sm font-bold text-[#F2F0E9] transition-colors hover:bg-white/10"
                >
                  Servicios para instituciones
                  <ArrowRight size={18} />
                </a>
              </div>

              <div className="ax-reveal mt-9 flex flex-wrap gap-2">
                {['Fundación Social GEMB', 'Bogotá · Colombia', 'Escritora de tres libros'].map((chip) => (
                  <span key={chip} className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[11px] font-medium text-[#F2F0E9]/[0.78]">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <figure className="ax-reveal relative mx-auto w-full max-w-md">
              <div className="ax-ring absolute -inset-3 rounded-[3rem] opacity-70 blur-[2px]" aria-hidden="true"></div>
              <div ref={photoRef} className="relative transition-transform duration-300 ease-out">
                <img
                  src="/alexandra-sq.jpg"
                  alt="Alexandra Ortega sonriendo, señalando su mente: las emociones se entrenan"
                  width="800"
                  height="800"
                  className="relative w-full rounded-[2.8rem] border border-white/15 object-cover shadow-2xl"
                />
                <figcaption className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#1A1A1A]/90 p-4 text-center shadow-2xl backdrop-blur-md">
                  <strong className="block font-heading text-lg text-[#E2C17D]">Desde 2016</strong>
                  <span className="text-xs leading-snug text-[#F2F0E9]/75">trayectoria continua en salud mental y procesos comunitarios</span>
                </figcaption>
              </div>
            </figure>
          </div>

          <a href="#perfil-alexandra" aria-label="Bajar a la siguiente sección" className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
            <span className="flex h-12 w-7 items-start justify-center rounded-full border border-white/25 p-1.5">
              <span className="ax-scroll-dot h-2 w-2 rounded-full bg-[#E2C17D]"></span>
            </span>
          </a>
        </section>

        {/* ── IMPACTO EN CIFRAS ────────────────────────────── */}
        <section aria-label="Impacto en cifras" className="relative z-10 px-6 md:px-12">
          <div className="mx-auto -mt-14 grid max-w-6xl gap-4 rounded-[2rem] border border-[#2E4036]/10 bg-white p-6 shadow-[0_24px_60px_rgba(46,64,54,0.14)] sm:grid-cols-2 md:p-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <article key={stat.label} className="ax-reveal rounded-2xl bg-[#F2F0E9]/70 p-5 text-center transition-colors hover:bg-[#F2F0E9]">
                <p className="font-heading text-4xl font-bold text-[#2E4036] md:text-5xl">
                  <Counter value={stat.value} prefix={stat.prefix || ''} isYear={stat.isYear} />
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[#1A1A1A]/65">{stat.label}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── PERFIL ───────────────────────────────────────── */}
        <section id="perfil-alexandra" className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-4xl">
            <SectionEyebrow>Perfil profesional</SectionEyebrow>
            <h2 className="ax-reveal mt-5 font-serif text-3xl italic leading-snug text-[#2E4036] md:text-[2.6rem]">
              Acompaño a personas, comunidades e instituciones a <em className="text-[#CC5833]">habitar sus emociones</em>: a liderar con consciencia, a comunicar con empatía y a convertir el cuidado de la salud mental en un proyecto de vida y de territorio.
            </h2>
            <p className="ax-reveal mt-8 leading-relaxed text-[#1A1A1A]/75">
              Psicóloga, coach ontológica y fundadora de la técnica <strong>Gimnasio Emocional Mentes Brillantes (GEMB)</strong>, con trayectoria continua desde 2016 en formación en inteligencia emocional, autocuidado, desarrollo personal, prevención en salud mental, liderazgo consciente y enfoque de género. Diseña y facilita procesos vivenciales para bibliotecas, entidades públicas, organizaciones comunitarias, colegios, empresas y espacios culturales.
            </p>
            <p className="ax-reveal mt-5 leading-relaxed text-[#1A1A1A]/75">
              Ofrece sus servicios como <strong>tallerista, conferencista y formadora en salud mental</strong> a la Biblioteca Pública Carlos E. Restrepo y a otras bibliotecas e instituciones que buscan fortalecer el bienestar emocional de su comunidad.
            </p>
            <div className="ax-reveal mt-9 flex flex-wrap gap-2.5">
              {PILLARS.map((pillar) => (
                <span
                  key={pillar}
                  className="rounded-full border border-[#2E4036]/20 bg-white px-4 py-2 text-xs font-medium text-[#2E4036] transition-all hover:-translate-y-0.5 hover:border-[#CC5833] hover:bg-[#CC5833] hover:text-white"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRAYECTORIA (línea de tiempo interactiva) ────── */}
        <section id="trayectoria-alexandra" className="bg-white px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionEyebrow>Trayectoria · desde 2016 hasta la fecha</SectionEyebrow>
            <h2 className="ax-reveal mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-[#2E4036] md:text-5xl">
              Un camino de <em className="font-serif font-normal italic text-[#CC5833]">liderazgo, salud mental y paz territorial</em>
            </h2>

            <div className="mt-12 grid gap-10 lg:grid-cols-[0.42fr_1fr]">
              {/* Selector de años */}
              <div className="ax-reveal flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" role="group" aria-label="Años de la trayectoria">
                {TIMELINE.map((item, index) => {
                  const isActive = index === activeMilestone;
                  return (
                    <button
                      key={item.year}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveMilestone(index)}
                      className={`group flex shrink-0 items-center gap-4 rounded-2xl border px-5 py-3.5 text-left transition-all duration-300 ${
                        isActive
                          ? 'border-[#2E4036] bg-[#2E4036] text-white shadow-[0_14px_30px_rgba(46,64,54,0.25)]'
                          : 'border-[#2E4036]/15 bg-[#F2F0E9]/60 text-[#2E4036] hover:border-[#2E4036]/40 hover:bg-[#F2F0E9]'
                      }`}
                    >
                      <span className={`font-heading text-xl font-bold ${isActive ? 'text-[#E2C17D]' : ''}`}>{item.year}</span>
                      <span className={`hidden text-[11px] font-medium uppercase tracking-[0.14em] lg:block ${isActive ? 'text-white/75' : 'text-[#1A1A1A]/50'}`}>
                        {item.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detalle del hito */}
              <div className="ax-reveal">
                <article key={milestone.year} className="ax-swap relative h-full overflow-hidden rounded-[2rem] border border-[#2E4036]/10 bg-[#F2F0E9]/60 p-8 md:p-12">
                  <span className="pointer-events-none absolute -right-6 -top-10 font-heading text-[7rem] font-bold text-[#2E4036]/[0.07] md:text-[10rem]">
                    {milestone.year}
                  </span>
                  <span className="relative inline-flex items-center gap-2 rounded-full bg-[#CC5833]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#CC5833]">
                    {milestone.tag}
                  </span>
                  <h3 className="relative mt-5 font-heading text-2xl font-bold text-[#1A1A1A] md:text-3xl">{milestone.title}</h3>
                  <p className="relative mt-4 max-w-2xl leading-relaxed text-[#1A1A1A]/70">{milestone.text}</p>

                  <div className="relative mt-9 flex items-center gap-4">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#2E4036]/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2E4036] to-[#CC5833] transition-all duration-500"
                        style={{ width: `${((activeMilestone + 1) / TIMELINE.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-xs text-[#1A1A1A]/50">
                      {activeMilestone + 1} / {TIMELINE.length}
                    </span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ── CUMBRE GLOBAL 2025 ───────────────────────────── */}
        <section className="relative overflow-hidden bg-[#2E4036] px-6 py-20 text-white md:px-12 md:py-28">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_14%,rgba(226,193,125,0.18),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(204,88,51,0.18),transparent_32%)]"></div>
          <div className="relative z-10 mx-auto max-w-7xl">
            <SectionEyebrow light>Hito destacado · Cumbre Global de Salud Mental 2025</SectionEyebrow>
            <h2 className="ax-reveal mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight md:text-5xl">
              La salud mental como <em className="font-serif font-normal italic text-[#E2C17D]">lenguaje universal</em>
            </h2>
            <p className="ax-reveal mt-7 max-w-4xl text-lg leading-relaxed text-[#F2F0E9]/[0.85]">
              Alexandra Ortega fue invitada como ponente a la Cumbre Global de Salud Mental 2025 por la metodología <strong>Gimnasio Emocional Mentes Brillantes</strong>: un movimiento pedagógico y terapéutico que promueve la alfabetización emocional, el entrenamiento interior y la prevención en salud mental a través del diálogo horizontal, el acompañamiento grupal, la mentoría, la meditación, la educación emocional, el enfoque de género y la transformación comunitaria.
            </p>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SUMMIT_IDEAS.map((idea, index) => (
                <article
                  key={idea}
                  className="ax-reveal group rounded-[1.8rem] border border-white/10 bg-[#1A1A1A]/40 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#E2C17D]/50"
                >
                  <span className="font-heading text-3xl font-bold text-[#E2C17D]/60 transition-colors group-hover:text-[#E2C17D]">
                    0{index + 1}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-[#F2F0E9]/[0.82]">{idea}</p>
                </article>
              ))}
            </div>

            <blockquote className="ax-reveal relative mx-auto mt-14 max-w-4xl text-center">
              <Quote size={44} className="mx-auto mb-5 text-[#E2C17D]/40" aria-hidden="true" />
              <p className="font-serif text-2xl italic leading-relaxed text-[#F2F0E9] md:text-3xl">
                «La verdadera seguridad no comienza en las calles, sino en las personas; no comienza en las instituciones, sino en las familias. Cuando una persona aprende a gestionar sus emociones, se convierte en un <em className="text-[#E2C17D]">territorio de paz</em> capaz de transformar su hogar y su comunidad.»
              </p>
            </blockquote>
          </div>
        </section>

        {/* ── ÁREAS DE EXPERIENCIA ─────────────────────────── */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionEyebrow>Áreas de experiencia</SectionEyebrow>
            <h2 className="ax-reveal mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-[#2E4036] md:text-5xl">
              Donde el conocimiento <em className="font-serif font-normal italic text-[#CC5833]">se vuelve transformación</em>
            </h2>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {AREAS.map((area) => {
                const AreaIcon = area.icon;
                return (
                  <article
                    key={area.title}
                    className="ax-reveal group rounded-[1.8rem] border border-[#2E4036]/10 bg-white p-7 shadow-[0_14px_36px_rgba(46,64,54,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_48px_rgba(46,64,54,0.12)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E4036]/[0.07] text-[#2E4036] transition-all duration-500 group-hover:bg-[#CC5833] group-hover:text-white">
                      <AreaIcon size={22} />
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-bold text-[#1A1A1A]">{area.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#1A1A1A]/65">{area.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SERVICIOS PARA INSTITUCIONES (interactivo) ───── */}
        <section id="servicios-alexandra" className="bg-white px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionEyebrow>Servicios para bibliotecas e instituciones</SectionEyebrow>
            <h2 className="ax-reveal mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-[#2E4036] md:text-5xl">
              Programas a la medida de <em className="font-serif font-normal italic text-[#CC5833]">bibliotecas, colegios, entidades y empresas</em>
            </h2>
            <p className="ax-reveal mt-6 max-w-3xl leading-relaxed text-[#1A1A1A]/70">
              Talleres, conferencias y procesos de formación diseñados para fortalecer el bienestar emocional de comunidades y equipos, disponibles para bibliotecas, colegios, fundaciones, entidades públicas y empresas.
            </p>

            {/* Selector de tipo de institución */}
            <div className="ax-reveal mt-9 rounded-[2rem] border border-[#2E4036]/10 bg-[#F2F0E9]/60 p-6 md:p-7">
              <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[#2E4036]">
                <Sparkles size={16} className="text-[#CC5833]" />
                ¿Desde qué tipo de institución nos visitas? Te resaltamos los programas recomendados:
              </p>
              <div className="flex flex-wrap gap-3">
                {AUDIENCES.map((item) => {
                  const AudienceIcon = item.icon;
                  const isActive = audience === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setAudience(isActive ? null : item.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'border-[#CC5833] bg-[#CC5833] text-white shadow-[0_10px_24px_rgba(204,88,51,0.3)]'
                          : 'border-[#2E4036]/20 bg-white text-[#2E4036] hover:border-[#CC5833]/60'
                      }`}
                    >
                      <AudienceIcon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {SERVICES.map((service) => {
                const recommended = audience !== null && service.fit.includes(audience);
                const dimmed = audience !== null && !recommended;
                return (
                  <article
                    key={service.title}
                    className={`ax-reveal relative rounded-[1.5rem] border p-5 transition-all duration-500 ${
                      recommended
                        ? 'border-[#E2C17D] bg-[#E2C17D]/[0.12] shadow-[0_16px_36px_rgba(226,193,125,0.25)] -translate-y-1'
                        : 'border-[#2E4036]/10 bg-[#F2F0E9]/50 hover:border-[#2E4036]/30'
                    } ${dimmed ? 'opacity-45' : 'opacity-100'}`}
                  >
                    {recommended && (
                      <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-[#CC5833] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                        <Star size={9} className="fill-current" /> Recomendado
                      </span>
                    )}
                    <h3 className="font-heading text-sm font-bold leading-snug text-[#1A1A1A]">{service.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#1A1A1A]/60">{service.text}</p>
                  </article>
                );
              })}
            </div>

            <div className="ax-reveal mt-10 text-center">
              <button
                type="button"
                onClick={() => handleWA(activeAudience ? activeAudience.message : 'Hola, quiero solicitar una propuesta de talleres, conferencias o formación con Alexandra Ortega.')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#CC5833] px-9 py-4 text-sm font-bold text-white shadow-[0_14px_34px_rgba(204,88,51,0.32)] transition-transform hover:scale-[1.02]"
              >
                <MessageCircle size={18} />
                {activeAudience ? `Solicitar propuesta para ${activeAudience.label.toLowerCase()}` : 'Solicitar una propuesta'}
              </button>
            </div>
          </div>
        </section>

        {/* ── MODELO COMUNITARIO (acordeón) ────────────────── */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionEyebrow>Modelo comunitario validado en territorio · Caracterización técnica 2026</SectionEyebrow>
              <h2 className="ax-reveal mt-4 font-heading text-4xl font-bold leading-tight text-[#2E4036] md:text-5xl">
                Una metodología con <em className="font-serif font-normal italic text-[#CC5833]">respaldo y resultados</em>
              </h2>
              <p className="ax-reveal mt-6 leading-relaxed text-[#1A1A1A]/70">
                En 2026, GEMB fue presentado en el marco de la caracterización técnica de organizaciones locales dirigida a la Alcaldía Local de Antonio Nariño — Mesa Local Más Bienestar, con enfoque en prevención en salud mental comunitaria y articulación territorial.
              </p>
            </div>

            <div className="ax-reveal flex flex-col gap-3">
              {MODEL.map((item, index) => {
                const isOpen = openModel === index;
                return (
                  <article key={item.title} className={`overflow-hidden rounded-[1.6rem] border transition-all duration-300 ${isOpen ? 'border-[#2E4036] bg-white shadow-[0_18px_42px_rgba(46,64,54,0.1)]' : 'border-[#2E4036]/10 bg-white/70'}`}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenModel(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-8"
                    >
                      <span className="flex items-center gap-4">
                        <span className={`font-mono text-xs font-bold ${isOpen ? 'text-[#CC5833]' : 'text-[#2E4036]/45'}`}>0{index + 1}</span>
                        <span className="font-heading text-lg font-bold text-[#1A1A1A] md:text-xl">{item.title}</span>
                      </span>
                      <ChevronDown size={20} className={`shrink-0 text-[#2E4036] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-[400ms] ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 leading-relaxed text-[#1A1A1A]/70 md:px-8">{item.text}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── ALIANZA BIBLIOTECA CARLOS E. RESTREPO ────────── */}
        <section className="bg-white px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="ax-reveal group relative mb-12 overflow-hidden rounded-[2.5rem] shadow-[0_24px_60px_rgba(46,64,54,0.18)]">
              <img
                src="/alexandra-wide.jpg"
                alt="Alexandra Ortega facilitando procesos de bienestar emocional en comunidad"
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] md:h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent"></div>
              <p className="absolute bottom-6 left-6 max-w-xl font-serif text-xl italic text-white md:bottom-8 md:left-10 md:text-2xl">
                Bienestar emocional que se cultiva en comunidad
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <SectionEyebrow>Alianza territorial · desde 2019</SectionEyebrow>
                <h2 className="ax-reveal mt-4 font-heading text-4xl font-bold leading-tight text-[#2E4036] md:text-5xl">
                  Articulación con la <em className="font-serif font-normal italic text-[#CC5833]">Biblioteca Carlos E. Restrepo</em>
                </h2>
                <p className="ax-reveal mt-6 leading-relaxed text-[#1A1A1A]/70">
                  Desde 2019, Alexandra Ortega trabaja de manera articulada con la Biblioteca Pública Carlos E. Restrepo, acompañando a sus usuarios en procesos de lectura, estudio y comprensión de la mente, las emociones y la conducta humana.
                </p>
                <p className="ax-reveal mt-4 leading-relaxed text-[#1A1A1A]/70">
                  Esta articulación ha permitido fortalecer procesos de bienestar emocional, cultura, arte, enfoque de género y transformación comunitaria en el territorio.
                </p>
              </div>
              <aside className="ax-reveal rounded-[2rem] border border-[#2E4036]/10 bg-[#2E4036] p-8 text-white md:p-9">
                <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#E2C17D]">
                  <Leaf size={14} /> Proyecto significativo
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold">Huertas Urbanas con Enfoque de Género</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#F2F0E9]/[0.78]">
                  Una acción impulsada desde presupuestos participativos, orientada al fortalecimiento emocional, económico, ambiental y cultural de mujeres y comunidad en el territorio.
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* ── INCIDENCIA PÚBLICA + MARQUESINA ──────────────── */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionEyebrow>Incidencia pública y salud mental territorial</SectionEyebrow>
            <h2 className="ax-reveal mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-[#2E4036] md:text-5xl">
              Experiencia <em className="font-serif font-normal italic text-[#CC5833]">institucional y comunitaria</em>
            </h2>
            <p className="ax-reveal mt-6 max-w-4xl leading-relaxed text-[#1A1A1A]/70">
              Ha desarrollado procesos, articulado acciones y participado en escenarios de política pública, presupuestos participativos, control social, enfoque de género, salud mental comunitaria y construcción de paz territorial, junto a entidades como:
            </p>
          </div>

          {/* Marquesina de instituciones */}
          <div className="ax-reveal ax-marquee relative mt-10 overflow-hidden border-y border-[#2E4036]/10 bg-white py-6" role="region" aria-label="Instituciones con las que ha trabajado">
            <div className={`ax-marquee-track ${marqueePaused ? 'is-paused' : ''}`}>
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                  {INSTITUTIONS.map((name) => (
                    <span key={`${copy}-${name}`} className="flex items-center whitespace-nowrap px-6 font-heading text-base font-bold text-[#2E4036]/75 md:text-lg">
                      {name}
                      <span className="ml-12 text-[#E2C17D]" aria-hidden="true">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              aria-pressed={marqueePaused}
              onClick={() => setMarqueePaused((paused) => !paused)}
              className="inline-flex items-center gap-2 rounded-full border border-[#2E4036]/15 bg-white px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#2E4036]/70 transition-colors hover:border-[#2E4036]/40 hover:text-[#2E4036]"
            >
              {marqueePaused ? <Play size={12} /> : <Pause size={12} />}
              {marqueePaused ? 'Reanudar desfile' : 'Pausar desfile'}
            </button>
          </div>

          <div className="mx-auto mt-12 max-w-7xl">
            <aside className="ax-reveal rounded-[2rem] border border-[#CC5833]/[0.2] bg-[#CC5833]/[0.06] p-7 md:p-9">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#CC5833]">
                Círculo de Estado Abierto de Bogotá · 2026
              </p>
              <p className="mt-4 leading-relaxed text-[#1A1A1A]/75">
                En 2026, la Fundación Social GEMB fue invitada a participar en el Círculo de Estado Abierto de Bogotá, un espacio de articulación con organizaciones para aportar a políticas, recomendaciones y acciones distritales. Allí postula la salud mental comunitaria —mujeres, familias y comunidades, prevención de violencias y resolución pacífica de conflictos— como base de la seguridad, la convivencia y la paz sostenible, en diálogo con Casas de Igualdad de Oportunidades para las Mujeres, Juntas de Acción Comunal y organizaciones locales.
              </p>
            </aside>
          </div>
        </section>

        {/* ── RECONOCIMIENTOS ──────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#1A1A1A] px-6 py-20 text-white md:px-12 md:py-28">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_82%_12%,rgba(226,193,125,0.14),transparent_30%),radial-gradient(circle_at_12%_86%,rgba(204,88,51,0.14),transparent_30%)]"></div>
          <div className="relative z-10 mx-auto max-w-7xl">
            <SectionEyebrow light>Reconocimientos e impacto social</SectionEyebrow>
            <h2 className="ax-reveal mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight md:text-5xl">
              Una lideresa que <em className="font-serif font-normal italic text-[#E2C17D]">deja huella</em> en su territorio
            </h2>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {HONORS.map((honor, index) => (
                <article
                  key={honor.title}
                  className="ax-reveal group rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#E2C17D]/50 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#E2C17D]/70">0{index + 1}</span>
                    <Award size={18} className="text-[#E2C17D]/40 transition-colors group-hover:text-[#E2C17D]" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-bold">{honor.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#F2F0E9]/[0.72]">{honor.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORMACIÓN + LIBROS ───────────────────────────── */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionEyebrow>Formación y certificaciones</SectionEyebrow>
            <h2 className="ax-reveal mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-[#2E4036] md:text-5xl">
              Raíces sólidas para <em className="font-serif font-normal italic text-[#CC5833]">acompañar con rigor</em>
            </h2>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <ul className="flex flex-col gap-3">
                {EDUCATION.map((item) => (
                  <li key={item.title} className="ax-reveal flex items-start gap-4 rounded-[1.4rem] border border-[#2E4036]/10 bg-white px-6 py-4 transition-all hover:-translate-y-0.5 hover:border-[#CC5833]/40">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2E4036]/[0.07] text-[#2E4036]">
                      <GraduationCap size={17} />
                    </span>
                    <span>
                      <strong className="block font-heading text-base font-bold text-[#1A1A1A]">{item.title}</strong>
                      <span className="text-sm text-[#1A1A1A]/55">{item.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <aside className="ax-reveal rounded-[2rem] border border-[#2E4036]/10 bg-white p-8 text-center md:p-10">
                <p className="flex items-center justify-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#CC5833]">
                  <BookOpen size={14} /> Publicaciones
                </p>
                <h3 className="mt-4 font-heading text-3xl font-bold text-[#2E4036]">
                  Escritora de <em className="font-serif font-normal italic text-[#CC5833]">tres libros</em>
                </h3>
                <ul className="mt-8 flex items-end justify-center gap-4" aria-label="Temas de sus tres libros">
                  {BOOKS.map((book) => (
                    <li
                      key={book.label}
                      className={`ax-book flex h-44 w-24 items-center justify-center rounded-xl bg-gradient-to-b ${book.gradient} ${book.rotate} p-3 shadow-[0_16px_32px_rgba(26,26,26,0.2)] md:h-52 md:w-28`}
                    >
                      <span className="font-heading text-xs font-bold leading-snug text-white [writing-mode:vertical-rl] rotate-180">
                        {book.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 font-serif text-lg italic text-[#1A1A1A]/60">
                  Palabras que entrenan la mente y abrazan el corazón.
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* ── CIERRE + CONTACTO ────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#2E4036] px-6 pb-32 pt-20 text-white md:px-12 md:pt-28">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(226,193,125,0.16),transparent_42%)]"></div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <Heart size={30} className="ax-reveal mx-auto text-[#E2C17D]" aria-hidden="true" />
            <p className="ax-reveal mt-6 font-serif text-3xl italic leading-relaxed md:text-4xl">
              «Cuando una persona aprende a gestionar sus emociones, <em className="text-[#E2C17D]">se convierte en un territorio de paz.</em>»
            </p>
            <p className="ax-reveal mt-6 text-sm uppercase tracking-[0.2em] text-[#F2F0E9]/60">
              Conferencias · Talleres vivenciales · Formación de formadoras · Procesos de bienestar emocional
            </p>

            <div className="ax-reveal mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => handleWA('Hola, quiero contactar a Alexandra Ortega, fundadora de Gimnasio Emocional Mentes Brillantes.')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white shadow-[0_14px_32px_rgba(37,211,102,0.24)] transition-transform hover:scale-[1.02]"
              >
                <MessageCircle size={18} />
                Escribir por WhatsApp
              </button>
              <a
                href={`mailto:${ALEXANDRA_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <Mail size={17} />
                Escribir a Alexandra
              </a>
              <a
                href={`tel:${ALEXANDRA_TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <Phone size={17} />
                Llamar · 320 841 3878
              </a>
            </div>

            <ul className="ax-reveal mt-10 flex flex-wrap items-center justify-center gap-5" aria-label="Redes sociales">
              <li>
                <a
                  href="https://www.instagram.com/gimnasioemocional_mb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#F2F0E9]/75 transition-colors hover:text-[#E2C17D]"
                >
                  <Instagram size={17} /> @Gimnasioemocional_mb
                  <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/search/top?q=Gimnasio%20Emocional%20Mentes%20Brillantes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#F2F0E9]/75 transition-colors hover:text-[#E2C17D]"
                >
                  <Facebook size={17} /> Gimnasio Emocional Mentes Brillantes
                  <ArrowUpRight size={13} />
                </a>
              </li>
            </ul>

            <p className="ax-reveal mt-10 text-xs text-[#F2F0E9]/45">
              Alexandra Ortega · Fundación Social Gimnasio Emocional Mentes Brillantes · NIT 901.002.849-3
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AlexandraPage;
