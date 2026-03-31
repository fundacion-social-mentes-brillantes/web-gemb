import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Menu, X, ArrowRight, Activity, ScanLine,
  Settings2, CheckCircle2, MessageCircle, Copy, AlertCircle, Star, Calendar,
  Clock, User, Target, ShieldCheck
} from 'lucide-react';

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
        <div className="max-w-3xl mt-auto">
          <h1 className="text-white leading-[1.1] mb-6">
            <span className="hero-elem block font-heading font-bold text-5xl md:text-7xl tracking-tight">
              Esto no es terapia.
            </span>
            <span className="hero-elem block font-serif italic text-6xl md:text-8xl text-[#F2F0E9] mt-2">
              Es Entrenamiento.
            </span>
          </h1>

          <p className="hero-elem text-[#F2F0E9]/90 text-lg md:text-xl font-light max-w-2xl mb-8 leading-relaxed">
            GEMB es un Gimnasio Emocional: entras a fortalecer tu carácter, descubrir tu patrón dominante y trazar tu ruta de crecimiento con práctica guiada.
          </p>

          <div className="hero-elem flex flex-col sm:flex-row gap-4 mb-10">
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

          <p className="hero-elem font-mono text-xs text-[#F2F0E9]/60 tracking-wider uppercase">
            Guiado por Alexandra Ortega · Método integral: Vipassana + 12 Pasos + PNL + UCDM + Eneagrama + Sala de Autoconocimiento
          </p>
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
    "Compilando protocolo de autoconocimiento..."
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
  1: { type: "Eneatipo 1 — El Perfeccionista", subtitle: "Busca hacer lo correcto y mejorar el mundo.", desc: "Tu miedo central es ser corrupto o defectuoso. Tienes altos estándares éticos, pero puedes caer en la crítica constante a ti mismo.", strengths: ["Ética de trabajo", "Deseo de mejorar", "Responsabilidad"], blindSpot: "Rigidez y resentimiento por sentir que el mundo no se esfuerza igual.", growth: "Soltar el control y aceptar la imperfección." },
  2: { type: "Eneatipo 2 — El Ayudador", subtitle: "Busca ser amado y necesitado.", desc: "Tu miedo central es no ser querido. Te vuelcas hacia los demás, a veces olvidando tus propias necesidades para asegurar su afecto.", strengths: ["Empatía", "Generosidad", "Orientación al servicio"], blindSpot: "Dar para recibir y desconectarse de sus propias necesidades.", growth: "Reconocer tu valor sin necesidad de ser útil." },
  3: { type: "Eneatipo 3 — El Triunfador", subtitle: "Busca el éxito y la admiración.", desc: "Tu miedo central es ser inútil o fracasar. Eres altamente adaptable y enfocado en metas, pero puedes confundir tu valor con tus logros.", strengths: ["Eficiencia", "Adaptabilidad", "Inspiración"], blindSpot: "Cuidar más la imagen que lo que realmente sientes íntimamente.", growth: "Reconocer tu valor más allá de lo que produces o logras." },
  4: { type: "Eneatipo 4 — El Individualista", subtitle: "Busca identidad y ser único.", desc: "Tu miedo central es ser común. Eres profundo y creativo, pero tiendes a la melancolía y a sentir que siempre te falta algo.", strengths: ["Sensibilidad", "Autenticidad", "Introspección"], blindSpot: "Envidiar lo que otros tienen y atascarse en la tormenta emocional.", growth: "Soltar la melancolía y pasar a la disciplina constructiva." },
  5: { type: "Eneatipo 5 — El Investigador", subtitle: "Busca conocimiento y ser competente.", desc: "Tu miedo central es ser incapaz o que invadan tu energía. Proteges tu espacio aislándote y acumulando información antes de actuar.", strengths: ["Objetividad", "Análisis profundo", "Independencia"], blindSpot: "Desconectar de las emociones y aislarse demasiado tiempo.", growth: "Pasar del pensamiento a la acción y vincularte." },
  6: { type: "Eneatipo 6 — El Leal", subtitle: "Busca seguridad y apoyo constante.", desc: "Tu miedo central es carecer de orientación ante el peligro. Eres comprometido, pero el exceso de preocupación te genera muchísima ansiedad.", strengths: ["Lealtad", "Anticipación de riesgos", "Compromiso colectivo"], blindSpot: "Dudar en exceso de ti mismo y de los demás buscando certezas.", growth: "Confiar en tu propia autoridad interna." },
  7: { type: "Eneatipo 7 — El Entusiasta", subtitle: "Busca la felicidad y evitar el dolor.", desc: "Tu miedo central es sufrir o perderte de algo. Tienes una mente rápida, pero huyes del dolor dispersándote con cientos de planes.", strengths: ["Optimismo", "Espontaneidad", "Versatilidad"], blindSpot: "Llenar la agenda para huir del malestar y evitar profundizar.", growth: "Aprender a estar presente incluso en el dolor y enfocarse." },
  8: { type: "Eneatipo 8 — El Líder", subtitle: "Busca tener el control y evitar la debilidad.", desc: "Tu miedo central es ser lastimado o controlado. Eres fuerte y directo, pero a veces intimidante y usas la confrontación como escudo.", strengths: ["Fuerza", "Decisión", "Protección a los suyos"], blindSpot: "Negar tu vulnerabilidad y no medir el impacto de tu intensidad.", growth: "Permitirte ser vulnerable sin sentirlo como debilidad." },
  9: { type: "Eneatipo 9 — El Conciliador", subtitle: "Busca la paz y evitar el conflicto.", desc: "Tu miedo central es la fragmentación o pérdida de conexión. Eres mediador nato, pero ignoras tus necesidades para mantener armonía.", strengths: ["Receptividad", "Tranquilidad", "Mediación objetiva"], blindSpot: "Pasividad, terquedad pasiva y resistirse al esfuerzo propio.", growth: "Hacerte valer, poner límites y pasar a la acción consciente." }
};

