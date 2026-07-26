import React, { useEffect, useRef, useState } from 'react';
import { X, ScanLine, CheckCircle2, Activity, Check, ArrowLeft, Printer, ArrowRight, FileDown, Loader2 } from 'lucide-react';
import { FULL_STATEMENTS, FULL_BLOCKS, FULL_RESPONSE_OPTIONS } from './testConfig';
import { QUICK_STATEMENTS } from './quickTestConfig';
import LeadCaptureForm from './components/LeadCaptureForm';
import EnneagramResultReport from './components/reports/EnneagramResultReport';
import { completeTestResponse, createTestLead } from './services/testResponsesService';
import { downloadPdfReport } from './utils/downloadPdfReport';

const RESPONSE_SCORE_MAP = {
  2: 1,
  1: 0.25,
  0: 0
};

const TRIAD_GROUPS = {
  visceral: { key: 'visceral', label: 'Visceral', members: [8, 9, 1] },
  emocional: { key: 'emocional', label: 'Emocional', members: [2, 3, 4] },
  mental: { key: 'mental', label: 'Mental', members: [5, 6, 7] }
};

const HARMONIC_GROUPS = {
  reactivos: { key: 'reactivos', label: 'Reactivos', members: [4, 6, 8] },
  positivos: { key: 'positivos', label: 'Positivos', members: [2, 7, 9] },
  competentes: { key: 'competentes', label: 'Competentes', members: [1, 3, 5] }
};

const EPSILON = 0.01;

const TYPE_TO_CENTER = {
  1: 'Visceral',
  2: 'Emocional',
  3: 'Emocional',
  4: 'Emocional',
  5: 'Mental',
  6: 'Mental',
  7: 'Mental',
  8: 'Visceral',
  9: 'Visceral'
};

const CENTER_TO_KEY = {
  Visceral: 'visceral',
  Emocional: 'emocional',
  Mental: 'mental'
};

const TYPE_VISUALS = {
  1: { glow: 'from-[#D7B55C] via-[#F4E8B7] to-[#EFE9D2]', accent: '#A47A1E' },
  2: { glow: 'from-[#CC6D58] via-[#F1B2A3] to-[#F7E2DA]', accent: '#B95542' },
  3: { glow: 'from-[#C56A31] via-[#E9B07D] to-[#F6E5D5]', accent: '#B4571B' },
  4: { glow: 'from-[#7D5AA6] via-[#B9A0D8] to-[#EEE6F7]', accent: '#684290' },
  5: { glow: 'from-[#3D6681] via-[#86AFC9] to-[#E4EEF4]', accent: '#2E566F' },
  6: { glow: 'from-[#4E7F75] via-[#94B9B0] to-[#E5F0ED]', accent: '#3D6B62' },
  7: { glow: 'from-[#D38A2F] via-[#F2C97C] to-[#FBF0DA]', accent: '#BC761D' },
  8: { glow: 'from-[#7E3A33] via-[#C88377] to-[#F2DFDB]', accent: '#6A2D28' },
  9: { glow: 'from-[#6B7C52] via-[#B7C49C] to-[#EFF3E6]', accent: '#56663E' }
};

const RESULT_TABLE_LABELS = {
  strategy: 'Estrategia principal',
  traits: 'Rasgos principales',
  center: 'Centro de expresión',
  selfView: 'Visión de sí mismo',
  strength: 'Fuerza',
  weakness: 'Debilidad'
};

const sortTypesWithTieBreak = (a, b, triads, harmonics, muchosByType) => {
  if (Math.abs(b.affinity - a.affinity) > EPSILON) return b.affinity - a.affinity;

  const muchoDiff = (muchosByType[b.type] ?? 0) - (muchosByType[a.type] ?? 0);
  if (muchoDiff !== 0) return muchoDiff;

  const centerDiff = (triads[b.centerKey]?.score ?? 0) - (triads[a.centerKey]?.score ?? 0);
  if (centerDiff !== 0) return centerDiff;

  const harmonicDiff = (harmonics[b.harmonicKey]?.score ?? 0) - (harmonics[a.harmonicKey]?.score ?? 0);
  if (harmonicDiff !== 0) return harmonicDiff;

  return a.type - b.type;
};

