import React, { useEffect, useState } from 'react';
import { X, ScanLine, CheckCircle2, Activity, Check, ArrowLeft } from 'lucide-react';
import { FULL_STATEMENTS, FULL_BLOCKS, FULL_RESPONSE_OPTIONS } from './testConfig';

export default function TestEnneagramModal({
  isOpen,
  onClose,
  quickGroups,
  quickMatrix,
  eneatypes,
  waNumber
}) {
  const [quickChoice, setQuickChoice] = useState({ first: null, second: null });
  const [step, setStep] = useState('choice');
  const [fullIndex, setFullIndex] = useState(0);
  const [fullAnswers, setFullAnswers] = useState([]);
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [questionMotion, setQuestionMotion] = useState('idle');
  const [isTransitioningQuestion, setIsTransitioningQuestion] = useState(false);

  useEffect(() => {
    if (!answerFeedback) return undefined;
    const timer = window.setTimeout(() => setAnswerFeedback(''), 1400);
    return () => window.clearTimeout(timer);
  }, [answerFeedback]);

  const resetModal = () => {
    setStep('choice');
    setQuickChoice({ first: null, second: null });
    setFullIndex(0);
    setFullAnswers([]);
    setAnswerFeedback('');
    setQuestionMotion('idle');
    setIsTransitioningQuestion(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const quickResult = () => {
    if (!quickChoice.first || !quickChoice.second) return null;
    const code = `${quickChoice.first}${quickChoice.second}`;
    const combo = quickMatrix[code];
    if (!combo) return null;
    return { code, label: combo.label, note: combo.note, type: eneatypes[combo.typeId] };
  };

  const maybeVibrate = () => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(20);
    }
  };

  const moveToQuestion = (nextIndex) => {
    setQuestionMotion('out');
    setIsTransitioningQuestion(true);

    window.setTimeout(() => {
      setFullIndex(nextIndex);
      setQuestionMotion('in');
      window.setTimeout(() => {
        setQuestionMotion('idle');
        setIsTransitioningQuestion(false);
      }, 220);
    }, 280);
  };

  const handleFullAnswer = (value) => {
    if (isTransitioningQuestion) return;

    const updated = [...fullAnswers];
    updated[fullIndex] = value;
    setFullAnswers(updated);
    setAnswerFeedback(`Respuesta guardada: ${FULL_RESPONSE_OPTIONS.find((opt) => opt.value === value)?.label || value}`);
    maybeVibrate();

    if (fullIndex < FULL_STATEMENTS.length - 1) {
      moveToQuestion(fullIndex + 1);
      return;
    }

    setStep('full-result');
    setQuestionMotion('idle');
    setIsTransitioningQuestion(false);
  };

  const progression = Math.round(((fullIndex + 1) / FULL_STATEMENTS.length) * 100);
  const currentStatement = FULL_STATEMENTS[fullIndex];
  const currentBlock = FULL_BLOCKS.find((block) => currentStatement.order >= block.start && currentStatement.order <= block.end);
  const answeredCount = fullAnswers.filter((value) => value !== undefined && value !== null).length;
  const motionClass = questionMotion === 'out'
    ? 'opacity-0 translate-y-5 md:translate-x-6'
    : questionMotion === 'in'
      ? 'opacity-100 translate-y-0 md:translate-x-0'
      : 'opacity-100 translate-y-0';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A1A]/90 backdrop-blur-md" onClick={handleClose}></div>
      <div className="relative bg-[#F2F0E9] w-full max-w-3xl rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
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
                Elige cómo empezar: primero una hipótesis rápida o una lectura profunda con 135 preguntas en 10 bloques.
              </p>
            </div>
          </div>
        )}

        {step === 'choice' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#CC5833]/10 flex items-center justify-center text-[#CC5833] font-bold">1</div>
                <div>
                  <p className="font-heading text-xl text-[#1A1A1A]">Hipótesis inicial de eneatipo</p>
                  <p className="text-sm text-gray-500">Test rápido · 2-3 minutos</p>
                </div>
              </div>
              <ul className="text-sm text-[#2E4036] space-y-2">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Grupo 1 (A/B/C) + Grupo 2 (X/Y/Z).</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Orientativo, no diagnóstico definitivo.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Sirve como punto de partida para pasar al test completo.</li>
              </ul>
              <button onClick={() => setStep('quick-first')} className="mt-auto bg-[#2E4036] text-white px-6 py-3 rounded-full font-bold btn-magnetic">
                Hacer test rápido
              </button>
            </div>

            <div className="bg-[#1A1A1A] text-[#F2F0E9] rounded-3xl p-6 shadow-lg flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-heading text-xl">Lectura profunda</p>
                  <p className="text-sm text-gray-300">Test completo · 10 bloques</p>
                </div>
              </div>
              <ul className="text-sm text-gray-200 space-y-2">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> 135 preguntas oficiales.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> Respuestas: MUCHO, POCO, NADA.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> El flujo queda activo mientras se ajusta el nuevo mapa de scoring.</li>
              </ul>
              <button onClick={() => setStep('full-intro')} className="mt-auto bg-[#CC5833] text-white px-6 py-3 rounded-full font-bold btn-magnetic">
                Hacer test completo
              </button>
            </div>
          </div>
        )}

        {step === 'quick-first' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6">
            <p className="font-mono text-xs text-[#CC5833] uppercase tracking-[0.2em]">Test rápido · Paso 1 de 2</p>
            <h3 className="font-heading text-2xl text-[#1A1A1A]">Elige el parrafo que mejor describe tu estilo de base</h3>
            <div className="space-y-3">
              {quickGroups.first.map(opt => (
                <button key={opt.code} onClick={() => { setQuickChoice({ ...quickChoice, first: opt.code }); setStep('quick-second'); }} className="w-full text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#2E4036] hover:shadow-md transition-all">
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
              {quickGroups.second.map(opt => (
                <button key={opt.code} onClick={() => { setQuickChoice({ ...quickChoice, second: opt.code }); setStep('quick-result'); }} className="w-full text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#2E4036] hover:shadow-md transition-all">
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
              <p className="font-mono text-[11px] text-[#CC5833] tracking-[0.2em]">Hipótesis inicial de eneatipo</p>
              <h3 className="font-heading text-3xl text-[#1A1A1A]">Combinación {quickResult().code}</h3>
              <p className="text-[#CC5833] font-serif italic">{quickResult().note}</p>
            </div>
          </div>
        )}

        {step === 'quick-result' && quickResult() && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <p className="text-sm text-gray-500">Orientativo, no diagnóstico definitivo. Úsalo como punto de partida y valida con el test completo para una lectura más profunda.</p>
            <div className="p-4 rounded-2xl bg-[#F2F0E9] border border-gray-200">
              <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Eneatipo sugerido</p>
              <h4 className="font-heading text-2xl text-[#1A1A1A]">{quickResult().type.type}</h4>
              <p className="text-[#CC5833] text-sm font-serif italic">{quickResult().type.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Motivacion</p>
                <p>{quickResult().type.motivation}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-3">
                <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Miedo central</p>
                <p>{quickResult().type.fear}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setStep('full-intro')} className="flex-1 bg-[#CC5833] text-white px-6 py-4 rounded-full font-bold btn-magnetic">Pasar a lectura profunda</button>
              <button onClick={() => { setStep('choice'); setQuickChoice({ first: null, second: null }); }} className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors">Repetir test rápido</button>
            </div>
          </div>
        )}

        {step === 'full-intro' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-6">
            <p className="font-mono text-xs text-[#CC5833] uppercase tracking-[0.2em]">Test completo</p>
            <h3 className="font-heading text-2xl text-[#1A1A1A]">135 preguntas · MUCHO / POCO / NADA</h3>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-sm text-[#2E4036]">
              <p>Responde según lo que te describe la mayor parte de tu vida, no solo tu estado actual ni tu versión ideal. Este flujo ya usa el nuevo banco oficial validado en el chat.</p>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> MUCHO = 2 · POCO = 1 · NADA = 0.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Orden exacto: P001 a P135.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> División en 10 bloques con progreso visible.</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('full-quiz')} className="bg-[#2E4036] text-white px-8 py-4 rounded-full font-bold btn-magnetic">Iniciar lectura profunda</button>
              <button onClick={() => { setStep('choice'); }} className="px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100">Volver</button>
            </div>
          </div>
        )}

        {step === 'full-quiz' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-5 flex-1 flex flex-col">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-3 text-sm text-gray-600">
                <span className="font-mono text-xs text-[#CC5833]">Pregunta {currentStatement.id} · {fullIndex + 1} de {FULL_STATEMENTS.length}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-semibold">{progression}%</span>
              </div>
              <div className="flex justify-between items-center gap-3 text-xs text-gray-600">
                <span className="px-3 py-1 rounded-full bg-[#CC5833]/10 text-[#CC5833] font-semibold">{currentBlock?.id} · {currentBlock?.title}</span>
                <span>Rango {currentBlock?.start}–{currentBlock?.end}</span>
              </div>
              <div className="h-2 rounded-full bg-[#2E4036]/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#CC5833] to-[#2E4036] transition-all duration-300" style={{ width: `${progression}%` }}></div>
              </div>
            </div>

            <div className={`rounded-[2rem] bg-white border border-gray-200 shadow-sm p-5 sm:p-6 transition-all duration-300 ease-out ${motionClass}`}>
              <h3 className="font-heading text-[1.55rem] sm:text-3xl text-[#1A1A1A] leading-snug">{currentStatement.text}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FULL_RESPONSE_OPTIONS.map(opt => {
                const isSelected = fullAnswers[fullIndex] === opt.value;
                return (
                  <button key={opt.value} onClick={() => handleFullAnswer(opt.value)} className={`rounded-[1.4rem] border px-4 py-4 text-left sm:text-center font-bold text-sm transition-all duration-200 ${isSelected ? 'bg-[#2E4036] text-white border-[#2E4036] shadow-[0_14px_30px_-18px_rgba(46,64,54,0.85)] scale-[1.01]' : 'bg-white border-gray-200 text-[#1A1A1A] hover:border-[#2E4036] hover:-translate-y-0.5'}`}>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isSelected ? 'border-white/30 bg-white/12' : 'border-[#2E4036]/20 bg-[#F2F0E9]'}`}>
                        {isSelected ? <Check size={16} /> : <span className="text-[11px] font-mono">{opt.value}</span>}
                      </div>
                      <div>
                        <div className="text-base sm:text-lg">{opt.label}</div>
                        <div className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>{isSelected ? 'Seleccionada' : `Valor ${opt.value}`}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-2 space-y-4">
              <div className={`min-h-[2.5rem] rounded-2xl border px-4 py-3 text-sm transition-all ${answerFeedback ? 'border-[#2E4036]/15 bg-[#2E4036]/8 text-[#2E4036]' : 'border-transparent bg-transparent text-gray-400'}`}>
                {answerFeedback ? <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#2E4036]" /><span>{answerFeedback}</span></div> : <span>Toca una opción para guardar y avanzar.</span>}
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-[#2E4036]/10">
                <button disabled={fullIndex === 0 || isTransitioningQuestion} onClick={() => setFullIndex((prev) => Math.max(0, prev - 1))} className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border ${fullIndex === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors'}`}>
                  <ArrowLeft size={16} />
                  Volver
                </button>
                <p className="text-xs sm:text-right text-gray-600 leading-relaxed max-w-md">Lee cada frase desde tu experiencia habitual. Respondidas: {answeredCount} de {FULL_STATEMENTS.length}.</p>
              </div>
            </div>
          </div>
        )}

        {step === 'full-result' && (
          <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center"><Activity className="text-[#00FF66]" size={22} /></div>
              <p className="font-mono text-[11px] text-[#CC5833] tracking-[0.2em]">Lectura profunda</p>
              <h3 className="font-heading text-3xl text-[#1A1A1A]">Banco oficial cargado</h3>
              <p className="text-[#CC5833] font-serif italic">135 preguntas · 10 bloques · MUCHO / POCO / NADA</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-sm text-[#1A1A1A]">
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-4 bg-[#F2F0E9] rounded-2xl border border-gray-200">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Preguntas</p>
                  <p className="font-heading text-2xl">{FULL_STATEMENTS.length}</p>
                </div>
                <div className="p-4 bg-[#F2F0E9] rounded-2xl border border-gray-200">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Bloques</p>
                  <p className="font-heading text-2xl">{FULL_BLOCKS.length}</p>
                </div>
                <div className="p-4 bg-[#F2F0E9] rounded-2xl border border-gray-200">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#2E4036] mb-1">Respondidas</p>
                  <p className="font-heading text-2xl">{answeredCount}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#CC5833]/20 bg-[#FFF7F1] p-4 text-sm text-[#7A3A25]">
                El test completo ya carga el nuevo banco oficial validado en chat. El resultado final queda pendiente porque el motor actual dependía de un mapa de scoring de las preguntas anteriores basado en <span className="font-semibold">targets</span>, y ese mapa todavía no existe para las 135 preguntas nuevas.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { const text = encodeURIComponent('Ya respondí el nuevo banco oficial de 135 preguntas del test completo. Quiero continuar con el siguiente paso cuando esté listo el mapa de scoring.'); window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank'); handleClose(); }} className="flex-1 bg-[#25D366] text-white px-6 py-4 rounded-full font-bold btn-magnetic shadow-[0_0_20px_rgba(37,211,102,0.3)]">Compartir y ver siguiente paso</button>
              <button onClick={() => { resetModal(); }} className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100">Repetir lectura</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
