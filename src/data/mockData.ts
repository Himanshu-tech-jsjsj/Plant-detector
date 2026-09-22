import { PlantDiagnosis } from '../types';

import bgGarden from '../assets/images/botanical_garden_bg_1789888108358.jpg';
import tomatoBlightImg from '../assets/images/tomato_leaf_blight_1789888125373.jpg';
import healthyLeafImg from '../assets/images/healthy_plant_leaf_1789888141393.jpg';

export const ASSETS = {
  bgGarden,
  tomatoBlightImg,
  healthyLeafImg,
};

export const EARLY_BLIGHT_DIAGNOSIS: PlantDiagnosis = {
  isLeaf: true,
  diseaseDetected: true,
  diseaseName: "Patte me Fungal Blight (Jhulsa Rog)",
  botanicalName: "Alternaria solani",
  confidenceScore: 94,
  plantName: "Tamatar / Aloo (Plant Leaf)",
  status: "infected",
  severity: "High (Chintajanak)",
  symptoms: [
    "Paton par kale concentric target-ring dhabbe aur peelapan.",
    "Patte jaldi sukhne lagte hain aur ped kamzor hota hai."
  ],
  treatment: {
    dawai: "Cymoxanil 8% + Mancozeb 64% WP (Curzate 2g/L) ya Copper Oxychloride.",
    tariqa: "Ek liter paani me 2 gram milakar patton par spray karein. 10 din baad firse spray karein."
  },
  care: [
    "Affected paton ko turant kaat kar alag karein.",
    "Paani humesha subah jadon me dein, patton par nahi.",
    "Plant spacing ka dhayan rakhein taki hawa cross ho."
  ],
  hotspots: [
    { x: 34, y: 36, radius: 24, label: "Kale concentric nishan (Target rings)" },
    { x: 62, y: 48, radius: 28, label: "Peelapan aur sanket (Chlorotic halo)" },
    { x: 44, y: 70, radius: 20, label: "Infected necrosis spot" }
  ]
};

export const POWDERY_MILDEW_DIAGNOSIS: PlantDiagnosis = {
  isLeaf: true,
  diseaseDetected: true,
  diseaseName: "Safed Churna Fafund (Powdery Mildew)",
  botanicalName: "Podosphaera pannosa",
  confidenceScore: 96,
  plantName: "Gulab / Bhindi / Beldar Paudha",
  status: "infected",
  severity: "Moderate (Safed Fafund)",
  symptoms: [
    "Patton ki upari satah par safed powder ya churna jaisi fafund.",
    "Pattiyan mudne lagti hain aur nayi kaliyan khil nahi paati."
  ],
  treatment: {
    dawai: "Wettable Sulphur 80% WP (Sultaf 2.5g/L) ya Hexaconazole 5% EC (Contaf 2ml/L).",
    tariqa: "1 liter paani me 2.5 gram Sulphur gholkar shaam ke waqt patton ke dono taraf spray karein."
  },
  care: [
    "Paudhe ko dhoop aur hawa wali khuli jagah par rakhein.",
    "Bachaav ke liye Neem Oil (5ml/L) ka niyamit spray karein."
  ],
  hotspots: [
    { x: 42, y: 45, radius: 30, label: "Safed powdery fungal patches" },
    { x: 60, y: 35, radius: 22, label: "Deformed leaf tissue" }
  ]
};

export const LEAF_CURL_DIAGNOSIS: PlantDiagnosis = {
  isLeaf: true,
  diseaseDetected: true,
  diseaseName: "Patta Modak / Murdiya Rog (Leaf Curl Virus)",
  botanicalName: "Chilli Leaf Curl Begomovirus",
  confidenceScore: 95,
  plantName: "Mirch / Papita / Tamatar",
  status: "infected",
  severity: "Critical (Virus Rog)",
  symptoms: [
    "Patte upar ki taraf katori jaise mud jaate hain.",
    "Pattiyan choti, moti aur khurduri ho jaati hain."
  ],
  treatment: {
    dawai: "Imidacloprid 17.8% SL (Confidor 0.5ml/L) + Neem Tel 10,000 PPM (3ml/L).",
    tariqa: "Ras chusne wale keedon (safed makkhi/thrips) ko marne ke liye patton ke nichle hisse par dhang se spray karein."
  },
  care: [
    "Khet ya bagiche me Yellow Sticky Traps lagayein.",
    "Grave roop se sankramit paudhe ko ukhaad kar jala dein."
  ],
  hotspots: [
    { x: 38, y: 40, radius: 32, label: "Upward curled leaf edge" },
    { x: 55, y: 55, radius: 24, label: "Stunted puckered vein cluster" }
  ]
};

