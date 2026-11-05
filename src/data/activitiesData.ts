import { ActivityMeta, ActivitySession, AreaKey, DailyMission, Medal } from '../types';

export const AREAS: AreaKey[] = [
  'Leitura',
  'Escrita',
  'Vocabulário',
  'Matemática',
  'Atenção',
  'Memória',
  'Competências Sociais',
];

export const POSITIVE_MESSAGES: string[] = [
  'Excelente trabalho! Estás a navegar com muita atenção.',
  'Muito bem! Cada passo conta na nossa aventura.',
  'Fantástico! Mostraste grande concentração e calma.',
  'Parabéns, Descobridor! Continuas a evoluir todos os dias.',
  'Brilhante! O teu esforço está a dar grandes resultados.',
];

export const LEVELS = [
  { level: 1, title: 'Grumete de Paço de Arcos', minXp: 0, maxXp: 150 },
  { level: 2, title: 'Marinheiro da Costa', minXp: 150, maxXp: 350 },
  { level: 3, title: 'Piloto do Farol do Bugio', minXp: 350, maxXp: 650 },
  { level: 4, title: 'Capitão da Caravela', minXp: 650, maxXp: 1000 },
  { level: 5, title: 'Grande Navegador', minXp: 1000, maxXp: 9999 },
];

export function getLevelInfo(xp: number) {
  const current =
    LEVELS.find((l) => xp >= l.minXp && xp < l.maxXp) || LEVELS[LEVELS.length - 1];
  const progressInLevel = xp - current.minXp;
  const levelSpan = Math.max(1, current.maxXp - current.minXp);
  const percent = Math.min(100, Math.round((progressInLevel / levelSpan) * 100));
  return { ...current, percent };
}

