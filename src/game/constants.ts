import { StageConfig, QuizQuestion, CollectibleType } from '../types';

export const GOAL_DISTANCE_METRES = 30;

export const STAGES: StageConfig[] = [
  {
    id: 1,
    title: 'Stage 1 — Festival Street',
    subtitle: 'Morning in the Decorated Streets',
    targetDistance: 30,
    description: 'Help Mushak dash 30 metres through the colorful neighborhood to reach Lord Ganesha! Jump over flower baskets and gather sacred Modaks.',
    bgAtmosphere: 'day',
    speed: 3.6,
  },
  {
    id: 2,
    title: 'Stage 2 — The Rangoli Lane',
    subtitle: 'The Harmony of Sacred Colors',
    targetDistance: 30,
    description: 'Dash 30 metres across the glowing Rangoli path to reach Lord Ganesha! Collect festival powders in sequence (Red → Yellow → Green → Blue) for major combo bonuses!',
    hasColorSequence: true,
    bgAtmosphere: 'evening',
    speed: 3.8,
  },
  {
    id: 3,
    title: 'Stage 3 — Pandal Festival',
    subtitle: 'Inside the Grand Sarvajanik Pandal',
    targetDistance: 30,
    description: 'Dash 30 metres through the majestic festive pandal adorned with brass lamps and dhol beats to reach the grand shrine of Lord Ganesha!',
    bgAtmosphere: 'pandal',
    speed: 4.0,
  },
  {
    id: 4,
    title: 'Stage 4 — Eco-Friendly Festival',
    subtitle: 'Clean & Green Devotion',
    targetDistance: 30,
    description: 'Dash 30 metres in harmony with nature to reach Lord Ganesha! Collect biodegradable clay and fresh lotus while dodging plastic litter.',
    isEcoStage: true,
    bgAtmosphere: 'green',
    speed: 4.0,
  },
  {
    id: 5,
    title: 'Stage 5 — Visarjan Journey',
    subtitle: 'The Peaceful Riverfront Procession',
    targetDistance: 30,
    description: 'Dash 30 metres alongside the joyous sunset procession to arrive at the sacred waterfront and receive the grand Darshan of Lord Ganesha!',
    bgAtmosphere: 'twilight',
    speed: 4.2,
  },
];

export const COLLECTIBLE_VALUES: Record<CollectibleType, number> = {
  modak: 10,
  flower: 5,
  durva: 8,
  diya: 15,
  eco_clay: 20,
  eco_leaf: 15,
  eco_flower: 10,
  trash_plastic: -15,
  trash_cup: -10,
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which sweet delicacy is traditionally Lord Ganesha's most cherished offering?",
    options: ["Modak", "Gulab Jamun", "Jalebi", "Rasgulla"],
    correctIndex: 0,
    explanation: "Lord Ganesha is lovingly known as 'Modakapriya' (the lover of modaks), steamed dumplings filled with coconut and jaggery.",
  },
  {
    id: 2,
    question: "What is the name of Lord Ganesha's loyal, agile mouse companion and vehicle (Vahana)?",
    options: ["Nandi", "Garuda", "Mushak", "Airavata"],
    correctIndex: 2,
    explanation: "Mushak (the mouse) is Ganesha's devoted vahana, symbolizing humbleness, agility, and conquering desires.",
  },
  {
    id: 3,
    question: "How many sacred blades of Durva (Bermuda grass) are traditionally offered during Ganesha Puja?",
    options: ["7 blades", "11 blades", "21 blades", "51 blades"],
    correctIndex: 2,
    explanation: "Traditionally, 21 shoots of three-pronged fresh green Durva grass are offered to Lord Ganesha for auspicious blessings.",
  },
  {
    id: 4,
    question: "Why are eco-friendly clay murtis (Shadu Mati) recommended for Ganesh Chaturthi?",
    options: [
      "They dissolve naturally in water without polluting rivers or lakes",
      "They are lighter to carry",
      "They dry faster in sunlight",
      "They shine brighter under neon lights"
    ],
    correctIndex: 0,
    explanation: "Natural clay idols dissolve harmlessly in water and safeguard aquatic ecosystems and marine life.",
  },
  {
    id: 5,
    question: "Which prominent Indian leader transformed Ganesh Chaturthi into a public community festival to inspire unity?",
    options: ["Mahatma Gandhi", "Lokmanya Bal Gangadhar Tilak", "Sardar Patel", "Subhash Chandra Bose"],
    correctIndex: 1,
    explanation: "In 1893, Lokmanya Tilak revitalized the festival as 'Sarvajanik Ganeshotsav' to unite people across communities in common celebration.",
  },
  {
    id: 6,
    question: "What do the prominent, wide ears of Lord Ganesha spiritually symbolize?",
    options: [
      "The importance of listening patiently and acquiring wisdom",
      "Hearing distant thunderstorms",
      "Fanning oneself during summer",
      "Enjoying rhythmic musical instruments"
    ],
    correctIndex: 0,
    explanation: "Lord Ganesha's large ears teach us to listen carefully, absorb good thoughts, and filter out negative noise.",
  },
  {
    id: 7,
    question: "Which vibrant yellow and orange flower garland is most commonly offered to Lord Ganesha?",
    options: ["Marigold (Genda)", "Sunflower", "Daisy", "Tulip"],
    correctIndex: 0,
    explanation: "Marigolds (Genda phool) represent radiance, auspiciousness, and spiritual surrender in festival celebrations.",
  },
  {
    id: 8,
    question: "According to sacred lore, with which tool or object did Lord Ganesha write down the epic Mahabharata as sage Vyasa dictated?",
    options: ["A golden quill", "His own broken tusk", "A peacock feather", "A silver stylus"],
    correctIndex: 1,
    explanation: "When the quill broke, Lord Ganesha broke off his own tusk without hesitation so the transcription would never pause.",
  },
  {
    id: 9,
    question: "What joyful slogan is chanted during the Visarjan procession requesting Ganesha to return early next year?",
    options: [
      "Ganpati Bappa Morya, Pudhchya Varshi Lavkar Ya!",
      "Jai Ho, Vijayi Bhava!",
      "Shubh Aarambh, Har Har Mahadev!",
      "Utsav Shuru, Dhol Bajao!"
    ],
    correctIndex: 0,
    explanation: "'Ganpati Bappa Morya, Pudhchya Varshi Lavkar Ya' warmly invites our beloved Bappa to bless us again next year!",
  },
  {
    id: 10,
    question: "What is the spiritual significance of lighting a traditional earthen Diya (lamp)?",
    options: [
      "Dispelling darkness and ushering in divine wisdom and purity",
      "Heating the sanctum",
      "Decorating the street pavement",
      "Keeping nocturnal insects away"
    ],
    correctIndex: 0,
    explanation: "The flame of the diya represents the inner light of knowledge triumphing over darkness, ignorance, and negativity.",
  }
];

export const ECO_MESSAGES = [
  "This Ganesh Chaturthi, choose celebrations that care for nature.",
  "Celebrate with devotion. Celebrate with nature.",
  "A natural clay idol returns peacefully to the earth.",
  "Clean streets and clean rivers honor Lord Ganesha's blessings.",
];
