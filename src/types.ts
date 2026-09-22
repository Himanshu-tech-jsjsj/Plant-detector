export interface DiagnosisHotspot {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  radius: number; // radius in px
  label: string;
}

export interface PlantDiagnosis {
  isLeaf?: boolean;
  notLeafMessage?: string;
  diseaseDetected: boolean;
  diseaseName: string;
  botanicalName?: string;
  confidenceScore: number;
  plantName: string;
  status: 'infected' | 'healthy' | 'not_a_leaf';
  severity?: string;
  symptoms: string[];
  treatment: {
    dawai: string;
    tariqa: string;
  };
  care: string[];
  hotspots: DiagnosisHotspot[];
}

export type ScanViewMode =
  | 'ready_scan'
  | 'result_blight'
  | 'result_healthy'
  | 'result_custom'
  | 'result_powdery_mildew'
  | 'result_leaf_curl'
  | 'result_rust'
  | 'not_a_leaf';