export const ACTIVITIES_META: ActivityMeta[] = [
  {
    id: 'caca-silabas',
    number: 1,
    title: 'Caça às Sílabas',
    area: 'Leitura',
    shortDesc: 'Completa as palavras escolhendo a sílaba certa entre sons parecidos.',
    steps: [
      '1. Observa a imagem e lê a palavra incompleta.',
      '2. Ouve ou lê as opções de sílabas com atenção.',
      '3. Toca na sílaba que completa corretamente a palavra.',
    ],
    xpReward: 40,
    neeSupportNote: 'Discriminação fonológica de consoantes próximas (ch/j, f/v, p/b) sem limite de tempo.',
  },
  {
    id: 'rimas-magicas',
    number: 2,
    title: 'Rimas Mágicas',
    area: 'Leitura',
    shortDesc: 'Descobre qual a palavra que termina com o mesmo som.',
    steps: [
      '1. Lê a palavra principal no topo do cartão.',
      '2. Diz as palavras em voz baixa para ouvir o som final.',
      '3. Escolhe a palavra que rima com a palavra principal.',
    ],
    xpReward: 40,
    neeSupportNote: 'Consciência fonológica e apoio rítmico com leitura por voz opcional.',
  },
  {
    id: 'associacao-imagem-palavra',
    number: 3,
    title: 'Associação Imagem-Palavra',
    area: 'Vocabulário',
    shortDesc: 'Liga cada ilustração do mar e da escola à palavra correta.',
    steps: [
      '1. Observa a figura apresentada no centro.',
      '2. Lê as três palavras disponíveis.',
      '3. Seleciona a palavra que corresponde à imagem.',
    ],
    xpReward: 35,
    neeSupportNote: 'Leitura lexical global ("flashes" imagem-palavra) para reforço visual.',
  },
  {
    id: 'descobre-palavra',
    number: 4,
    title: 'Descobre a Palavra',
    area: 'Escrita',
    shortDesc: 'Constrói a palavra letra a letra com ajuda visual e sem penalizações.',
    steps: [
      '1. Lê a pista e observa a imagem de apoio.',
      '2. Toca nas letras pela ordem certa para formar a palavra.',
      '3. Se precisares, usa o botão "Dica" para revelar a próxima letra.',
    ],
    xpReward: 50,
    neeSupportNote: 'Construção guiada letra a letra sem contabilização punitiva de erros ortográficos.',
  },
  {
    id: 'sinonimos-antonimos',
    number: 5,
    title: 'Sinónimos e Antónimos',
    area: 'Vocabulário',
    shortDesc: 'Encontra palavras com o mesmo sentido ou sentido contrário.',
    steps: [
      '1. Verifica se o desafio pede um Sinónimo (igual) ou Antónimo (contrário).',
      '2. Lê a frase de exemplo para compreender o contexto.',
      '3. Escolhe a opção correta.',
    ],
    xpReward: 45,
    neeSupportNote: 'Contextualização semântica clara para evitar ambiguidades literais.',
  },
  {
    id: 'memoria-visual',
    number: 6,
    title: 'Memória Visual',
    area: 'Memória',
    shortDesc: 'Encontra os pares de símbolos dos Descobridores ao teu próprio ritmo.',
    steps: [
      '1. Toca numa carta para ver o símbolo escondido.',
      '2. Toca noutra carta para tentar encontrar o par igual.',
      '3. Continua com calma até descobrires todos os 6 pares.',
    ],
    xpReward: 50,
    neeSupportNote: 'Treino de memória imediata e de trabalho com grelha reduzida (6 pares) e sem cronómetro.',
  },
  {
    id: 'caca-intruso',
    number: 7,
    title: 'Caça ao Intruso',
    area: 'Atenção',
    shortDesc: 'Observa os quatro elementos e descobre qual não pertence ao grupo.',
    steps: [
      '1. Observa com atenção os 4 cartões apresentados.',
      '2. Pensa no que três deles têm em comum.',
      '3. Toca no elemento que é diferente (o intruso).',
    ],
    xpReward: 40,
    neeSupportNote: 'Exercício visuo-atencional para reduzir a impulsividade e treinar a categorização.',
  },
  {
    id: 'problemas-matematicos',
    number: 8,
    title: 'Problemas Matemáticos Ilustrados',
    area: 'Matemática',
    shortDesc: 'Resolve pequenos desafios do dia a dia com apoio de imagens.',
    steps: [
      '1. Lê o problema curto passo a passo.',
      '2. Conta os elementos ilustrados no esquema visual.',
      '3. Escolhe a resposta certa.',
    ],
    xpReward: 50,
    neeSupportNote: 'Enunciados curtos sem vocabulário complexo, acompanhados de representação visual concreta.',
  },
  {
    id: 'sequencias-logicas',
    number: 9,
    title: 'Sequências Lógicas',
    area: 'Matemática',
    shortDesc: 'Descobre o próximo número ou símbolo que completa a sequência.',
    steps: [
      '1. Observa a ordem dos elementos da esquerda para a direita.',
      '2. Descobre a regra que se repete.',
      '3. Escolhe o elemento que falta no espaço vazio.',
    ],
    xpReward: 45,
    neeSupportNote: 'Treino de organização temporal, espacial e raciocínio lógico estruturado.',
  },
  {
    id: 'emocoes-expressoes',
    number: 10,
    title: 'Emoções e Expressões',
    area: 'Competências Sociais',
    shortDesc: 'Identifica emoções e escolhe a melhor atitude para ajudar os colegas.',
    steps: [
      '1. Lê a situação que aconteceu na escola.',
      '2. Observa a expressão associada.',
      '3. Escolhe a resposta mais simpática e adequada.',
    ],
    xpReward: 45,
    neeSupportNote: 'Apoio explícito à compreensão emocional e regras de interação social (PEA Nível 1 e PHDA).',
  },
];

// Question banks for each activity
export interface SyllableQuestion {
  prefix: string;
  suffix: string;
  correct: string;
  options: string[];
  emoji: string;
  fullWord: string;
}

export const SYLLABLE_QUESTIONS: SyllableQuestion[] = [
  { prefix: 'CA', suffix: 'VELA', correct: 'RA', options: ['RA', 'LA', 'BA'], emoji: '⛵', fullWord: 'CARAVELA' },
  { prefix: '', suffix: 'ROL', correct: 'FA', options: ['FA', 'VA', 'PA'], emoji: '🗼', fullWord: 'FAROL' },
  { prefix: '', suffix: 'AVE', correct: 'CH', options: ['CH', 'J', 'X'], emoji: '🔑', fullWord: 'CHAVE' },
  { prefix: 'MA', suffix: 'NHEIRO', correct: 'RI', options: ['RI', 'LI', 'NI'], emoji: '⚓', fullWord: 'MARINHEIRO' },
  { prefix: '', suffix: 'LHA', correct: 'BO', options: ['BO', 'PO', 'DO'], emoji: '🫧', fullWord: 'BOLHA' },
];

