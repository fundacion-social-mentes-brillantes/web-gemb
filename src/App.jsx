import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Menu, X, ArrowRight, Activity, ScanLine,
  Settings2, CheckCircle2, MessageCircle, Copy, AlertCircle, Star, Calendar,
  Clock, User, Target, ShieldCheck, Check, ChevronDown, ChevronUp, ArrowLeft
} from 'lucide-react';
import EnhancedTestEnneagramModal from './TestEnneagramModal';

// Carga asíncrona de GSAP
const loadScript = (src) => new Promise((resolve, reject) => {
  if (document.querySelector(`script[src="${src}"]`)) {
    resolve();
    return;
  }
  const script = document.createElement('script');
  script.src = src;
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
});

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 flex justify-center ${scrolled ? 'pt-6 pointer-events-none' : 'pt-8 pointer-events-auto'}`}>
        <div className={`transition-all duration-500 pointer-events-auto ${scrolled ? 'w-[95%] max-w-6xl glass-pill rounded-full py-3 px-4 md:px-6 shadow-sm' : 'w-full max-w-7xl px-6 md:px-12 bg-transparent'}`}>
          <div className={`flex justify-between w-full relative ${scrolled ? 'items-center' : 'items-start'}`}>

            {/* IZQUIERDA: Logo Apilado */}
            <div className="w-[45%] md:w-1/4 flex justify-start">
              <a href="#" className="inline-block">
                <GoldenLogoLockup scrolled={scrolled} />
              </a>
            </div>

            {/* CENTRO: Enlaces */}
            <div className={`w-2/4 hidden md:flex justify-center gap-6 lg:gap-8 text-sm font-medium transition-colors ${scrolled ? 'items-center text-[#2E4036]' : 'items-start pt-6 text-white/90'}`}>
              <a href="#metodo" className="hover:opacity-70 transition-opacity">Método</a>
              <a href="#eneatipos" className="hover:opacity-70 transition-opacity">Eneatipos</a>
              <a href="#archivo" className="hover:opacity-70 transition-opacity">Archivo</a>

              {/* Botón pequeño premium en el Navbar para la sesión Coach */}
              <a href="#sesion-coach" className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1 ${scrolled ? 'border-[#CC5833] text-[#CC5833] hover:bg-[#CC5833] hover:text-white shadow-sm' : 'border-white/50 text-white hover:bg-white hover:text-[#1A1A1A] backdrop-blur-sm'}`}>
                <Star size={12} className="fill-current" /> Sesión Coach
              </a>

              <a href="#planes" className="hover:opacity-70 transition-opacity">Planes</a>
            </div>

            {/* DERECHA: Botón CTA */}
            <div className={`w-[55%] md:w-1/4 flex justify-end ${scrolled ? 'items-center' : 'items-start pt-3'}`}>
              <button
                onClick={onOpenTest}
                className={`hidden lg:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all btn-magnetic shadow-lg ${scrolled ? 'bg-[#CC5833] text-white hover:bg-[#b04a29]' : 'bg-white text-[#1A1A1A] hover:bg-gray-100'}`}
              >
                Descubrir mi eneatipo
              </button>
              <button className="lg:hidden mt-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className={scrolled ? 'text-[#2E4036]' : 'text-white'} size={28} /> : <Menu className={scrolled ? 'text-[#2E4036]' : 'text-white'} size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#1A1A1A] text-white flex flex-col items-center justify-center space-y-6 p-6">
          <a href="#metodo" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading">Método</a>
          <a href="#eneatipos" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading">Eneatipos</a>
          <a href="#archivo" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading">Archivo</a>
          <a href="#sesion-coach" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading text-[#E2C17D] flex items-center gap-2"><Star size={20} className="fill-current" /> Sesión Coach</a>
          <a href="#planes" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading">Planes</a>
          <button
            onClick={() => { onOpenTest(); setMobileMenuOpen(false); }}
            className="bg-[#CC5833] text-white px-8 py-4 rounded-full font-semibold mt-4 shadow-[0_0_20px_rgba(204,88,51,0.3)]"
          >
            Descubrir mi eneatipo
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
    <section ref={containerRef} className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-end pb-24 md:pb-32 pt-48">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=2070&auto=format&fit=crop"
          alt="Atmospheric Forest"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E4036] via-[#2E4036]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end h-full">
        <div className="max-w-4xl mt-auto">
          <div className="hero-elem inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] md:text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm mb-5">
            <span className="h-2 w-2 rounded-full bg-[#E2C17D]"></span>
            Eneagrama para autoconocimiento y entrenamiento interior
          </div>

          <h1 className="text-white leading-[1.02] mb-5 max-w-4xl">
            <span className="hero-elem block font-heading font-bold text-[2.7rem] sm:text-6xl md:text-7xl tracking-tight">
              Esto no es terapia.
            </span>
            <span className="hero-elem block font-serif italic text-[2.95rem] sm:text-[4.6rem] md:text-[5.3rem] text-[#F2F0E9] mt-1 md:mt-2">
              Es entrenamiento para grandes resultados.
            </span>
          </h1>

          <p className="hidden">
            GEMB es un Gimnasio Emocional: entras a fortalecer tu carácter, descubrir tu patrón dominante y trazar tu ruta de crecimiento con práctica guiada.
          </p>

          <p className="hero-elem text-[#E2C17D] text-xl md:text-2xl font-serif italic mb-5 max-w-2xl">
            Tu mundo interior crea tu mundo exterior.
          </p>

          <div className="hero-elem max-w-3xl space-y-4 mb-8">
            <p className="text-[#F2F0E9]/90 text-base md:text-lg font-light leading-relaxed">
              Si quieres cambiar los frutos, primero debes cambiar las raices; si quieres cambiar lo visible, primero debes cambiar lo invisible con tu entrenamiento.
            </p>
            <p className="text-[#F2F0E9]/82 text-base md:text-lg leading-relaxed">
              Haz el test y descubre el eneatipo que identifica la mascara de ego que sabotea tu vida, tus relaciones, tus finanzas y tu salud.
            </p>
          </div>

          <div className="hero-elem flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={onOpenTest}
              className="bg-[#CC5833] text-white px-8 py-4 rounded-full font-semibold btn-magnetic flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,88,51,0.3)]"
            >
              Descubrir mi eneatipo
              <ArrowRight size={18} />
            </button>
            <a href="#metodo" className="border border-[#F2F0E9]/30 text-[#F2F0E9] hover:bg-[#F2F0E9]/10 px-8 py-4 rounded-full font-semibold btn-magnetic flex items-center justify-center transition-colors backdrop-blur-sm">
              Ver el Método
            </a>
          </div>

          <div className="hero-elem max-w-3xl rounded-[1.75rem] border border-white/15 bg-black/15 px-5 py-4 backdrop-blur-sm">
            <p className="font-mono text-[11px] md:text-xs text-[#F2F0E9]/70 tracking-[0.16em] uppercase">
            Guiado por Alexandra Ortega · Método integral: Vipassana + 12 Pasos + PNL + UCDM + Eneagrama + Sala de Reducción del Ego
          </p>
        </div>
        </div>
      </div>
    </section>
  );
};

