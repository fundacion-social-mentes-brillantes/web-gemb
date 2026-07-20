import React, { useState, useEffect, useRef, useLayoutEffect, lazy, Suspense } from 'react';
import {
  Menu, X, ArrowRight, Activity, ScanLine,
  Settings2, CheckCircle2, MessageCircle, Copy, AlertCircle, Star, Calendar,
  Clock, User, Target, ShieldCheck, ChevronDown, BookOpen, Compass, Sparkles, LogIn, HeartHandshake
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Las páginas pesadas se cargan bajo demanda: el home no descarga Firebase,
// jsPDF, el portal privado ni los tests hasta que se necesitan.
const EnhancedTestEnneagramModal = lazy(() => import('./TestEnneagramModal'));
const TestInitialAssessmentModal = lazy(() => import('./TestInitialAssessmentModal'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AlexandraPage = lazy(() => import('./components/AlexandraPage'));
const FundacionPage = lazy(() => import('./components/FundacionPage'));
const PrivacyPage = lazy(() => import('./components/PrivacyPage'));
const ProcessPortal = lazy(() => import('./components/ProcessPortal'));

// GSAP empaquetado (sin CDN externo ni pantalla de carga): disponible en
// window.gsap para todos los componentes desde el primer render.
gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

// --- ESTILOS GLOBALES Y FUENTES ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Outfit:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Great+Vibes&display=swap');

    :root {
      --color-moss: #2E4036;
      --color-clay: #CC5833;
      --color-cream: #F2F0E9;
      --color-charcoal: #1A1A1A;
    }

    html {
      scroll-behavior: smooth;
      scroll-padding-top: 100px;
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
    }

    body {
      background-color: var(--color-cream);
      color: var(--color-charcoal);
      font-family: 'Outfit', sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4, .font-heading {
      font-family: 'Plus Jakarta Sans', sans-serif;
      letter-spacing: -0.02em;
    }

    .font-serif {
      font-family: 'Cormorant Garamond', serif;
    }

    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }

    /* Ruido global */
    .noise-overlay {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 9999;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.04;
    }

    .radius-huge { border-radius: 2.5rem; }
    .glass-pill {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(46, 64, 54, 0.1);
    }

    .btn-magnetic {
      transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease;
    }
    .btn-magnetic:hover {
      transform: scale(1.02);
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--color-cream); }
    ::-webkit-scrollbar-thumb { background: var(--color-moss); border-radius: 4px; }
  `}} />
);

const WA_NUMBER = "573112602355";
const SITE_URL = "https://www.gimnasioemocionalmb.com";

const HOME_SEO = {
  title: "Gimnasio Emocional Mentes Brillantes | Fundación Social Mentes Brillantes",
  description: "Programa de entrenamiento emocional de la Fundación Social Mentes Brillantes (entidad sin ánimo de lucro, NIT 901.002.849-3): encuentros comunitarios gratuitos en Bogotá, procesos de transformación y prevención en salud mental desde 2016.",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/logo-gemb.png`,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Fundación Social Mentes Brillantes",
    alternateName: ["Gimnasio Emocional Mentes Brillantes", "GEMB"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo-gemb.png`,
    foundingDate: "2016",
    taxID: "901.002.849-3",
    email: "fundacionsocial@gimnasioemocionalmb.com",
    telephone: "+573112602355",
    address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
    sameAs: ["https://www.instagram.com/gimnasioemocional_mb"],
    description: "Entidad sin ánimo de lucro que entrena inteligencia emocional y previene violencias mediante programas comunitarios gratuitos y procesos de acompañamiento; los excedentes financian su labor social."
  }
};

const ADMIN_SEO = {
  title: "Panel privado | Gimnasio Emocional Mentes Brillantes",
  description: "Acceso privado al panel administrativo de Gimnasio Emocional Mentes Brillantes.",
  url: `${SITE_URL}/#admin`,
  image: `${SITE_URL}/logo-gemb.png`,
  robots: "noindex, nofollow"
};

const ALEXANDRA_PATH = "/alexandra-ortega";

const ALEXANDRA_SEO = {
  title: "Alexandra Ortega | Fundadora de Gimnasio Emocional Mentes Brillantes",
  description: "Conoce a Alexandra Ortega: psicóloga, coach ontológica y fundadora de la técnica Gimnasio Emocional Mentes Brillantes (GEMB). Tallerista, conferencista y formadora en salud mental con trayectoria continua desde 2016.",
  url: `${SITE_URL}${ALEXANDRA_PATH}`,
  image: `${SITE_URL}/alexandra-sq.jpg`,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alexandra Ortega",
    jobTitle: "Psicóloga, Coach Ontológica, Tallerista, Conferencista y Formadora en Salud Mental",
    description: "Fundadora de la técnica Gimnasio Emocional Mentes Brillantes (GEMB), con trayectoria continua desde 2016 en inteligencia emocional, prevención en salud mental, liderazgo consciente, enfoque de género y construcción de paz territorial.",
    image: `${SITE_URL}/alexandra-sq.jpg`,
    url: `${SITE_URL}${ALEXANDRA_PATH}`,
    email: "mailto:yaosproactiva@hotmail.com",
    telephone: "+573208413878",
    worksFor: {
      "@type": "Organization",
      name: "Fundación Social Gimnasio Emocional Mentes Brillantes",
      url: SITE_URL
    },
    knowsAbout: [
      "Inteligencia emocional",
      "Prevención en salud mental",
      "Liderazgo consciente",
      "Enfoque de género",
      "Duelo y resignificación",
      "Construcción de paz"
    ],
    sameAs: ["https://www.instagram.com/gimnasioemocional_mb"]
  }
};

const FUNDACION_PATH = "/fundacion";

const FUNDACION_SEO = {
  title: "La Fundación | Labor social de Gimnasio Emocional Mentes Brillantes",
  description:
    "Fundación Social Gimnasio Emocional Mentes Brillantes (NIT 901.002.849-3): encuentros comunitarios gratuitos en Bogotá, formación a lideresas, prescripción social en salud y un modelo solidario que reinvierte el 100% de los excedentes en labor social desde 2016.",
  url: `${SITE_URL}${FUNDACION_PATH}`,
  image: `${SITE_URL}/logo-gemb.png`,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Fundación Social Gimnasio Emocional Mentes Brillantes",
    alternateName: "GEMB",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-gemb.png`,
    foundingDate: "2016",
    taxID: "901.002.849-3",
    email: "fundacionsocial@gimnasioemocionalmb.com",
    telephone: "+573112602355",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bogotá",
      addressCountry: "CO"
    },
    areaServed: "Colombia",
    founder: { "@type": "Person", name: "Alexandra Ortega" },
    sameAs: ["https://www.instagram.com/gimnasioemocional_mb"]
  }
};

const PRIVACIDAD_PATH = "/politica-de-privacidad";

const PRIVACIDAD_SEO = {
  title: "Política de tratamiento de datos | Fundación Social Gimnasio Emocional Mentes Brillantes",
  description:
    "Conoce cómo la Fundación Social Gimnasio Emocional Mentes Brillantes (NIT 901.002.849-3) protege y trata tus datos personales según la Ley 1581 de 2012.",
  url: `${SITE_URL}${PRIVACIDAD_PATH}`,
  image: `${SITE_URL}/logo-gemb.png`
};

const PROCESO_PATH = "/mi-proceso";

const PROCESO_SEO = {
  title: "Mi Proceso | Gimnasio Emocional Mentes Brillantes",
  description: "Área privada para continuar tu proceso con Gimnasio Emocional Mentes Brillantes.",
  url: `${SITE_URL}${PROCESO_PATH}`,
  image: `${SITE_URL}/logo-gemb.png`,
  robots: "noindex, nofollow"
};

const PROCESS_PAGES = [
  {
    path: "/curso-de-milagros",
    icon: BookOpen,
    label: "Curso de Milagros",
    eyebrow: "Estudio espiritual y práctica diaria",
    title: "Un Curso de Milagros en Colombia | Gimnasio Emocional Mentes Brillantes",
    description: "Estudia y practica Un Curso de Milagros con Gimnasio Emocional Mentes Brillantes. Un recorrido espiritual para sanar la percepción, elegir de nuevo y volver al amor.",
    h1: "Un Curso de Milagros: un entrenamiento de la mente para volver al amor",
    lead: "Cada año abrimos un recorrido de estudio y práctica de Un Curso de Milagros para observar la mente, sanar la percepción, soltar el juicio y elegir de nuevo desde el amor.",
    quote: "No buscamos memorizar ideas espirituales; buscamos entrenar una mirada más limpia, amorosa y responsable en la vida diaria.",
    keywords: ["Un Curso de Milagros", "Curso de Milagros Colombia", "estudio espiritual", "despertar de conciencia"],
    whatsappMessage: "Hola, quiero información sobre el recorrido de Un Curso de Milagros en Gimnasio Emocional Mentes Brillantes.",
    sections: [
      {
        title: "Qué es este recorrido",
        body: "Es un espacio de estudio, práctica y acompañamiento espiritual donde usamos las enseñanzas de Un Curso de Milagros como entrenamiento de la mente. La intención es aprender a mirar las situaciones desde menos miedo, menos culpa y más amor.",
        bullets: ["Lectura y comprensión guiada", "Práctica interior aplicada a la vida cotidiana", "Observación del juicio, la culpa y la defensa", "Elección consciente de una percepción más amorosa"]
      },
      {
        title: "Como lo vivimos en GEMB",
        body: "Dentro de Gimnasio Emocional Mentes Brillantes lo vivimos como una disciplina espiritual acompañada. Integramos conversación honesta, silencio, oración, práctica emocional y ejemplos reales para que la teoría baje a decisiones concretas.",
        bullets: ["Encuentros de estudio y reflexión", "Prácticas para elegir de nuevo", "Acompañamiento desde una mirada humana y espiritual", "Lenguaje claro para personas que están comenzando"]
      },
      {
        title: "Para quien es",
        body: "Es para personas que sienten el llamado a sanar su percepción, revisar sus reacciones, dejar de vivir desde la culpa o el ataque y cultivar una relación más serena con Dios, consigo mismas y con los demás.",
        bullets: ["Quienes buscan un grupo de estudio espiritual", "Personas en proceso de despertar de conciencia", "Quienes quieren unir espiritualidad con práctica emocional", "Personas nuevas o con experiencia previa en UCDM"]
      },
      {
        title: "Qué puedes esperar",
        body: "Puedes esperar profundidad, constancia y una invitación a practicar. No es un espacio para discutir quién tiene la razón, sino para mirar dónde la mente se separa del amor y entrenar una respuesta diferente.",
        bullets: ["Mayor claridad sobre tus pensamientos", "Herramientas para soltar juicio y culpa", "Un lenguaje amoroso para volver al centro", "Comunidad de práctica y acompañamiento"]
      }
    ],
    practice: "Durante siete días, observa un juicio recurrente y escribe: qué creo que está pasando, qué miedo hay debajo y cómo podría elegir mirar esto desde el amor.",
    disclaimer: "Este espacio no representa a la organización oficial de Un Curso de Milagros; es un grupo de estudio, práctica y acompañamiento espiritual desarrollado dentro de Gimnasio Emocional Mentes Brillantes.",
    faq: [
      ["¿Necesito experiencia previa?", "No. Puedes llegar sin experiencia. El recorrido está pensado para estudiar, preguntar y practicar paso a paso."],
      ["¿Es un curso religioso?", "No se presenta como una religión. Es un camino espiritual de entrenamiento de la mente, vivido con respeto por el proceso de cada persona."],
      ["¿Cuándo inicia?", "Abrimos recorridos por ciclos. Lo mejor es escribir por WhatsApp para recibir fechas, horarios y modalidad vigente."],
      ["¿Es presencial o virtual?", "La modalidad puede variar según el ciclo. Te confirmamos los encuentros disponibles cuando solicitas información."],
      ["¿Cómo pido información?", "Puedes escribir por WhatsApp desde esta página y pedir detalles del próximo recorrido de Un Curso de Milagros."]
    ]
  },
  {
    path: "/sala-reduccion-ego",
    icon: Activity,
    label: "Sala de Reducción del Ego",
    eyebrow: "Practica grupal de conciencia",
    title: "Sala de Reducción del Ego | Gimnasio Emocional Mentes Brillantes",
    description: "Participa en la Sala de Reducción del Ego de Gimnasio Emocional Mentes Brillantes, un espacio de entrenamiento emocional y espiritual para reconocer el ego, rendir el control y volver a la conciencia.",
    h1: "Sala de Reducción del Ego: un espacio para reconocer, rendir y transformar",
    lead: "La Sala de Reducción del Ego es un espacio de entrenamiento emocional y espiritual donde aprendemos a observar las reacciones que nacen del miedo, el control, el juicio o la necesidad de tener la razón.",
    quote: "En lugar de pelear con el ego, aprendemos a reconocerlo, rendirlo y volver a una mirada más consciente, amorosa y responsable.",
    keywords: ["Sala de Reducción del Ego", "reducción del ego", "entrenamiento emocional", "conciencia emocional"],
    whatsappMessage: "Hola, quiero información sobre la Sala de Reducción del Ego de Gimnasio Emocional Mentes Brillantes.",
    sections: [
      {
        title: "Qué es la Sala de Reducción del Ego",
        body: "Es un espacio grupal, profundo y humano para entrenar la observación interior. Miramos las formas del ego sin vergüenza y sin dramatizar: control, defensa, orgullo, culpa, miedo, victimismo, juicio y reacción automática.",
        bullets: ["Reconocer el impulso antes de actuar", "Rendir el control desde la honestidad", "Practicar serenidad y responsabilidad", "Volver a la esencia real sin castigo"]
      },
      {
        title: "Qué trabajamos en la sala",
        body: "Trabajamos situaciones reales de la vida: conversaciones difíciles, límites, heridas, comparación, necesidad de aprobación, enojo, culpa o deseo de tener siempre la razón. La sala convierte la reacción en material de conciencia.",
        bullets: ["Control y necesidad de razón", "Juicio, ataque y defensa", "Culpa, miedo y orgullo espiritual", "Entrega, oración y poder superior"]
      },
      {
        title: "Para quien es",
        body: "Es para personas que quieren crecer con honestidad, practicar humildad emocional y salir del piloto automático. No necesitas saber nombrar todo lo que sientes; basta con llegar con disposición a mirar.",
        bullets: ["Personas nuevas en GEMB", "Quienes repiten conflictos o reacciones", "Quienes desean entrenar conciencia emocional", "Quienes buscan una práctica espiritual aterrizada"]
      },
      {
        title: "Qué pasa en una sesión",
        body: "La experiencia combina apertura, compartir consciente, escucha, dirección, práctica interior y cierre. El ambiente cuida la dignidad de cada persona y no se plantea como terapia clínica.",
        bullets: ["Se abre un tema de trabajo", "Se comparte desde la experiencia", "Se observa el patrón del ego", "Se cierra con práctica, serenidad y dirección"]
      }
    ],
    practice: "Antes de reaccionar, respira y nombra en voz baja: ¿estoy defendiendo, controlando o queriendo tener la razón? Esa pausa ya abre una puerta.",
    faq: [
      ["¿Qué significa reducir el ego?", "Significa observar sus mecanismos de miedo, defensa y control para dejar de obedecerlos automáticamente."],
      ["¿Es terapia?", "No. Es un espacio de formación, acompañamiento y entrenamiento emocional/espiritual. No reemplaza atención clínica cuando se necesita."],
      ["¿Puedo asistir si soy nuevo?", "Sí. La sala está pensada para recibir personas nuevas con orientación clara y un ambiente cuidado."],
      ["¿Qué se hace en una sala?", "Se trabaja un tema, se comparte con honestidad, se reconoce el patrón y se practica una forma más consciente de responder."],
      ["¿Cómo pido información?", "Puedes escribir por WhatsApp desde esta página y pedir fechas, modalidad y condiciones de participación."]
    ]
  },
  {
    path: "/entrega-de-pasos",
    icon: Compass,
    label: "Entrega de Pasos",
    eyebrow: "Escritura, honestidad y reparacion",
    title: "Entrega de Pasos | Proceso emocional y espiritual GEMB",
    description: "La Entrega de Pasos en Gimnasio Emocional Mentes Brillantes es un proceso de escritura, honestidad y reparación interior para ordenar la historia personal y avanzar con más paz.",
    h1: "Entrega de Pasos: escribir, reconocer y soltar lo que ya no necesitas cargar",
    lead: "La Entrega de Pasos es un camino de escritura, honestidad y reparacion interior. A traves de los pasos, la persona deja de cargar sola su historia y empieza a ordenar lo vivido.",
    quote: "Escribir no cambia el pasado, pero puede cambiar la forma en que lo cargas, lo comprendes y eliges avanzar.",
    keywords: ["Entrega de Pasos", "12 pasos", "recuperación emocional", "reparación interior"],
    whatsappMessage: "Hola, quiero información sobre la Entrega de Pasos en Gimnasio Emocional Mentes Brillantes.",
    sections: [
      {
        title: "Qué es la Entrega de Pasos",
        body: "Es un proceso acompañado de escritura, reconocimiento y entrega interior, inspirado en caminos de recuperación emocional y espiritual. No se trata de exponerte ni de forzarte, sino de ordenar tu historia con verdad y cuidado.",
        bullets: ["Mirar patrones emocionales", "Reconocer heridas y decisiones antiguas", "Soltar cargas que ya no necesitas llevar", "Abrir espacio para responsabilidad y libertad"]
      },
      {
        title: "Por que escribir ayuda a sanar",
        body: "La escritura permite sacar del cuerpo y de la mente aquello que se repite en silencio. Cuando una persona escribe con guía, puede ver conexiones, nombrar dolores y dejar de vivir gobernada por historias incompletas.",
        bullets: ["Ordena lo vivido", "Reduce confusion interna", "Muestra patrones repetidos", "Ayuda a preparar reparaciones posibles"]
      },
      {
        title: "Cómo se acompaña el proceso",
        body: "El acompañamiento ofrece dirección, preguntas, tiempos y contención. La persona avanza paso a paso, sin prisa artificial, con respeto por su historia y por el momento emocional en el que se encuentra.",
        bullets: ["Orientación para escribir", "Revisión de patrones y aprendizajes", "Cuidado de la confidencialidad", "Enfoque en responsabilidad, paz y reparación"]
      },
      {
        title: "Para quien es",
        body: "Es para quienes sienten que cargan historias, culpas, duelos, resentimientos o ciclos que necesitan ser mirados con honestidad para avanzar con más libertad.",
        bullets: ["Personas que quieren ordenar su historia", "Quienes buscan recuperación emocional", "Quienes desean reparar vínculos desde la conciencia", "Quienes necesitan una ruta profunda y acompañada"]
      }
    ],
    practice: "Escribe una línea diaria durante una semana: hoy reconozco que ya no quiero cargar solo/a con... Luego observa qué emoción aparece.",
    faq: [
      ["¿Debo tener experiencia previa?", "No. El proceso puede iniciar desde cero, con guía para comprender qué se escribe y cómo avanzar."],
      ["¿Qué son los pasos?", "Son una ruta de honestidad, reconocimiento, entrega y reparación interior que ayuda a ordenar la historia personal."],
      ["¿Tengo que compartir mi historia?", "No se fuerza a nadie. El proceso cuida el ritmo personal y se comparte lo necesario dentro del acompañamiento."],
      ["¿Es confidencial?", "Sí. La confidencialidad y el respeto por la historia de cada persona son parte esencial del proceso."],
      ["¿Cómo inicio?", "Puedes escribir por WhatsApp para recibir orientación sobre el primer encuentro y la forma de comenzar."]
    ]
  },
  {
    path: "/sesion-coach",
    icon: User,
    label: "Sesión Coach",
    eyebrow: "Puerta de entrada al proceso GEMB",
    title: "Sesión Coach Emocional | Gimnasio Emocional Mentes Brillantes",
    description: "Agenda una Sesión Coach con Gimnasio Emocional Mentes Brillantes para mirar tu historia, ordenar tu mundo interior y recibir guía en tu proceso emocional.",
    h1: "Sesión Coach: una guía privada para ordenar tu mundo interior",
    lead: "La Sesión Coach es un espacio privado de guía emocional donde miramos tu historia con honestidad, identificamos patrones que se repiten y ordenamos el mundo interior.",
    quote: "La claridad no llega solo por pensar más; llega cuando miras tu historia con dirección, honestidad y una práctica que puedas sostener.",
    keywords: ["sesión coach emocional", "coach emocional", "guía emocional", "Alexandra Ortega"],
    whatsappMessage: "Hola, quiero agendar una Sesión Coach con Gimnasio Emocional Mentes Brillantes.",
    sections: [
      {
        title: "Qué es una Sesión Coach",
        body: "Es la puerta principal de Gimnasio Emocional Mentes Brillantes: un encuentro privado para mirar lo que estás viviendo, ordenar tu mundo interior y recibir una ruta de avance. Puede ser guiada por Alexandra Ortega o por coaches formados en la técnica GEMB.",
        bullets: ["Lectura honesta de tu momento actual", "Identificación de patrones emocionales", "Dirección para tomar decisiones con más conciencia", "Primer mapa de proceso y práctica"]
      },
      {
        title: "Qué puedes trabajar",
        body: "Puedes trabajar relaciones, límites, duelos, cansancio emocional, culpa, miedo, repetición de conflictos, falta de dirección, dependencia emocional o dificultad para sostener cambios.",
        bullets: ["Historia personal y patrones repetidos", "Orden emocional y espiritual", "Límites, decisiones y coherencia", "Ruta hacia sala, pasos, UCDM o seguimiento"]
      },
      {
        title: "Como se vive una sesion",
        body: "La sesión combina escucha, preguntas precisas, lectura del patrón y orientación práctica. No prometemos curas ni resultados médicos; ofrecemos una guía clara para que puedas entrenar una forma diferente de responder.",
        bullets: ["Conversacion privada y cuidada", "Claridad sobre el patron principal", "Practicas para la vida real", "Siguiente paso sugerido dentro de GEMB"]
      },
      {
        title: "Para quien es",
        body: "Es para personas que necesitan ordenar lo que sienten y quieren iniciar un proceso serio, humano y espiritual. También es ideal si no sabes por dónde empezar dentro de GEMB.",
        bullets: ["Quienes buscan guía emocional", "Personas que repiten ciclos y quieren claridad", "Quienes necesitan un primer mapa de proceso", "Personas que desean acompañamiento sin enfoque clínico"]
      }
    ],
    practice: "Antes de la sesión, escribe tres situaciones que se repiten en tu vida y que ya no quieres seguir resolviendo desde la misma reacción.",
    faq: [
      ["¿Es terapia psicológica?", "No. Es una guía emocional y espiritual de entrenamiento interior. No reemplaza atención psicológica, médica o psiquiátrica cuando sea necesaria."],
      ["¿Quién guía la sesión?", "Puede guiarla Alexandra Ortega o un miembro del equipo de coaches formados en la técnica GEMB."],
      ["¿Cuánto dura?", "La duración se confirma al agendar, según la modalidad disponible y el tipo de acompañamiento."],
      ["¿Puedo tomarla online?", "Sí, cuando hay modalidad virtual disponible. Te confirmamos opciones y horarios por WhatsApp."],
      ["¿Cómo agendo?", "Escribe por WhatsApp desde esta página y solicita disponibilidad para tu Sesión Coach."]
    ]
  }
];

const PROCESS_PAGE_BY_PATH = PROCESS_PAGES.reduce((pages, page) => {
  pages[page.path] = page;
  return pages;
}, {});

const normalizePath = (path) => {
  const cleanPath = path.replace(/\/+$/, "");
  return cleanPath || "/";
};

const setMetaTag = ({ name, property, content }) => {
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    if (name) tag.setAttribute("name", name);
    if (property) tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const setCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const getProcessStructuredData = (page) => [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.label,
    serviceType: "Entrenamiento emocional y espiritual",
    url: `${SITE_URL}${page.path}`,
    description: page.description,
    provider: {
      "@type": "Organization",
      name: "Gimnasio Emocional Mentes Brillantes",
      url: SITE_URL
    },
    areaServed: {
      "@type": "Country",
      name: "Colombia"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  }
];

const useSeoMeta = (seo) => {
  const structuredDataJson = seo?.structuredData ? JSON.stringify(seo.structuredData) : "";

  useEffect(() => {
    if (!seo || typeof document === "undefined") return;

    document.documentElement.lang = "es-CO";
    document.title = seo.title;
    setCanonical(seo.url);
    setMetaTag({ name: "description", content: seo.description });
    setMetaTag({ name: "author", content: "Gimnasio Emocional Mentes Brillantes" });
    setMetaTag({ name: "robots", content: seo.robots || "index, follow" });
    setMetaTag({ property: "og:type", content: "website" });
    setMetaTag({ property: "og:url", content: seo.url });
    setMetaTag({ property: "og:title", content: seo.title });
    setMetaTag({ property: "og:description", content: seo.description });
    setMetaTag({ property: "og:image", content: seo.image || `${SITE_URL}/logo-gemb.png` });
    setMetaTag({ property: "og:locale", content: "es_CO" });
    setMetaTag({ property: "og:site_name", content: "Gimnasio Emocional Mentes Brillantes" });
    setMetaTag({ name: "twitter:card", content: "summary_large_image" });
    setMetaTag({ name: "twitter:title", content: seo.title });
    setMetaTag({ name: "twitter:description", content: seo.description });
    setMetaTag({ name: "twitter:image", content: seo.image || `${SITE_URL}/logo-gemb.png` });

    let jsonLd = document.head.querySelector("#gemb-jsonld");

    if (structuredDataJson) {
      if (!jsonLd) {
        jsonLd = document.createElement("script");
        jsonLd.id = "gemb-jsonld";
        jsonLd.type = "application/ld+json";
        document.head.appendChild(jsonLd);
      }

      jsonLd.textContent = structuredDataJson;
    } else if (jsonLd) {
      jsonLd.remove();
    }
  }, [seo, structuredDataJson]);
};

// --- COMPONENTES ---

const GoldenLogoLockup = ({ scrolled, inFooter = false }) => {
  const isCompact = scrolled && !inFooter;

  return (
    <div className={`flex transition-all duration-700 origin-top-left ${isCompact ? 'scale-90' : 'scale-100'}`}>
      <img
        src="/logo-gemb.png"
        alt="Gimnasio Emocional Mentes Brillantes"
        className={`transition-all duration-700 object-contain ${
          isCompact ? 'h-12 md:h-14' : 'h-24 md:h-32 drop-shadow-2xl'
        }`}
      />
    </div>
  );
};

const Navbar = ({ onOpenTest }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  const focusFirstProcessLink = () => {
    window.setTimeout(() => {
      dropdownRef.current?.querySelector('[role="menuitem"]')?.focus();
    }, 0);
  };

  const handleProcessButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setDropdownOpen(true);
      focusFirstProcessLink();
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 flex justify-center ${scrolled ? 'pt-6 pointer-events-none' : 'pt-8 pointer-events-auto'}`}>
        <div className={`transition-all duration-500 pointer-events-auto ${scrolled ? 'w-[95%] max-w-6xl glass-pill rounded-full py-3 px-4 md:px-6 shadow-sm' : 'w-full max-w-7xl px-6 md:px-12 bg-transparent'}`}>
          <div className={`flex justify-between w-full relative ${scrolled ? 'items-center' : 'items-start'}`}>

            {/* IZQUIERDA: Logo Apilado */}
            <div className="w-[45%] md:w-1/4 flex justify-start">
              <a href="/" className="inline-block">
                <GoldenLogoLockup scrolled={scrolled} />
              </a>
            </div>

            {/* CENTRO: Enlaces */}
            <div className={`w-2/4 hidden md:flex justify-center gap-4 lg:gap-6 text-xs lg:text-sm font-medium transition-colors ${scrolled ? 'items-center text-[#2E4036]' : 'items-start pt-6 text-white/90'}`}>
              <a href="/#metodo" className="hover:opacity-70 transition-opacity">Método</a>

              {/* Botón pequeño premium en el Navbar para la sesión Coach */}
              <a href="/sesion-coach" className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1 ${scrolled ? 'border-[#CC5833] text-[#CC5833] hover:bg-[#CC5833] hover:text-white shadow-sm' : 'border-white/50 text-white hover:bg-white hover:text-[#1A1A1A] backdrop-blur-sm'}`}>
                <Star size={12} className="fill-current text-[#CC5833]" /> Sesión Coach
              </a>

              {/* Dropdown "Procesos" */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-controls="procesos-menu"
                  onClick={() => setDropdownOpen((open) => !open)}
                  onKeyDown={handleProcessButtonKeyDown}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#E2C17D] ${
                    scrolled
                      ? 'text-[#2E4036] hover:bg-[#2E4036]/5'
                      : 'text-white/90 hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  Procesos <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div
                    id="procesos-menu"
                    role="menu"
                    aria-label="Procesos principales"
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white text-[#1A1A1A] rounded-2xl p-2 shadow-2xl border border-[#2E4036]/10 min-w-[280px] flex flex-col gap-1 z-50 animate-[fadeIn_0.2s_ease-out]"
                  >
                    <a href="/sesion-coach" role="menuitem" onClick={() => setDropdownOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[#F2F0E9] focus:bg-[#F2F0E9] focus:outline-none transition-colors text-xs font-bold flex items-center gap-3 text-[#2E4036]">
                      <Star size={14} className="text-[#CC5833] fill-[#CC5833]" /> Sesión Coach
                    </a>
                    <a href="/sala-reduccion-ego" role="menuitem" onClick={() => setDropdownOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[#F2F0E9] focus:bg-[#F2F0E9] focus:outline-none transition-colors text-xs font-bold flex items-center gap-3 text-[#2E4036]">
                      <Activity size={14} className="text-[#CC5833]" /> Sala del Ego
                    </a>
                    <a href="/entrega-de-pasos" role="menuitem" onClick={() => setDropdownOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[#F2F0E9] focus:bg-[#F2F0E9] focus:outline-none transition-colors text-xs font-bold flex items-center gap-3 text-[#2E4036]">
                      <Compass size={14} className="text-[#2E4036]" /> Entrega de Pasos
                    </a>
                    <a href="/curso-de-milagros" role="menuitem" onClick={() => setDropdownOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[#F2F0E9] focus:bg-[#F2F0E9] focus:outline-none transition-colors text-xs font-bold flex items-center gap-3 text-[#2E4036]">
                      <BookOpen size={14} className="text-[#E2C17D]" /> Curso de Milagros
                    </a>
                    <a href="/mi-proceso" role="menuitem" onClick={() => setDropdownOpen(false)} className="mt-1 px-4 py-3 rounded-xl bg-[#2E4036] hover:bg-[#243328] focus:bg-[#243328] focus:outline-none transition-colors text-xs font-bold flex items-center gap-3 text-white">
                      <LogIn size={14} className="text-[#E2C17D]" /> Continuar mi proceso
                    </a>
                  </div>
                )}
              </div>

              <a href="/fundacion" className="hover:opacity-70 transition-opacity flex items-center gap-1">
                <HeartHandshake size={13} className="text-[#E2C17D]" /> La Fundación
              </a>
              <a href="/alexandra-ortega" className="hover:opacity-70 transition-opacity">Alexandra</a>
              <a href="/#planes" className="hover:opacity-70 transition-opacity">Planes</a>
              <a
                href="/#admin"
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                  scrolled
                    ? 'border-[#2E4036]/20 text-[#2E4036] hover:border-[#2E4036] hover:bg-[#2E4036] hover:text-white'
                    : 'border-white/35 text-white/90 hover:bg-white/12 hover:text-white backdrop-blur-sm'
                }`}
              >
                <ShieldCheck size={13} />
                Ingresar
              </a>
            </div>

            {/* DERECHA: Botón CTA */}
            <div className={`w-[55%] md:w-1/4 flex justify-end ${scrolled ? 'items-center' : 'items-start pt-3'}`}>
              <button
                onClick={onOpenTest}
                className={`hidden lg:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all btn-magnetic shadow-lg ${scrolled ? 'bg-[#CC5833] text-white hover:bg-[#b04a29]' : 'bg-white text-[#1A1A1A] hover:bg-gray-100'}`}
              >
                Valoraci&oacute;n inicial de tu proceso
              </button>
              <button
                type="button"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden mt-2 rounded-full p-2 focus-visible:ring-2 focus-visible:ring-[#E2C17D]"
                onClick={() => {
                  setDropdownOpen(false);
                  setMobileMenuOpen((open) => !open);
                }}
              >
                {mobileMenuOpen ? <X className={scrolled ? 'text-[#2E4036]' : 'text-white'} size={28} /> : <Menu className={scrolled ? 'text-[#2E4036]' : 'text-white'} size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#1A1A1A] text-white flex flex-col items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-center shadow-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#E2C17D] mb-5">Navegación</p>
            <div className="flex flex-col items-stretch gap-3">
              <a href="/#metodo" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-5 py-3 text-lg font-heading hover:bg-white/10 focus:bg-white/10 focus:outline-none">Método</a>
              <a href="/sesion-coach" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-5 py-3 text-lg font-heading text-[#E2C17D] flex items-center justify-center gap-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none"><Star size={16} className="fill-current text-[#CC5833]" /> Sesión Coach</a>
              <a href="/sala-reduccion-ego" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-5 py-3 text-lg font-heading flex items-center justify-center gap-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none"><Activity size={16} className="text-[#CC5833]" /> Sala del Ego</a>
              <a href="/entrega-de-pasos" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-5 py-3 text-lg font-heading flex items-center justify-center gap-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none"><Compass size={16} className="text-[#E2C17D]" /> Entrega de Pasos</a>
              <a href="/curso-de-milagros" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-5 py-3 text-lg font-heading flex items-center justify-center gap-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none"><BookOpen size={16} className="text-[#E2C17D]" /> Curso de Milagros</a>
              <a href="/mi-proceso" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl bg-[#CC5833] px-5 py-3 text-lg font-heading flex items-center justify-center gap-2 hover:bg-[#b04a29] focus:outline-none"><LogIn size={16} className="text-white" /> Continuar mi proceso</a>
              <a href="/fundacion" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-5 py-3 text-lg font-heading flex items-center justify-center gap-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none"><HeartHandshake size={16} className="text-[#E2C17D]" /> La Fundación</a>
              <a href="/alexandra-ortega" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-5 py-3 text-lg font-heading flex items-center justify-center gap-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none"><User size={16} className="text-[#E2C17D]" /> ¿Quién es Alexandra?</a>
              <a href="/#planes" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-5 py-3 text-lg font-heading hover:bg-white/10 focus:bg-white/10 focus:outline-none">Planes</a>
            </div>
          </div>
          <a
            href="/#admin"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white/85 hover:bg-white/10 transition-colors"
          >
            <ShieldCheck size={15} />
            Ingresar
          </a>
          <button
            onClick={() => { onOpenTest(); setMobileMenuOpen(false); }}
            className="bg-[#CC5833] text-white px-7 py-3.5 rounded-full font-semibold mt-4 shadow-[0_0_20px_rgba(204,88,51,0.3)]"
          >
            Valoraci&oacute;n inicial de tu proceso
          </button>
        </div>
      )}
    </>
  );
};

const Hero = ({ onOpenTest }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const gsap = window.gsap;
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-elem", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-end pb-20 md:pb-28 pt-44">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=75&w=1400&auto=format&fit=crop"
          alt="Bosque sereno al amanecer"
          width="1400"
          height="933"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#2E4036]/80 to-[#1A1A1A]/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(226,193,125,0.24),transparent_34%),radial-gradient(circle_at_78%_34%,rgba(204,88,51,0.18),transparent_28%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end h-full">
        <div className="grid lg:grid-cols-[1.08fr_0.72fr] gap-10 lg:gap-16 items-end">
          <div className="max-w-4xl">
            <a href="/fundacion" className="hero-elem inline-flex items-center gap-2 rounded-full border border-[#E2C17D]/40 bg-white/10 px-4 py-2 text-[11px] md:text-xs uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm mb-4 transition-colors hover:bg-white/20">
              <HeartHandshake size={14} className="text-[#E2C17D]" />
              Fundación Social Mentes Brillantes · Entidad sin ánimo de lucro
            </a>
            <div className="hero-elem mb-6 flex items-center gap-2 text-[11px] md:text-xs uppercase tracking-[0.24em] text-white/70">
              <Sparkles size={13} className="text-[#E2C17D]" />
              Valoración inicial + mapa de entrenamiento
            </div>

            <h1 className="text-white leading-[1.02] mb-6 max-w-5xl">
              <span className="hero-elem block font-heading font-bold text-[2.85rem] sm:text-6xl md:text-7xl tracking-tight">
                Esto no es terapia.
              </span>
              <span className="hero-elem block font-serif italic text-[2.8rem] sm:text-[4.4rem] md:text-[5.2rem] text-[#F2F0E9] mt-1 md:mt-2">
                Es entrenamiento emocional.
              </span>
            </h1>

            <p className="hero-elem text-[#E2C17D] text-xl md:text-2xl font-serif italic mb-5 max-w-2xl">
              Transforma tu mundo interior y tus resultados.
            </p>

            <div className="hero-elem max-w-3xl space-y-4 mb-8">
              <p className="text-[#F2F0E9]/92 text-base md:text-xl font-light leading-relaxed">
                GEMB une conciencia, oración, meditación, 12 Pasos, Un Curso de Milagros, Eneagrama y acompañamiento para que dejes de reaccionar desde el ego y empieces a entrenar desde la paz.
              </p>
              <p className="text-[#F2F0E9]/[0.78] text-sm md:text-base leading-relaxed">
                Si quieres cambiar los frutos, primero debes cambiar las raíces: la forma en que piensas, eliges, amas, pones límites y sostienes tus decisiones.
              </p>
            </div>

            <div className="hero-elem flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={onOpenTest}
                className="bg-[#CC5833] text-white px-8 py-4 rounded-full font-semibold btn-magnetic flex items-center justify-center gap-2 shadow-[0_0_26px_rgba(204,88,51,0.35)]"
              >
                Valoración inicial de tu proceso
                <ArrowRight size={18} />
              </button>
              <a href="#procesos" className="border border-[#F2F0E9]/30 text-[#F2F0E9] hover:bg-[#F2F0E9]/10 px-8 py-4 rounded-full font-semibold btn-magnetic flex items-center justify-center transition-colors backdrop-blur-sm">
                Ver procesos
              </a>
            </div>

            <p className="hero-elem mb-8 max-w-2xl text-xs md:text-sm leading-relaxed text-[#F2F0E9]/70">
              GEMB es el programa de entrenamiento emocional de la <strong className="font-bold text-[#F2F0E9]/90">Fundación Social Mentes Brillantes</strong> (NIT 901.002.849-3).
              Los excedentes financian encuentros comunitarios gratuitos y programas sociales en Bogotá.{' '}
              <a href="/fundacion" className="font-bold text-[#E2C17D] underline decoration-[#E2C17D]/40 underline-offset-4 hover:text-white">Conoce la labor social →</a>
            </p>
          </div>

          <div className="hero-elem hidden lg:block rounded-[2rem] border border-white/15 bg-black/20 p-6 backdrop-blur-md shadow-2xl">
            <p className="font-mono text-[11px] text-[#E2C17D] tracking-[0.18em] uppercase mb-5">
              Método integral GEMB
            </p>
            <div className="space-y-4">
              {["Diagnóstico emocional", "Entrenamiento espiritual", "Seguimiento y práctica"].map((item, index) => (
                <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E2C17D] text-sm font-bold text-[#1A1A1A]">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-[#F2F0E9]">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-[#F2F0E9]/65">
              Guiado por Alexandra Ortega: claridad, práctica y dirección para volver al centro.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MICRO-FEATURES ---

const ENEATYPE_CARDS = [
  { title: "Eneatipo 1", insight: "El Perfeccionista / Reformador." },
  { title: "Eneatipo 2", insight: "El Ayudador." },
  { title: "Eneatipo 3", insight: "El Triunfador / Realizador." },
  { title: "Eneatipo 4", insight: "El Individualista." },
  { title: "Eneatipo 5", insight: "El Investigador." },
  { title: "Eneatipo 6", insight: "El Leal." },
  { title: "Eneatipo 7", insight: "El Entusiasta." },
  { title: "Eneatipo 8", insight: "El Lider / Desafiador." },
  { title: "Eneatipo 9", insight: "El Conciliador." }
];

const TELEMETRY_MESSAGES = [
  "Analizando patron motivacional...",
  "Detectando miedo central activado...",
  "Identificando eneatipo dominante...",
  "Cargando mapa de crecimiento...",
  "Compilando protocolo de reduccion del ego..."
];

const FeatureDeck = () => {
  const [active, setActive] = useState(0);
  const cards = ENEATYPE_CARDS;
  /*
    { title: "Eneatipo 1", insight: "El Perfeccionista / Reformador." },
    { title: "Eneatipo 2", insight: "El Ayudador." },
    { title: "Eneatipo 3", insight: "El Triunfador / Realizador." },
    { title: "Eneatipo 4", insight: "El Individualista." },
    { title: "Eneatipo 5", insight: "El Investigador." },
    { title: "Eneatipo 6", insight: "El Leal." },
    { title: "Eneatipo 7", insight: "El Entusiasta." },
    { title: "Eneatipo 8", insight: "El Líder / Desafiador." },
    { title: "Eneatipo 9", insight: "El Conciliador." }
  */

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="relative h-48 w-full max-w-sm mx-auto mt-4 perspective-1000">
        {cards.map((card, idx) => {
          const isActive = idx === active;
          const isPrev = idx === (active - 1 + cards.length) % cards.length;

          let transform = "translateY(20px) scale(0.9) rotateX(10deg)";
          let opacity = 0.4;
          let zIndex = 0;

          if (isActive) {
            transform = "translateY(0px) scale(1) rotateX(0deg)";
            opacity = 1;
            zIndex = 10;
          } else if (isPrev) {
            transform = "translateY(-15px) scale(0.95) rotateX(-5deg)";
            opacity = 0.7;
            zIndex = 5;
          }

          return (
            <div
              key={idx}
              className="absolute inset-0 bg-white rounded-2xl p-6 shadow-xl border border-gray-100 transition-all duration-700 ease-in-out flex flex-col justify-center"
              style={{ transform, opacity, zIndex, transformOrigin: 'bottom center' }}
            >
              <span className="font-mono text-xs text-[#CC5833] font-bold tracking-widest mb-2 block">ENEATIPO</span>
              <h4 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-2">{card.title}</h4>
              <p className="text-gray-500 text-sm italic font-serif">"{card.insight}"</p>
            </div>
          );
        })}
      </div>
      <div className="mt-8 pt-4 border-t border-[#1A1A1A]/10">
        <p className="font-mono text-xs text-[#2E4036] opacity-70">
          Diagnóstico → Claridad → Protocolo de entrenamiento
        </p>
      </div>
    </div>
  );
};

const FeatureTelemetry = () => {
  const messages = TELEMETRY_MESSAGES;
  /*
    "Analizando patrón motivacional...",
    "Detectando miedo central activado...",
    "Identificando eneatipo dominante...",
    "Cargando mapa de crecimiento...",
    "Compilando protocolo de reducción del ego..."
  */
  const [msgIdx, setMsgIdx] = useState(0);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (isTyping) {
      if (text.length < messages[msgIdx].length) {
        timeout = setTimeout(() => {
          setText(messages[msgIdx].slice(0, text.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      timeout = setTimeout(() => {
        setText("");
        setMsgIdx((prev) => (prev + 1) % messages.length);
        setIsTyping(true);
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [text, isTyping, msgIdx, messages]);

  return (
    <div className="h-full bg-[#1A1A1A] text-[#F2F0E9] rounded-2xl p-6 flex flex-col font-mono text-sm relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-xs opacity-50 tracking-widest uppercase">En Vivo</span>
      </div>

      <div className="flex-1">
        <p className="text-[#00FF66]/80 mb-2">{'>'} sys.diagnose()</p>
        <p className="min-h-[3rem] text-gray-300">
          {text}
          <span className="inline-block w-2 h-4 bg-[#CC5833] ml-1 animate-pulse"></span>
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
        <div className="flex justify-between items-center opacity-70">
          <span>Claridad</span> <span className="text-[#00FF66]">↑ 85%</span>
        </div>
        <div className="flex justify-between items-center opacity-70">
          <span>Ruido mental</span> <span className="text-[#CC5833]">↓ 20%</span>
        </div>
        <div className="flex justify-between items-center opacity-70">
          <span>Liderazgo emocional</span> <span className="text-[#00FF66]">↑ 92%</span>
        </div>
      </div>
    </div>
  );
};

const FeatureAgenda = () => {
  const cursorRef = useRef(null);
  const btnRef = useRef(null);
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const [activeDay, setActiveDay] = useState(2);
  const [isCopied, setIsCopied] = useState(false);
  const protocolText = "Protocolo de Entrenamiento GEMB:\n- Sala de Reducción del Ego (Sesión semanal)\n- Práctica: Meditación 15 min";

  useLayoutEffect(() => {
    const gsap = window.gsap;
    let ctx = gsap.context(() => {
      if (!isCopied) {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        tl.to(cursorRef.current, { x: 140, y: 30, duration: 1, ease: "power2.inOut" })
          .to(cursorRef.current, { scale: 0.8, duration: 0.1, onComplete: () => setActiveDay(3) })
          .to(cursorRef.current, { scale: 1, duration: 0.1 })
          .to(cursorRef.current, { x: 80, y: 180, duration: 1, ease: "power2.inOut", delay: 0.5 })
          .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
          .to(btnRef.current, { scale: 0.95, duration: 0.1 }, "<")
          .to(cursorRef.current, { scale: 1, duration: 0.1 })
          .to(btnRef.current, { scale: 1, duration: 0.1 }, "<")
          .to(cursorRef.current, { x: 300, y: 300, duration: 1, ease: "power2.inOut", opacity: 0 });
      }
    });
    return () => ctx.revert();
  }, [isCopied]);

  const handleSaveProtocol = async () => {
    try {
      await navigator.clipboard.writeText(protocolText);
      setIsCopied(true);
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      setTimeout(() => {
        setIsCopied(false);
        if (cursorRef.current) cursorRef.current.style.display = 'block';
      }, 6000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = protocolText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 6000);
    }
  };

  const handleWhatsAppProtocol = () => {
    const encoded = encodeURIComponent(`Hola, este es mi protocolo de entrenamiento base:\n\n${protocolText}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between mb-6">
        {days.map((day, i) => (
          <div key={day} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${activeDay === i ? 'bg-[#2E4036] text-white' : 'bg-gray-100 text-gray-400'}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-3 flex-1">
        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#CC5833] mt-1.5"></div>
          <div>
            <p className="text-sm font-bold text-[#1A1A1A]">Sala de Reducción del Ego</p>
            <p className="text-xs text-gray-500">Sesión semanal en vivo</p>
          </div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#2E4036] mt-1.5"></div>
          <div>
            <p className="text-sm font-bold text-[#1A1A1A]">Práctica: Meditación</p>
            <p className="text-xs text-gray-500">Protocolo de 15 min</p>
          </div>
        </div>
      </div>

      {isCopied ? (
        <div className="mt-6 flex gap-2 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex-1 py-3 bg-[#E6E4DD] rounded-xl text-[#2E4036] font-bold text-xs md:text-sm flex justify-center items-center gap-1 border border-transparent">
            <CheckCircle2 size={16} /> Copiado
          </div>
          <button onClick={handleWhatsAppProtocol} className="flex-[2] py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs md:text-sm flex justify-center items-center gap-2 hover:bg-[#20bd5a] transition-colors btn-magnetic">
            <MessageCircle size={16} /> Enviar por WhatsApp
          </button>
        </div>
      ) : (
        <button onClick={handleSaveProtocol} ref={btnRef} className="mt-6 w-full py-3 rounded-xl border-2 border-[#2E4036] text-[#2E4036] font-bold text-sm flex justify-center items-center gap-2 hover:bg-[#2E4036] hover:text-white transition-colors relative z-10">
          <Copy size={16} /> Guardar protocolo
        </button>
      )}

      {isCopied && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-xs font-mono animate-[bounce_0.5s_ease-out] shadow-xl z-30 pointer-events-none">
          Protocolo copiado al portapapeles
        </div>
      )}

      <div ref={cursorRef} className="absolute top-0 left-0 z-20 pointer-events-none" style={{ transform: 'translate(0px, 150px)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 3.21V20.8C5.5 21.46 6.27 21.82 6.78 21.4L11.5 17H18.5C19.05 17 19.5 16.55 19.5 16V3.21C19.5 2.66 19.05 2.21 18.5 2.21H6.5C5.95 2.21 5.5 2.66 5.5 3.21Z" fill="#1A1A1A" />
          <path d="M6 3V20L11.5 16H18V3H6Z" fill="white" />
        </svg>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const methodSteps = [
    {
      title: "Mirar con verdad",
      text: "Identificamos el patrón emocional y espiritual que dirige tus decisiones cuando estás en miedo, control o culpa.",
      icon: <ScanLine size={22} />
    },
    {
      title: "Practicar a diario",
      text: "Entrenamos oración, meditación, límites, 12 Pasos, UCDM y acciones simples que sostienen un cambio real.",
      icon: <Activity size={22} />
    },
    {
      title: "Volver al centro",
      text: "Acompañamos tu proceso para que no dependas de motivación: aprendes a elegir desde paz, claridad y responsabilidad.",
      icon: <Compass size={22} />
    }
  ];

  const methodPillars = [
    "Conciencia",
    "Oración",
    "Meditación",
    "12 Pasos",
    "Un Curso de Milagros",
    "Sala del Ego",
    "Eneagrama",
    "Acompañamiento"
  ];

  return (
    <section id="metodo" className="py-24 md:py-32 px-6 md:px-12 bg-[#F2F0E9] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2C17D]/70 to-transparent"></div>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-end mb-16 md:mb-20">
          <div>
            <span className="font-mono text-xs font-bold text-[#CC5833] tracking-[0.22em] uppercase mb-4 block">
              El Método
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] max-w-3xl leading-tight">
              Una ruta espiritual y práctica para entrenar tu mundo interior.
            </h2>
          </div>
          <div className="space-y-5">
            <p className="text-[#1A1A1A]/70 text-base md:text-lg leading-relaxed">
              GEMB no te llena de teoría. Te ayuda a mirar tu ego con honestidad, ordenar tus emociones y practicar una forma distinta de responder a la vida.
            </p>
            <div className="flex flex-wrap gap-2">
              {methodPillars.map((pillar) => (
                <span key={pillar} className="rounded-full border border-[#2E4036]/15 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2E4036]">
                  {pillar}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-12 md:mb-16">
          {methodSteps.map((step, index) => (
            <div key={step.title} className="bg-white border border-[#2E4036]/10 p-7 rounded-[2rem] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#2E4036] text-[#E2C17D] flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="font-mono text-xs text-[#CC5833] font-bold">0{index + 1}</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-3">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[#1A1A1A]/65">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Panel 1 */}
          <div className="bg-white radius-huge p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col min-h-[420px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl">Mapa de Eneatipos</h3>
              <ScanLine className="text-[#CC5833]" size={24} />
            </div>
            <FeatureDeck />
          </div>

          {/* Panel 2 */}
          <div className="bg-[#1A1A1A] radius-huge p-2 shadow-xl min-h-[420px]">
            <div className="h-full w-full rounded-[2rem] overflow-hidden">
              <FeatureTelemetry />
            </div>
          </div>

          {/* Panel 3 */}
          <div className="bg-[#F2F0E9] border-2 border-[#2E4036]/10 radius-huge p-8 md:p-10 flex flex-col min-h-[420px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl">Agenda / Protocolo</h3>
              <Settings2 className="text-[#2E4036]" size={24} />
            </div>
            <FeatureAgenda />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MANIFIESTO ---

const Manifesto = () => {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const gsap = window.gsap;
    let ctx = gsap.context(() => {
      gsap.from(".manifesto-line", {
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, textRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="eneatipos" className="relative py-32 md:py-48 bg-[#1A1A1A] overflow-hidden flex items-center min-h-[80vh]">
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=70&w=1200&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      ></div>

      <div ref={textRef} className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl leading-tight mb-12">
          <span className="manifesto-line block font-heading font-bold text-[#F2F0E9]/50 mb-4">
            Lo normal es decir: "Estoy roto/a".
          </span>
          <span className="manifesto-line block font-serif italic text-white">
            Nosotros decimos: "Estoy listo/a para entrenar".
          </span>
        </h2>

        <p className="manifesto-line text-[#F2F0E9]/80 text-lg md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
          En GEMB no buscamos "arreglar" personas. Entrenamos resistencia emocional, claridad y disciplina interior.<br />
          <span className="text-white font-medium mt-4 block">No somos clínica. Somos Gimnasio. No pacientes: atletas emocionales.</span>
        </p>
      </div>
    </section>
  );
};

// --- ARCHIVO (TARJETAS APILADAS) ---

const StackedCards = () => {
  const containerRef = useRef(null);

  const cards = [
    {
      title: "Sala de Reducción del Ego",
      text: "Un espacio semanal para desactivar la voz que sabotea, y volver al centro.",
      icon: <Activity size={48} className="text-[#CC5833] animate-[spin_10s_linear_infinite]" />,
      bg: "bg-[#F2F0E9]",
      textCol: "text-[#1A1A1A]"
    },
    {
      title: "12 Pasos · Disciplina con propósito",
      text: "Estructura. Progreso. Servicio. Un camino que no depende de motivación: depende de práctica.",
      icon: (
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-[#2E4036] rounded-sm opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF66] shadow-[0_0_10px_#00FF66] animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
      ),
      bg: "bg-[#E6E4DD]",
      textCol: "text-[#1A1A1A]"
    },
    {
      title: "Instante Santo · Recableado",
      text: "Oración, meditación y perdón práctico: cuando la mente baja el ruido, el alma respira.",
      icon: (
        <svg viewBox="0 0 100 40" className="w-24 h-12 stroke-[#F2F0E9] fill-none stroke-2">
          <path d="M0 20 L20 20 L30 5 L40 35 L50 20 L60 20 L65 10 L75 30 L80 20 L100 20" className="animate-[dash_3s_linear_infinite] [stroke-dasharray:100] [stroke-dashoffset:100]" />
        </svg>
      ),
      bg: "bg-[#2E4036]",
      textCol: "text-[#F2F0E9]"
    }
  ];

  useLayoutEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    let ctx = gsap.context(() => {
      const cardElements = gsap.utils.toArray('.stacked-card');

      cardElements.forEach((card, i) => {
        if (i < cardElements.length - 1) {
          ScrollTrigger.create({
            trigger: cardElements[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
            animation: gsap.to(card, {
              scale: 0.9,
              opacity: 0.5,
              filter: "blur(10px)",
              ease: "none"
            })
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="archivo" ref={containerRef} className="relative bg-[#1A1A1A] pb-24">
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`stacked-card sticky top-0 h-[100dvh] w-full flex items-center justify-center ${card.bg} ${card.textCol} shadow-[0_-10px_40px_rgba(0,0,0,0.1)] origin-top`}
          style={{ zIndex: idx }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            <div className="mb-12 h-24 flex items-center justify-center">
              {card.icon}
            </div>
            <h2 className="font-heading font-bold text-5xl md:text-7xl mb-6 tracking-tight">
              {card.title.split('·').map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="block font-serif italic font-normal opacity-70 mt-2">{part}</span>}
                  {i === 0 && part}
                </React.Fragment>
              ))}
            </h2>
            <p className="text-xl md:text-2xl font-light opacity-80 max-w-2xl mx-auto font-serif">
              {card.text}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

// --- NUEVA SECCIÓN: NUESTROS PROCESOS PRINCIPALES ---

const NuestrosProcesosSection = () => {
  const handleWA = (message) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
  };

  const procesos = [
    {
      id: "sesion-coach",
      route: "/sesion-coach",
      title: "Sesión Coach",
      subtitle: "Dirección privada 1:1",
      text: "Acompañamiento personalizado para mirar tu historia con honestidad, ordenar tu mundo emocional y recibir dirección concreta para tu proceso interior.",
      cta: "Agendar información por WhatsApp",
      message: "Hola, quiero más información sobre la Sesión Coach de Gimnasio Emocional Mentes Brillantes.",
      icon: <User className="text-[#E2C17D]" size={30} />,
      accent: "from-[#E2C17D]/25 to-transparent"
    },
    {
      id: "sala-ego",
      route: "/sala-reduccion-ego",
      title: "Sala de Reducción del Ego",
      subtitle: "Práctica grupal en vivo",
      text: "Un espacio profundo para reconocer la voz que controla, suelta o ataca; y entrenar una respuesta más consciente, humilde y amorosa.",
      cta: "Preguntar por la Sala del Ego",
      message: "Hola, quiero más información sobre la Sala de Reducción del Ego.",
      icon: <Activity className="text-[#CC5833]" size={30} />,
      accent: "from-[#CC5833]/25 to-transparent"
    },
    {
      id: "entrega-pasos",
      route: "/entrega-de-pasos",
      title: "Entrega de Pasos",
      subtitle: "Honestidad y reparación",
      text: "Una ruta de entrega, inventario y responsabilidad para dejar de cargar solo/a, reparar desde el alma y vivir con más libertad.",
      cta: "Quiero saber sobre los pasos",
      message: "Hola, quiero más información sobre la Entrega de Pasos.",
      icon: <Compass className="text-[#E2C17D]" size={30} />,
      accent: "from-[#2E4036]/60 to-transparent"
    },
    {
      id: "curso-milagros",
      route: "/curso-de-milagros",
      title: "Un Curso de Milagros",
      subtitle: "Entrenamiento de la mente",
      text: "Un recorrido de estudio y práctica para sanar la percepción, elegir de nuevo y volver al amor como disciplina diaria.",
      cta: "Información del Curso de Milagros",
      message: "Hola, quiero más información sobre Un Curso de Milagros.",
      icon: <BookOpen className="text-[#F2F0E9]" size={30} />,
      accent: "from-white/15 to-transparent"
    }
  ];

  return (
    <section id="procesos" className="py-24 md:py-32 px-6 md:px-12 bg-[#2E4036] relative overflow-hidden text-white z-10">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(226,193,125,0.18),transparent_28%),radial-gradient(circle_at_90%_80%,rgba(204,88,51,0.18),transparent_30%)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr] gap-10 lg:gap-16 mb-14 md:mb-20 items-end">
          <div>
            <span className="font-mono text-xs text-[#E2C17D] font-bold tracking-widest uppercase mb-4 block">
              Procesos fuertes
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Nuestros Procesos Principales
            </h2>
          </div>
          <p className="text-[#F2F0E9]/78 font-serif italic text-xl md:text-2xl leading-relaxed max-w-3xl">
            Elige el punto de entrada que tu vida necesita hoy: claridad privada, práctica grupal, entrega profunda o entrenamiento espiritual de la mente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-7">
          {procesos.map((proceso) => (
            <article
              key={proceso.id}
              id={proceso.id}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#1A1A1A]/45 p-7 md:p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#E2C17D]/50"
            >
              <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${proceso.accent} opacity-80 pointer-events-none`}></div>
              <div className="relative flex min-h-[360px] flex-col">
                <div className="mb-7 flex items-center justify-between">
                  <div className="w-14 h-14 bg-white/[0.07] rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#E2C17D]/40 transition-colors">
                    {proceso.icon}
                  </div>
                  <a href={proceso.route} aria-label={`Conocer ${proceso.title}`} className="font-mono text-[10px] text-white/45 hover:text-[#E2C17D] transition-colors">
                    Ver ruta
                  </a>
                </div>

                <span className="font-mono text-[10px] text-[#E2C17D] tracking-widest uppercase block mb-2">
                  {proceso.subtitle}
                </span>

                <h3 className="font-heading font-bold text-2xl mb-4 group-hover:text-[#E2C17D] transition-colors">
                  {proceso.title}
                </h3>

                <p className="text-[#F2F0E9]/76 text-sm leading-relaxed font-light mb-8">
                  {proceso.text}
                </p>

                <a
                  href={proceso.route}
                  className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E2C17D] transition-colors hover:text-white"
                >
                  Conocer proceso
                  <ArrowRight size={14} />
                </a>

                <button
                  type="button"
                  aria-label={`${proceso.cta}: ${proceso.title}`}
                  onClick={() => handleWA(proceso.message)}
                  className="mt-auto w-full py-4 rounded-full border border-white/20 group-hover:border-transparent group-hover:bg-[#CC5833] text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 flex justify-center items-center gap-2 group-hover:shadow-[0_8px_25px_rgba(204,88,51,0.35)]"
                >
                  <MessageCircle size={14} className="text-white" />
                  {proceso.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- NUEVA SECCIÓN: COACH SESSION (VERSIÓN PREMIUM & PERSUASIVA) ---

const painPoints = [
  { id: 'cargado', label: 'Me siento cargado/a por todos', response: 'Vamos a mirar dónde confundiste amor con rescate, y entrenar una forma de servir sin perderte a ti.' },
  { id: 'limites', label: 'Me cuesta poner límites', response: 'Ordenaremos el miedo al rechazo, definiremos una línea clara y practicaremos cómo sostenerla sin culpa.' },
  { id: 'mente', label: 'Mi mente no se apaga', response: 'Bajaremos el ruido del control con una práctica concreta para volver al cuerpo, la oración y la acción correcta.' }
];

const CoachSessionSection = ({ onOpenGuarantee }) => {
  const [selectedPain, setSelectedPain] = useState(null);

  const handleWA = () => {
    const text = encodeURIComponent("Hola, quiero agendar una Sesión Coach con Alexandra Ortega. Quiero información para iniciar mi proceso en Gimnasio Emocional Mentes Brillantes.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <section id="sesion-coach-detalle" className="pt-24 pb-12 md:pt-32 md:pb-16 px-6 md:px-12 bg-[#F2F0E9] relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#1A1A1A] radius-huge p-8 md:p-14 shadow-[0_24px_70px_rgba(0,0,0,0.18)] relative flex flex-col lg:flex-row gap-12 lg:gap-16 items-center border border-[#2E4036]/20 overflow-hidden">

          <div className="absolute inset-0 radius-huge overflow-hidden pointer-events-none">
            <div className="absolute top-[-40%] right-[-10%] w-[70%] h-[140%] bg-gradient-to-bl from-[#CC5833]/14 via-[#2E4036]/25 to-transparent blur-3xl rounded-full"></div>
            <div className="absolute bottom-[-35%] left-[-15%] w-[60%] h-[80%] bg-gradient-to-tr from-[#E2C17D]/10 to-transparent blur-3xl rounded-full"></div>
          </div>

          <div className="flex-1 relative z-10 w-full">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#CC5833] px-5 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white shadow-[0_8px_22px_rgba(204,88,51,0.32)]">
              <Star size={14} className="fill-current" /> Servicio principal · 1:1
            </div>

            <h2 className="font-heading font-bold text-4xl md:text-5xl text-[#F2F0E9] mb-3 leading-tight">
              Sesión Coach
              <span className="block text-[#E2C17D] font-serif italic font-normal text-3xl md:text-4xl mt-1">con Alexandra Ortega</span>
            </h2>

            <p className="text-lg md:text-xl text-white/90 font-light mb-6">
              Acompañamiento personalizado para ordenar lo que sientes, mirar el patrón que se repite y salir con una dirección práctica para tu vida real.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Clock size={14} className="text-[#CC5833]" />
                <span className="text-xs text-white/80 font-mono">Sesión privada</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <User size={14} className="text-[#CC5833]" />
                <span className="text-xs text-white/80 font-mono">1 a 1</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Target size={14} className="text-[#CC5833]" />
                <span className="text-xs text-white/80 font-mono">Seguimiento claro</span>
              </div>
            </div>

            <p className="text-[#E2C17D] font-serif italic text-xl md:text-2xl mb-8 border-l-2 border-[#E2C17D]/30 pl-4">
              "No buscamos que entiendas más. Buscamos que practiques distinto."
            </p>

            <div className="bg-[#2a2a2a]/50 p-6 rounded-3xl border border-white/5 mb-8">
              <p className="text-white font-medium mb-4 text-sm flex items-center gap-2">
                <Activity size={16} className="text-[#00FF66]" /> Selecciona tu mayor reto hoy:
              </p>
              <div className="flex flex-col gap-3">
                {painPoints.map((pain) => (
                  <button
                    key={pain.id}
                    onClick={() => setSelectedPain(pain)}
                    className={`text-left px-5 py-3 rounded-xl text-sm transition-all duration-300 border ${selectedPain?.id === pain.id
                        ? 'bg-[#CC5833] border-[#CC5833] text-white shadow-lg font-medium'
                        : 'bg-transparent border-white/20 text-white/70 hover:border-white/50 hover:bg-white/5'
                      }`}
                  >
                    {pain.label}
                  </button>
                ))}
              </div>

              {/* Resultado de la interacción */}
              {selectedPain && (
                <div className="mt-5 p-4 bg-[#2E4036]/30 border border-[#2E4036] rounded-xl animate-[fadeIn_0.3s_ease-out]">
                  <p className="text-[#F2F0E9] text-sm leading-relaxed">
                    <span className="font-bold text-[#E2C17D]">El enfoque:</span> {selectedPain.response}
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={handleWA}
                className="w-full md:w-auto px-8 py-4 rounded-full bg-[#E2C17D] text-[#1A1A1A] font-bold btn-magnetic shadow-[0_0_20px_rgba(226,193,125,0.2)] flex justify-center items-center gap-3 border border-transparent hover:bg-white transition-colors"
              >
                {selectedPain ? 'Quiero mi Sesión Coach' : 'Agendar información por WhatsApp'}
                <ArrowRight size={18} />
              </button>

              <div className="mt-4 flex flex-col gap-1">
                <p className="text-xs text-white/40 mt-1">
                  <span className="font-bold text-white/60">Al hacer clic:</span> te pedimos 3 datos, te enviamos horarios y confirmas tu espacio.
                </p>
              </div>

              <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-md shadow-lg group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#2E4036]/50 border border-[#00FF66]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,255,102,0.1)]">
                  <ShieldCheck size={24} className="text-[#00FF66]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[#F2F0E9] font-bold text-sm md:text-base flex items-center gap-2">Compromiso de acompañamiento</h4>
                  <p className="text-white/70 text-[11px] md:text-xs mt-1 leading-tight font-light">
                    Tu proceso sostiene la labor social gratuita de la Fundación. Condiciones del acompañamiento disponibles.
                  </p>
                  <button onClick={onOpenGuarantee} className="text-[#E2C17D] text-[10px] uppercase tracking-widest font-mono mt-2 hover:text-white transition-colors underline decoration-[#E2C17D]/30 underline-offset-4">
                    Ver términos y condiciones
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[45%] relative z-10 bg-white/[0.03] p-8 md:p-10 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl">
            <h3 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-2">
              Sales con una ruta:
            </h3>

            <ul className="space-y-6">
              {[
                "Lectura clara del patrón emocional que hoy te bloquea, agota o repite la misma historia.",
                "Primer protocolo de entrenamiento: límites, calma, oración, acción y seguimiento.",
                "Ruta recomendada según tu caso: Sala del Ego, pasos, UCDM, prácticas o acompañamiento.",
                "Una forma más honesta de medir avance: decisiones, paz, coherencia y práctica diaria."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="w-7 h-7 rounded-full bg-[#2E4036] flex items-center justify-center shrink-0 mt-0.5 border border-[#00FF66]/30 group-hover:bg-[#CC5833] transition-colors duration-300">
                    <CheckCircle2 size={14} className="text-[#00FF66] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[#F2F0E9]/80 font-light leading-relaxed text-sm md:text-base group-hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-[#E2C17D] italic font-serif opacity-80 text-center">
                Un encuentro diseñado para darte claridad, dirección y una práctica que puedas sostener.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


// --- SECCIÓN: ¿QUIÉN ES ALEXANDRA ORTEGA? ---

const AlexandraFounderSection = () => (
  <section id="alexandra" className="relative z-10 bg-white px-6 py-24 md:px-12 md:py-32 overflow-hidden">
    <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#E2C17D]/[0.12] blur-3xl"></div>
    <div className="pointer-events-none absolute -bottom-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-[#2E4036]/[0.08] blur-3xl"></div>

    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      {/* Retrato */}
      <div className="relative mx-auto w-full max-w-md">
        <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-[#E2C17D]/30 via-transparent to-[#CC5833]/20 blur-xl" aria-hidden="true"></div>
        <a href="/alexandra-ortega" aria-label="Conocer quién es Alexandra Ortega" className="group relative block overflow-hidden rounded-[2.5rem] shadow-[0_28px_60px_rgba(46,64,54,0.22)]">
          <img
            src="/alexandra-sq.jpg"
            alt="Alexandra Ortega, fundadora de Gimnasio Emocional Mentes Brillantes"
            width="800"
            height="800"
            loading="lazy"
            decoding="async"
            className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              Fundadora GEMB
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#CC5833] text-white shadow-lg transition-transform duration-500 group-hover:rotate-45">
              <ArrowRight size={18} />
            </span>
          </div>
        </a>
        <div className="absolute -right-4 -top-5 rounded-2xl border border-[#2E4036]/10 bg-white px-5 py-3.5 shadow-[0_18px_38px_rgba(46,64,54,0.16)] md:-right-8">
          <p className="font-heading text-2xl font-bold text-[#2E4036]">+176</p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A]/55">mujeres formadas</p>
        </div>
      </div>

      {/* Texto */}
      <div>
        <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-[#CC5833]">
          La fundadora
        </span>
        <h2 className="font-heading text-4xl font-bold leading-tight tracking-tight text-[#1A1A1A] md:text-5xl lg:text-6xl">
          ¿Quién es <span className="font-serif font-normal italic text-[#2E4036]">Alexandra Ortega?</span>
        </h2>
        <p className="mt-5 font-serif text-2xl italic text-[#CC5833] md:text-3xl">
          "Las emociones también se entrenan."
        </p>
        <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-[#1A1A1A]/75 md:text-lg">
          Psicóloga, coach ontológica y creadora de la técnica GEMB. Tallerista, conferencista y formadora en salud mental con trayectoria continua desde 2016, ponente en la Cumbre Global de Salud Mental 2025 y lideresa reconocida por su trabajo en salud mental comunitaria, enfoque de género y construcción de paz territorial.
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          {['Psicóloga', 'Coach Ontológica', 'Ponente · Cumbre Global 2025', 'Escritora de 3 libros'].map((chip) => (
            <span key={chip} className="rounded-full border border-[#2E4036]/15 bg-[#F2F0E9] px-4 py-2 text-xs font-medium text-[#2E4036]">
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="/alexandra-ortega"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2E4036] px-8 py-4 text-sm font-bold text-white btn-magnetic shadow-[0_14px_34px_rgba(46,64,54,0.3)] transition-colors hover:bg-[#243328]"
          >
            Conocer a Alexandra
            <ArrowRight size={18} />
          </a>
          <a
            href="/alexandra-ortega#trayectoria-alexandra"
            className="inline-flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#CC5833] transition-colors hover:text-[#2E4036]"
          >
            Ver su trayectoria desde 2016 →
          </a>
        </div>
      </div>
    </div>
  </section>
);

// --- LA FUNDACIÓN (resumen en home) ---

const FundacionSection = () => (
  <section id="fundacion" className="relative z-10 overflow-hidden bg-[#2E4036] px-6 py-24 text-[#F2F0E9] md:px-12 md:py-32">
    <div className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#E2C17D]/[0.10] blur-3xl"></div>
    <div className="pointer-events-none absolute -bottom-40 -right-40 h-[26rem] w-[26rem] rounded-full bg-black/20 blur-3xl"></div>

    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
      <div>
        <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-[#E2C17D]">
          Entidad sin ánimo de lucro · Desde 2016
        </span>
        <h2 className="font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          Detrás de este método hay <span className="font-serif font-normal italic text-[#E2C17D]">una fundación</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-white/80 md:text-lg">
          La Fundación Social Gimnasio Emocional Mentes Brillantes realiza encuentros comunitarios gratuitos cada semana en Bogotá,
          forma lideresas y funcionarias con la Secretaría Distrital de la Mujer, hace parte de la estrategia de prescripción social
          Más Bienestar de la Secretaría Distrital de Salud, y reinvierte el 100% de los excedentes de sus servicios en esta labor social.
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="/fundacion"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E2C17D] px-8 py-4 text-sm font-bold text-[#2E4036] btn-magnetic shadow-[0_14px_34px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#efd693]"
          >
            Conocer la labor social
            <ArrowRight size={18} />
          </a>
          <a
            href="/politica-de-privacidad"
            className="inline-flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
          >
            Política de datos →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          ['+5.000', 'personas al año, presencial'],
          ['181', 'familias acompañadas'],
          ['Semanal', 'encuentros gratuitos híbridos'],
          ['100%', 'de excedentes reinvertidos']
        ].map(([value, label]) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            <p className="font-heading text-3xl font-bold text-[#E2C17D]">{value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-white/55">{label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- PRICING ---

const Pricing = ({ onOpenTest }) => {
  const handleWA = (message) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
  };

  const plans = [
    {
      title: "Diagnóstico",
      subtitle: "Tu punto de partida",
      description: "Ideal si necesitas claridad antes de elegir un proceso.",
      items: ["Valoración inicial", "Mapa de patrón emocional", "Ruta recomendada"],
      action: onOpenTest,
      button: "Valoración inicial de tu proceso",
      tone: "light"
    },
    {
      title: "Acceso Total",
      subtitle: "7 días dentro del método",
      description: "Una entrada guiada para probar prácticas, sala y entrenamiento real.",
      items: ["Sala de Reducción del Ego", "Prácticas guiadas", "Protocolos de límites", "Entrada sin compromiso largo"],
      action: () => handleWA("Hola, quiero activar Acceso Total · 7 Días."),
      button: "Activar 7 días por WhatsApp",
      tone: "featured"
    },
    {
      title: "Atleta Emocional",
      subtitle: "Proceso de transformación",
      description: "Para quien quiere seguimiento, profundidad y una ruta sostenida.",
      items: ["Mentoría de Pasos", "Acompañamiento y seguimiento", "Kits de Transformación", "Protocolo personal"],
      action: () => handleWA("Hola, quiero reservar una llamada para el plan Atleta Emocional."),
      button: "Reservar llamada",
      tone: "light"
    }
  ];

  return (
    <section id="planes" className="pb-24 pt-16 md:pb-32 md:pt-24 px-6 md:px-12 bg-[#F2F0E9] relative overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#2E4036]/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 md:mb-20">
          <span className="font-mono text-xs font-bold text-[#CC5833] tracking-[0.22em] uppercase mb-4 block">
            Planes con aporte solidario
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-5">
            Elige tu nivel de entrenamiento.
          </h2>
          <p className="text-[#1A1A1A]/62 font-serif italic text-xl max-w-2xl mx-auto">
            Puedes empezar con claridad, entrar al método por unos días o comprometerte con una transformación más profunda.
          </p>
          <p className="mx-auto mt-5 flex max-w-2xl items-center justify-center gap-2 rounded-full border border-[#2E4036]/15 bg-white px-5 py-2.5 text-xs md:text-sm text-[#2E4036]">
            <HeartHandshake size={15} className="shrink-0 text-[#CC5833]" />
            <span>
              El 100% de los excedentes financia los programas sociales gratuitos de la Fundación.{' '}
              <a href="/fundacion" className="font-bold underline decoration-[#CC5833]/40 underline-offset-2 hover:text-[#CC5833]">Ver cómo</a>
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {plans.map((plan) => {
            const isFeatured = plan.tone === 'featured';

            return (
              <article
                key={plan.title}
                className={`relative flex h-full flex-col rounded-[2rem] p-8 md:p-10 border shadow-xl ${
                  isFeatured
                    ? 'bg-[#2E4036] text-white border-[#E2C17D]/30 lg:-translate-y-4'
                    : 'bg-white text-[#1A1A1A] border-[#2E4036]/10'
                }`}
              >
                {isFeatured && (
                  <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#CC5833] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_8px_20px_rgba(204,88,51,0.28)]">
                    <Star size={13} className="fill-current" />
                    Recomendado
                  </div>
                )}

                <p className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-3 ${isFeatured ? 'text-[#E2C17D]' : 'text-[#CC5833]'}`}>
                  {plan.subtitle}
                </p>
                <h3 className="font-heading font-bold text-3xl mb-4">{plan.title}</h3>
                <p className={`text-sm leading-relaxed mb-8 ${isFeatured ? 'text-[#F2F0E9]/72' : 'text-[#1A1A1A]/62'}`}>
                  {plan.description}
                </p>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.items.map((item) => (
                    <li key={item} className={`flex items-start gap-3 text-sm ${isFeatured ? 'text-[#F2F0E9]' : 'text-[#1A1A1A]/82'}`}>
                      <CheckCircle2 size={18} className={`${isFeatured ? 'text-[#E2C17D]' : 'text-[#2E4036]'} shrink-0 mt-0.5`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={plan.action}
                  className={`w-full py-4 rounded-full font-bold btn-magnetic transition-colors flex justify-center items-center gap-2 ${
                    isFeatured
                      ? 'bg-[#CC5833] text-white shadow-[0_0_22px_rgba(204,88,51,0.35)] hover:bg-[#b84d2d]'
                      : 'border border-[#2E4036] text-[#2E4036] hover:bg-[#2E4036] hover:text-white'
                  }`}
                >
                  {isFeatured && <MessageCircle size={18} />}
                  {plan.button}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- FOOTER ---

const Footer = () => {
  const handleWA = () => {
    const text = encodeURIComponent("Hola, quiero información sobre Gimnasio Emocional Mentes Brillantes.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#F2F0E9] pt-24 pb-12 px-6 md:px-12 rounded-t-[3rem] md:rounded-t-[5rem] mt-[-2rem] relative z-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,rgba(226,193,125,0.10),transparent_28%),radial-gradient(circle_at_84%_72%,rgba(204,88,51,0.12),transparent_30%)]"></div>
      <div className="max-w-7xl mx-auto">
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
          <div>
            <div className="mb-6">
              <GoldenLogoLockup scrolled={false} inFooter={true} />
            </div>
            <p className="font-serif italic text-gray-300 text-xl max-w-md mt-4 leading-relaxed">
              Gimnasio Emocional Mentes Brillantes. Entrenamos la paz interior para que tus decisiones, relaciones y resultados nazcan desde otro lugar.
            </p>
            <button
              type="button"
              onClick={handleWA}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white btn-magnetic"
            >
              <MessageCircle size={18} />
              Escribir por WhatsApp
            </button>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex flex-wrap gap-x-8 gap-y-3 font-medium text-sm text-gray-300 md:justify-end">
              <a href="/#metodo" className="hover:text-white transition-colors">Método</a>
              <a href="/#procesos" className="hover:text-white transition-colors">Procesos</a>
              <a href="/sesion-coach" className="hover:text-white transition-colors">Sesión Coach</a>
              <a href="/fundacion" className="hover:text-white transition-colors">La Fundación</a>
              <a href="/alexandra-ortega" className="hover:text-white transition-colors">Alexandra Ortega</a>
              <a href="/#planes" className="hover:text-white transition-colors">Planes</a>
              <a href="/#admin" className="hover:text-white transition-colors">Panel privado</a>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2 mt-2 text-sm text-gray-300">
              <a href="mailto:fundacionsocial@gimnasioemocionalmb.com" className="hover:text-white transition-colors">
                fundacionsocial@gimnasioemocionalmb.com
              </a>
              <span>WhatsApp: +57 311 260 2355</span>
              <span>Bogotá · Colombia</span>
            </div>
            <div className="flex items-center gap-2 mt-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></div>
              <span className="font-mono text-xs text-gray-400">Sistema emocional · Activo</span>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p>© {new Date().getFullYear()} Fundación Social Gimnasio Emocional Mentes Brillantes · NIT 901.002.849-3</p>
            <p>
              Entidad sin ánimo de lucro ·{' '}
              <a href="/politica-de-privacidad" className="underline decoration-white/20 underline-offset-4 hover:text-white transition-colors">
                Política de tratamiento de datos
              </a>
            </p>
          </div>
          <p className="max-w-xl text-center md:text-right">
            Marca final: vuelve al centro, entrena tu mente y elige de nuevo. Si estás en crisis o necesitas atención clínica inmediata, busca ayuda profesional en tu país.
          </p>
        </div>
      </div>
    </footer>
  );
};

const ProcessPage = ({ page, onOpenTest }) => {
  const Icon = page.icon;
  const relatedPages = PROCESS_PAGES.filter((processPage) => processPage.path !== page.path);

  const handleWA = () => {
    const text = encodeURIComponent(page.whatsappMessage);
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <>
      <GlobalStyles />
      <div className="noise-overlay"></div>
      <Navbar onOpenTest={onOpenTest} />

      <main className="bg-[#F2F0E9] text-[#1A1A1A]">
        <section className="relative min-h-[92dvh] overflow-hidden bg-[#1A1A1A] px-6 pb-20 pt-44 text-white md:px-12 md:pb-24">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(46,64,54,0.96),rgba(26,26,26,0.98)_48%,rgba(204,88,51,0.42))]"></div>
          <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:48px_48px]"></div>

          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.72fr] lg:items-end">
            <div>
              <a href="/" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F2F0E9] transition-colors hover:bg-white/[0.12]">
                &larr; Volver al inicio
              </a>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E2C17D]/25 bg-[#E2C17D]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#E2C17D]">
                <Icon size={15} />
                {page.eyebrow}
              </div>

              <h1 className="max-w-5xl font-heading text-[2.55rem] font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl">
                {page.h1}
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[#F2F0E9]/[0.88] md:text-xl">
                {page.lead}
              </p>

              <p className="mt-6 max-w-3xl border-l-2 border-[#E2C17D]/[0.45] pl-5 font-serif text-2xl italic leading-snug text-[#E2C17D]">
                {page.quote}
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={handleWA}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-sm font-bold text-white shadow-[0_14px_32px_rgba(37,211,102,0.24)] transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle size={18} />
                  Pedir información por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={onOpenTest}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F2F0E9]/30 px-7 py-4 text-sm font-bold text-[#F2F0E9] transition-colors hover:bg-white/10"
                >
                  Valoración inicial de tu proceso
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/[0.12] bg-white/[0.055] p-7 shadow-2xl backdrop-blur-md md:p-8">
              <img
                src="/logo-gemb.png"
                alt="Gimnasio Emocional Mentes Brillantes"
                className="mb-8 h-24 w-auto object-contain"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#E2C17D]">
                Tu mapa emocional
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-white">
                Un proceso dentro de GEMB
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#F2F0E9]/[0.72]">
                Conciencia, espiritualidad, entrenamiento emocional, práctica interior y acompañamiento para transformar la forma en que miras, eliges y respondes.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {page.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[11px] font-medium text-[#F2F0E9]/[0.78]">
                    {keyword}
                  </span>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.76fr_1.24fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#CC5833]">
                Lectura del proceso
              </span>
              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-[#2E4036] md:text-5xl">
                Qué vive una persona en este camino
              </h2>
              <p className="mt-5 font-serif text-xl italic leading-relaxed text-[#1A1A1A]/70">
                Cada proceso tiene una puerta distinta, pero todos entrenan lo mismo: volver al centro, asumir responsabilidad y elegir desde una conciencia más amplia.
              </p>
            </div>

            <div className="grid gap-6">
              {page.sections.map((section) => (
                <article key={section.title} className="rounded-[2rem] border border-[#2E4036]/10 bg-white p-7 shadow-[0_18px_45px_rgba(46,64,54,0.08)] md:p-9">
                  <h3 className="font-heading text-2xl font-bold text-[#1A1A1A]">
                    {section.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-[#1A1A1A]/72">
                    {section.body}
                  </p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-[#1A1A1A]/[0.80]">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#2E4036]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#2E4036] px-6 py-16 text-white md:px-12 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#E2C17D]">
                Recomendación de práctica
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold md:text-4xl">
                Una acción pequeña para empezar hoy
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[#F2F0E9]/[0.82]">
                {page.practice}
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-[#1A1A1A]/40 p-7 md:p-8">
              <h3 className="font-heading text-2xl font-bold text-[#E2C17D]">
                Siguiente paso sugerido
              </h3>
              <p className="mt-4 leading-relaxed text-[#F2F0E9]/[0.78]">
                Si sientes que este proceso conversa con tu momento actual, pide orientación. El equipo GEMB puede ayudarte a elegir entre Sesión Coach, Sala de Reducción del Ego, Entrega de Pasos o Un Curso de Milagros.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleWA}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#CC5833] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#b84d2d]"
                >
                  <MessageCircle size={17} />
                  Hablar con GEMB
                </button>
                <button
                  type="button"
                  onClick={onOpenTest}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Hacer valoración inicial
                </button>
              </div>
            </div>
          </div>
        </section>

        {page.disclaimer && (
          <section className="px-6 pt-14 md:px-12">
            <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#CC5833]/[0.18] bg-[#CC5833]/[0.08] p-6 text-sm leading-relaxed text-[#1A1A1A]/70 md:p-7">
              <strong className="text-[#CC5833]">Nota sobre este espacio:</strong> {page.disclaimer}
            </div>
          </section>
        )}

        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#CC5833]">
                Preguntas frecuentes
              </span>
              <h2 className="mt-4 font-heading text-4xl font-bold text-[#2E4036]">
                Dudas comunes antes de empezar
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {page.faq.map(([question, answer]) => (
                <article key={question} className="rounded-[1.5rem] border border-[#2E4036]/10 bg-white p-6 shadow-[0_16px_36px_rgba(46,64,54,0.07)]">
                  <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
                    {question}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/[0.68]">
                    {answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 md:px-12 md:pb-32">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#2E4036]/10 bg-white p-7 shadow-[0_18px_50px_rgba(46,64,54,0.08)] md:p-9">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#CC5833]">
                  Enlaces internos
                </span>
                <h2 className="mt-4 font-heading text-3xl font-bold text-[#2E4036]">
                  También puedes explorar
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {relatedPages.map((relatedPage) => {
                  const RelatedIcon = relatedPage.icon;

                  return (
                    <a
                      key={relatedPage.path}
                      href={relatedPage.path}
                      className="group rounded-2xl border border-[#2E4036]/10 bg-[#F2F0E9] p-5 transition-all hover:-translate-y-0.5 hover:border-[#CC5833]/40 hover:bg-white"
                    >
                      <RelatedIcon size={20} className="text-[#CC5833]" />
                      <h3 className="mt-4 font-heading text-base font-bold text-[#1A1A1A] group-hover:text-[#CC5833]">
                        {relatedPage.label}
                      </h3>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-relaxed text-[#1A1A1A]/[0.52]">
            Los espacios de Gimnasio Emocional Mentes Brillantes son procesos de formación, acompañamiento y entrenamiento emocional/espiritual. No reemplazan atención médica, psicológica o psiquiátrica cuando esta sea necesaria.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

// --- MODALES ---

const ENEATYPES = {
  1: {
    type: "Eneatipo 1: El Perfeccionista",
    subtitle: "Integridad, estándares altos y sentido del deber",
    desc: "Buscas vivir con coherencia y justicia. El miedo a equivocarte o corromperte te lleva a exigirte y tensar el entorno cuando algo no cumple el estándar.",
    motivation: "Ser correcto y mantener un estándar moral alto",
    fear: "Ser defectuoso o corromperse",
    desire: "Integridad, rectitud y orden",
    defense: "Control, crítica y perfeccionismo",
    relation: "Se vincula desde el deber y la coherencia",
    pressure: "Aumenta la rigidez, corrige y juzga",
    strengths: ["Ética y responsabilidad", "Capacidad de mejora continua", "Claridad de estándares"],
    blindSpot: "Confundir perfección con valor personal y endurecerse con los demás.",
    growth: "Aceptar la imperfección, practicar compasión y descanso intencional."
  },
  2: {
    type: "Eneatipo 2: El Ayudador",
    subtitle: "Vínculo, servicio y sentirse necesario",
    desc: "Sientes que tu valor crece cuando eres útil. Temes no ser amado, por eso te adelantas a cuidar y puedes olvidar tus propios límites.",
    motivation: "Conseguir amor a través de la entrega",
    fear: "No ser querido o volverse prescindible",
    desire: "Amor, cercanía y reciprocidad",
    defense: "Generosidad estratégica y seducción por servicio",
    relation: "Ofrece apoyo para asegurar vínculo",
    pressure: "Se sobreinvolucra y espera gratitud implícita",
    strengths: ["Empatía aguda", "Calidez y apoyo práctico", "Lectura emocional del otro"],
    blindSpot: "Dar para sentirse necesario y descuidar lo propio.",
    growth: "Pedir de forma directa, poner límites y reconocer su valor sin sobreentrega."
  },
  3: {
    type: "Eneatipo 3: El Triunfador",
    subtitle: "Éxito, eficiencia y reconocimiento",
    desc: "Orientas tu energía a lograr y lucir resultados. El fracaso amenaza tu sentido de valor y puedes confundir quién eres con lo que logras.",
    motivation: "Demostrar valor a través de metas alcanzadas",
    fear: "Fracasar o parecer inútil",
    desire: "Éxito visible y admiración",
    defense: "Gestión de imagen, ritmo alto y foco en objetivos",
    relation: "Se muestra competente y resuelve rápido",
    pressure: "Acelera, compite y desconecta emociones",
    strengths: ["Orientación a resultados", "Adaptabilidad", "Energía motivadora"],
    blindSpot: "Confundir la imagen con la identidad y relegar emociones.",
    growth: "Bajar el ritmo, validar lo que siente y medir el éxito también en autenticidad."
  },
  4: {
    type: "Eneatipo 4: El Individualista",
    subtitle: "Identidad, profundidad y autenticidad",
    desc: "Buscas significado y expresarte de forma única. Temes ser común y puedes intensificar tus emociones o compararte con lo que falta.",
    motivation: "Ser auténtico y reconocido en su singularidad",
    fear: "Ser trivial o no tener identidad",
    desire: "Expresión genuina y profundidad emocional",
    defense: "Retiro, dramatización y comparación",
    relation: "Se vincula desde la intimidad y la sensibilidad estética",
    pressure: "Se sumerge en la melancolía o dramatiza",
    strengths: ["Sensibilidad estética", "Introspección", "Creatividad expresiva"],
    blindSpot: "Idealizar lo que falta y quedarse en el anhelo.",
    growth: "Aterrizar en acciones concretas, valorar lo presente y regular la intensidad."
  },
  5: {
    type: "Eneatipo 5: El Investigador",
    subtitle: "Conocimiento, claridad y autonomía",
    desc: "Observas para entender y conservar energía. Temes ser invadido o incapaz, por eso acumulas recursos y te refugias en tu mente.",
    motivation: "Conservar recursos y entender antes de actuar",
    fear: "Incompetencia o invasión",
    desire: "Competencia y autosuficiencia",
    defense: "Retiro, observación y acumulación de información",
    relation: "Vincula desde la objetividad y el espacio personal",
    pressure: "Se distancia, intelectualiza y minimiza necesidades",
    strengths: ["Análisis profundo", "Objetividad", "Independencia"],
    blindSpot: "Aislarse y postergar la acción; desconexión afectiva.",
    growth: "Bajar al cuerpo, pedir ayuda y compartir saberes en acción."
  },
  6: {
    type: "Eneatipo 6: El Leal",
    subtitle: "Seguridad, previsión y compromiso",
    desc: "Escaneas riesgos para mantenerte a salvo. La duda y la búsqueda de certezas pueden frenarte o llevarte a desafiar para probar la solidez del entorno.",
    motivation: "Anticipar riesgos y asegurar apoyo",
    fear: "Quedarse sin guía o protección",
    desire: "Certeza y apoyo mutuo",
    defense: "Duda, cuestionamiento y lealtad intensa",
    relation: "Busca acuerdos claros y pertenencia",
    pressure: "Se vuelve hipervigilante o desafía más",
    strengths: ["Lealtad", "Pensamiento de escenarios", "Trabajo en equipo"],
    blindSpot: "Sostener la duda como protección y proyectar sospecha.",
    growth: "Confiar en su criterio, modular la alarma y decidir desde la calma."
  },
  7: {
    type: "Eneatipo 7: El Entusiasta",
    subtitle: "Libertad, opciones y entusiasmo",
    desc: "Te mueves rápido hacia lo estimulante. Temes quedar atrapado en dolor o aburrimiento y llenas tu agenda para no sentirte limitado.",
    motivation: "Mantener libertad y evitar dolor prolongado",
    fear: "Quedar atrapado en sufrimiento o restricción",
    desire: "Disfrute, variedad y plenitud",
    defense: "Reencuadre positivo, distracción y múltiples planes",
    relation: "Conecta desde la energía y la aventura compartida",
    pressure: "Se dispersa y evita profundizar; salta a lo siguiente",
    strengths: ["Creatividad para opciones", "Energía contagiosa", "Agilidad mental"],
    blindSpot: "Usar la actividad para no tocar el malestar.",
    growth: "Elegir foco, tolerar emociones densas y permanecer presente."
  },
  8: {
    type: "Eneatipo 8: El Líder",
    subtitle: "Fuerza, control y protección",
    desc: "Buscas mantener el control para no ser vulnerado. Eres directo y protector, pero tu intensidad puede imponerse sobre otros.",
    motivation: "Autonomía y protección de los suyos",
    fear: "Ser controlado, débil o traicionado",
    desire: "Sentir poder personal y justicia",
    defense: "Confrontación, dominio y exceso de fuerza",
    relation: "Se vincula con franqueza y toma espacios con rapidez",
    pressure: "Sube la intensidad, decide por otros y minimiza sensibilidad",
    strengths: ["Decisión y valentía", "Claridad frente a la injusticia", "Capacidad de acción inmediata"],
    blindSpot: "Desconocer el impacto de su fuerza y negar la vulnerabilidad.",
    growth: "Practicar contención, escuchar y mostrar vulnerabilidad con seguridad."
  },
  9: {
    type: "Eneatipo 9: El Conciliador",
    subtitle: "Paz, armonía y estabilidad",
    desc: "Anhelas tranquilidad y evitas el conflicto. Puedes diluir tus prioridades para mantener la paz y postergar decisiones.",
    motivation: "Evitar el conflicto y conservar la conexión",
    fear: "Ruptura, separación o perderse a sí mismo",
    desire: "Estabilidad y paz interior",
    defense: "Disociación, postergación y fusión con otros",
    relation: "Media y cede para mantener armonía",
    pressure: "Se adormece, procrastina o se bloquea",
    strengths: ["Ecuanimidad", "Capacidad de mediación", "Escucha paciente"],
    blindSpot: "Olvidar su propia agenda y caer en inercia.",
    growth: "Priorizarse, decidir con firmeza y tolerar el desacuerdo."
  }
};

const guaranteeItems = [
  "El proceso se define en la primera sesión con Alexandra según tu caso. No vendemos 'una sesión': definimos un plan.",
  "La garantía aplica solo si completas el proceso completo indicado por la entrenadora, sin dejarlo a medias.",
  (
    <span key="lista-proceso" className="block">
      El proceso puede incluir (según tu caso):
      <ul className="list-none mt-3 space-y-2 pl-3 border-l-2 border-[#CC5833]/30">
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2E4036] opacity-70"></span>Sesiones Guía Coach 1:1</li>
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2E4036] opacity-70"></span>Sala de Reducción del Ego (asistencia y práctica)</li>
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2E4036] opacity-70"></span>Un Curso de Milagros (UCDM)</li>
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2E4036] opacity-70"></span>Vipassana (cuando sea indicado)</li>
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2E4036] opacity-70"></span>12 Pasos (trabajo y acompañamiento)</li>
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2E4036] opacity-70"></span>Prácticas de meditación/oración, límites y servicio</li>
        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2E4036] opacity-70"></span>Cualquier asignación o protocolo indicado por la entrenadora</li>
      </ul>
    </span>
  ),
  "Aquí el cambio es 50% guía (nosotros) y 50% práctica (tú). La garantía requiere evidencias mínimas de cumplimiento: asistencia, tareas, prácticas y seguimiento.",
  "Si completas todo el proceso acordado (todo lo indicado) y aun así no percibes cambios reales y medibles, puedes solicitar la devolución del 100%."
];

const GuaranteeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSendWA = () => {
    const text = encodeURIComponent("Hola, quiero solicitar la garantía de satisfacción. Completé el proceso completo indicado por Alexandra (sesiones + prácticas + espacios sugeridos) y deseo iniciar la verificación.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative bg-[#F2F0E9] w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="w-16 h-16 bg-[#2E4036] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <ShieldCheck className="text-[#00FF66]" size={32} />
          </div>
          <span className="font-mono text-xs font-bold text-[#CC5833] tracking-widest mb-2">COMPROMISO MUTUO</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1A1A1A] leading-tight">Garantía de Satisfacción</h2>
        </div>

        <div className="space-y-6 mb-8 animate-[fadeIn_0.5s_ease-out_0.1s]">
          {guaranteeItems.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#CC5833]/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={16} className="text-[#CC5833]" />
              </div>
              <div className="text-[#1A1A1A]/80 text-sm md:text-base font-medium leading-relaxed flex-1">{item}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-gray-500 font-mono uppercase tracking-wider mb-8 animate-[fadeIn_0.5s_ease-out_0.1s]">
          Los detalles del plan se confirman y se ajustan por escrito durante el proceso, sesión a sesión (normalmente ~10 sesiones), según avances y cumplimiento.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full animate-[fadeIn_0.5s_ease-out_0.2s]">
          <button
            onClick={handleSendWA}
            className="flex-[2] bg-[#25D366] text-white px-6 py-4 rounded-full font-bold btn-magnetic shadow-[0_0_20px_rgba(37,211,102,0.3)] flex justify-center items-center gap-2"
          >
            <MessageCircle size={20} /> Solicitar por WhatsApp
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-500 font-bold hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

// Pantalla mínima mientras se descarga el código de una sección (lazy).
const RouteLoader = ({ dark = false }) => (
  <div className={`min-h-[100dvh] flex items-center justify-center font-mono text-sm ${dark ? 'bg-[#0D0B07] text-[#E4C878]' : 'bg-[#F2F0E9] text-[#2E4036]'}`}>
    Cargando…
  </div>
);

export default function App() {
  const [assessmentMounted, setAssessmentMounted] = useState(false);
  const [enneagramMounted, setEnneagramMounted] = useState(false);
  const [isInitialAssessmentOpen, setInitialAssessmentOpen] = useState(false);
  const [isEnneagramOpen, setEnneagramOpen] = useState(false);
  const [isGuaranteeOpen, setGuaranteeOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/'
  );
  const [currentHash, setCurrentHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : ''
  );
  const isAdminRoute = currentHash === '#admin';
  const isAlexandraPage = currentPath === ALEXANDRA_PATH;
  const isProcesoPage = currentPath === PROCESO_PATH;
  const isPrivacidadPage = currentPath === PRIVACIDAD_PATH;
  const isFundacionPage = currentPath === FUNDACION_PATH;
  const currentProcessPage = PROCESS_PAGE_BY_PATH[currentPath];
  const activeSeo = isAdminRoute
    ? ADMIN_SEO
    : isProcesoPage
      ? PROCESO_SEO
      : isPrivacidadPage
      ? PRIVACIDAD_SEO
      : isFundacionPage
      ? FUNDACION_SEO
      : isAlexandraPage
      ? ALEXANDRA_SEO
      : currentProcessPage
      ? {
          title: currentProcessPage.title,
          description: currentProcessPage.description,
          url: `${SITE_URL}${currentProcessPage.path}`,
          image: `${SITE_URL}/logo-gemb.png`,
          structuredData: getProcessStructuredData(currentProcessPage)
        }
      : HOME_SEO;

  useSeoMeta(activeSeo);

  useEffect(() => {
    const syncLocation = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', syncLocation);
    window.addEventListener('popstate', syncLocation);
    return () => {
      window.removeEventListener('hashchange', syncLocation);
      window.removeEventListener('popstate', syncLocation);
    };
  }, []);

  // Los modales de tests se montan solo la primera vez que se abren
  // (así el home no descarga su código hasta que alguien los usa).
  const openAssessment = () => {
    setAssessmentMounted(true);
    setInitialAssessmentOpen(true);
  };
  const openEnneagram = () => {
    setEnneagramMounted(true);
    setEnneagramOpen(true);
  };

  const testModals = (
    <Suspense fallback={null}>
      {assessmentMounted && (
        <TestInitialAssessmentModal
          isOpen={isInitialAssessmentOpen}
          onClose={() => setInitialAssessmentOpen(false)}
          onOpenEnneagram={openEnneagram}
          waNumber={WA_NUMBER}
        />
      )}
      {enneagramMounted && (
        <EnhancedTestEnneagramModal
          isOpen={isEnneagramOpen}
          onClose={() => setEnneagramOpen(false)}
          eneatypes={ENEATYPES}
          waNumber={WA_NUMBER}
        />
      )}
    </Suspense>
  );

  if (isAdminRoute) {
    return (
      <>
        <GlobalStyles />
        <div className="noise-overlay"></div>
        <Suspense fallback={<RouteLoader />}>
          <AdminPanel />
        </Suspense>
      </>
    );
  }

  if (isProcesoPage) {
    return (
      <Suspense fallback={<RouteLoader dark />}>
        <ProcessPortal GlobalStyles={GlobalStyles} />
      </Suspense>
    );
  }

  if (isPrivacidadPage) {
    return (
      <Suspense fallback={<RouteLoader />}>
        <PrivacyPage
          GlobalStyles={GlobalStyles}
          Navbar={Navbar}
          Footer={Footer}
          onOpenTest={openAssessment}
        />
      </Suspense>
    );
  }

  if (isFundacionPage) {
    return (
      <>
        <Suspense fallback={<RouteLoader />}>
          <FundacionPage
            GlobalStyles={GlobalStyles}
            Navbar={Navbar}
            Footer={Footer}
            waNumber={WA_NUMBER}
            onOpenTest={openAssessment}
          />
        </Suspense>
        {testModals}
      </>
    );
  }

  if (isAlexandraPage) {
    return (
      <>
        <Suspense fallback={<RouteLoader />}>
          <AlexandraPage
            GlobalStyles={GlobalStyles}
            Navbar={Navbar}
            Footer={Footer}
            waNumber={WA_NUMBER}
            onOpenTest={openAssessment}
          />
        </Suspense>
        {testModals}
      </>
    );
  }

  if (currentProcessPage) {
    return (
      <>
        <ProcessPage page={currentProcessPage} onOpenTest={openAssessment} />
        {testModals}
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="noise-overlay"></div>

      <Navbar onOpenTest={openAssessment} />

      <main>
        <Hero onOpenTest={openAssessment} />
        <FeaturesSection />
        <Manifesto />

        {/* La Fundación primero: misión y labor social antes de los procesos */}
        <FundacionSection />

        <StackedCards />
        <NuestrosProcesosSection />

        {/* Sesión Guía Coach */}
        <CoachSessionSection onOpenGuarantee={() => setGuaranteeOpen(true)} />

        {/* ¿Quién es Alexandra Ortega? */}
        <AlexandraFounderSection />

        <Pricing onOpenTest={openAssessment} />
      </main>

      <Footer />

      {testModals}
      <GuaranteeModal isOpen={isGuaranteeOpen} onClose={() => setGuaranteeOpen(false)} />
    </>
  );
}