export interface RhymeQuestion {
  target: string;
  emoji: string;
  correct: string;
  options: string[];
}

export const RHYME_QUESTIONS: RhymeQuestion[] = [
  { target: 'MAR', emoji: '🌊', correct: 'NAVEGAR', options: ['NAVEGAR', 'VENTO', 'PRAIA'] },
  { target: 'FAROL', emoji: '🗼', correct: 'SOL', options: ['SOL', 'LUA', 'ESTRELA'] },
  { target: 'VELA', emoji: '⛵', correct: 'JANELA', options: ['JANELA', 'PORTA', 'TELHADO'] },
  { target: 'MAPA', emoji: '🗺️', correct: 'CAPA', options: ['CAPA', 'LIVRO', 'LÁPIS'] },
  { target: 'ESCOLA', emoji: '🏫', correct: 'BOLA', options: ['BOLA', 'CADERNO', 'MESA'] },
];

export interface ImageWordQuestion {
  emoji: string;
  hint: string;
  correct: string;
  options: string[];
}

export const IMAGE_WORD_QUESTIONS: ImageWordQuestion[] = [
  { emoji: '🧭', hint: 'Instrumento que aponta para o Norte', correct: 'BÚSSOLA', options: ['BÚSSOLA', 'ÂNCORA', 'LEME'] },
  { emoji: '⚓', hint: 'Peça pesada que segura o barco no mar', correct: 'ÂNCORA', options: ['ÂNCORA', 'VELA', 'REMO'] },
  { emoji: '🗺️', hint: 'Desenho dos mares e das terras', correct: 'MAPA', options: ['MAPA', 'CARTA', 'DIÁRIO'] },
  { emoji: '🐚', hint: 'Encontra-se na areia da praia', correct: 'CONCHA', options: ['CONCHA', 'PEDRA', 'ALGA'] },
  { emoji: '🔭', hint: 'Serve para ver o que está longe', correct: 'LUNETA', options: ['LUNETA', 'ESPELHO', 'ÓCULOS'] },
];

export interface SpellWordQuestion {
  word: string;
  emoji: string;
  clue: string;
}

export const SPELL_WORD_QUESTIONS: SpellWordQuestion[] = [
  { word: 'MAR', emoji: '🌊', clue: 'Grande extensão de água salgada' },
  { word: 'SOL', emoji: '☀️', clue: 'Estrela que ilumina o nosso dia' },
  { word: 'BARCO', emoji: '⛵', clue: 'Meio de transporte que anda na água' },
  { word: 'PRAIA', emoji: '🏖️', clue: 'Lugar com areia junto ao mar' },
  { word: 'LIVRO', emoji: '📖', clue: 'Objeto com páginas para ler histórias' },
];

export interface SynonymQuestion {
  mode: 'Sinónimo' | 'Antónimo';
  word: string;
  context: string;
  correct: string;
  options: string[];
}

export const SYNONYM_QUESTIONS: SynonymQuestion[] = [
  {
    mode: 'Sinónimo',
    word: 'TRANQUILO',
    context: 'O mar de Paço de Arcos está muito tranquilo hoje.',
    correct: 'CALMO',
    options: ['CALMO', 'AGITADO', 'RÁPIDO'],
  },
  {
    mode: 'Antónimo',
    word: 'PERTO',
    context: 'O Farol do Bugio não está perto da areia, está...',
    correct: 'LONGE',
    options: ['LONGE', 'JUNTO', 'AQUI'],
  },
  {
    mode: 'Sinónimo',
    word: 'ALEGRE',
    context: 'A turma ficou alegre com a visita de estudo.',
    correct: 'CONTENTE',
    options: ['CONTENTE', 'TRISTE', 'CANSADA'],
  },
  {
    mode: 'Antónimo',
    word: 'COMEÇAR',
    context: 'Depois de começar a leitura, vamos...',
    correct: 'TERMINAR',
    options: ['TERMINAR', 'INICIAR', 'CONTINUAR'],
  },
];

