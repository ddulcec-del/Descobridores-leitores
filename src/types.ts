export type AreaKey =
  | 'Leitura'
  | 'Escrita'
  | 'Vocabulário'
  | 'Matemática'
  | 'Atenção'
  | 'Memória'
  | 'Competências Sociais';

export type NavTab = 'inicio' | 'atividades' | 'conquistas' | 'professor';

export interface AccessibilitySettings {
  voiceEnabled: boolean;
  slowSpeech: boolean;
  soundEffects: boolean;
  largeText: boolean;
  highContrast: boolean;
  focusMode: boolean;
  readingRuler: boolean;
}

export interface StudentProfile {
  name: string;
  grade: '4.º Ano' | '5.º Ano';
  className: string;
  avatarId: 'caravela' | 'farol' | 'mascote';
  xp: number;
}

export interface ActivitySession {
  id: string;
  activityId: string;
  activityTitle: string;
  area: AreaKey;
  score: number;
  maxScore: number;
  xpEarned: number;
  timestamp: string;
  studentName: string;
  grade: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  targetArea?: AreaKey;
  targetCount: number;
  xpReward: number;
}

export interface Medal {
  id: string;
  title: string;
  description: string;
  criteriaText: string;
  iconName: 'compass' | 'book' | 'pen' | 'calculator' | 'eye' | 'brain' | 'heart' | 'award';
  checkUnlocked: (sessions: ActivitySession[], xp: number) => boolean;
}

export interface ActivityMeta {
  id: string;
  number: number;
  title: string;
  area: AreaKey;
  shortDesc: string;
  steps: string[];
  xpReward: number;
  neeSupportNote: string;
}