const calculateFullResult = (answers) => {
  const weightedPointsByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const questionCountByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const muchosByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const pocosByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const nadasByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  FULL_STATEMENTS.forEach((statement) => {
    questionCountByType[statement.eneatype] += 1;
  });

  FULL_STATEMENTS.forEach((statement, index) => {
    const answer = answers[index];
    if (answer === undefined || answer === null) return;

    const type = statement.eneatype;
    weightedPointsByType[type] += RESPONSE_SCORE_MAP[answer] ?? 0;

    if (answer === 2) {
      muchosByType[type] += 1;
    } else if (answer === 1) {
      pocosByType[type] += 1;
    } else if (answer === 0) {
      nadasByType[type] += 1;
    }
  });

  const affinityByType = Object.fromEntries(
    Object.keys(weightedPointsByType).map((type) => {
      const questionCount = questionCountByType[type] || 1;
      return [type, (weightedPointsByType[type] / questionCount) * 100];
    })
  );

  const getGroupScore = (members) => members.reduce((sum, type) => sum + (affinityByType[type] ?? 0), 0) / members.length;

  const triads = Object.fromEntries(
    Object.entries(TRIAD_GROUPS).map(([key, group]) => [
      key,
      {
        ...group,
        score: getGroupScore(group.members)
      }
    ])
  );

  const harmonics = Object.fromEntries(
    Object.entries(HARMONIC_GROUPS).map(([key, group]) => [
      key,
      {
        ...group,
        score: getGroupScore(group.members)
      }
    ])
  );

  const getHarmonicKeyForType = (type) =>
    Object.values(HARMONIC_GROUPS).find((group) => group.members.includes(type))?.key;

  const getCenterKeyForType = (type) =>
    Object.values(TRIAD_GROUPS).find((group) => group.members.includes(type))?.key;

  const affinityTable = Object.keys(affinityByType)
    .map((type) => ({
      type: Number(type),
      affinity: affinityByType[type],
      weightedPoints: weightedPointsByType[type],
      questionCount: questionCountByType[type],
      muchos: muchosByType[type],
      pocos: pocosByType[type],
      nadas: nadasByType[type],
      center: TYPE_TO_CENTER[type],
      centerKey: getCenterKeyForType(Number(type)),
      harmonicKey: getHarmonicKeyForType(Number(type))
    }))
    .sort((a, b) => sortTypesWithTieBreak(a, b, triads, harmonics, muchosByType));

  const dominantCenter = Object.values(triads)
    .slice()
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.label.localeCompare(b.label, 'es');
    })[0];

  return {
    dominantType: affinityTable[0]?.type ?? null,
    affinityByType,
    weightedPointsByType,
    questionCountByType,
    muchosByType,
    pocosByType,
    nadasByType,
    affinityTable,
    triads,
    harmonics,
    dominantCenter
  };
};

/* Motor genérico del TEST RÁPIDO. Es una copia parametrizada de
   calculateFullResult: misma escala, misma normalización por número
   de preguntas y mismos desempates, pero sobre cualquier banco de
   preguntas. Se mantiene separada a propósito para no tocar el motor
   del test completo (ver docs/mapa-test-eneagrama.md). */
const calculateResultForStatements = (statements, answers) => {
  const weightedPointsByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const questionCountByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const muchosByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const pocosByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const nadasByType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  statements.forEach((statement) => {
    questionCountByType[statement.eneatype] += 1;
  });

  statements.forEach((statement, index) => {
    const answer = answers[index];
    if (answer === undefined || answer === null) return;

    const type = statement.eneatype;
    weightedPointsByType[type] += RESPONSE_SCORE_MAP[answer] ?? 0;

    if (answer === 2) {
      muchosByType[type] += 1;
    } else if (answer === 1) {
      pocosByType[type] += 1;
    } else if (answer === 0) {
      nadasByType[type] += 1;
    }
  });

  const affinityByType = Object.fromEntries(
    Object.keys(weightedPointsByType).map((type) => {
      const questionCount = questionCountByType[type] || 1;
      return [type, (weightedPointsByType[type] / questionCount) * 100];
    })
  );

  const getGroupScore = (members) => members.reduce((sum, type) => sum + (affinityByType[type] ?? 0), 0) / members.length;

  const triads = Object.fromEntries(
    Object.entries(TRIAD_GROUPS).map(([key, group]) => [key, { ...group, score: getGroupScore(group.members) }])
  );

  const harmonics = Object.fromEntries(
    Object.entries(HARMONIC_GROUPS).map(([key, group]) => [key, { ...group, score: getGroupScore(group.members) }])
  );

  const getHarmonicKeyForType = (type) =>
    Object.values(HARMONIC_GROUPS).find((group) => group.members.includes(type))?.key;

  const getCenterKeyForType = (type) =>
    Object.values(TRIAD_GROUPS).find((group) => group.members.includes(type))?.key;

  const affinityTable = Object.keys(affinityByType)
    .map((type) => ({
      type: Number(type),
      affinity: affinityByType[type],
      weightedPoints: weightedPointsByType[type],
      questionCount: questionCountByType[type],
      muchos: muchosByType[type],
      pocos: pocosByType[type],
      nadas: nadasByType[type],
      center: TYPE_TO_CENTER[type],
      centerKey: getCenterKeyForType(Number(type)),
      harmonicKey: getHarmonicKeyForType(Number(type))
    }))
    .sort((a, b) => sortTypesWithTieBreak(a, b, triads, harmonics, muchosByType));

  const dominantCenter = Object.values(triads)
    .slice()
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.label.localeCompare(b.label, 'es');
    })[0];

  return {
    dominantType: affinityTable[0]?.type ?? null,
    affinityByType,
    weightedPointsByType,
    questionCountByType,
    muchosByType,
    pocosByType,
    nadasByType,
    affinityTable,
    triads,
    harmonics,
    dominantCenter
  };
};