export const BACTERIAL_BLIGHT_DIAGNOSIS: PlantDiagnosis = {
  isLeaf: true,
  diseaseDetected: true,
  diseaseName: "Jivanu Jhulsa / Bacterial Leaf Blight",
  botanicalName: "Xanthomonas oryzae / campestris",
  confidenceScore: 93,
  plantName: "Dhan / Nimbu / Anaar",
  status: "infected",
  severity: "High (Bacterial Infection)",
  symptoms: [
    "Patton ke kinaron par geele dhabbe jo baad me peele padkar jal jaate hain.",
    "Kinaron par V-shape burn nishan bante hain."
  ],
  treatment: {
    dawai: "Streptocycline (6g in 50L paani) + Copper Oxychloride 50 WP (2.5g/L).",
    tariqa: "Dono dawaon ko milakar subah ke samay patton par spray karein."
  },
  care: [
    "Patton par paani ka chhidkav band karein aur hawa ka dhyan rakhein.",
    "Nitrogen khaad kam karein aur potash ki matra badhayein."
  ],
  hotspots: [
    { x: 30, y: 45, radius: 26, label: "Marginal bacterial necrosis" }
  ]
};

export const RUST_DIAGNOSIS: PlantDiagnosis = {
  isLeaf: true,
  diseaseDetected: true,
  diseaseName: "Ratawa / Gerui Rog (Rust Disease)",
  botanicalName: "Puccinia graminis / striiformis",
  confidenceScore: 95,
  plantName: "Gehun / Gulab / Coffee",
  status: "infected",
  severity: "Moderate (Gerui Rog)",
  symptoms: [
    "Patton par narangi aur laal powder jaise ubbhre hue pustules.",
    "Chhoone par zang jaisa laal powder ungliyon par lagta hai."
  ],
  treatment: {
    dawai: "Propiconazole 25% EC (Tilt 1ml/L) ya Tebuconazole.",
    tariqa: "1 liter paani me 1 ml Tilt gholkar patton par turant spray karein."
  },
  care: [
    "Dhabbe dekhte hi turant upchar karein taaki spores hawa me na udein.",
    "Rogi patti ko khet se bahar phenkein."
  ],
  hotspots: [
    { x: 45, y: 45, radius: 28, label: "Orange powdery rust pustules" }
  ]
};

export const HEALTHY_PLANT_DIAGNOSIS: PlantDiagnosis = {
  isLeaf: true,
  diseaseDetected: false,
  diseaseName: "Aapka Paudha Swasth Hai! (No Disease Detected)",
  botanicalName: "Plantae",
  confidenceScore: 98,
  plantName: "Paudha (Plant Leaf)",
  status: "healthy",
  severity: "Swasth (Healthy)",
  symptoms: [
    "Patte bilkul hare aur taaza hain.",
    "Koi rog ya keede ke sanket nahi mile."
  ],
  treatment: {
    dawai: "Kisi dawai ki zarurat nahi hai.",
    tariqa: "Paudha swasth hai, normal care jaari rakhein."
  },
  care: [
    "Niyamit dhoop aur hafte me zaroorat ke mutabiq paani dein.",
    "Agle mahine ek baar organic compost ya khad dein."
  ],
  hotspots: []
};

export const NOT_A_LEAF_DIAGNOSIS: PlantDiagnosis = {
  isLeaf: false,
  diseaseDetected: false,
  diseaseName: "Paudhe Ka Patta Nahi Hai (Not a Leaf)",
  botanicalName: "Non-Botanical Object",
  confidenceScore: 99,
  plantName: "Anya Vastu (Not a Leaf)",
  status: "not_a_leaf",
  notLeafMessage: "Sorry, this is not a leaf. Kripya kisi paudhe ke patte ki photo scan karein.",
  severity: "Anya Vastu",
  symptoms: [
    "Scan kiye gaye photo me kisi paudhe ka patta nahi dikha.",
    "Kripya paudhe ke patte ki saaf photo scan karein."
  ],
  treatment: {
    dawai: "Koi dawai lagu nahi hoti.",
    tariqa: "Kripya paudhe ke patte ko camera frame me laayein aur dobara scan karein."
  },
  care: [
    "Camera lens ko patte ke paas rakhein.",
    "Photo me roshni achhi rakhein."
  ],
  hotspots: []
};
