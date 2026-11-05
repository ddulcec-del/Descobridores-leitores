import { AccessibilitySettings, ActivitySession, StudentProfile } from '../types';

const KEYS = {
  PROFILE: 'descobridores_pa_profile_v1',
  SESSIONS: 'descobridores_pa_sessions_v1',
  A11Y: 'descobridores_pa_a11y_v1',
  CLAIMED_MISSIONS: 'descobridores_pa_missions_v1',
  NOTES: 'descobridores_pa_notes_v1',
};

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Beatriz Silva',
  grade: '4.º Ano',
  className: 'Turma B',
  avatarId: 'caravela',
  xp: 165,
};

export const DEFAULT_A11Y: AccessibilitySettings = {
  voiceEnabled: false,
  slowSpeech: true,
  soundEffects: true,
  largeText: false,
  highContrast: false,
  focusMode: false,
  readingRuler: false,
};

export const INITIAL_SESSIONS: ActivitySession[] = [
  {
    id: 'init-1',
    activityId: 'caca-silabas',
    activityTitle: 'Caça às Sílabas',
    area: 'Leitura',
    score: 5,
    maxScore: 5,
    xpEarned: 40,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    studentName: 'Beatriz Silva',
    grade: '4.º Ano · Turma B',
  },
  {
    id: 'init-2',
    activityId: 'problemas-matematicos',
    activityTitle: 'Problemas Matemáticos Ilustrados',
    area: 'Matemática',
    score: 4,
    maxScore: 4,
    xpEarned: 50,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    studentName: 'Beatriz Silva',
    grade: '4.º Ano · Turma B',
  },
  {
    id: 'init-3',
    activityId: 'emocoes-expressoes',
    activityTitle: 'Emoções e Expressões',
    area: 'Competências Sociais',
    score: 3,
    maxScore: 3,
    xpEarned: 45,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    studentName: 'Beatriz Silva',
    grade: '4.º Ano · Turma B',
  },
];

export function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSessions(): ActivitySession[] {
  try {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    if (!raw) return INITIAL_SESSIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function saveSessions(sessions: ActivitySession[]): void {
  try {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {
    // Ignore
  }
}

export function loadA11y(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(KEYS.A11Y);
    if (!raw) return DEFAULT_A11Y;
    return { ...DEFAULT_A11Y, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_A11Y;
  }
}

export function saveA11y(settings: AccessibilitySettings): void {
  try {
    localStorage.setItem(KEYS.A11Y, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function loadClaimedMissions(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.CLAIMED_MISSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveClaimedMissions(ids: string[]): void {
  try {
    localStorage.setItem(KEYS.CLAIMED_MISSIONS, JSON.stringify(ids));
  } catch {
    // Ignore
  }
}

const DEFAULT_NOTES = [
  'P / B — Pato começa com P, Barco começa com B.',
  'Ontem = Passado · Hoje = Presente · Amanhã = Futuro',
];

export function loadNotes(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.NOTES);
    if (!raw) return DEFAULT_NOTES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_NOTES;
  }
}

export function saveNotes(notes: string[]): void {
  try {
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  } catch {
    // Ignore
  }
}

export function exportSessionsToCSV(sessions: ActivitySession[]): void {
  const headers = [
    'Data e Hora',
    'Aluno',
    'Ano e Turma',
    'Atividade',
    'Área Curricular',
    'Pontuação',
    'Máximo',
    'XP Ganho',
  ];

  const rows = sessions.map((s) => {
    const dateStr = new Date(s.timestamp).toLocaleString('pt-PT');
    return [
      `"${dateStr}"`,
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.grade.replace(/"/g, '""')}"`,
      `"${s.activityTitle.replace(/"/g, '""')}"`,
      `"${s.area}"`,
      s.score,
      s.maxScore,
      s.xpEarned,
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'descobridores_paco_arcos_resultados.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
