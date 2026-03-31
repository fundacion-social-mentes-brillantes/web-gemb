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
              <a href="#sala-ego" className="hover:opacity-70 transition-opacity">Sala del Ego</a>
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
                Test del Ego (Gratis)
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
          <a href="#sala-ego" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading">Sala del Ego</a>
          <a href="#archivo" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading">Archivo</a>
          <a href="#sesion-coach" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading text-[#E2C17D] flex items-center gap-2"><Star size={20} className="fill-current" /> Sesión Coach</a>
          <a href="#planes" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-heading">Planes</a>
          <button
            onClick={() => { onOpenTest(); setMobileMenuOpen(false); }}
            className="bg-[#CC5833] text-white px-8 py-4 rounded-full font-semibold mt-4 shadow-[0_0_20px_rgba(204,88,51,0.3)]"
          >
            Test del Ego (Gratis)
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
            GEMB es un Gimnasio Emocional: entras a fortalecer tu carácter, desintoxicar el Ego y recablear tus patrones con práctica guiada.
          </p>

          <div className="hero-elem flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={onOpenTest}
              className="bg-[#CC5833] text-white px-8 py-4 rounded-full font-semibold btn-magnetic flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,88,51,0.3)]"
            >
              Hacer el Test del Ego
              <ArrowRight size={18} />
            </button>
            <a href="#metodo" className="border border-[#F2F0E9]/30 text-[#F2F0E9] hover:bg-[#F2F0E9]/10 px-8 py-4 rounded-full font-semibold btn-magnetic flex items-center justify-center transition-colors backdrop-blur-sm">
              Ver el Método
            </a>
          </div>

          <p className="hero-elem font-mono text-xs text-[#F2F0E9]/60 tracking-wider uppercase">
            Guiado por Alexandra Ortega · Método integral: Vipassana + 12 Pasos + PNL + UCDM + Sala de Reducción del Ego
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
    { title: "Ego Víctima", insight: "Cuando el dolor se vuelve identidad." },
    { title: "Ego Salvador", insight: "Cuando amar significa cargarse a todos." },
    { title: "Ego Tirano", insight: "Cuando el control se disfraza de fuerza." }
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
              <span className="font-mono text-xs text-[#CC5833] font-bold tracking-widest mb-2 block">ARQUETIPO</span>
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
    "Leyendo patrones repetidos...",
    "Detectando 'exceso de futuro' (ruido mental)...",
    "Iniciando desintoxicación del Ego...",
    "Cargando protocolo: límites + amor propio...",
    "Compilando paz interior (sin atajos)..."
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
            Herramientas diseñadas para <span className="text-[#2E4036]">desactivar</span> tu piloto automático.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Panel 1 */}
          <div className="bg-white radius-huge p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col h-[420px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl">Baraja Diagnóstica</h3>
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
    <section id="sala-ego" className="relative py-32 md:py-48 bg-[#1A1A1A] overflow-hidden flex items-center min-h-[80vh]">
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
  { id: 'cargado', label: 'Me siento cargado/a por todos', response: 'El Ego Salvador te está agotando. Desactivaremos esa necesidad de rescatar para que recuperes tu energía vital.' },
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
                "Diagnóstico claro del patrón (Ego) que hoy te bloquea o agota.",
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
              {["Test del Ego (Gratis)", "Resultado + insight claro", "Ruta recomendada (próximo paso)"].map((item, i) => (
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

const TestEgoModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  if (!isOpen) return null;

  const handleAnswer = (optionId) => {
    const newAnswers = [...answers, optionId];
    if (qIndex < testQuestions.length - 1) {
      setAnswers(newAnswers);
      setQIndex(qIndex + 1);
    } else {
      setAnswers(newAnswers);
      setStep('result');
    }
  };

  const calculateResult = () => {
    const counts = { A: 0, B: 0, C: 0 };
    answers.forEach(a => counts[a]++);

    const max = Math.max(counts.A, counts.B, counts.C);

    if (counts.A === max) return { type: "Ego Víctima", desc: "El dolor se ha vuelto tu identidad. Sientes que el mundo te sucede a ti y te cuesta asumir el liderazgo de tu vida. Necesitas límites firmes y dejar de esperar salvadores." };
    if (counts.B === max) return { type: "Ego Salvador", desc: "Crees que amar es cargarte los problemas de todos. Tu valor personal depende de qué tan necesario eres para otros. Necesitas entrenar el amor propio y soltar el control disfrazado de ayuda." };
    return { type: "Ego Tirano", desc: "El control y la razón son tus armaduras. La vulnerabilidad te aterra, por eso impones tu visión y exiges perfección. Necesitas entrenar la empatía y desactivar tu reactividad defensiva." };
  };

  const handleSendWA = () => {
    const result = calculateResult();
    const text = encodeURIComponent(`Hola, acabo de hacer el Test del Ego y mi arquetipo principal es: *${result.type}*.\n\nMe di cuenta que estoy listo/a para entrenar. ¿Cuál es el siguiente paso en GEMB?`);
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
      <div className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative bg-[#F2F0E9] w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors">
          <X size={24} />
        </button>

        {step === 'intro' && (
          <div className="text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-center mb-6">
              <ScanLine size={48} className="text-[#CC5833]" />
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1A1A1A] mb-4">Test del Ego</h2>
            <p className="font-serif italic text-xl text-gray-500 mb-8 max-w-md mx-auto">
              Descubre qué máscara está dirigiendo tu vida en piloto automático. Sé brutalmente honesto/a.
            </p>
            <div className="bg-white p-6 rounded-2xl mb-8 border border-gray-200 text-sm text-[#2E4036] max-w-lg mx-auto shadow-sm">
              <ul className="text-left space-y-3">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#CC5833]" /> 10 preguntas de opción múltiple.</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#CC5833]" /> Responde lo que <b>haces</b>, no lo que <i>deberías</i> hacer.</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#CC5833]" /> Al finalizar recibirás tu diagnóstico y el protocolo a seguir.</li>
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
              <span className="font-mono text-xs font-bold text-[#CC5833]">PREGUNTA {qIndex + 1} DE 10</span>
              <div className="flex gap-1">
                {testQuestions.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i <= qIndex ? 'bg-[#2E4036]' : 'bg-gray-300'}`}></div>
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
                  onClick={() => handleAnswer(opt.id)}
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
          <div className="text-center animate-[fadeIn_0.5s_ease-out] flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="text-[#00FF66]" size={32} />
            </div>
            <span className="font-mono text-xs font-bold text-[#CC5833] tracking-widest mb-2">DIAGNÓSTICO COMPLETADO</span>
            <h2 className="font-heading font-bold text-4xl text-[#1A1A1A] mb-2">{calculateResult().type}</h2>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm mt-6 mb-8 w-full">
              <p className="text-[#1A1A1A] text-lg font-serif italic mb-0">
                "{calculateResult().desc}"
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-6">Envía tu resultado al equipo para recibir indicaciones sobre tu protocolo.</p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <button
                onClick={handleSendWA}
                className="flex-1 bg-[#25D366] text-white px-6 py-4 rounded-full font-bold btn-magnetic shadow-[0_0_20px_rgba(37,211,102,0.3)] flex justify-center items-center gap-2"
              >
                <MessageCircle size={20} /> Hablar por WhatsApp
              </button>
              <button
                onClick={resetTest}
                className="px-6 py-4 rounded-full border border-gray-300 text-gray-500 font-bold hover:bg-gray-100 transition-colors"
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

const testQuestions = [
  { text: "¿Cómo reaccionas habitualmente ante una crítica o retroalimentación fuerte?", options: [{ id: 'A', text: "Siento que me atacan y me deprimo." }, { id: 'B', text: "Me justifico excesivamente intentando explicar mi buena intención." }, { id: 'C', text: "Contraataco o descalifico a quien me critica." }] },
  { text: "En tus relaciones (pareja, amigos, familia) sientes que a menudo:", options: [{ id: 'A', text: "Doy mucho más de lo que recibo y termino agotado/a." }, { id: 'B', text: "Tengo que resolverles la vida porque sin mí se pierden." }, { id: 'C', text: "Las cosas solo funcionan si se hacen a mi manera." }] },
  { text: "¿Cuál crees que es tu mayor miedo inconsciente?", options: [{ id: 'A', text: "Ser abandonado/a o que dejen de quererme." }, { id: 'B', text: "Dejar de ser útil o necesario/a para los demás." }, { id: 'C', text: "Perder el control de la situación o mostrar vulnerabilidad." }] },
  { text: "Cuando te equivocas y cometes un error grave:", options: [{ id: 'A', text: "Me torturo mentalmente y me digo que no sirvo para nada." }, { id: 'B', text: "Intento arreglarlo desesperadamente para que nadie sufra." }, { id: 'C', text: "Busco rápidamente excusas o factores externos a quién culpar." }] },
  { text: "En situaciones de silencio o calma prolongada:", options: [{ id: 'A', text: "Me angustio pensando si alguien está molesto conmigo." }, { id: 'B', text: "Busco a quién escribirle o en qué ayudar para no estar quieto/a." }, { id: 'C', text: "Me impaciento porque siento que se está perdiendo el tiempo." }] },
  { text: "¿Cómo es tu relación con los límites (decir 'NO')?", options: [{ id: 'A', text: "Casi no sé ponerlos, me da terror que se enojen." }, { id: 'B', text: "Los pongo pero luego me siento muy culpable y cedo." }, { id: 'C', text: "Los pongo de forma rígida y a veces agresiva." }] },
  { text: "Tu voz interna (diálogo mental) suele sonar como:", options: [{ id: 'A', text: "'Pobre de mí, siempre me pasa lo mismo'." }, { id: 'B', text: "'Tienes que ser fuerte por ellos, tú puedes cargar con todo'." }, { id: 'C', text: "'La gente es incompetente, si no lo hago yo, sale mal'." }] },
  { text: "Si alguien te hace un favor que no pediste:", options: [{ id: 'A', text: "Me siento profundamente en deuda y con culpa." }, { id: 'B', text: "Intento devolverlo inmediatamente el doble." }, { id: 'C', text: "Lo tomo como algo que merezco o evalúo qué quiere a cambio." }] },
  { text: "¿Qué significa el éxito para ti en este momento de tu vida?", options: [{ id: 'A', text: "Algo que veo lejos porque la suerte nunca me acompaña." }, { id: 'B', text: "Ver triunfar a las personas que he ayudado y apoyado." }, { id: 'C', text: "Tener el poder, la razón y dominar mi entorno." }] },
  { text: "En el fondo, sientes que la vida es:", options: [{ id: 'A', text: "Injusta y difícil para ti." }, { id: 'B', text: "Una misión de rescate donde debes salvar a otros." }, { id: 'C', text: "Un campo de batalla donde solo los fuertes ganan." }] }
];

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
      <TestEgoModal isOpen={isTestOpen} onClose={() => setTestOpen(false)} />
      <GuaranteeModal isOpen={isGuaranteeOpen} onClose={() => setGuaranteeOpen(false)} />
    </>
  );
}