import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Maximize2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Visor de diapositivas diseñadas (imágenes del PDF de la diseñadora).
   Preserva el diseño original tal cual, con marco negro + dorado.
   ═══════════════════════════════════════════════════════════════ */

export default function DesignedSlides({ title, slides = [], isCompleted, onComplete, onBack, isSaving }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const isLast = index === total - 1;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(total - 1, i + 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  const handleFinish = async () => {
    if (onComplete) await onComplete();
    onBack();
  };

  if (!total) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10 text-center text-sm text-gray-500">
        Esta herramienta aún no tiene contenido cargado.
        <div className="mt-4"><button onClick={onBack} className="rounded-full border border-[#2E4036]/20 px-5 py-2.5 font-bold text-[#2E4036]">Volver</button></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#C9A24B] hover:text-[#8a6d1f]">
        <ArrowLeft size={16} /> Volver a las herramientas
      </button>

      <div className="overflow-hidden rounded-[1.8rem] border border-[#E4C878]/30 bg-gradient-to-b from-[#141109] to-[#0C0A06] p-3 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] md:p-4">
        {title && <p className="px-2 pb-2 pt-1 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#E4C878]/70">{title}</p>}

        <div className="relative">
          <img
            key={index}
            src={slides[index]}
            alt={`${title || 'Diapositiva'} — página ${index + 1}`}
            className="w-full rounded-2xl bg-black"
            style={{ aspectRatio: '3 / 2', objectFit: 'contain' }}
          />
          <a
            href={slides[index]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ampliar diapositiva"
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-bold text-[#E4C878] backdrop-blur transition hover:bg-black/70"
          >
            <Maximize2 size={13} /> Ampliar
          </a>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between gap-3 px-1 pt-4">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-bold transition ${index === 0 ? 'cursor-not-allowed border-white/10 text-white/25' : 'border-[#E4C878]/40 text-[#E4C878] hover:bg-[#E4C878]/10'}`}
          >
            <ArrowLeft size={15} /> Atrás
          </button>

          <span className="font-mono text-xs text-[#F3ECDD]/60">{index + 1} / {total}</span>

          {isLast ? (
            <button
              onClick={handleFinish}
              disabled={isSaving}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition ${isCompleted ? 'bg-[#2E4036] text-white' : 'bg-[#E4C878] text-[#14110A] hover:bg-[#efd693]'} disabled:opacity-60`}
            >
              <CheckCircle2 size={15} /> {isCompleted ? 'Completada ✓' : 'Marcar vista'}
            </button>
          ) : (
            <button onClick={() => setIndex((i) => Math.min(total - 1, i + 1))} className="inline-flex items-center gap-1.5 rounded-full bg-[#E4C878] px-5 py-2.5 text-sm font-bold text-[#14110A] transition hover:bg-[#efd693]">
              Siguiente <ArrowRight size={15} />
            </button>
          )}
        </div>

        {/* Puntos de progreso */}
        <div className="flex flex-wrap justify-center gap-1.5 px-2 pb-1 pt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir a la página ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-[#E4C878]' : 'w-2 bg-[#E4C878]/25 hover:bg-[#E4C878]/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