const getResultTableRows = (typeData, centerLabel) => {
  if (!typeData) return [];

  return [
    { label: RESULT_TABLE_LABELS.strategy, value: typeData.motivation },
    { label: RESULT_TABLE_LABELS.traits, value: typeData.strengths?.join(' • ') || typeData.subtitle },
    { label: RESULT_TABLE_LABELS.center, value: centerLabel },
    { label: RESULT_TABLE_LABELS.selfView, value: typeData.desire || typeData.relation },
    { label: RESULT_TABLE_LABELS.strength, value: typeData.strengths?.[0] || typeData.growth },
    { label: RESULT_TABLE_LABELS.weakness, value: typeData.blindSpot || typeData.pressure || typeData.defense }
  ];
};

const QUICK_NOTE = 'Hipótesis basada en 27 preguntas clave del banco oficial (3 por eneatipo).';

const buildQuickAnswersPayload = (answerValues) =>
  QUICK_STATEMENTS.map((statement, index) => {
    const answer = answerValues[index];
    const option = FULL_RESPONSE_OPTIONS.find((item) => item.value === answer);

    return {
      questionId: statement.id,
      order: index + 1,
      bankOrder: statement.order,
      eneatype: statement.eneatype,
      question: statement.text,
      answer,
      label: option?.label || ''
    };
  });

/* Conserva los campos suggestedType / suggestedLabel que el
   AdminPanel usa para listar respuestas de 'enneagram-quick'. */
const buildQuickResultPayload = (quickResult, dominantTypeData) => ({
  suggestedType: quickResult.dominantType,
  // Mismo formato que los registros históricos del test rápido anterior
  // ("Perfeccionista", no "El Perfeccionista"), que el AdminPanel lista.
  suggestedLabel: dominantTypeData?.type?.replace(/^Eneatipo \d+: /, '').replace(/^El /, '') || '',
  note: QUICK_NOTE,
  result: dominantTypeData?.type || '',
  subtitle: dominantTypeData?.subtitle || '',
  motivation: dominantTypeData?.motivation || '',
  fear: dominantTypeData?.fear || '',
  dominantCenter: quickResult.dominantCenter,
  affinityTable: quickResult.affinityTable,
  calculationDetails: {
    affinityByType: quickResult.affinityByType,
    weightedPointsByType: quickResult.weightedPointsByType,
    questionCountByType: quickResult.questionCountByType,
    muchosByType: quickResult.muchosByType,
    pocosByType: quickResult.pocosByType,
    nadasByType: quickResult.nadasByType
  }
});

const buildFullAnswersPayload = (answerValues) =>
  FULL_STATEMENTS.map((statement, index) => {
    const answer = answerValues[index];
    const option = FULL_RESPONSE_OPTIONS.find((item) => item.value === answer);

    return {
      questionId: statement.id,
      order: statement.order,
      block: statement.block,
      eneatype: statement.eneatype,
      question: statement.text,
      answer,
      label: option?.label || ''
    };
  });

const buildFullResultPayload = (fullResult, dominantTypeData) => ({
  dominantType: fullResult.dominantType,
  dominantTypeTitle: dominantTypeData?.type || '',
  dominantTypeSubtitle: dominantTypeData?.subtitle || '',
  dominantCenter: fullResult.dominantCenter,
  affinityTable: fullResult.affinityTable,
  triads: fullResult.triads,
  harmonics: fullResult.harmonics,
  calculationDetails: {
    affinityByType: fullResult.affinityByType,
    weightedPointsByType: fullResult.weightedPointsByType,
    questionCountByType: fullResult.questionCountByType,
    muchosByType: fullResult.muchosByType,
    pocosByType: fullResult.pocosByType,
    nadasByType: fullResult.nadasByType
  }
});

const buildFullReportData = ({ fullResult, dominantTypeData, contact, generatedAt, eneatypes, waNumber }) => ({
  mode: 'full',
  personName: contact?.fullName || '',
  generatedAt,
  dominantType: fullResult.dominantType,
  dominantTypeData,
  dominantCenter: fullResult.dominantCenter,
  dominantAffinity: fullResult.affinityByType?.[fullResult.dominantType],
  affinityTable: fullResult.affinityTable,
  triads: fullResult.triads,
  harmonics: fullResult.harmonics,
  typeCatalog: eneatypes,
  waNumber
});

const buildQuickReportData = ({ quickResult, contact, generatedAt, eneatypes, waNumber }) => ({
  mode: 'quick',
  personName: contact?.fullName || '',
  generatedAt,
  dominantType: quickResult.dominantType,
  dominantTypeData: eneatypes[quickResult.dominantType],
  dominantCenter: quickResult.dominantCenter,
  dominantAffinity: quickResult.affinityByType?.[quickResult.dominantType],
  affinityTable: quickResult.affinityTable,
  triads: quickResult.triads,
  harmonics: quickResult.harmonics,
  typeCatalog: eneatypes,
  waNumber
});