const testQuestions = [
  { text: "¿Qué impulsa tus decisiones más instintivas?", options: [{ id: 'A', text: "Hacer lo correcto y evitar el error a toda costa.", scores: [{t:1, p:3}] }, { id: 'B', text: "Ayudar a quienes me necesitan y sentirme valioso/a.", scores: [{t:2, p:3}] }, { id: 'C', text: "Alcanzar el éxito y destacar por mis logros.", scores: [{t:3, p:3}] }] },
  { text: "Cuando te sientes incomprendido/a, tiendes a:", options: [{ id: 'A', text: "Sentir melancolía y aislarme en mis propios sentimientos.", scores: [{t:4, p:3}] }, { id: 'B', text: "Retirarme a mi mente para analizar todo con lógica.", scores: [{t:5, p:3}] }, { id: 'C', text: "Buscar seguridad o aliados en los que pueda confiar.", scores: [{t:6, p:3}] }] },
  { text: "Ante un conflicto inminente, tu reacción natural es:", options: [{ id: 'A', text: "Evadirlo planificando cosas o cambiando de tema rápidamente.", scores: [{t:7, p:3}] }, { id: 'B', text: "Enfrentarlo de frente, tomar el control y no ceder poder.", scores: [{t:8, p:3}] }, { id: 'C', text: "Bajar la tensión, ceder un poco y buscar la paz a toda costa.", scores: [{t:9, p:3}] }] },
  { text: "La voz crítica en tu cabeza suele decir:", options: [{ id: 'A', text: "'Podrías haberlo hecho mucho mejor, te falta disciplina'.", scores: [{t:1, p:3}] }, { id: 'B', text: "'Nadie agradece realmente todo lo que haces por ellos'.", scores: [{t:2, p:3}] }, { id: 'C', text: "'Si fallas, la gente dejará de valorarte y admirarte'.", scores: [{t:3, p:3}] }] },
  { text: "En situaciones sociales, generalmente te percibes como:", options: [{ id: 'A', text: "Diferente a los demás, con una profundidad que pocos entienden.", scores: [{t:4, p:3}] }, { id: 'B', text: "Un observador distante que protege su energía y espacio.", scores: [{t:5, p:3}] }, { id: 'C', text: "Alerta, midiendo quién es confiable y visualizando riesgos.", scores: [{t:6, p:3}] }] },
  { text: "Tu peor miedo es:", options: [{ id: 'A', text: "Quedar atrapado/a en el dolor o perderme de experiencias.", scores: [{t:7, p:3}] }, { id: 'B', text: "Ser controlado/a, manipulado/a o traicionado por alguien.", scores: [{t:8, p:3}] }, { id: 'C', text: "Perder la conexión con mi entorno o fragmentarme del grupo.", scores: [{t:9, p:3}] }] },
  { text: "¿Cómo manejas tus necesidades personales?", options: [{ id: 'A', text: "Las reprimo porque el deber y la responsabilidad van primero.", scores: [{t:1, p:3}] }, { id: 'B', text: "Las ignoro para atender las necesidades de mis seres queridos.", scores: [{t:2, p:3}] }, { id: 'C', text: "Las adapto estratégicamente para no entorpecer mis metas.", scores: [{t:3, p:3}] }] },
  { text: "Al expresar tus emociones:", options: [{ id: 'A', text: "Suelen ser intensas, llenas de matices y yo me sumerjo en ellas.", scores: [{t:4, p:3}] }, { id: 'B', text: "Siento desconexión temporal; prefiero analizarlas en privado.", scores: [{t:5, p:3}] }, { id: 'C', text: "Tengo mucha ansiedad anticipatoria que los demás no siempre notan.", scores: [{t:6, p:3}] }] },
  { text: "Tu ritmo de vida es:", options: [{ id: 'A', text: "Acelerado, haciendo mil planes y saltando de un estímulo a otro.", scores: [{t:7, p:3}] }, { id: 'B', text: "Intenso, marcando el terreno, directo y liderando con fuerza.", scores: [{t:8, p:3}] }, { id: 'C', text: "Tranquilo y pausado, evitando gastar energía en peleas.", scores: [{t:9, p:3}] }] },
  { text: "Si las cosas no salen como planeaste:", options: [{ id: 'A', text: "Me frustro mucho internamente porque las cosas 'deben' ser correctas.", scores: [{t:1, p:3}] }, { id: 'B', text: "Busco cómo ser indispensable en el nuevo plan para ayudar.", scores: [{t:2, p:3}] }, { id: 'C', text: "Me adapto rápidamente a las expectativas para seguir teniendo éxito.", scores: [{t:3, p:3}] }] },
  { text: "Sobre tu espacio y tiempo personal:", options: [{ id: 'A', text: "Deseo intimidad pero al tiempo siento que siempre me falta alguien.", scores: [{t:4, p:3}] }, { id: 'B', text: "Es sagrado e innegociable; me agota la intromisión social continua.", scores: [{t:5, p:3}] }, { id: 'C', text: "Me gusta compartirlo si me da seguridad, pero desconfío al inicio.", scores: [{t:6, p:3}] }] },
  { text: "Frente al compromiso formal o rutinas:", options: [{ id: 'A', text: "Me asusta sentirme encerrado/a, prefiero las opciones abiertas.", scores: [{t:7, p:3}] }, { id: 'B', text: "Los asumo con seriedad si soy yo quien mantiene el control.", scores: [{t:8, p:3}] }, { id: 'C', text: "Los acepto pacíficamente, a veces me fusiono con planes de otros.", scores: [{t:9, p:3}] }] },
  { text: "Sientes que la gente genuinamente valora de ti:", options: [{ id: 'A', text: "Mi integridad incorruptible, mi ética y mi exigencia.", scores: [{t:1, p:3}] }, { id: 'B', text: "Mi calidez natural, mi servicio y mi bondad al dar apoyo.", scores: [{t:2, p:3}] }, { id: 'C', text: "Mi brillantez, mi eficiencia impecable y mis excelentes resultados.", scores: [{t:3, p:3}] }] },
  { text: "En tu tiempo libre prefieres:", options: [{ id: 'A', text: "Explorar la estética o reflexionar sobre mis sentires profundos.", scores: [{t:4, p:3}] }, { id: 'B', text: "Investigar temas complejos, leer o explorar mi pasatiempo privado.", scores: [{t:5, p:3}] }, { id: 'C', text: "Estar con mi pequeño círculo seguro que sé que no me fallará.", scores: [{t:6, p:3}] }] },
  { text: "Lo que más te molesta y desestabiliza de los demás es:", options: [{ id: 'A', text: "Que me pongan límites, me aburran o intenten quitarme libertad.", scores: [{t:7, p:3}] }, { id: 'B', text: "Que intenten controlarme con órdenes o me muestren debilidad.", scores: [{t:8, p:3}] }, { id: 'C', text: "Que armen dramas emocionales innecesarios que roban mi paz.", scores: [{t:9, p:3}] }] },
  { text: "En el fondo, tu mayor deseo en las relaciones es:", options: [{ id: 'A', text: "Que haya madurez, perfección y que entiendan mi corrección.", scores: [{t:1, p:3}, {t:4, p:1}] }, { id: 'B', text: "Sentirme amado/a y confirmar que verdaderamente me necesitan.", scores: [{t:2, p:3}, {t:3, p:1}] }, { id: 'C', text: "Ser admirado/a por mis logros y que me apoyen para ser mejor.", scores: [{t:3, p:3}, {t:8, p:1}] }] },
  { text: "Si te enfrentas al rechazo o humillación, tú...", options: [{ id: 'A', text: "Me hundo en mi sentimiento de que estoy dañado o incompleto.", scores: [{t:4, p:3}, {t:1, p:1}] }, { id: 'B', text: "Me aíslo rápidamente convenciéndome de que no los necesito.", scores: [{t:5, p:3}, {t:8, p:1}] }, { id: 'C', text: "Aumento mis defensas y dudo mucho sobre en quién confiar.", scores: [{t:6, p:3}, {t:1, p:1}] }] },
  { text: "Cuando tienes mucha energía o poder, tiendes a:", options: [{ id: 'A', text: "Multiplicar mis experiencias y vivir intensamente cada hora.", scores: [{t:7, p:3}] }, { id: 'B', text: "Liderar, empujar decisiones difíciles y proteger a los vulnerables.", scores: [{t:8, p:3}] }, { id: 'C', text: "Conectar con quien quiero, pacificar entornos y unificar.", scores: [{t:9, p:3}] }] }
];

const TestEnneagramModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  if (!isOpen) return null;

  const handleAnswer = (scores) => {
    const newAnswers = [...answers, scores];
    if (qIndex < testQuestions.length - 1) {
      setAnswers(newAnswers);
      setQIndex(qIndex + 1);
    } else {
      setAnswers(newAnswers);
      setStep('result');
    }
  };

  const calculateResult = () => {
    const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    answers.forEach(arr => {
      arr.forEach(s => { scores[s.t] += s.p; });
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top1Id = sorted[0][0];
    const top2Id = sorted[1][0];
    
    const top1 = ENEATYPES[top1Id];
    // Show top2 if diff <= 3 points
    const showTop2 = (sorted[0][1] - sorted[1][1] <= 3);

    return {
      top1,
      top2: showTop2 ? ENEATYPES[top2Id] : null
    };
  };

  const handleSendWA = () => {
    const { top1 } = calculateResult();
    const text = encodeURIComponent(`Hola, hice el test del eneagrama en GEMB y mi resultado dominante fue *${top1.type}*.\n\nQuiero saber cuál es el siguiente paso y protocolo de entrenamiento para mí.`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
    onClose();
  };

  const resetTest = () => {
    setStep('intro');
    setQIndex(0);
    setAnswers([]);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A1A]/90 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative bg-[#F2F0E9] w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors">
          <X size={24} />
        </button>

        {step === 'intro' && (
          <div className="text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-center mb-6">
              <ScanLine size={48} className="text-[#CC5833]" />
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">Test del Eneagrama</h2>
            <p className="font-serif italic text-xl text-gray-500 mb-8 max-w-md mx-auto">
              Descubre el patrón dominante de tu personalidad y reconoce tu ruta de crecimiento real.
            </p>
            <div className="bg-white p-6 rounded-2xl mb-8 border border-gray-200 text-sm text-[#2E4036] max-w-lg mx-auto shadow-sm">
              <ul className="text-left space-y-3">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#CC5833]" /> 18 preguntas de opción múltiple (~3 minutos).</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#CC5833]" /> Responde lo que <b>haces y sientes realmente</b>, no lo que <i>deberías</i>.</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#CC5833]" /> <i>Nota:</i> Esta herramienta de autoconocimiento inicial no reemplaza guía profesional ni clínica.</li>
              </ul>
            </div>
            <button
              onClick={() => setStep('quiz')}
              className="bg-[#2E4036] text-white px-10 py-4 rounded-full font-bold btn-magnetic shadow-lg"
            >
              Comenzar Diagnóstico
            </button>
          </div>
        )}

        {step === 'quiz' && (
          <div className="animate-[fadeIn_0.3s_ease-out] flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="font-mono text-xs font-bold text-[#CC5833]">PREGUNTA {qIndex + 1} DE {testQuestions.length}</span>
              <div className="flex gap-1">
                {testQuestions.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= qIndex ? 'bg-[#2E4036]' : 'bg-gray-300'}`}></div>
                ))}
              </div>
            </div>

            <h3 className="font-heading font-bold text-2xl md:text-3xl text-[#1A1A1A] mb-8 leading-tight">
              {testQuestions[qIndex].text}
            </h3>

            <div className="space-y-4 mt-auto">
              {testQuestions[qIndex].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.scores)}
                  className="w-full text-left p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#2E4036] hover:shadow-md transition-all text-[#1A1A1A] group"
                >
                  <span className="font-bold text-[#CC5833] mr-3 group-hover:text-[#2E4036] transition-colors">{opt.id}.</span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="animate-[fadeIn_0.5s_ease-out] flex flex-col">
            <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Activity className="text-[#00FF66]" size={24} />
            </div>
            <div className="text-center">
              <span className="font-mono text-[10px] font-bold text-[#CC5833] tracking-widest block mb-1">PATRÓN PREDOMINANTE</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-2">{calculateResult().top1.type}</h2>
              <p className="text-lg text-[#CC5833] font-serif italic mb-6">{calculateResult().top1.subtitle}</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-6 space-y-5 text-sm w-full text-left">
              <p className="text-[#1A1A1A] leading-relaxed">
                {calculateResult().top1.desc}
              </p>
              
              <div>
                <strong className="block text-[#2E4036] mb-2 text-xs uppercase tracking-wider font-mono">Tus Fortalezas:</strong>
                <ul className="space-y-1">
                  {calculateResult().top1.strengths.map((s, idx) => (
                     <li key={idx} className="flex items-start gap-2"><CheckCircle2 size={16} className="text-[#00FF66] mt-0.5"/> {s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F2F0E9] p-4 rounded-xl border border-gray-200">
                <strong className="block text-[#CC5833] mb-1 text-xs uppercase tracking-wider font-mono"><AlertCircle size={14} className="inline mr-1" /> Riesgo / Punto Ciego:</strong>
                <span className="text-gray-700">{calculateResult().top1.blindSpot}</span>
              </div>
              
              <div className="bg-[#2E4036] text-white p-4 rounded-xl shadow-md">
                <strong className="block text-[#00FF66] mb-1 text-xs uppercase tracking-wider font-mono"><Target size={14} className="inline mr-1" /> Ruta de Crecimiento:</strong>
                <span className="text-gray-200">{calculateResult().top1.growth}</span>
              </div>
            </div>

            {calculateResult().top2 && (
              <div className="text-center bg-gray-100/50 rounded-xl p-3 mb-6 text-xs text-gray-500 border border-gray-200">
                Tu resultado sugiere esta afinidad principal, pero también aparece muy marcada influencia de: <strong>{calculateResult().top2.type}</strong>.
              </div>
            )}

            <p className="text-xs text-center text-gray-500 mb-6 px-4">Esta evaluación es un punto de partida para tu autoconocimiento, guiado más fondo en nuestros programas.</p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleSendWA}
                className="flex-[2] bg-[#25D366] text-white px-6 py-4 rounded-full font-bold btn-magnetic shadow-[0_0_20px_rgba(37,211,102,0.3)] flex justify-center items-center gap-2"
              >
                <MessageCircle size={20} /> Compartir Resultado y Ver Siguiente Paso
              </button>
              <button
                onClick={resetTest}
                className="flex-1 px-4 py-4 rounded-full border border-gray-300 text-gray-500 font-bold hover:bg-gray-100 transition-colors text-sm text-center"
              >
                Reintentar
              </button>
            </div>
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
      <TestEnneagramModal isOpen={isTestOpen} onClose={() => setTestOpen(false)} />
      <GuaranteeModal isOpen={isGuaranteeOpen} onClose={() => setGuaranteeOpen(false)} />
    </>
  );
}