export const MEMORY_SYMBOLS = [
  { id: 'caravela', emoji: '⛵', label: 'Caravela' },
  { id: 'farol', emoji: '🗼', label: 'Farol' },
  { id: 'bussola', emoji: '🧭', label: 'Bússola' },
  { id: 'concha', emoji: '🐚', label: 'Concha' },
  { id: 'ancora', emoji: '⚓', label: 'Âncora' },
  { id: 'mapa', emoji: '🗺️', label: 'Mapa' },
];

export interface IntruderQuestion {
  categoryHint: string;
  items: { emoji: string; label: string; isIntruder: boolean }[];
}

export const INTRUDER_QUESTIONS: IntruderQuestion[] = [
  {
    categoryHint: 'Três elementos pertencem ao mar. Qual é o intruso?',
    items: [
      { emoji: '⛵', label: 'Barco', isIntruder: false },
      { emoji: '🐟', label: 'Peixe', isIntruder: false },
      { emoji: '🚲', label: 'Bicicleta', isIntruder: true },
      { emoji: '🐚', label: 'Concha', isIntruder: false },
    ],
  },
  {
    categoryHint: 'Três elementos são material escolar. Qual é o intruso?',
    items: [
      { emoji: '✏️', label: 'Lápis', isIntruder: false },
      { emoji: '📖', label: 'Livro', isIntruder: false },
      { emoji: '🎒', label: 'Mochila', isIntruder: false },
      { emoji: '🍎', label: 'Maçã', isIntruder: true },
    ],
  },
  {
    categoryHint: 'Três elementos são frutos. Qual é o intruso?',
    items: [
      { emoji: '🍌', label: 'Banana', isIntruder: false },
      { emoji: '🍇', label: 'Uvas', isIntruder: false },
      { emoji: '🧭', label: 'Bússola', isIntruder: true },
      { emoji: '🍊', label: 'Laranja', isIntruder: false },
    ],
  },
  {
    categoryHint: 'Três elementos são animais. Qual é o intruso?',
    items: [
      { emoji: '🦉', label: 'Coruja', isIntruder: false },
      { emoji: '🐢', label: 'Tartaruga', isIntruder: false },
      { emoji: '🐬', label: 'Golfinho', isIntruder: false },
      { emoji: '🗼', label: 'Farol', isIntruder: true },
    ],
  },
];

export interface MathProblemQuestion {
  story: string;
  visualGroupA: string[];
  visualGroupB: string[];
  operator: '+' | '-';
  correct: number;
  options: number[];
}

export const MATH_QUESTIONS: MathProblemQuestion[] = [
  {
    story: 'A Inês apanhou 4 conchas na praia e depois encontrou mais 3 conchas. Quantas conchas tem agora?',
    visualGroupA: ['🐚', '🐚', '🐚', '🐚'],
    visualGroupB: ['🐚', '🐚', '🐚'],
    operator: '+',
    correct: 7,
    options: [6, 7, 8],
  },
  {
    story: 'Estavam 6 barcos no porto de Paço de Arcos. 2 barcos partiram para navegar. Quantos barcos ficaram?',
    visualGroupA: ['⛵', '⛵', '⛵', '⛵', '⛵', '⛵'],
    visualGroupB: ['⛵', '⛵'],
    operator: '-',
    correct: 4,
    options: [3, 4, 5],
  },
  {
    story: 'O Tiago leu 5 páginas de manhã e 5 páginas à tarde. Quantas páginas leu ao todo?',
    visualGroupA: ['📖', '📖', '📖', '📖', '📖'],
    visualGroupB: ['📖', '📖', '📖', '📖', '📖'],
    operator: '+',
    correct: 10,
    options: [9, 10, 11],
  },
  {
    story: 'A professora tinha 8 lápis na caixa e emprestou 3 lápis. Quantos lápis ficaram na caixa?',
    visualGroupA: ['✏️', '✏️', '✏️', '✏️', '✏️', '✏️', '✏️', '✏️'],
    visualGroupB: ['✏️', '✏️', '✏️'],
    operator: '-',
    correct: 5,
    options: [4, 5, 6],
  },
];