// --- MICRO-FEATURES ---

const FeatureDeck = () => {
  const [active, setActive] = useState(0);
  const cards = [
    { title: "Eneatipo 1", insight: "El Perfeccionista / Reformador." },
    { title: "Eneatipo 2", insight: "El Ayudador." },
    { title: "Eneatipo 3", insight: "El Triunfador / Realizador." },
    { title: "Eneatipo 4", insight: "El Individualista." },
    { title: "Eneatipo 5", insight: "El Investigador." },
    { title: "Eneatipo 6", insight: "El Leal." },
    { title: "Eneatipo 7", insight: "El Entusiasta." },
    { title: "Eneatipo 8", insight: "El Líder / Desafiador." },
    { title: "Eneatipo 9", insight: "El Conciliador." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
  const messages = [
    "Analizando patrón motivacional...",
    "Detectando miedo central activado...",
    "Identificando eneatipo dominante...",
    "Cargando mapa de crecimiento...",
    "Compilando protocolo de reducción del ego..."
  ];
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
      setText("");
      setMsgIdx((prev) => (prev + 1) % messages.length);
      setIsTyping(true);
    }
    return () => clearTimeout(timeout);
  }, [text, isTyping, msgIdx]);

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
    } catch (err) {
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
  return (
    <section id="metodo" className="py-24 md:py-32 px-6 md:px-12 bg-[#F2F0E9] relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1A1A1A] max-w-2xl leading-tight">
            Herramientas diseñadas para <span className="text-[#2E4036]">descifrar</span> tu patrón y entrenar desde la raíz.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Panel 1 */}
          <div className="bg-white radius-huge p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col h-[420px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl">Mapa de Eneatipos</h3>
              <ScanLine className="text-[#CC5833]" size={24} />
            </div>
            <FeatureDeck />
          </div>

          {/* Panel 2 */}
          <div className="bg-[#1A1A1A] radius-huge p-2 shadow-xl h-[420px]">
            <div className="h-full w-full rounded-[2rem] overflow-hidden">
              <FeatureTelemetry />
            </div>
          </div>

          {/* Panel 3 */}
          <div className="bg-[#F2F0E9] border-2 border-[#2E4036]/10 radius-huge p-8 md:p-10 flex flex-col h-[420px]">
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
          backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop")',
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

// --- NUEVA SECCIÓN: COACH SESSION (VERSIÓN PREMIUM & PERSUASIVA) ---

const painPoints = [
  { id: 'cargado', label: 'Me siento cargado/a por todos', response: 'El patrón del Ayudador te está agotando. Desactivaremos esa necesidad de rescatar para que recuperes tu energía vital.' },
  { id: 'limites', label: 'Me cuesta poner límites', response: 'El miedo al rechazo te domina hoy. Trazaremos una línea clara y te daré el guion exacto para decir NO sin culpa.' },
  { id: 'mente', label: 'Mi mente no se apaga', response: 'Exceso de futuro y control. Implementaremos un protocolo guiado para bajar el ruido mental y volver a tu centro.' }
];

const CoachSessionSection = ({ onOpenGuarantee }) => {
  const [selectedPain, setSelectedPain] = useState(null);

  const handleWA = () => {
    const text = encodeURIComponent("Hola, quiero agendar una Sesión Guía Coach con Alexandra Ortega. Estoy listo/a para entrenar. ¿Qué disponibilidad hay esta semana?");
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <section id="sesion-coach" className="pt-24 pb-12 md:pt-32 md:pb-16 px-6 md:px-12 bg-[#F2F0E9] relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#1A1A1A] radius-huge p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative flex flex-col lg:flex-row gap-12 lg:gap-16 items-center border border-[#2E4036]/20">

          {/* Tapykue oñemoĩva ipype (Glow background) */}
          <div className="absolute inset-0 radius-huge overflow-hidden pointer-events-none">
            <div className="absolute top-[-40%] right-[-10%] w-[70%] h-[140%] bg-gradient-to-bl from-[#CC5833]/10 via-[#2E4036]/20 to-transparent blur-3xl rounded-full"></div>
          </div>

          {/* Jekuaa porã (Badge Recomendado) */}
          <div className="absolute top-0 left-8 md:left-14 -translate-y-1/2 bg-[#CC5833] text-white text-[10px] md:text-xs font-bold px-5 py-2 rounded-full tracking-widest uppercase shadow-[0_5px_15px_rgba(204,88,51,0.4)] flex items-center gap-2 z-20">
            <Star size={14} className="fill-current" /> Ruta Rápida · 1:1
          </div>

          {/* Columna Izquierda: Copy persuasivo e Interacción */}
          <div className="flex-1 relative z-10 w-full mt-6 md:mt-2">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-[#F2F0E9] mb-3 leading-tight">
              Sesión Guía Coach
              <span className="block text-[#E2C17D] font-serif italic font-normal text-3xl md:text-4xl mt-1">con Alexandra Ortega</span>
            </h2>

            <p className="text-lg md:text-xl text-white/90 font-light mb-6">
              Ve directo a la raíz. En 45 minutos desactivamos el patrón que hoy te sabotea y trazamos tu ruta de acción clara.
            </p>

            {/* Contadores Minimalistas */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Clock size={14} className="text-[#CC5833]" />
                <span className="text-xs text-white/80 font-mono">45 min</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <User size={14} className="text-[#CC5833]" />
                <span className="text-xs text-white/80 font-mono">1 a 1</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Target size={14} className="text-[#CC5833]" />
                <span className="text-xs text-white/80 font-mono">Protocolo Práctico</span>
              </div>
            </div>

            <p className="text-[#E2C17D] font-serif italic text-xl md:text-2xl mb-8 border-l-2 border-[#E2C17D]/30 pl-4">
              "No te dejo con motivación. Te dejo con un plan."
            </p>

            {/* Mini Interacción */}
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

            {/* CTA y Fricción Cero */}
            <div className="relative">
              <button
                onClick={handleWA}
                className="w-full md:w-auto px-8 py-4 rounded-full bg-[#E2C17D] text-[#1A1A1A] font-bold btn-magnetic shadow-[0_0_20px_rgba(226,193,125,0.2)] flex justify-center items-center gap-3 border border-transparent hover:bg-white transition-colors"
              >
                {selectedPain ? 'Quiero mi Sesión (WhatsApp)' : 'Agendar Sesión (WhatsApp)'}
                <ArrowRight size={18} />
              </button>

              <div className="mt-4 flex flex-col gap-1">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle size={10} /> Cupos limitados por semana
                </p>
                <p className="text-xs text-white/40 mt-1">
                  <span className="font-bold text-white/60">Al hacer clic:</span> te pedimos 3 datos → te enviamos horarios → confirmas tu cupo.
                </p>
              </div>

              {/* Sello Premium de Garantía Actualizado */}
              <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-md shadow-lg group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#2E4036]/50 border border-[#00FF66]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,255,102,0.1)]">
                  <ShieldCheck size={24} className="text-[#00FF66]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[#F2F0E9] font-bold text-sm md:text-base flex items-center gap-2">Garantía 100% (Proceso Completo)</h4>
                  <p className="text-white/70 text-[11px] md:text-xs mt-1 leading-tight font-light">Aplica al completar todo el plan indicado.</p>
                  <button onClick={onOpenGuarantee} className="text-[#E2C17D] text-[10px] uppercase tracking-widest font-mono mt-2 hover:text-white transition-colors underline decoration-[#E2C17D]/30 underline-offset-4">
                    Ver términos y condiciones
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: "Sales con" (Entregables) */}
          <div className="w-full lg:w-[45%] relative z-10 bg-white/[0.03] p-8 md:p-10 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl">
            <h3 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-2">
              Sales con:
            </h3>

            <ul className="space-y-6">
              {[
                "Diagnóstico claro del patrón (Eneatipo) que hoy te bloquea o agota.",
                "Protocolo de entrenamiento 7 días (límites, calma y acción).",
                "Ruta recomendada exacta para no perder el tiempo buscando qué hacer.",
                "Acceso directo a las herramientas del Gimnasio Emocional (12 Pasos, Meditación, etc)."
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
                Un encuentro diseñado para darte claridad inmediata.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


// --- PRICING ---

const Pricing = ({ onOpenTest }) => {
  const handleWA = (message) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
  };

  return (
    <section id="planes" className="pb-24 pt-12 md:pb-32 md:pt-16 px-6 md:px-12 bg-[#F2F0E9]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            Elige tu nivel de entrenamiento.
          </h2>
          <p className="text-[#1A1A1A]/60 font-serif italic text-xl">Sin atajos. Solo práctica.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Plan 1 */}
          <div className="bg-white radius-huge p-8 md:p-10 border border-gray-200 shadow-sm flex flex-col h-full">
            <h3 className="font-heading font-bold text-2xl text-[#1A1A1A] mb-2">Diagnóstico</h3>
            <p className="text-gray-500 mb-8 text-sm">Tu punto de partida.</p>

            <ul className="space-y-4 mb-10 flex-1">
              {["Test del Eneagrama (Gratis)", "Resultado + insight claro", "Ruta recomendada (próximo paso)"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#1A1A1A]">
                  <CheckCircle2 size={18} className="text-[#2E4036] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onOpenTest}
              className="w-full py-4 rounded-full border border-[#2E4036] text-[#2E4036] font-bold btn-magnetic hover:bg-[#2E4036] hover:text-white transition-colors"
            >
              Hacer el Test
            </button>
          </div>

          {/* Plan 2 - Destacado */}
          <div className="bg-[#2E4036] radius-huge p-8 md:p-12 shadow-2xl flex flex-col h-[105%] relative z-10 text-white transform md:-translate-y-4">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#CC5833] text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase">
              Recomendado
            </div>
            <h3 className="font-heading font-bold text-3xl mb-2">Acceso Total · 7 Días</h3>
            <p className="text-[#F2F0E9]/70 mb-8 font-serif italic">Prueba el método desde dentro.</p>

            <ul className="space-y-5 mb-10 flex-1">
              {["Sala de Reducción del Ego", "Prácticas guiadas (meditación/oración)", "Protocolos de límites y amor propio", "Entrada al método sin compromiso largo"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#F2F0E9]">
                  <CheckCircle2 size={20} className="text-[#CC5833] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleWA("Hola, quiero activar Acceso Total · 7 Días.")}
              className="w-full py-5 rounded-full bg-[#CC5833] text-white font-bold btn-magnetic text-lg shadow-[0_0_20px_rgba(204,88,51,0.4)] flex justify-center items-center gap-2"
            >
              <MessageCircle size={20} /> Activar 7 Días
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white radius-huge p-8 md:p-10 border border-gray-200 shadow-sm flex flex-col h-full">
            <h3 className="font-heading font-bold text-2xl text-[#1A1A1A] mb-2">Atleta Emocional</h3>
            <p className="text-gray-500 mb-8 text-sm">Compromiso total con el proceso.</p>

            <ul className="space-y-4 mb-10 flex-1">
              {["Mentoría de Pasos", "Acompañamiento y seguimiento", "Kits de Transformación (emocional/vida)", "Diseño de protocolo personal"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#1A1A1A]">
                  <CheckCircle2 size={18} className="text-[#2E4036] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleWA("Hola, quiero reservar una llamada para el plan Atleta Emocional.")}
              className="w-full py-4 rounded-full border border-[#2E4036] text-[#2E4036] font-bold btn-magnetic hover:bg-[#2E4036] hover:text-white transition-colors flex justify-center items-center gap-2"
            >
              Reservar Llamada
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FOOTER ---

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-[#F2F0E9] pt-24 pb-12 px-6 md:px-12 rounded-t-[3rem] md:rounded-t-[5rem] mt-[-2rem] relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
          <div>
            <div className="mb-6">
              <GoldenLogoLockup scrolled={false} inFooter={true} />
            </div>
            <p className="font-serif italic text-gray-400 text-lg max-w-sm mt-4">
              Gimnasio Emocional Mentes Brillantes. Entrenando la paz interior, un día a la vez.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex gap-8 font-medium text-sm text-gray-300">
              <a href="#metodo" className="hover:text-white transition-colors">Método</a>
              <a href="#archivo" className="hover:text-white transition-colors">Archivo</a>
              <a href="#planes" className="hover:text-white transition-colors">Planes</a>
            </div>
            <div className="flex items-center gap-2 mt-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></div>
              <span className="font-mono text-xs text-gray-400">Sistema Operativo · Activo</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono">
          <p>© {new Date().getFullYear()} GEMB. Todos los derechos reservados.</p>
          <p className="max-w-xl text-center md:text-right">
            Bienestar y entrenamiento emocional. Si estás en crisis o necesitas atención clínica inmediata, busca ayuda profesional en tu país.
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- MODALES ---

const ENEATYPES = {
  1: {
    type: "Eneatipo 1 — El Perfeccionista",
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
    type: "Eneatipo 2 — El Ayudador",
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
    type: "Eneatipo 3 — El Triunfador",
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
    type: "Eneatipo 4 — El Individualista",
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
    type: "Eneatipo 5 — El Investigador",
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
    type: "Eneatipo 6 — El Leal",
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
    type: "Eneatipo 7 — El Entusiasta",
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
    type: "Eneatipo 8 — El Líder",
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
    type: "Eneatipo 9 — El Conciliador",
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

const QUICK_GROUPS = {
  "first": [
    {
      "code": "A",
      "title": "Impulso y autonomía",
      "desc": "Independencia, empuje, objetivos claros, deseo de impacto y baja tolerancia a que otros marquen tu paso."
    },
    {
      "code": "B",
      "title": "Reserva y quietud",
      "desc": "Preferencia por la soledad elegida, imaginación, poca competitividad y gusto por la calma."
    },
    {
      "code": "C",
      "title": "Deber y entrega",
      "desc": "Sentido fuerte de responsabilidad, compromiso con otros y tendencia a postergarte para cumplir."
    }
  ],
  "second": [
    {
      "code": "X",
      "title": "Optimismo y evitar dolor",
      "desc": "Actitud positiva, búsqueda de entusiasmo, sociabilidad y tendencia a esquivar lo doloroso."
    },
    {
      "code": "Y",
      "title": "Intensidad y reactividad",
      "desc": "Sensibilidad alta, lealtades claras, necesidad de decidir por ti mismo y respuestas emocionales fuertes."
    },
    {
      "code": "Z",
      "title": "Control y distancia",
      "desc": "Lógica, eficiencia, perfeccionismo, preferencia por trabajar en solitario y contención emocional."
    }
  ]
};

const QUICK_MATRIX = {
  "AX": {
    "typeId": 7,
    "label": "Entusiasta",
    "note": "Energía alta, optimismo y búsqueda de opciones."
  },
  "AY": {
    "typeId": 8,
    "label": "Líder",
    "note": "Autoafirmación, fuerza y control del terreno."
  },
  "AZ": {
    "typeId": 3,
    "label": "Triunfador",
    "note": "Orientación a logro, eficiencia e imagen eficaz."
  },
  "BX": {
    "typeId": 9,
    "label": "Conciliador",
    "note": "Calma, receptividad y preferencia por la armonía."
  },
  "BY": {
    "typeId": 4,
    "label": "Individualista",
    "note": "Sensibilidad, identidad propia y expresión emocional."
  },
  "BZ": {
    "typeId": 5,
    "label": "Investigador",
    "note": "Observación, objetividad y protección de energía."
  },
  "CX": {
    "typeId": 2,
    "label": "Ayudador",
    "note": "Entrega, cuidado y búsqueda de conexión."
  },
  "CY": {
    "typeId": 6,
    "label": "Leal",
    "note": "Compromiso, cautela y necesidad de seguridad."
  },
  "CZ": {
    "typeId": 1,
    "label": "Perfeccionista",
    "note": "Principios, racionalidad y autoexigencia."
  }
};

const LIKERT_OPTIONS = [
  { value: 0, label: 'Nada' },
  { value: 1, label: 'Poco' },
  { value: 2, label: 'Medio' },
  { value: 3, label: 'Bastante' },
  { value: 4, label: 'Mucho' }
];

const FULL_STATEMENTS = [
  { id: 'F1', text: 'Me tenso y corrijo cuando algo está fuera de lugar.', targets: [{ t: 1, w: 1 }] },
  { id: 'F2', text: 'La culpa aparece si no cumplo mi propio estándar.', targets: [{ t: 1, w: 1 }] },
  { id: 'F3', text: 'Bajo presión sigo el deber aunque me desgaste.', targets: [{ t: 1, w: 1 }, { t: 6, w: 1 }] },
  { id: 'F4', text: 'Me cuesta delegar porque temo que el resultado no sea correcto.', targets: [{ t: 1, w: 1 }] },

  { id: 'F5', text: 'Me siento valioso cuando anticipo y cuido los detalles de otros.', targets: [{ t: 2, w: 1 }] },
  { id: 'F6', text: 'Pregunto qué necesitas antes de hablar de lo mío.', targets: [{ t: 2, w: 1 }, { t: 9, w: 1 }] },
  { id: 'F7', text: 'Me duele que no reconozcan mi apoyo ni la autenticidad con que acompaño.', targets: [{ t: 2, w: 1 }, { t: 4, w: 1 }] },
  { id: 'F8', text: 'Cuando pongo límites siento que puedo ser egoísta.', targets: [{ t: 2, w: 1 }] },

  { id: 'F9', text: 'Mi imagen y resultados definen cuánto valgo.', targets: [{ t: 3, w: 1 }] },
  { id: 'F10', text: 'Ajusto mi estilo para encajar y ganar.', targets: [{ t: 3, w: 1 }] },
  { id: 'F11', text: 'Prefiero avanzar rápido aunque no sienta.', targets: [{ t: 3, w: 1 }, { t: 7, w: 1 }] },
  { id: 'F12', text: 'A veces priorizo la meta sobre el descanso o los vínculos.', targets: [{ t: 3, w: 1 }, { t: 8, w: 1 }] },

  { id: 'F13', text: 'Prefiero profundidad y autenticidad a lo superficial.', targets: [{ t: 4, w: 1 }] },
  { id: 'F14', text: 'Me comparo con lo que me falta y siento melancolía.', targets: [{ t: 4, w: 1 }] },
  { id: 'F15', text: 'Expreso mi singularidad aunque el entorno premie solo eficiencia.', targets: [{ t: 4, w: 1 }, { t: 3, w: 1 }] },
  { id: 'F16', text: 'Bajo estrés me retiro a procesar en profundidad antes de actuar.', targets: [{ t: 4, w: 1 }, { t: 5, w: 1 }] },

  { id: 'F17', text: 'Necesito tiempo a solas para recargar mente y energía.', targets: [{ t: 5, w: 1 }, { t: 4, w: 1 }] },
  { id: 'F18', text: 'Observar y entender antes de actuar me hace sentir seguro.', targets: [{ t: 5, w: 1 }, { t: 6, w: 1 }] },
  { id: 'F19', text: 'Evito depender porque temo quedarme sin recursos.', targets: [{ t: 5, w: 1 }] },
  { id: 'F20', text: 'Cuando hay demasiada demanda me refugio en mi espacio mental.', targets: [{ t: 5, w: 1 }] },

  { id: 'F21', text: 'Escaneo riesgos y pido claridad antes de decidir.', targets: [{ t: 6, w: 1 }] },
  { id: 'F22', text: 'Puedo dudar de la autoridad y cuestionarla.', targets: [{ t: 6, w: 1 }, { t: 8, w: 1 }] },
  { id: 'F23', text: 'Busco alianzas y protocolos para sentirme tranquilo.', targets: [{ t: 6, w: 1 }] },
  { id: 'F24', text: 'Si todo es incierto imagino escenarios peores para prepararme.', targets: [{ t: 6, w: 1 }, { t: 1, w: 1 }] },

  { id: 'F25', text: 'Busco opciones nuevas para no sentirme atrapado.', targets: [{ t: 7, w: 1 }] },
  { id: 'F26', text: 'Reencuadro en positivo y salto al siguiente plan.', targets: [{ t: 7, w: 1 }] },
  { id: 'F27', text: 'Evito emociones densas llenando la agenda.', targets: [{ t: 7, w: 1 }, { t: 3, w: 1 }] },
  { id: 'F28', text: 'La idea de perder libertad me inquieta más que el esfuerzo.', targets: [{ t: 7, w: 1 }] },

  { id: 'F29', text: 'Defiendo mi territorio y a los míos con intensidad.', targets: [{ t: 8, w: 1 }] },
  { id: 'F30', text: 'Mostrar vulnerabilidad se siente peligroso.', targets: [{ t: 8, w: 1 }] },
  { id: 'F31', text: 'Ante injusticia aumento mi presencia y tomo el control.', targets: [{ t: 8, w: 1 }, { t: 3, w: 1 }] },
  { id: 'F32', text: 'Prefiero confrontar directo antes que rumiar.', targets: [{ t: 8, w: 1 }] },

  { id: 'F33', text: 'Para mantener paz cedo y postergo mis preferencias.', targets: [{ t: 9, w: 1 }] },
  { id: 'F34', text: 'Me adormezco o me pierdo en contenido mental para no entrar en conflicto.', targets: [{ t: 9, w: 1 }, { t: 5, w: 1 }] },
  { id: 'F35', text: 'Tardo en decidir porque quiero que todos estén bien.', targets: [{ t: 9, w: 1 }, { t: 2, w: 1 }, { t: 6, w: 1 }] },
  { id: 'F36', text: 'Cuando alguien presiona busco calmar y mediar en lugar de imponer.', targets: [{ t: 9, w: 1 }, { t: 1, w: 1 }] }
];

const FULL_POTENTIAL = FULL_STATEMENTS.reduce((acc, q) => {
  q.targets.forEach(({ t, w }) => {
    acc[t] = (acc[t] || 0) + w * 4;
  });
  return acc;
}, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 });


const TestEnneagramModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('choice');
  const [quickChoice, setQuickChoice] = useState({ first: null, second: null });
  const [fullIndex, setFullIndex] = useState(0);
  const [fullAnswers, setFullAnswers] = useState([]);

  const handleClose = () => {
    setStep('choice');
    setQuickChoice({ first: null, second: null });
    setFullIndex(0);
    setFullAnswers([]);
    onClose();
  };

  if (!isOpen) return null;

  const quickResult = () => {
    if (!quickChoice.first || !quickChoice.second) return null;
    const code = `${quickChoice.first}${quickChoice.second}`;
    const combo = QUICK_MATRIX[code];
    if (!combo) return null;
    return {
      code,
      label: combo.label,
      note: combo.note,
      type: ENEATYPES[combo.typeId]
    };
  };

  const handleFullAnswer = (value) => {
    const updated = [...fullAnswers];
    updated[fullIndex] = value;
    setFullAnswers(updated);
    if (fullIndex < FULL_STATEMENTS.length - 1) {
      setFullIndex(fullIndex + 1);
    } else {
      setStep('full-result');
    }
  };

  const computeFullScores = () => {
    const totals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    fullAnswers.forEach((ans, idx) => {
      if (ans === undefined || ans === null) return;
      FULL_STATEMENTS[idx].targets.forEach(({ t, w }) => {
        totals[t] += ans * w;
      });
    });
    return totals;
  };

  const fullResult = () => {
    const totals = computeFullScores();
    const normalized = Object.entries(totals).map(([id, rawScore]) => {
      const maxPossible = FULL_POTENTIAL[id] || 1;
      const normalizedScore = maxPossible ? rawScore / maxPossible : 0;
      return { id, rawScore, maxPossible, normalizedScore };
    });

    const ranking = normalized.sort((a, b) => b.normalizedScore - a.normalizedScore);
    const [top, second] = ranking;
    const marginNormalized = top.normalizedScore - second.normalizedScore;
    const coverageNormalized = top.normalizedScore;

    let confidence = 'baja';
    if (coverageNormalized >= 0.7 && marginNormalized >= 0.1) confidence = 'alta';
    else if (coverageNormalized >= 0.55 && marginNormalized >= 0.06) confidence = 'media';

    return {
      ranking,
      top: { ...ENEATYPES[top.id], rawScore: top.rawScore, maxPossible: top.maxPossible, normalizedScore: top.normalizedScore },
      second: { ...ENEATYPES[second.id], rawScore: second.rawScore, maxPossible: second.maxPossible, normalizedScore: second.normalizedScore },
      marginNormalized,
      coverageNormalized,
      confidence
    };
  };

  const progression = Math.round((fullIndex / FULL_STATEMENTS.length) * 100);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A1A]/90 backdrop-blur-md" onClick={handleClose}></div>

      <div className="relative bg-[#F2F0E9] w-full max-w-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-6 right-6 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors">
          <X size={24} />
        </button>

        {step === 'choice' && (
          <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <ScanLine size={48} className="text-[#CC5833]" />
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-3">Mapa de Eneatipo</h2>
              <p className="font-serif italic text-lg text-gray-600 max-w-2xl mx-auto">
                Elige cómo empezar: primero una hipótesis rápida o una lectura profunda con 36 afirmaciones. Ambos muestran motivación, miedo central y defensas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#CC5833]/10 flex items-center justify-center text-[#CC5833] font-bold">1</div>
                  <div>
                    <p className="font-heading text-xl text-[#1A1A1A]">Primera orientación</p>
                    <p className="text-sm text-gray-500">Test rápido · 2–3 minutos</p>
                  </div>
                </div>
                <ul className="text-sm text-[#2E4036] space-y-2">
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Grupo 1 (A/B/C) + Grupo 2 (X/Y/Z).</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Resultado = hipótesis inicial (no diagnóstico).</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Invita a pasar al test completo.</li>
                </ul>
                <button
                onClick={() => setStep('quick-first')}
                  className="mt-auto bg-[#2E4036] text-white px-6 py-3 rounded-full font-bold btn-magnetic"
                >
                  Hacer test rápido
                </button>
              </div>

              <div className="bg-[#1A1A1A] text-[#F2F0E9] rounded-3xl p-6 shadow-lg flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-heading text-xl">Lectura profunda</p>
                    <p className="text-sm text-gray-300">Test completo · 8–12 minutos</p>
                  </div>
                </div>
                <ul className="text-sm text-gray-200 space-y-2">
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> 36 afirmaciones · escala Likert 0–4.</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> Puntúa 9 eneatipos y muestra ranking real.</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> Incluye motivación, miedo, deseo y defensa.</li>
                </ul>
                <button
                onClick={() => setStep('full-intro')}
                  className="mt-auto bg-[#CC5833] text-white px-6 py-3 rounded-full font-bold btn-magnetic"
                >
                  Hacer test completo
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'quick-first' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6">
            <p className="font-mono text-xs text-[#CC5833] uppercase tracking-[0.2em]">Test rápido · Paso 1 de 2</p>
            <h3 className="font-heading text-2xl text-[#1A1A1A]">Elige el párrafo que mejor describe tu estilo de base</h3>
            <div className="space-y-3">
              {QUICK_GROUPS.first.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => { setQuickChoice({ ...quickChoice, first: opt.code }); setStep('quick-second'); }}
                  className="w-full text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#2E4036] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-9 h-9 rounded-xl bg-[#CC5833]/10 text-[#CC5833] font-bold flex items-center justify-center">{opt.code}</span>
                    <p className="font-heading text-lg text-[#1A1A1A]">{opt.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'quick-second' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-mono text-xs text-[#CC5833]">Test rápido · Paso 2 de 2</span>
              <span className="px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-semibold text-xs">Elegiste {quickChoice.first}</span>
            </div>
            <h3 className="font-heading text-2xl text-[#1A1A1A]">Ahora elige la opción que describe cómo manejas tu mundo interno</h3>
            <div className="space-y-3">
              {QUICK_GROUPS.second.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => { setQuickChoice({ ...quickChoice, second: opt.code }); setStep('quick-result'); }}
                  className="w-full text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#2E4036] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-9 h-9 rounded-xl bg-[#2E4036]/10 text-[#2E4036] font-bold flex items-center justify-center">{opt.code}</span>
                    <p className="font-heading text-lg text-[#1A1A1A]">{opt.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'quick-result' && quickResult() && (
          <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                <Activity className="text-[#00FF66]" size={22} />
              </div>
              <p className="font-mono text-[11px] text-[#CC5833] tracking-[0.2em]">Hipótesis inicial</p>
              <h3 className="font-heading text-3xl text-[#1A1A1A]">Combinación {quickResult().code}</h3>
              <p className="text-[#CC5833] font-serif italic">{quickResult().note}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-left">
              <p className="text-sm text-gray-500">Esta lectura es orientativa. Úsala como punto de partida y valida con el test completo para mayor precisión.</p>
              <div className="p-4 rounded-2xl bg-[#F2F0E9] border border-gray-200">
                <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Eneatipo sugerido</p>
                <h4 className="font-heading text-2xl text-[#1A1A1A]">{quickResult().type.type}</h4>
                <p className="text-[#CC5833] text-sm font-serif italic">{quickResult().type.subtitle}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="bg-white border border-gray-100 rounded-2xl p-3">
                  <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Motivación</p>
                  <p>{quickResult().type.motivation}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-3">
                  <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Miedo central</p>
                  <p>{quickResult().type.fear}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('full-intro')}
                className="flex-1 bg-[#CC5833] text-white px-6 py-4 rounded-full font-bold btn-magnetic"
              >
                Pasar a lectura profunda
              </button>
              <button
                onClick={() => { setStep('choice'); setQuickChoice({ first: null, second: null }); }}
                className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors"
              >
                Repetir test rápido
              </button>
            </div>
          </div>
        )}

        {step === 'full-intro' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6">
            <p className="font-mono text-xs text-[#CC5833] uppercase tracking-[0.2em]">Test completo</p>
            <h3 className="font-heading text-2xl text-[#1A1A1A]">36 afirmaciones · escala 0 a 4</h3>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-sm text-[#2E4036]">
              <p>Responde según lo que te describe la mayor parte de tu vida, no solo tu estado actual. El resultado mostrará ranking de eneatipos, segundo candidato (si aplica) y nivel de confianza.</p>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> 0 = Nada · 4 = Mucho.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Foco en motivación, miedo, deseo, defensa y reacción bajo presión.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Puedes volver una pregunta atrás si necesitas ajustar.</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('full-quiz')}
                className="bg-[#2E4036] text-white px-8 py-4 rounded-full font-bold btn-magnetic"
              >
                Iniciar lectura profunda
              </button>
              <button
                onClick={() => { setStep('choice'); }}
                className="px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100"
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {step === 'full-quiz' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="font-mono text-xs text-[#CC5833]">Afirmación {fullIndex + 1} de {FULL_STATEMENTS.length}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-semibold">{progression}%</span>
            </div>

            <h3 className="font-heading text-2xl text-[#1A1A1A] leading-snug">{FULL_STATEMENTS[fullIndex].text}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-auto">
              {LIKERT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleFullAnswer(opt.value)}
                  className={`rounded-2xl border px-3 py-4 text-center font-bold text-sm transition-all ${fullAnswers[fullIndex] === opt.value ? 'bg-[#2E4036] text-white border-[#2E4036]' : 'bg-white border-gray-200 text-[#1A1A1A] hover:border-[#2E4036]'}`}
                >
                  <div className="text-lg">{opt.label}</div>
                  <div className="text-[11px] opacity-70">{opt.value}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 text-sm text-gray-600">
              <button
                disabled={fullIndex === 0}
                onClick={() => setFullIndex((prev) => Math.max(0, prev - 1))}
                className={`px-3 py-2 rounded-full border ${fullIndex === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
              >
                Volver
              </button>
              <p className="text-xs">Lee cada frase desde tu motivación habitual, no desde la imagen ideal.</p>
            </div>
          </div>
        )}

        {step === 'full-result' && (
          <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
            {(() => {
              const res = fullResult();
              return (
                <>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                      <Activity className="text-[#00FF66]" size={22} />
                    </div>
                    <p className="font-mono text-[11px] text-[#CC5833] tracking-[0.2em]">Lectura profunda</p>
                    <h3 className="font-heading text-3xl text-[#1A1A1A]">{res.top.type}</h3>
                    <p className="text-[#CC5833] font-serif italic">{res.top.subtitle}</p>
                    <div className="flex gap-2 text-xs text-gray-600 mt-1">
                      <span className="px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-semibold">Confianza {res.confidence}</span>
                      <span className="px-3 py-1 rounded-full bg-[#CC5833]/10 text-[#CC5833] font-semibold">Margen {(res.marginNormalized * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Lectura orientativa de autoconocimiento (no diagnóstica). Úsala para conversar y, si quieres más rigor, acompáñala con la Sala de Reducción del Ego.</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-sm text-[#1A1A1A]">
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 bg-[#F2F0E9] rounded-2xl border border-gray-200">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Motivación</p>
                        <p>{res.top.motivation}</p>
                      </div>
                      <div className="p-3 bg-[#F2F0E9] rounded-2xl border border-gray-200">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Miedo central</p>
                        <p>{res.top.fear}</p>
                      </div>
                      <div className="p-3 bg-[#F2F0E9] rounded-2xl border border-gray-200">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Deseo central</p>
                        <p>{res.top.desire}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-2xl border border-gray-100">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-[#CC5833] mb-1">Defensa habitual</p>
                        <p>{res.top.defense}</p>
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-gray-100">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-[#CC5833] mb-1">Patrón relacional</p>
                        <p>{res.top.relation}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-[#2E4036] text-white rounded-2xl">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-[#00FF66] mb-1">Reacción bajo presión</p>
                      <p className="text-sm leading-relaxed">{res.top.pressure}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-100 rounded-2xl p-3">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Fortalezas</p>
                        <ul className="space-y-1">
                          {res.top.strengths.map((s, idx) => (
                            <li key={idx} className="flex gap-2"><CheckCircle2 size={14} className="text-[#00FF66] mt-0.5" /> {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-3">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-[#CC5833] mb-1">Riesgo / punto ciego</p>
                        <p>{res.top.blindSpot}</p>
                        <p className="mt-2 text-[#2E4036] font-semibold">Ruta de crecimiento:</p>
                        <p>{res.top.growth}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100/70 border border-gray-200 rounded-3xl p-5 space-y-2 text-sm text-gray-700">
                    <p className="font-semibold text-[#1A1A1A]">Segundo eneatipo probable: {res.second.type}</p>
                    <p>El resultado sugiere afinidad secundaria si la diferencia es baja. Úsalo como contraste, no como etiqueta.</p>
                    {res.confidence === 'baja' && (
                      <p className="text-[#CC5833] font-semibold">Lectura ambigua: responde de nuevo o agenda una sesión para profundizar.</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(`Hice el test completo. Resultado principal: ${res.top.type} (confianza ${res.confidence}). Segundo: ${res.second.type}. Quiero orientación y Sala de Reducción del Ego.`);
                        window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
                        handleClose();
                      }}
                      className="flex-1 bg-[#25D366] text-white px-6 py-4 rounded-full font-bold btn-magnetic shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                    >
                      Compartir y ver siguiente paso
                    </button>
                    <button
                      onClick={() => { setStep('choice'); setQuickChoice({ first: null, second: null }); setFullIndex(0); setFullAnswers([]); }}
                      className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100"
                    >
                      Repetir lectura
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
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

export default function App() {
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [isTestOpen, setTestOpen] = useState(false);
  const [isGuaranteeOpen, setGuaranteeOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
      window.gsap.registerPlugin(window.ScrollTrigger);
      setGsapLoaded(true);
    };
    load();
  }, []);

  if (!gsapLoaded) {
    return (
      <div className="min-h-[100dvh] bg-[#F2F0E9] flex items-center justify-center font-mono text-sm text-[#2E4036]">
        Cargando entorno visual...
      </div>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="noise-overlay"></div>

      <Navbar onOpenTest={() => setTestOpen(true)} />

      <main>
        <Hero onOpenTest={() => setTestOpen(true)} />
        <FeaturesSection />
        <Manifesto />
        <StackedCards />

        {/* Nueva sección: Sesión Guía Coach */}
        <CoachSessionSection onOpenGuarantee={() => setGuaranteeOpen(true)} />

        <Pricing onOpenTest={() => setTestOpen(true)} />
      </main>

      <Footer />

      {/* Modales Inyectados */}
      <EnhancedTestEnneagramModal
        isOpen={isTestOpen}
        onClose={() => setTestOpen(false)}
        quickGroups={QUICK_GROUPS}
        quickMatrix={QUICK_MATRIX}
        eneatypes={ENEATYPES}
        waNumber={WA_NUMBER}
      />
      <GuaranteeModal isOpen={isGuaranteeOpen} onClose={() => setGuaranteeOpen(false)} />
    </>
  );
}



