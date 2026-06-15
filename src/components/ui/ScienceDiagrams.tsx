"use client";

import { useMemo } from "react";

interface ScienceDiagramProps {
  type: "cell" | "atom" | "molecule" | "dna" | "photosynthesis" | "heart" | "solarsystem" | "foodchain" | "watercycle" | "digestive";
  params?: Record<string, string | number>;
  language?: "ar" | "en";
  className?: string;
}

// رسومات علمية تفاعلية
export function ScienceDiagram({ type, params = {}, language = "ar", className = "" }: ScienceDiagramProps) {
  const diagram = useMemo(() => {
    switch (type) {
      case "cell":
        return <CellDiagram params={params} language={language} />;
      case "atom":
        return <AtomDiagram params={params} language={language} />;
      case "molecule":
        return <MoleculeDiagram params={params} language={language} />;
      case "dna":
        return <DNADiagram language={language} />;
      case "photosynthesis":
        return <PhotosynthesisDiagram language={language} />;
      case "heart":
        return <HeartDiagram language={language} />;
      case "solarsystem":
        return <SolarSystemDiagram language={language} />;
      case "foodchain":
        return <FoodChainDiagram language={language} />;
      case "watercycle":
        return <WaterCycleDiagram language={language} />;
      case "digestive":
        return <DigestiveDiagram language={language} />;
      default:
        return <CellDiagram params={params} language={language} />;
    }
  }, [type, params, language]);

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900 dark:to-pink-950 rounded-xl p-4 ${className}`}>
      <svg viewBox="0 0 500 400" className="w-full h-auto">
        {diagram}
      </svg>
    </div>
  );
}

// رسم الخلية
function CellDiagram({ params, language }: { params: Record<string, string | number>; language: string }) {
  const cellType = params.cellType || "plant";
  
  const labels = {
    cell: language === "ar" ? "الخلية" : "Cell",
    nucleus: language === "ar" ? "النواة" : "Nucleus",
    membrane: language === "ar" ? "غشاء الخلية" : "Cell Membrane",
    cytoplasm: language === "ar" ? "السيتوبلازم" : "Cytoplasm",
    mitochondria: language === "ar" ? "الميتوكوندريا" : "Mitochondria",
    chloroplast: language === "ar" ? "البلاستيدات الخضراء" : "Chloroplast",
    cellWall: language === "ar" ? "جدار الخلية" : "Cell Wall",
    vacuole: language === "ar" ? "الفجوة العصارية" : "Vacuole",
  };

  return (
    <>
      {/* جدار الخلية (للنبات فقط) */}
      {cellType === "plant" && (
        <rect x="80" y="60" width="340" height="280" rx="20" fill="none" stroke="#065F46" strokeWidth="4" strokeDasharray="10,5" />
      )}
      
      {/* غشاء الخلية */}
      <ellipse cx="250" cy="200" rx="140" ry="110" fill="rgba(147, 51, 234, 0.1)" stroke="#9333EA" strokeWidth="3" />
      
      {/* السيتوبلازم */}
      <ellipse cx="250" cy="200" rx="130" ry="100" fill="rgba(196, 181, 253, 0.3)" />
      
      {/* النواة */}
      <ellipse cx="250" cy="200" rx="50" ry="40" fill="rgba(139, 92, 246, 0.5)" stroke="#7C3AED" strokeWidth="2" />
      <circle cx="250" cy="200" r="15" fill="#5B21B6" />
      <text x="250" y="260" textAnchor="middle" className="text-xs fill-purple-900">{labels.nucleus}</text>
      
      {/* الميتوكوندريا */}
      <ellipse cx="170" cy="150" rx="25" ry="12" fill="rgba(239, 68, 68, 0.4)" stroke="#EF4444" strokeWidth="1" />
      <path d="M 155 150 Q 165 145 175 150 Q 185 145 190 150" fill="none" stroke="#EF4444" strokeWidth="1" />
      <text x="170" y="175" textAnchor="middle" className="text-xs fill-red-700">{labels.mitochondria}</text>
      
      {/* البلاستيدات (للنبات فقط) */}
      {cellType === "plant" && (
        <>
          <ellipse cx="320" cy="150" rx="20" ry="15" fill="rgba(34, 197, 94, 0.5)" stroke="#22C55E" strokeWidth="1" />
          <text x="320" y="175" textAnchor="middle" className="text-xs fill-green-700">{labels.chloroplast}</text>
        </>
      )}
      
      {/* الفجوة العصارية */}
      <ellipse cx="180" cy="250" rx="35" ry="25" fill="rgba(59, 130, 246, 0.3)" stroke="#3B82F6" strokeWidth="1" />
      <text x="180" y="255" textAnchor="middle" className="text-xs fill-blue-700">{labels.vacuole}</text>
      
      {/* التسميات */}
      <text x="400" y="90" className="text-xs fill-purple-900">{labels.membrane}</text>
      <line x1="395" y1="90" x2="380" y2="110" stroke="#9333EA" strokeWidth="1" />
      
      {cellType === "plant" && (
        <>
          <text x="100" y="45" className="text-xs fill-emerald-900">{labels.cellWall}</text>
        </>
      )}
      
      {/* العنوان */}
      <text x="250" y="385" textAnchor="middle" className="text-lg font-bold fill-slate-800">
        {language === "ar" ? `خلية ${cellType === "plant" ? "نباتية" : "حيوانية"}` : `${cellType === "plant" ? "Plant" : "Animal"} Cell`}
      </text>
    </>
  );
}

// رسم الذرة
function AtomDiagram({ params, language }: { params: Record<string, string | number>; language: string }) {
  const element = params.element || "carbon";
  const atomicNumber = element === "hydrogen" ? 1 : element === "oxygen" ? 8 : element === "carbon" ? 6 : 6;
  
  const labels = {
    atom: language === "ar" ? "الذرة" : "Atom",
    proton: language === "ar" ? "بروتون" : "Proton",
    neutron: language === "ar" ? "نيوترون" : "Neutron",
    electron: language === "ar" ? "إلكترون" : "Electron",
    nucleus: language === "ar" ? "النواة" : "Nucleus",
    shells: language === "ar" ? "مستويات الطاقة" : "Energy Shells",
  };

  // رسم الإلكترونات في مدارات
  const electrons = [];
  const shells = [2, 8, 8, 18]; // عدد الإلكترونات في كل مستوى
  let remaining = atomicNumber;
  
  for (let shell = 0; shell < 4 && remaining > 0; shell++) {
    const radius = 60 + shell * 40;
    const e = Math.min(shells[shell], remaining);
    
    // المدار
    electrons.push(
      <circle key={`orbit-${shell}`} cx="250" cy="180" r={radius} fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="5,5" />
    );
    
    // الإلكترونات
    for (let i = 0; i < e; i++) {
      const angle = (2 * Math.PI * i) / e - Math.PI / 2;
      const x = 250 + radius * Math.cos(angle);
      const y = 180 + radius * Math.sin(angle);
      electrons.push(
        <circle key={`e-${shell}-${i}`} cx={x} cy={y} r="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
      );
    }
    
    remaining -= e;
  }

  return (
    <>
      {/* النواة */}
      <circle cx="250" cy="180" r="30" fill="rgba(239, 68, 68, 0.5)" stroke="#DC2626" strokeWidth="2" />
      
      {/* البروتونات */}
      <circle cx="240" cy="175" r="8" fill="#EF4444" />
      <circle cx="260" cy="175" r="8" fill="#EF4444" />
      <circle cx="250" cy="190" r="8" fill="#EF4444" />
      
      {/* النيوترونات */}
      <circle cx="245" cy="185" r="7" fill="#6B7280" />
      <circle cx="255" cy="182" r="7" fill="#6B7280" />
      
      {/* المدارات والإلكترونات */}
      {electrons}
      
      {/* التسميات */}
      <text x="250" y="230" textAnchor="middle" className="text-xs fill-red-700">{labels.nucleus}</text>
      <text x="320" y="100" className="text-xs fill-blue-700">{labels.electron}</text>
      <line x1="315" y1="100" x2="295" y2="115" stroke="#3B82F6" strokeWidth="1" />
      
      <text x="130" y="60" className="text-xs fill-red-700">+ {labels.proton}</text>
      <circle cx="120" cy="55" r="6" fill="#EF4444" />
      
      <text x="130" y="80" className="text-xs fill-gray-600">{labels.neutron}</text>
      <circle cx="120" cy="75" r="5" fill="#6B7280" />
      
      <text x="130" y="100" className="text-xs fill-blue-700">- {labels.electron}</text>
      <circle cx="120" cy="95" r="5" fill="#3B82F6" />
      
      {/* العنصر */}
      <text x="250" y="385" textAnchor="middle" className="text-lg font-bold fill-slate-800">
        {labels.atom}: {element.charAt(0).toUpperCase() + element.slice(1)} ({atomicNumber})
      </text>
    </>
  );
}

// رسم الجزيء
function MoleculeDiagram({ params, language }: { params: Record<string, string | number>; language: string }) {
  const molecule = params.molecule || "water";
  
  const labels = {
    molecule: language === "ar" ? "الجزيء" : "Molecule",
    oxygen: language === "ar" ? "أكسجين" : "Oxygen",
    hydrogen: language === "ar" ? "هيدروجين" : "Hydrogen",
    carbon: language === "ar" ? "كربون" : "Carbon",
    covalent: language === "ar" ? "رابطة تساهمية" : "Covalent Bond",
  };

  if (molecule === "water") {
    return (
      <>
        {/* جزيء الماء H2O */}
        <text x="250" y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">
          {language === "ar" ? "جزيء الماء (H₂O)" : "Water Molecule (H₂O)"}
        </text>
        
        {/* ذرة الأكسجين */}
        <circle cx="250" cy="180" r="40" fill="rgba(239, 68, 68, 0.5)" stroke="#EF4444" strokeWidth="2" />
        <text x="250" y="185" textAnchor="middle" className="text-xl font-bold fill-red-900">O</text>
        
        {/* ذرتا الهيدروجين */}
        <circle cx="170" cy="240" r="25" fill="rgba(59, 130, 246, 0.5)" stroke="#3B82F6" strokeWidth="2" />
        <text x="170" y="245" textAnchor="middle" className="text-lg font-bold fill-blue-900">H</text>
        
        <circle cx="330" cy="240" r="25" fill="rgba(59, 130, 246, 0.5)" stroke="#3B82F6" strokeWidth="2" />
        <text x="330" y="245" textAnchor="middle" className="text-lg font-bold fill-blue-900">H</text>
        
        {/* الروابط */}
        <line x1="220" y1="205" x2="190" y2="225" stroke="#1F2937" strokeWidth="3" />
        <line x1="280" y1="205" x2="310" y2="225" stroke="#1F2937" strokeWidth="3" />
        
        {/* الزاوية */}
        <path d="M 220 200 A 30,30 0 0 0 280 200" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <text x="250" y="280" textAnchor="middle" className="text-sm fill-emerald-700">104.5°</text>
        
        {/* التسميات */}
        <text x="350" y="150" className="text-sm fill-red-700">{labels.oxygen}</text>
        <text x="370" y="260" className="text-sm fill-blue-700">{labels.hydrogen}</text>
      </>
    );
  }
  
  if (molecule === "co2") {
    return (
      <>
        {/* جزيء CO2 */}
        <text x="250" y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">
          CO₂ {language === "ar" ? "ثاني أكسيد الكربون" : "Carbon Dioxide"}
        </text>
        
        {/* ذرة الكربون */}
        <circle cx="250" cy="180" r="30" fill="rgba(55, 65, 81, 0.5)" stroke="#374151" strokeWidth="2" />
        <text x="250" y="185" textAnchor="middle" className="text-xl font-bold fill-gray-900">C</text>
        
        {/* ذرتا الأكسجين */}
        <circle cx="150" cy="180" r="25" fill="rgba(239, 68, 68, 0.5)" stroke="#EF4444" strokeWidth="2" />
        <text x="150" y="185" textAnchor="middle" className="text-lg font-bold fill-red-900">O</text>
        
        <circle cx="350" cy="180" r="25" fill="rgba(239, 68, 68, 0.5)" stroke="#EF4444" strokeWidth="2" />
        <text x="350" y="185" textAnchor="middle" className="text-lg font-bold fill-red-900">O</text>
        
        {/* الروابط المزدوجة */}
        <line x1="180" y1="175" x2="220" y2="175" stroke="#1F2937" strokeWidth="3" />
        <line x1="180" y1="185" x2="220" y2="185" stroke="#1F2937" strokeWidth="3" />
        <line x1="280" y1="175" x2="320" y2="175" stroke="#1F2937" strokeWidth="3" />
        <line x1="280" y1="185" x2="320" y2="185" stroke="#1F2937" strokeWidth="3" />
        
        <text x="250" y="250" textAnchor="middle" className="text-sm fill-slate-700">{labels.covalent}</text>
      </>
    );
  }

  return (
    <>
      <text x="250" y="200" textAnchor="middle" className="text-lg fill-slate-800">{labels.molecule}</text>
    </>
  );
}

// رسم الـ DNA
function DNADiagram({ language }: { language: string }) {
  const labels = {
    dna: language === "ar" ? "الحمض النووي (DNA)" : "DNA Double Helix",
    adenine: language === "ar" ? "أدينين" : "Adenine",
    thymine: language === "ar" ? "ثايمين" : "Thymine",
    guanine: language === "ar" ? "جوانين" : "Guanine",
    cytosine: language === "ar" ? "سيتوزين" : "Cytosine",
  };

  return (
    <>
      {/* حلزون DNA */}
      <text x="250" y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.dna}</text>
      
      {/* الشريط الأول */}
      <path d="M 150 60 Q 200 90 250 60 Q 300 30 350 60 Q 400 90 350 120 Q 300 150 250 120 Q 200 90 150 120 Q 100 150 150 180 Q 200 210 250 180 Q 300 150 350 180 Q 400 210 350 240 Q 300 270 250 240 Q 200 210 150 240 Q 100 270 150 300 Q 200 330 250 300 Q 300 270 350 300" fill="none" stroke="#3B82F6" strokeWidth="4" />
      
      {/* الشريط الثاني */}
      <path d="M 350 60 Q 300 90 250 60 Q 200 30 150 60 Q 100 90 150 120 Q 200 150 250 120 Q 300 90 350 120 Q 400 150 350 180 Q 300 210 250 180 Q 200 150 150 180 Q 100 210 150 240 Q 200 270 250 240 Q 300 210 350 240 Q 400 270 350 300 Q 300 330 250 300 Q 200 270 150 300" fill="none" stroke="#EF4444" strokeWidth="4" />
      
      {/* أزواج القواعد */}
      <line x1="175" y1="75" x2="225" y2="75" stroke="#10B981" strokeWidth="3" />
      <circle cx="175" cy="75" r="5" fill="#10B981" />
      <circle cx="225" cy="75" r="5" fill="#F59E0B" />
      
      <line x1="275" y1="75" x2="325" y2="75" stroke="#8B5CF6" strokeWidth="3" />
      <circle cx="275" cy="75" r="5" fill="#8B5CF6" />
      <circle cx="325" cy="75" r="5" fill="#EC4899" />
      
      <line x1="175" y1="135" x2="225" y2="135" stroke="#8B5CF6" strokeWidth="3" />
      <line x1="275" y1="135" x2="325" y2="135" stroke="#10B981" strokeWidth="3" />
      
      <line x1="175" y1="195" x2="225" y2="195" stroke="#10B981" strokeWidth="3" />
      <line x1="275" y1="195" x2="325" y2="195" stroke="#8B5CF6" strokeWidth="3" />
      
      <line x1="175" y1="255" x2="225" y2="255" stroke="#8B5CF6" strokeWidth="3" />
      <line x1="275" y1="255" x2="325" y2="255" stroke="#10B981" strokeWidth="3" />
      
      {/* مفتاح الألوان */}
      <rect x="30" y="340" width="12" height="12" fill="#10B981" rx="2" />
      <text x="48" y="350" className="text-xs fill-slate-700">A</text>
      
      <rect x="80" y="340" width="12" height="12" fill="#F59E0B" rx="2" />
      <text x="98" y="350" className="text-xs fill-slate-700">T</text>
      
      <rect x="130" y="340" width="12" height="12" fill="#8B5CF6" rx="2" />
      <text x="148" y="350" className="text-xs fill-slate-700">G</text>
      
      <rect x="180" y="340" width="12" height="12" fill="#EC4899" rx="2" />
      <text x="198" y="350" className="text-xs fill-slate-700">C</text>
      
      <text x="250" y="385" textAnchor="middle" className="text-sm fill-slate-600">A-T | G-C</text>
    </>
  );
}

// رسم البناء الضوئي
function PhotosynthesisDiagram({ language }: { language: string }) {
  const labels = {
    photosynthesis: language === "ar" ? "البناء الضوئي" : "Photosynthesis",
    sunlight: language === "ar" ? "ضوء الشمس" : "Sunlight",
    co2: language === "ar" ? "ثاني أكسيد الكربون" : "CO₂",
    water: language === "ar" ? "ماء" : "Water",
    oxygen: language === "ar" ? "أكسجين" : "O₂",
    glucose: language === "ar" ? "جلوكوز" : "Glucose",
    equation: language === "ar" ? "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂" : "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
  };

  return (
    <>
      <text x="250" y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.photosynthesis}</text>
      
      {/* الشمس */}
      <circle cx="150" cy="80" r="30" fill="#FCD34D" />
      <g stroke="#F59E0B" strokeWidth="3">
        <line x1="150" y1="40" x2="150" y2="25" />
        <line x1="180" y1="55" x2="195" y2="45" />
        <line x1="190" y1="80" x2="205" y2="80" />
        <line x1="180" y1="105" x2="195" y2="115" />
      </g>
      <text x="150" y="130" textAnchor="middle" className="text-xs fill-amber-700">{labels.sunlight}</text>
      
      {/* أ стрелs للشمس */}
      <path d="M 150 145 L 180 180 L 165 175 L 170 200 L 155 195 L 155 220" fill="none" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#arrowYellow)" />
      
      {/* الورقة */}
      <path d="M 150 220 Q 250 200 350 220 Q 350 280 250 300 Q 150 280 150 220 Z" fill="rgba(34, 197, 94, 0.5)" stroke="#22C55E" strokeWidth="2" />
      
      {/* CO2 يدخل */}
      <text x="80" y="200" className="text-sm fill-slate-700">CO₂</text>
      <path d="M 100 210 L 150 230" fill="none" stroke="#6B7280" strokeWidth="2" markerEnd="url(#arrowGray)" />
      
      {/* ماء يدخل */}
      <text x="80" y="280" className="text-sm fill-blue-600">H₂O</text>
      <path d="M 100 280 L 160 270" fill="none" stroke="#3B82F6" strokeWidth="2" />
      
      {/* أكسجين يخرج */}
      <text x="400" y="200" className="text-sm fill-red-600">O₂</text>
      <path d="M 350 230 L 390 210" fill="none" stroke="#EF4444" strokeWidth="2" />
      
      {/* جلوكوز يخرج */}
      <text x="400" y="280" className="text-sm fill-amber-700">C₆H₁₂O₆</text>
      <path d="M 350 270 L 390 270" fill="none" stroke="#F59E0B" strokeWidth="2" />
      
      {/* المعادلة */}
      <text x="250" y="350" textAnchor="middle" className="text-sm fill-slate-800">{labels.equation}</text>
      
      <text x="250" y="385" textAnchor="middle" className="text-sm fill-emerald-700">🌿 {language === "ar" ? "في البلاستيدات الخضراء" : "In Chloroplasts"}</text>
    </>
  );
}

// رسم القلب
function HeartDiagram({ language }: { language: string }) {
  const labels = {
    heart: language === "ar" ? "القلب" : "Human Heart",
    rightAtrium: language === "ar" ? "الأذين الأيمن" : "Right Atrium",
    leftAtrium: language === "ar" ? "الأذين الأيسر" : "Left Atrium",
    rightVentricle: language === "ar" ? "البطين الأيمن" : "Right Ventricle",
    leftVentricle: language === "ar" ? "البطين الأيسر" : "Left Ventricle",
    oxygenated: language === "ar" ? "دم مؤكسج" : "Oxygenated Blood",
    deoxygenated: language === "ar" ? "دم غير مؤكسج" : "Deoxygenated Blood",
  };

  return (
    <>
      <text x="250" y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.heart}</text>
      
      {/* شكل القلب */}
      <path d="M 250 100 Q 180 60 150 120 Q 120 180 180 240 Q 220 280 250 320 Q 280 280 320 240 Q 380 180 350 120 Q 320 60 250 100 Z" fill="rgba(239, 68, 68, 0.3)" stroke="#DC2626" strokeWidth="2" />
      
      {/* الأذين الأيمن */}
      <path d="M 160 120 Q 180 100 210 110 Q 230 130 220 160 L 180 170 Q 150 150 160 120 Z" fill="rgba(59, 130, 246, 0.4)" stroke="#3B82F6" strokeWidth="1.5" />
      <text x="185" y="145" className="text-xs fill-blue-900 text-center">{language === "ar" ? "أذين" : "R.A"}</text>
      
      {/* الأذين الأيسر */}
      <path d="M 280 110 Q 310 100 330 120 Q 340 150 310 170 L 270 160 Q 260 130 280 110 Z" fill="rgba(239, 68, 68, 0.4)" stroke="#EF4444" strokeWidth="1.5" />
      <text x="300" y="145" className="text-xs fill-red-900 text-center">{language === "ar" ? "أذين" : "L.A"}</text>
      
      {/* البطين الأيمن */}
      <path d="M 170 180 Q 200 200 220 250 Q 230 280 250 300 L 210 300 Q 180 280 170 240 Q 165 200 170 180 Z" fill="rgba(59, 130, 246, 0.3)" stroke="#3B82F6" strokeWidth="1.5" />
      <text x="195" y="250" className="text-xs fill-blue-900">{language === "ar" ? "بطين" : "R.V"}</text>
      
      {/* البطين الأيسر */}
      <path d="M 280 180 Q 310 200 320 240 Q 330 280 290 300 L 250 300 Q 260 280 260 250 Q 270 200 280 180 Z" fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="1.5" />
      <text x="295" y="250" className="text-xs fill-red-900">{language === "ar" ? "بطين" : "L.V"}</text>
      
      {/* الحاجز */}
      <line x1="250" y1="160" x2="250" y2="300" stroke="#1F2937" strokeWidth="2" />
      
      {/* مفتاح الألوان */}
      <rect x="30" y="340" width="15" height="15" fill="rgba(239, 68, 68, 0.4)" rx="2" />
      <text x="50" y="352" className="text-xs fill-slate-700">{labels.oxygenated}</text>
      
      <rect x="180" y="340" width="15" height="15" fill="rgba(59, 130, 246, 0.4)" rx="2" />
      <text x="200" y="352" className="text-xs fill-slate-700">{labels.deoxygenated}</text>
      
      <text x="250" y="385" textAnchor="middle" className="text-sm fill-slate-600">❤️</text>
    </>
  );
}

// رسم المجموعة الشمسية
function SolarSystemDiagram({ language }: { language: string }) {
  const labels = {
    solarSystem: language === "ar" ? "المجموعة الشمسية" : "Solar System",
    sun: language === "ar" ? "الشمس" : "Sun",
    mercury: language === "ar" ? "عطارد" : "Mercury",
    venus: language === "ar" ? "الزهرة" : "Venus",
    earth: language === "ar" ? "الأرض" : "Earth",
    mars: language === "ar" ? "المريخ" : "Mars",
    jupiter: language === "ar" ? "المشتري" : "Jupiter",
  };

  return (
    <>
      <text x="250" y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.solarSystem}</text>
      
      {/* الشمس */}
      <circle cx="250" cy="200" r="35" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
      <text x="250" y="205" textAnchor="middle" className="text-xs fill-amber-900">{labels.sun}</text>
      
      {/* المدارات */}
      {[70, 100, 130, 160, 210, 270].map((r, i) => (
        <circle key={i} cx="250" cy="200" r={r} fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3,3" />
      ))}
      
      {/* الكواكب */}
      <circle cx="320" cy="200" r="5" fill="#9CA3AF" />
      <circle cx="350" cy="200" r="7" fill="#FBBF24" />
      <circle cx="380" cy="200" r="8" fill="#3B82F6" />
      <circle cx="410" cy="200" r="6" fill="#EF4444" />
      <circle cx="460" cy="200" r="15" fill="#D97706" />
      
      {/* التسميات */}
      <text x="320" y="220" textAnchor="middle" className="text-xs fill-gray-600">{labels.mercury}</text>
      <text x="350" y="225" textAnchor="middle" className="text-xs fill-amber-600">{labels.venus}</text>
      <text x="380" y="228" textAnchor="middle" className="text-xs fill-blue-600">{labels.earth}</text>
      <text x="410" y="225" textAnchor="middle" className="text-xs fill-red-600">{labels.mars}</text>
      <text x="460" y="235" textAnchor="middle" className="text-xs fill-amber-700">{labels.jupiter}</text>
      
      <text x="250" y="385" textAnchor="middle" className="text-sm fill-slate-600">☀️🌍</text>
    </>
  );
}

// رسم السلسلة الغذائية
function FoodChainDiagram({ language }: { language: string }) {
  const labels = {
    foodChain: language === "ar" ? "السلسلة الغذائية" : "Food Chain",
    producer: language === "ar" ? "منتج" : "Producer",
    consumer: language === "ar" ? "مستهلك" : "Consumer",
    decomposer: language === "ar" ? "محلل" : "Decomposer",
  };

  return (
    <>
      <text x="250" y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.foodChain}</text>
      
      {/* المنتج (نبات) */}
      <circle cx="80" cy="180" r="40" fill="rgba(34, 197, 94, 0.3)" stroke="#22C55E" strokeWidth="2" />
      <text x="80" y="175" textAnchor="middle" className="text-3xl">🌱</text>
      <text x="80" y="235" textAnchor="middle" className="text-xs fill-green-700">{labels.producer}</text>
      
      {/* سهم */}
      <path d="M 125 180 L 165 180" fill="none" stroke="#1F2937" strokeWidth="2" markerEnd="url(#arrow)" />
      
      {/* المستهلك الأول (أرنب) */}
      <circle cx="210" cy="180" r="35" fill="rgba(245, 158, 11, 0.3)" stroke="#F59E0B" strokeWidth="2" />
      <text x="210" y="185" textAnchor="middle" className="text-2xl">🐰</text>
      <text x="210" y="230" textAnchor="middle" className="text-xs fill-amber-700">{labels.consumer} 1</text>
      
      {/* سهم */}
      <path d="M 250 180 L 290 180" fill="none" stroke="#1F2937" strokeWidth="2" />
      
      {/* المستهلك الثاني (ثعلب) */}
      <circle cx="330" cy="180" r="35" fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="2" />
      <text x="330" y="185" textAnchor="middle" className="text-2xl">🦊</text>
      <text x="330" y="230" textAnchor="middle" className="text-xs fill-red-700">{labels.consumer} 2</text>
      
      {/* سهم */}
      <path d="M 370 180 L 410 180" fill="none" stroke="#1F2937" strokeWidth="2" />
      
      {/* المستهلك الثالث (أسد) */}
      <circle cx="450" cy="180" r="35" fill="rgba(139, 92, 246, 0.3)" stroke="#8B5CF6" strokeWidth="2" />
      <text x="450" y="185" textAnchor="middle" className="text-2xl">🦁</text>
      <text x="450" y="230" textAnchor="middle" className="text-xs fill-purple-700">{labels.consumer} 3</text>
      
      {/* المحلل */}
      <circle cx="250" cy="320" r="30" fill="rgba(107, 114, 128, 0.3)" stroke="#6B7280" strokeWidth="2" />
      <text x="250" y="325" textAnchor="middle" className="text-xl">🍄</text>
      <text x="250" y="365" textAnchor="middle" className="text-xs fill-gray-700">{labels.decomposer}</text>
      
      {/* أسهم للمحلل */}
      <path d="M 250 260 L 250 285" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeDasharray="5,5" />
      
      <text x="250" y="385" textAnchor="middle" className="text-sm fill-slate-600">🌱 → 🐰 → 🦊 → 🦁 → 🍄</text>
    </>
  );
}

// رسم دورة الماء
function WaterCycleDiagram({ language }: { language: string }) {
  const labels = {
    waterCycle: language === "ar" ? "دورة الماء" : "Water Cycle",
    evaporation: language === "ar" ? "التبخر" : "Evaporation",
    condensation: language === "ar" ? "التكاثف" : "Condensation",
    precipitation: language === "ar" ? "الهطول" : "Precipitation",
    collection: language === "ar" ? "التجمع" : "Collection",
  };

  return (
    <>
      <text x="250" y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.waterCycle}</text>
      
      {/* الشمس */}
      <circle cx="100" cy="70" r="25" fill="#FCD34D" />
      <text x="100" y="110" textAnchor="middle" className="text-xs fill-amber-700">☀️</text>
      
      {/* البحر */}
      <path d="M 50 320 Q 100 310 150 320 Q 200 330 250 320 Q 300 310 350 320 Q 400 330 450 320 L 450 350 L 50 350 Z" fill="rgba(59, 130, 246, 0.4)" stroke="#3B82F6" strokeWidth="1" />
      <text x="250" y="345" textAnchor="middle" className="text-sm fill-blue-700">{labels.collection}</text>
      
      {/* السحاب */}
      <ellipse cx="350" cy="80" rx="60" ry="30" fill="rgba(156, 163, 175, 0.5)" />
      <ellipse cx="320" cy="70" rx="40" ry="25" fill="rgba(156, 163, 175, 0.6)" />
      <ellipse cx="380" cy="75" rx="35" ry="20" fill="rgba(156, 163, 175, 0.5)" />
      <text x="350" y="85" textAnchor="middle" className="text-xs fill-gray-700">{labels.condensation}</text>
      
      {/* التبخر */}
      <path d="M 200 300 Q 220 250 250 200 Q 280 150 320 100" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="5,5" />
      <text x="280" y="180" className="text-xs fill-blue-600">{labels.evaporation}</text>
      
      {/* المطر */}
      <line x1="300" y1="120" x2="290" y2="160" stroke="#3B82F6" strokeWidth="2" />
      <line x1="320" y1="115" x2="310" y2="155" stroke="#3B82F6" strokeWidth="2" />
      <line x1="340" y1="120" x2="330" y2="160" stroke="#3B82F6" strokeWidth="2" />
      <line x1="360" y1="115" x2="350" y2="155" stroke="#3B82F6" strokeWidth="2" />
      <text x="330" y="180" textAnchor="middle" className="text-xs fill-blue-600">{labels.precipitation}</text>
      
      {/* الجبل */}
      <polygon points="100,320 150,200 200,320" fill="rgba(139, 92, 246, 0.3)" stroke="#8B5CF6" strokeWidth="1" />
      
      {/* تدفق المياه */}
      <path d="M 150 320 Q 170 340 200 340 Q 230 340 260 335" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
      
      <text x="250" y="385" textAnchor="middle" className="text-sm fill-slate-600">💧 ☀️ ☁️ 🌧️ 💧</text>
    </>
  );
}

// رسم الجهاز الهضمي
function DigestiveDiagram({ language }: { language: string }) {
  const labels = {
    digestive: language === "ar" ? "الجهاز الهضمي" : "Digestive System",
    mouth: language === "ar" ? "الفم" : "Mouth",
    esophagus: language === "ar" ? "المريء" : "Esophagus",
    stomach: language === "ar" ? "المعدة" : "Stomach",
    smallIntestine: language === "ar" ? "الأمعاء الدقيقة" : "Small Intestine",
    largeIntestine: language === "ar" ? "الأمعاء الغليظة" : "Large Intestine",
  };

  return (
    <>
      <text x="250" y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.digestive}</text>
      
      {/* الفم */}
      <ellipse cx="250" cy="70" rx="30" ry="20" fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="1.5" />
      <text x="250" y="75" textAnchor="middle" className="text-xs fill-red-800">{labels.mouth}</text>
      
      {/* المريء */}
      <rect x="245" y="90" width="10" height="60" fill="rgba(245, 158, 11, 0.3)" stroke="#F59E0B" strokeWidth="1" rx="5" />
      <text x="270" y="120" className="text-xs fill-amber-700">{labels.esophagus}</text>
      
      {/* المعدة */}
      <ellipse cx="250" cy="190" rx="50" ry="35" fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="1.5" />
      <text x="250" y="195" textAnchor="middle" className="text-xs fill-red-800">{labels.stomach}</text>
      
      {/* الأمعاء الدقيقة */}
      <path d="M 220 225 Q 200 250 220 270 Q 240 290 220 310 Q 200 330 220 350 Q 240 370 260 350 Q 280 330 260 310 Q 240 290 260 270 Q 280 250 260 230" fill="none" stroke="#F59E0B" strokeWidth="4" />
      <text x="300" y="300" className="text-xs fill-amber-700">{labels.smallIntestine}</text>
      
      {/* الأمعاء الغليظة */}
      <path d="M 180 230 Q 150 250 150 290 Q 150 330 180 350 Q 220 370 280 370 Q 320 360 340 330 Q 350 290 340 250 Q 320 220 280 230" fill="none" stroke="#DC2626" strokeWidth="6" />
      <text x="100" y="300" className="text-xs fill-red-700">{labels.largeIntestine}</text>
      
      <text x="250" y="385" textAnchor="middle" className="text-sm fill-slate-600">🍽️ → 🔽 → 🟤</text>
    </>
  );
}

// مكون لعرض مجموعة رسومات علمية
export function ScienceDiagramsGrid({ diagrams, language = "ar" }: { 
  diagrams: Array<{ type: ScienceDiagramProps["type"]; params?: Record<string, string | number> }>;
  language?: "ar" | "en";
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {diagrams.map((diagram, index) => (
        <ScienceDiagram
          key={index}
          type={diagram.type}
          params={diagram.params}
          language={language}
        />
      ))}
    </div>
  );
}

export default ScienceDiagram;