export interface SequenceQuestion {
  ruleHint: string;
  sequence: string[];
  correct: string;
  options: string[];
}

export const SEQUENCE_QUESTIONS: SequenceQuestion[] = [
  {
    ruleHint: 'Conta de 2 em 2:',
    sequence: ['2', '4', '6', '8', '?'],
    correct: '10',
    options: ['9', '10', '12'],
  },
  {
    ruleHint: 'Observa o padrão de símbolos:',
    sequence: ['⛵', '🗼', '⛵', '🗼', '?'],
    correct: '⛵',
    options: ['⛵', '⚓', '🧭'],
  },
  {
    ruleHint: 'Conta de 5 em 5:',
    sequence: ['5', '10', '15', '20', '?'],
    correct: '25',
    options: ['22', '25', '30'],
  },
  {
    ruleHint: 'Observa a ordem das fases:',
    sequence: ['🌅 Manhã', '☀️ Tarde', '🌙 Noite', '🌅 Manhã', '?'],
    correct: '☀️ Tarde',
    options: ['☀️ Tarde', '🌙 Noite', '🌅 Manhã'],
  },
];

export interface EmotionQuestion {
  situation: string;
  emoji: string;
  emotionName: string;
  question: string;
  correct: string;
  options: string[];
}

export const EMOTION_QUESTIONS: EmotionQuestion[] = [
  {
    situation: 'O João deixou cair o seu estojo e os lápis espalharam-se pelo chão.',
    emoji: '😟',
    emotionName: 'Preocupado',
    question: 'O que podes dizer ou fazer para ajudar?',
    correct: '“Não faz mal, João! Eu ajudo-te a apanhar os lápis.”',
    options: [
      '“Não faz mal, João! Eu ajudo-te a apanhar os lápis.”',
      'Rir e continuar a andar.',
      'Dizer que ele é muito desastrado.',
    ],
  },
  {
    situation: 'A Maria conseguiu terminar um exercício difícil pela primeira vez.',
    emoji: '😄',
    emotionName: 'Orgulhosa e Alegre',
    question: 'Qual é a melhor forma de reagir?',
    correct: 'Dar os parabéns: “Boa, Maria! Conseguiste!”',
    options: [
      'Dar os parabéns: “Boa, Maria! Conseguiste!”',
      'Dizer que o exercício era muito fácil.',
      'Ignorar e não dizer nada.',
    ],
  },
  {
    situation: 'Está muito barulho na sala e sentes que estás a ficar cansado ou agitado.',
    emoji: '😮‍💨',
    emotionName: 'Precisa de Calma',
    question: 'O que podes fazer para te sentires melhor?',
    correct: 'Respirar fundo devagar e pedir ajuda ao professor.',
    options: [
      'Respirar fundo devagar e pedir ajuda ao professor.',
      'Gritar mais alto do que os colegas.',
      'Atirar o caderno para o chão.',
    ],
  },
];

export const DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'mission-leitura',
    title: 'Explorador das Palavras',
    description: 'Completa 1 atividade de Leitura ou Vocabulário.',
    targetArea: 'Leitura',
    targetCount: 1,
    xpReward: 30,
  },
  {
    id: 'mission-matematica',
    title: 'Calculador de Rota',
    description: 'Completa 1 desafio de Matemática.',
    targetArea: 'Matemática',
    targetCount: 1,
    xpReward: 30,
  },
  {
    id: 'mission-geral',
    title: 'Aventura Completa',
    description: 'Realiza 3 atividades educativas hoje.',
    targetCount: 3,
    xpReward: 50,
  },
];

