export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // Egyptian colloquial explanation
  trickWarning: string; // Egyptian colloquial tip alerting student of traps
}

export type InfographicType = 
  | 'ohm_sim' 
  | 'kirchhoff_sim' 
  | 'organic_namer' 
  | 'osmosis_sim' 
  | 'derivative_slope' 
  | 'geology_faults'
  | 'momentum_sim' // New physics/math mechanic
  | 'cellular_sim' // New biology mechanic
  | 'chemical_equilibrium' // New chemistry equilibrium
  | 'none';

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  analogy: string; // "تشبيه بلدي يبسطهالك"
  coreConcept: string; // Absolute academic definition
  deepExplanation: string[]; // Deep Egyptian colloquial paragraphs
  infographicTitle: string;
  infographicType: InfographicType;
  questions: Question[];
  imageUrl?: string; // Sourced educational diagram/illustration URL
  imageCaption?: string; // Egyptian colloquial description of the scientific diagram
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export interface Unit {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  badge: string; // Shara target name
  term1Units: Unit[];
  term2Units: Unit[];
}

export type SpecializationID = 'general' | 'scientific' | 'literary' | 'scientific_science' | 'scientific_math';

export interface Specialization {
  id: SpecializationID;
  name: string; // 'علمي', 'أدبي', 'علمي علوم', 'علمي رياضة', 'عام'
  subjects: Subject[];
}

export interface AcademicYear {
  id: 'grade10' | 'grade11' | 'grade12';
  name: string; // 'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'
  specializations: Specialization[];
}