export default function TestEnneagramModal({
  isOpen,
  onClose,
  eneatypes,
  waNumber
}) {
  const [step, setStep] = useState('choice');
  const [fullIndex, setFullIndex] = useState(0);
  const [fullAnswers, setFullAnswers] = useState([]);
  const [quickIndex, setQuickIndex] = useState(0);
  const [quickAnswers, setQuickAnswers] = useState([]);
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [questionMotion, setQuestionMotion] = useState('idle');
  const [isTransitioningQuestion, setIsTransitioningQuestion] = useState(false);
  const [responseId, setResponseId] = useState(null);
  const [selectedTestType, setSelectedTestType] = useState(null);
  const [pendingStartStep, setPendingStartStep] = useState(null);
  const [saveState, setSaveState] = useState({ isSaving: false, error: '' });
  const [leadContact, setLeadContact] = useState(null);
  const [resultGeneratedAt, setResultGeneratedAt] = useState(null);
  const [pdfState, setPdfState] = useState({ isGenerating: false, error: '' });
  const reportContentRef = useRef(null);
  const lastCompletionPayloadRef = useRef(null);
  const quickMotionTimeoutsRef = useRef([]);

  useEffect(() => {
    if (!answerFeedback) return undefined;
    const timer = window.setTimeout(() => setAnswerFeedback(''), 1400);
    return () => window.clearTimeout(timer);
  }, [answerFeedback]);

  const clearQuickMotionTimeouts = () => {
    quickMotionTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    quickMotionTimeoutsRef.current = [];
  };

  const resetModal = () => {
    clearQuickMotionTimeouts();
    setStep('choice');
    setQuickIndex(0);
    setQuickAnswers([]);
    setFullIndex(0);
    setFullAnswers([]);
    setAnswerFeedback('');
    setQuestionMotion('idle');
    setIsTransitioningQuestion(false);
    setResponseId(null);
    setSelectedTestType(null);
    setPendingStartStep(null);
    setSaveState({ isSaving: false, error: '' });
    setLeadContact(null);
    setResultGeneratedAt(null);
    setPdfState({ isGenerating: false, error: '' });
    lastCompletionPayloadRef.current = null;
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const handleTestStart = (testType, nextStep) => {
    // Cada inicio de test arranca limpio: evita reutilizar respuestas
    // de una corrida anterior dentro de la misma sesión del modal.
    clearQuickMotionTimeouts();
    setQuickIndex(0);
    setQuickAnswers([]);
    setFullIndex(0);
    setFullAnswers([]);
    setSelectedTestType(testType);
    setPendingStartStep(nextStep);
    setSaveState({ isSaving: false, error: '' });
    setPdfState({ isGenerating: false, error: '' });
    setResultGeneratedAt(null);
    setStep('lead');
  };

  const handleLeadSubmit = async ({ contact, consent }) => {
    const createdResponseId = await createTestLead({
      contact,
      consent,
      testType: selectedTestType
    });

    setLeadContact(contact);
    setResponseId(createdResponseId);
    setStep(pendingStartStep);
  };

  const persistCompletion = async (payload) => {
    lastCompletionPayloadRef.current = payload;
    setSaveState({ isSaving: true, error: '' });

    try {
      await completeTestResponse(responseId, payload);
      setSaveState({ isSaving: false, error: '' });
    } catch (err) {
      setSaveState({
        isSaving: false,
        error:
          err?.message ||
          'No pudimos guardar el resultado. Puedes reintentar sin perder tus respuestas.'
      });
    }
  };

  const retryPersistCompletion = () => {
    if (!lastCompletionPayloadRef.current) return;
    persistCompletion(lastCompletionPayloadRef.current);
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

    const completedFullResult = calculateFullResult(updated);
    const completedDominantTypeData = eneatypes[completedFullResult.dominantType];

    setStep('full-result');
    setResultGeneratedAt(new Date().toISOString());
    setPdfState({ isGenerating: false, error: '' });
    setQuestionMotion('idle');
    setIsTransitioningQuestion(false);
    persistCompletion({
      answers: buildFullAnswersPayload(updated),
      result: buildFullResultPayload(completedFullResult, completedDominantTypeData)
    });
  };

  const moveToQuickQuestion = (nextIndex) => {
    setQuestionMotion('out');
    setIsTransitioningQuestion(true);

    const outerId = window.setTimeout(() => {
      setQuickIndex(nextIndex);
      setQuestionMotion('in');
      const innerId = window.setTimeout(() => {
        setQuestionMotion('idle');
        setIsTransitioningQuestion(false);
      }, 220);
      quickMotionTimeoutsRef.current.push(innerId);
    }, 280);
    quickMotionTimeoutsRef.current.push(outerId);
  };

  const handleQuickAnswer = (value) => {
    if (isTransitioningQuestion) return;

    const updated = [...quickAnswers];
    updated[quickIndex] = value;
    setQuickAnswers(updated);
    setAnswerFeedback(`Respuesta guardada: ${FULL_RESPONSE_OPTIONS.find((opt) => opt.value === value)?.label || value}`);
    maybeVibrate();

    if (quickIndex < QUICK_STATEMENTS.length - 1) {
      moveToQuickQuestion(quickIndex + 1);
      return;
    }

    const completedQuickResult = calculateResultForStatements(QUICK_STATEMENTS, updated);
    const completedDominantTypeData = eneatypes[completedQuickResult.dominantType];

    setStep('quick-result');
    setResultGeneratedAt(new Date().toISOString());
    setPdfState({ isGenerating: false, error: '' });
    setQuestionMotion('idle');
    setIsTransitioningQuestion(false);
    persistCompletion({
      answers: buildQuickAnswersPayload(updated),
      result: buildQuickResultPayload(completedQuickResult, completedDominantTypeData)
    });
  };

  const handleDownloadReport = async () => {
    if (!reportContentRef.current || pdfState.isGenerating) return;

    setPdfState({ isGenerating: true, error: '' });

    try {
      await downloadPdfReport({
        reportElement: reportContentRef.current,
        fileName: 'resultado-eneagrama-gemb.pdf'
      });
      setPdfState({ isGenerating: false, error: '' });
    } catch (err) {
      console.error(err);
      setPdfState({
        isGenerating: false,
        error: 'No pudimos generar el PDF. Intenta de nuevo.'
      });
    }
  };

  const handlePrintReport = () => {
    if (!reportContentRef.current) return;

    const cleanup = () => {
      document.body.classList.remove('printing-enneagram-report');
      window.removeEventListener('afterprint', cleanup);
    };

    setPdfState({ isGenerating: false, error: '' });
    document.body.classList.add('printing-enneagram-report');
    window.addEventListener('afterprint', cleanup, { once: true });

    window.setTimeout(() => {
      window.print();
      window.setTimeout(cleanup, 1200);
    }, 80);
  };

  const progression = Math.round(((fullIndex + 1) / FULL_STATEMENTS.length) * 100);
  const currentStatement = FULL_STATEMENTS[fullIndex];
  const currentBlock = FULL_BLOCKS.find((block) => currentStatement.order >= block.start && currentStatement.order <= block.end);
  const answeredCount = fullAnswers.filter((value) => value !== undefined && value !== null).length;
  const quickProgression = Math.round(((quickIndex + 1) / QUICK_STATEMENTS.length) * 100);
  const currentQuickStatement = QUICK_STATEMENTS[quickIndex];
  const quickAnsweredCount = quickAnswers.filter((value) => value !== undefined && value !== null).length;
  const quickResultData = step === 'quick-result' ? calculateResultForStatements(QUICK_STATEMENTS, quickAnswers) : null;
  const quickDominantTypeData = quickResultData ? eneatypes[quickResultData.dominantType] : null;
  const fullResult = step === 'full-result' ? calculateFullResult(fullAnswers) : null;
  const dominantTypeData = fullResult ? eneatypes[fullResult.dominantType] : null;
  const dominantCenterKey = fullResult ? CENTER_TO_KEY[fullResult.dominantCenter.label] : null;
  const dominantVisual = fullResult ? TYPE_VISUALS[fullResult.dominantType] : null;
  const resultTableRows = fullResult ? getResultTableRows(dominantTypeData, fullResult.dominantCenter.label) : [];
  const activeReportData = fullResult
    ? buildFullReportData({
        fullResult,
        dominantTypeData,
        contact: leadContact,
        generatedAt: resultGeneratedAt,
        eneatypes,
        waNumber
      })
    : step === 'quick-result' && quickResultData
      ? buildQuickReportData({
          quickResult: quickResultData,
          contact: leadContact,
          generatedAt: resultGeneratedAt,
          eneatypes,
          waNumber
        })
      : null;
  const modalWidthClass = step === 'full-result' ? 'max-w-6xl' : 'max-w-3xl';
  const motionClass = questionMotion === 'out'
    ? 'opacity-0 translate-y-5 md:translate-x-6'
    : questionMotion === 'in'
      ? 'opacity-100 translate-y-0 md:translate-x-0'
      : 'opacity-100 translate-y-0';
  const saveStatusNotice = (saveState.isSaving || saveState.error) ? (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${saveState.error ? 'border-[#CC5833]/25 bg-[#FFF3EE] text-[#7A3A25]' : 'border-[#2E4036]/15 bg-[#F4F7F5] text-[#2E4036]'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p>{saveState.isSaving ? 'Guardando tu resultado...' : saveState.error}</p>
        {saveState.error && (
          <button
            onClick={retryPersistCompletion}
            className="rounded-full bg-[#2E4036] px-4 py-2 text-xs font-bold text-white"
          >
            Reintentar guardado
          </button>
        )}
      </div>
    </div>
  ) : null;
  const reportActions = activeReportData ? (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleDownloadReport}
          disabled={pdfState.isGenerating}
          className="inline-flex items-center justify-center gap-2 bg-[#2E4036] text-white px-6 py-4 rounded-full font-bold btn-magnetic disabled:cursor-wait disabled:opacity-75"
        >
          {pdfState.isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
          {pdfState.isGenerating ? 'Preparando tu reporte...' : 'Descargar reporte PDF'}
        </button>
        <button
          type="button"
          onClick={handlePrintReport}
          className="inline-flex items-center justify-center gap-2 border border-[#2E4036]/25 bg-white text-[#2E4036] px-6 py-4 rounded-full font-bold hover:bg-[#F4F7F5] transition-colors"
        >
          <Printer size={18} />
          Imprimir reporte
        </button>
      </div>
      {pdfState.error && (
        <p className="rounded-2xl border border-[#CC5833]/25 bg-[#FFF3EE] px-4 py-3 text-sm text-[#7A3A25]">
          {pdfState.error}
        </p>
      )}
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A1A1A]/90 backdrop-blur-md" onClick={handleClose}></div>
      <div className={`relative bg-[#F2F0E9] w-full ${modalWidthClass} rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto`}>
        <button onClick={handleClose} aria-label="Cerrar" className="absolute top-6 right-6 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors">
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
                  <p className="text-sm text-gray-500">Test rápido · 27 preguntas · 3-4 minutos</p>
                </div>
              </div>
              <ul className="text-sm text-[#2E4036] space-y-2">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> 27 preguntas clave del banco oficial (3 por eneatipo).</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Misma escala y cálculo que la lectura profunda.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#CC5833] mt-0.5" /> Hipótesis con top 3 de eneatipos y centro dominante.</li>
              </ul>
              <button onClick={() => handleTestStart('enneagram-quick', 'quick-quiz')} className="mt-auto bg-[#2E4036] text-white px-6 py-3 rounded-full font-bold btn-magnetic">
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
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#E2C17D] mt-0.5" /> Resultado real por eneatipo y centro dominante.</li>
              </ul>
              <button onClick={() => handleTestStart('enneagram-full', 'full-intro')} className="mt-auto bg-[#CC5833] text-white px-6 py-3 rounded-full font-bold btn-magnetic">
                Hacer test completo
              </button>
            </div>
          </div>
        )}

        {step === 'lead' && (
          <LeadCaptureForm
            title="Tus datos antes del test"
            description="Guardaremos tu resultado de eneagrama para que el equipo pueda revisarlo con contexto y seguimiento."
            submitLabel="Guardar datos y continuar"
            onSubmit={handleLeadSubmit}
          />
        )}

        {step === 'quick-quiz' && (
          <div className="animate-[fadeIn_0.3s_ease-out] space-y-5 flex-1 flex flex-col">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-3 text-sm text-gray-600">
                <span className="font-mono text-xs text-[#CC5833]">Test rápido · Pregunta {quickIndex + 1} de {QUICK_STATEMENTS.length}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-semibold">{quickProgression}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#2E4036]/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#CC5833] to-[#2E4036] transition-all duration-300" style={{ width: `${quickProgression}%` }}></div>
              </div>
            </div>

            <div className={`rounded-[2rem] bg-white border border-gray-200 shadow-sm p-5 sm:p-6 transition-all duration-300 ease-out ${motionClass}`}>
              <h3 className="font-heading text-[1.55rem] sm:text-3xl text-[#1A1A1A] leading-snug">{currentQuickStatement.text}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FULL_RESPONSE_OPTIONS.map(opt => {
                const isSelected = quickAnswers[quickIndex] === opt.value;
                return (
                  <button key={opt.value} onClick={() => handleQuickAnswer(opt.value)} className={`rounded-[1.4rem] border px-4 py-4 text-left sm:text-center font-bold text-sm transition-all duration-200 ${isSelected ? 'bg-[#2E4036] text-white border-[#2E4036] shadow-[0_14px_30px_-18px_rgba(46,64,54,0.85)] scale-[1.01]' : 'bg-white border-gray-200 text-[#1A1A1A] hover:border-[#2E4036] hover:-translate-y-0.5'}`}>
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
                <button disabled={quickIndex === 0 || isTransitioningQuestion} onClick={() => setQuickIndex((prev) => Math.max(0, prev - 1))} className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border ${quickIndex === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors'}`}>
                  <ArrowLeft size={16} />
                  Volver
                </button>
                <p className="text-xs sm:text-right text-gray-600 leading-relaxed max-w-md">Responde según tu experiencia habitual, no tu estado de hoy. Respondidas: {quickAnsweredCount} de {QUICK_STATEMENTS.length}.</p>
              </div>
            </div>
          </div>
        )}

        {step === 'quick-result' && quickResultData && (
          <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                <Activity className="text-[#00FF66]" size={22} />
              </div>
              <p className="font-mono text-[11px] text-[#CC5833] tracking-[0.2em]">Hipótesis inicial de eneatipo</p>
              <h3 className="font-heading text-3xl text-[#1A1A1A]">Tu hipótesis: Eneatipo {quickResultData.dominantType}</h3>
              <p className="text-[#CC5833] font-serif italic">{QUICK_NOTE}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-left">
              {saveStatusNotice}
              <p className="text-sm text-gray-500">Orientativo, no diagnóstico definitivo. Úsalo como punto de partida y valida con la lectura profunda de 135 preguntas.</p>
              <div className="p-4 rounded-2xl bg-[#F2F0E9] border border-gray-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Eneatipo sugerido</p>
                    <h4 className="font-heading text-2xl text-[#1A1A1A]">{quickDominantTypeData?.type}</h4>
                    <p className="text-[#CC5833] text-sm font-serif italic">{quickDominantTypeData?.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-heading text-3xl text-[#1A1A1A]">{quickResultData.affinityByType[quickResultData.dominantType].toFixed(0)}%</p>
                    <p className="text-[11px] text-gray-500">Afinidad</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="bg-white border border-gray-100 rounded-2xl p-3">
                  <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Motivación</p>
                  <p>{quickDominantTypeData?.motivation}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-3">
                  <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest mb-1">Miedo central</p>
                  <p>{quickDominantTypeData?.fear}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-xs text-[#2E4036] uppercase tracking-widest">Top 3 de afinidad</p>
                  <p className="text-[11px] text-gray-500">Centro dominante estimado: <span className="font-semibold text-[#2E4036]">{quickResultData.dominantCenter?.label}</span></p>
                </div>
                {quickResultData.affinityTable.slice(0, 3).map((entry, index) => (
                  <div key={entry.type} className={`grid grid-cols-[36px_1fr_52px] items-center gap-3 rounded-2xl px-3 py-2.5 border ${index === 0 ? 'border-[#CC5833]/30 bg-[#FFF7F1]' : 'border-gray-100 bg-[#FCFCFA]'}`}>
                    <div className="font-heading text-xl text-[#1A1A1A] text-center">{entry.type}</div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">{eneatypes[entry.type]?.subtitle || `Centro ${entry.center}`}</p>
                      <div className="h-4 rounded-full bg-[#F1EFE8] overflow-hidden border border-[#E8E2D8]">
                        <div
                          className={`h-full rounded-full ${index === 0 ? 'bg-gradient-to-r from-[#E86137] to-[#B64624]' : 'bg-gradient-to-r from-[#2E4036] to-[#708979]'}`}
                          style={{ width: `${Math.max(entry.affinity, 2)}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="font-heading text-base text-[#1A1A1A] text-right">{entry.affinity.toFixed(0)}%</p>
                  </div>
                ))}
              </div>

              {reportActions}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => handleTestStart('enneagram-full', 'full-intro')} className="flex-1 bg-[#CC5833] text-white px-6 py-4 rounded-full font-bold btn-magnetic">Pasar a lectura profunda</button>
                <button onClick={() => { setStep('choice'); setQuickIndex(0); setQuickAnswers([]); }} className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors">Repetir test rápido</button>
              </div>
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

        {step === 'full-result' && fullResult && (
          <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
            {saveStatusNotice}
            <div className="space-y-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                <Activity className="text-[#00FF66]" size={22} />
              </div>
              <p className="font-mono text-[11px] text-[#CC5833] tracking-[0.2em]">Lectura profunda</p>
              <h3 className="font-heading text-3xl text-[#1A1A1A]">Resultado del test de eneagrama</h3>
              <p className="text-[#CC5833] font-serif italic">135 preguntas · 10 bloques · afinidad real por eneatipo</p>
            </div>

            <div className="grid lg:grid-cols-[1.05fr_1.2fr] gap-5">
              <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${dominantVisual?.glow} border border-white/50 shadow-[0_20px_60px_-30px_rgba(26,26,26,0.35)] p-6 md:p-7`}>
                <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/35 blur-2xl"></div>
                <div className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-black/5 blur-2xl"></div>
                <div className="relative space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#1A1A1A]/65">Resultado principal</p>
                      <h4 className="font-heading text-3xl text-[#1A1A1A] mt-2">Tu eneatipo es el {fullResult.dominantType}</h4>
                    </div>
                    <div className="h-16 w-16 rounded-[1.5rem] bg-white/55 border border-white/50 flex items-center justify-center font-heading text-4xl text-[#1A1A1A] shadow-sm">
                      {fullResult.dominantType}
                    </div>
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-[#1A1A1A]">{dominantTypeData?.type}</p>
                    <p className="text-sm mt-1" style={{ color: dominantVisual?.accent }}>{dominantTypeData?.subtitle}</p>
                  </div>

                  <p className="max-w-md text-sm md:text-base leading-relaxed text-[#1A1A1A]/85">
                    {dominantTypeData?.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/55 border border-white/60 px-4 py-3">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-[#1A1A1A]/55">Afinidad</p>
                      <p className="font-heading text-2xl text-[#1A1A1A]">{fullResult.affinityByType[fullResult.dominantType].toFixed(1)}%</p>
                    </div>
                    <div className="rounded-2xl bg-white/55 border border-white/60 px-4 py-3">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-[#1A1A1A]/55">Centro dominante</p>
                      <p className="font-heading text-2xl text-[#1A1A1A]">{fullResult.dominantCenter.label}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="bg-[#7FA9D8] px-5 py-4 border-b border-[#6F97C5]">
                  <p className="font-heading text-lg text-white">Características del Eneatipo {fullResult.dominantType}</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {resultTableRows.map((row) => (
                    <div key={row.label} className="grid md:grid-cols-[220px_1fr]">
                      <div className="bg-[#F7F7F3] px-5 py-4 border-r border-gray-200">
                        <p className="font-semibold text-[#1A1A1A]">{row.label}</p>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            </div>

            <div className="flex justify-center">
              <button
                onClick={() => { window.location.hash = '#eneatipos'; handleClose(); }}
                className="inline-flex items-center justify-center gap-2 bg-[#7FA9D8] hover:bg-[#6F97C5] text-white px-6 py-3 rounded-full font-bold btn-magnetic shadow-sm"
              >
                Leer más sobre el Eneatipo {fullResult.dominantType}
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-[2rem] p-5 md:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-heading text-2xl text-[#1A1A1A]">Afinidad por eneatipo</p>
                  <p className="text-sm text-gray-600">Barras ordenadas de mayor a menor afinidad.</p>
                </div>
                <div className="rounded-full border border-gray-200 px-4 py-2 text-xs font-mono text-[#2E4036]">
                  Dominante: {fullResult.dominantType}
                </div>
              </div>

              <div className="space-y-3">
                {fullResult.affinityTable.map((entry, index) => {
                  const width = Math.max(entry.affinity, 2);
                  const isDominant = index === 0;

                  return (
                    <div key={entry.type} className={`grid grid-cols-[42px_1fr_54px] md:grid-cols-[56px_1fr_70px] items-center gap-3 rounded-2xl px-3 py-3 border ${isDominant ? 'border-[#CC5833]/30 bg-[#FFF7F1]' : 'border-gray-100 bg-[#FCFCFA]'}`}>
                      <div className="font-heading text-2xl text-[#1A1A1A] text-center">{entry.type}</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                          <span>{eneatypes[entry.type]?.subtitle || `Centro ${entry.center}`}</span>
                          <span>{isDominant ? 'Dominante' : `Puesto ${index + 1}`}</span>
                        </div>
                        <div className="h-6 rounded-full bg-[#F1EFE8] overflow-hidden border border-[#E8E2D8]">
                          <div
                            className={`h-full rounded-full ${isDominant ? 'bg-gradient-to-r from-[#E86137] to-[#B64624]' : 'bg-gradient-to-r from-[#2E4036] to-[#708979]'}`}
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-heading text-xl text-[#1A1A1A]">{entry.affinity.toFixed(1)}%</p>
                        <p className="text-[11px] text-gray-500">Afinidad</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-[2rem] p-5 md:p-6 shadow-sm space-y-4">
              <div>
                <p className="font-heading text-2xl text-[#1A1A1A]">Tríadas o centros</p>
                <p className="text-sm text-gray-600">Distribución global entre Visceral, Emocional y Mental.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {Object.values(fullResult.triads)
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .map((triad) => {
                    const isCenterWinner = triad.key === dominantCenterKey;
                    return (
                      <div key={triad.key} className={`rounded-[1.5rem] border p-4 ${isCenterWinner ? 'border-[#2E4036]/25 bg-[#F4F7F5]' : 'border-gray-200 bg-[#FCFCFA]'}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-heading text-xl text-[#1A1A1A]">{triad.label}</p>
                            <p className="text-xs text-gray-500 mt-1">Tipos {triad.members.join(' + ')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-heading text-2xl text-[#1A1A1A]">{triad.score.toFixed(1)}</p>
                            <p className="text-[11px] text-gray-500">{isCenterWinner ? 'Dominante' : 'Centro'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <details className="bg-white border border-gray-200 rounded-[2rem] p-5 md:p-6 shadow-sm">
              <summary className="cursor-pointer list-none font-heading text-xl text-[#1A1A1A] flex items-center justify-between gap-3">
                Ver detalles del cálculo
                <span className="text-xs font-mono text-[#2E4036] uppercase tracking-widest">Afinidad · respuestas · puntos</span>
              </summary>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-200 text-gray-500">
                      <th className="py-3 pr-4 font-semibold">Tipo</th>
                      <th className="py-3 pr-4 font-semibold">Afinidad</th>
                      <th className="py-3 pr-4 font-semibold">MUCHO</th>
                      <th className="py-3 pr-4 font-semibold">POCO</th>
                      <th className="py-3 pr-4 font-semibold">NADA</th>
                      <th className="py-3 pr-4 font-semibold">Puntos</th>
                      <th className="py-3 pr-4 font-semibold">Preguntas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullResult.affinityTable.map((entry) => (
                      <tr key={`detail-${entry.type}`} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-3 pr-4 font-semibold text-[#1A1A1A]">Eneatipo {entry.type}</td>
                        <td className="py-3 pr-4 text-gray-700">{entry.affinity.toFixed(1)}%</td>
                        <td className="py-3 pr-4 text-gray-700">{entry.muchos}</td>
                        <td className="py-3 pr-4 text-gray-700">{entry.pocos}</td>
                        <td className="py-3 pr-4 text-gray-700">{entry.nadas}</td>
                        <td className="py-3 pr-4 text-gray-700">{entry.weightedPoints.toFixed(2)}</td>
                        <td className="py-3 pr-4 text-gray-700">{entry.questionCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>

            {reportActions}

            <div className="flex flex-col lg:flex-row gap-3">
              <button
                onClick={() => { const text = encodeURIComponent(`Ya respondí el test completo de 135 preguntas. Mi resultado dominante fue el Eneatipo ${fullResult.dominantType} y mi centro dominante fue ${fullResult.dominantCenter.label}.`); window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank'); }}
                className="flex-1 bg-[#25D366] text-white px-6 py-4 rounded-full font-bold btn-magnetic shadow-[0_0_20px_rgba(37,211,102,0.3)]"
              >
                Compartir resultado
              </button>
              <button onClick={() => { resetModal(); }} className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100">Volver a hacer el test</button>
            </div>
          </div>
        )}
      </div>

      {activeReportData && (
        <div ref={reportContentRef} className="enneagram-print-layer gemb-report-render-layer">
          <EnneagramResultReport report={activeReportData} />
        </div>
      )}
    </div>
  );
}