export const MEDALS: Medal[] = [
  {
    id: 'primeira-viagem',
    title: 'Primeira Viagem',
    description: 'Completaste a tua primeira atividade na plataforma.',
    criteriaText: '1 atividade concluída',
    iconName: 'compass',
    checkUnlocked: (sessions) => sessions.length >= 1,
  },
  {
    id: 'leitor-atento',
    title: 'Leitor do Farol',
    description: 'Completaste atividades de Leitura com sucesso.',
    criteriaText: '2 atividades de Leitura',
    iconName: 'book',
    checkUnlocked: (sessions) =>
      sessions.filter((s) => s.area === 'Leitura').length >= 2,
  },
  {
    id: 'mestre-escrita',
    title: 'Escrivão da Caravela',
    description: 'Praticaste a escrita e construção de palavras.',
    criteriaText: '1 atividade de Escrita',
    iconName: 'pen',
    checkUnlocked: (sessions) =>
      sessions.filter((s) => s.area === 'Escrita').length >= 1,
  },
  {
    id: 'navegador-numeros',
    title: 'Navegador dos Números',
    description: 'Resolveste desafios matemáticos e sequências.',
    criteriaText: '2 atividades de Matemática',
    iconName: 'calculator',
    checkUnlocked: (sessions) =>
      sessions.filter((s) => s.area === 'Matemática').length >= 2,
  },
  {
    id: 'olho-aguia',
    title: 'Olho de Águia',
    description: 'Demonstraste excelente foco na Caça ao Intruso.',
    criteriaText: '1 atividade de Atenção',
    iconName: 'eye',
    checkUnlocked: (sessions) =>
      sessions.filter((s) => s.area === 'Atenção').length >= 1,
  },
  {
    id: 'memoria-ouro',
    title: 'Memória de Ouro',
    description: 'Encontraste todos os pares na Memória Visual.',
    criteriaText: '1 atividade de Memória',
    iconName: 'brain',
    checkUnlocked: (sessions) =>
      sessions.filter((s) => s.area === 'Memória').length >= 1,
  },
  {
    id: 'coracao-amigo',
    title: 'Coração Amigo',
    description: 'Praticaste empatia e competências sociais.',
    criteriaText: '1 atividade de Competências Sociais',
    iconName: 'heart',
    checkUnlocked: (sessions) =>
      sessions.filter((s) => s.area === 'Competências Sociais').length >= 1,
  },
  {
    id: 'capitao-xp',
    title: 'Capitão de Paço de Arcos',
    description: 'Alcançaste 350 pontos XP na tua jornada.',
    criteriaText: '350 XP acumulados',
    iconName: 'award',
    checkUnlocked: (_sessions, xp) => xp >= 350,
  },
];

export const NEE_GUIDE_SECTIONS = [
  {
    profile: 'Dislexia e Dificuldades Específicas de Aprendizagem',
    strategies: [
      'Reduzir o comprimento dos textos e propor questões intermédias passo a passo.',
      'Reduzir a velocidade da leitura em voz alta e nunca obrigar a ler perante a turma.',
      'Permitir o uso de marcador móvel / régua de leitura para evitar saltar linhas.',
      'Não penalizar erros ortográficos fora de exercícios específicos; valorizar o conteúdo e o esforço.',
      'Separar a avaliação dos conhecimentos da avaliação da ortografia e conceder tempo suplementar.',
    ],
  },
  {
    profile: 'PHDA (Hiperatividade com Défice de Atenção)',
    strategies: [
      'Manter o ambiente visual limpo e com poucos estímulos distratores (Modo Foco ativo).',
      'Fracionar as tarefas em etapas breves (10–15 minutos) com dificuldade progressiva.',
      'Fornecer feedback imediato, positivo e contínuo após cada comportamento ou tarefa adequada.',
      'Combinar tarefas escolares com pausas de respiração lenta e relaxamento muscular.',
      'Valorizar o progresso individual em relação ao próprio aluno, evitando comparações com colegas.',
    ],
  },
  {
    profile: 'PEA Nível 1 (Perturbação do Espetro do Autismo / Síndrome de Asperger)',
    strategies: [
      'Proporcionar elevada consistência, previsibilidade e instruções diretas acompanhadas de exemplos.',
      'Evitar linguagem ambígua, metáforas não explicadas ou sobrecarga verbal.',
      'Utilizar apoios visuais concretos (esquemas, imagens, listas de verificação passo a passo).',
      'Trabalhar explicitamente o reconhecimento de emoções e regras de interação social.',
      'Prevenir situações de ansiedade mantendo um tom calmo, previsível e encorajador.',
    ],
  },
];
