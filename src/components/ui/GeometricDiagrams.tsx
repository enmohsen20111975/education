"use client";

import { useMemo } from "react";

interface GeometricDiagramsProps {
  type: "triangle" | "circle" | "rectangle" | "polygon" | "pythagorean" | "angles" | "vectors" | "trigonometry" | "area" | "volume";
  params?: Record<string, number>;
  language?: "ar" | "en";
  className?: string;
}

// رسومات هندسية SVG تفاعلية
export function GeometricDiagram({ type, params = {}, language = "ar", className = "" }: GeometricDiagramsProps) {
  const diagram = useMemo(() => {
    switch (type) {
      case "triangle":
        return <TriangleDiagram params={params} language={language} />;
      case "circle":
        return <CircleDiagram params={params} language={language} />;
      case "rectangle":
        return <RectangleDiagram params={params} language={language} />;
      case "polygon":
        return <PolygonDiagram params={params} language={language} />;
      case "pythagorean":
        return <PythagoreanDiagram params={params} language={language} />;
      case "angles":
        return <AnglesDiagram params={params} language={language} />;
      case "vectors":
        return <VectorsDiagram params={params} language={language} />;
      case "trigonometry":
        return <TrigonometryDiagram params={params} language={language} />;
      case "area":
        return <AreaDiagram params={params} language={language} />;
      case "volume":
        return <VolumeDiagram params={params} language={language} />;
      default:
        return <TriangleDiagram params={params} language={language} />;
    }
  }, [type, params, language]);

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 ${className}`}>
      <svg viewBox="0 0 400 300" className="w-full h-auto">
        {diagram}
      </svg>
    </div>
  );
}

// رسم المثلث
function TriangleDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const a = params.a || 100;
  const b = params.b || 150;
  const angle = params.angle || 60;
  
  const rad = (angle * Math.PI) / 180;
  const px2 = 200 + b * Math.cos(rad);
  const py2 = 250 - b * Math.sin(rad);
  
  const height = a * Math.sin(rad);
  const area = 0.5 * a * height;
  
  const labels = {
    triangle: language === "ar" ? "مثلث" : "Triangle",
    base: language === "ar" ? "القاعدة" : "Base",
    height: language === "ar" ? "الارتفاع" : "Height",
    area: language === "ar" ? "المساحة" : "Area",
  };

  return (
    <>
      {/* المثلث */}
      <polygon
        points={`200,250 ${200 + a},250 ${px2},${py2}`}
        fill="rgba(59, 130, 246, 0.2)"
        stroke="#3B82F6"
        strokeWidth="2"
      />
      {/* خط الارتفاع */}
      <line x1={200 + a/2} y1="250" x2={200 + a/2} y2={250 - height} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5,5" />
      {/* الزوايا */}
      <path d="M 210,250 A 10,10 0 0 1 210,240" fill="none" stroke="#10B981" strokeWidth="1.5" />
      {/* التسميات */}
      <text x={200 + a/2} y="270" textAnchor="middle" className="text-sm fill-slate-700 dark:fill-slate-300">{labels.base}: {a}</text>
      <text x={180 + a/2} y={250 - height/2} textAnchor="middle" className="text-sm fill-red-500">{labels.height}: {height.toFixed(1)}</text>
      <text x={100} y="30" textAnchor="start" className="text-base font-bold fill-slate-800 dark:fill-slate-200">{labels.area}: {area.toFixed(1)}</text>
    </>
  );
}

// رسم الدائرة
function CircleDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const r = params.r || 80;
  const cx = 200;
  const cy = 150;
  
  const circumference = 2 * Math.PI * r;
  const area = Math.PI * r * r;
  
  const labels = {
    circle: language === "ar" ? "دائرة" : "Circle",
    radius: language === "ar" ? "نصف القطر" : "Radius",
    diameter: language === "ar" ? "القطر" : "Diameter",
    circumference: language === "ar" ? "محيط الدائرة" : "Circumference",
    area: language === "ar" ? "المساحة" : "Area",
  };

  return (
    <>
      {/* الدائرة */}
      <circle cx={cx} cy={cy} r={r} fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2" />
      {/* نصف القطر */}
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#3B82F6" strokeWidth="2" />
      {/* القطر */}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5,5" />
      {/* المركز */}
      <circle cx={cx} cy={cy} r="3" fill="#1F2937" />
      {/* التسميات */}
      <text x={cx + r/2} y={cy - 10} textAnchor="middle" className="text-sm fill-blue-500">{labels.radius}: {r}</text>
      <text x={cx} y={cy + r + 20} textAnchor="middle" className="text-sm fill-red-500">{labels.diameter}: {r * 2}</text>
      <text x={20} y="30" className="text-sm fill-slate-700 dark:fill-slate-300">{labels.circumference}: {circumference.toFixed(1)}</text>
      <text x={20} y="50" className="text-sm fill-slate-700 dark:fill-slate-300">{labels.area}: {area.toFixed(1)}</text>
    </>
  );
}

// رسم المستطيل
function RectangleDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const width = params.width || 150;
  const height = params.height || 100;
  const x = 200 - width/2;
  const y = 150 - height/2;
  
  const perimeter = 2 * (width + height);
  const area = width * height;
  const diagonal = Math.sqrt(width * width + height * height);
  
  const labels = {
    rectangle: language === "ar" ? "مستطيل" : "Rectangle",
    width: language === "ar" ? "العرض" : "Width",
    height: language === "ar" ? "الطول" : "Height",
    diagonal: language === "ar" ? "القطر" : "Diagonal",
    perimeter: language === "ar" ? "المحيط" : "Perimeter",
    area: language === "ar" ? "المساحة" : "Area",
  };

  return (
    <>
      {/* المستطيل */}
      <rect x={x} y={y} width={width} height={height} fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth="2" />
      {/* القطر */}
      <line x1={x} y1={y} x2={x + width} y2={y + height} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5,5" />
      {/* التسميات */}
      <text x={200} y={y + height + 20} textAnchor="middle" className="text-sm fill-slate-700">{labels.width}: {width}</text>
      <text x={x - 10} y={y + height/2} textAnchor="end" className="text-sm fill-slate-700">{labels.height}: {height}</text>
      <text x={20} y="30" className="text-sm fill-slate-700">{labels.perimeter}: {perimeter}</text>
      <text x={20} y="50" className="text-sm fill-slate-700">{labels.area}: {area}</text>
      <text x={20} y="70" className="text-sm fill-red-500">{labels.diagonal}: {diagonal.toFixed(1)}</text>
    </>
  );
}

// رسم المضلع
function PolygonDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const sides = params.sides || 6;
  const r = params.r || 80;
  const cx = 200;
  const cy = 150;
  
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  
  const interiorAngle = ((sides - 2) * 180) / sides;
  const exteriorAngle = 360 / sides;
  
  const labels = {
    polygon: language === "ar" ? "مضلع" : "Polygon",
    sides: language === "ar" ? "الأضلاع" : "Sides",
    interiorAngle: language === "ar" ? "الزاوية الداخلية" : "Interior Angle",
    exteriorAngle: language === "ar" ? "الزاوية الخارجية" : "Exterior Angle",
  };

  return (
    <>
      {/* المضلع */}
      <polygon
        points={points.join(" ")}
        fill="rgba(139, 92, 246, 0.2)"
        stroke="#8B5CF6"
        strokeWidth="2"
      />
      {/* المركز */}
      <circle cx={cx} cy={cy} r="3" fill="#1F2937" />
      {/* خطوط من المركز للرؤوس */}
      {points.map((p, i) => {
        const [px, py] = p.split(",");
        return <line key={i} x1={cx} y1={cy} x2={px} y2={py} stroke="#8B5CF6" strokeWidth="0.5" strokeDasharray="3,3" />;
      })}
      {/* التسميات */}
      <text x={20} y="30" className="text-sm fill-slate-700">{labels.sides}: {sides}</text>
      <text x={20} y="50" className="text-sm fill-slate-700">{labels.interiorAngle}: {interiorAngle}°</text>
      <text x={20} y="70" className="text-sm fill-slate-700">{labels.exteriorAngle}: {exteriorAngle}°</text>
    </>
  );
}

// نظرية فيثاغورس
function PythagoreanDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const a = params.a || 60;
  const b = params.b || 80;
  const c = Math.sqrt(a * a + b * b);
  
  const x1 = 150, y1 = 200;
  const x2 = x1 + a, y2 = y1;
  const x3 = x1, y3 = y1 - b;
  
  const labels = {
    pythagorean: language === "ar" ? "نظرية فيثاغورس" : "Pythagorean Theorem",
    formula: language === "ar" ? `أ² + ب² = ج²` : `a² + b² = c²`,
    a: language === "ar" ? "أ" : "a",
    b: language === "ar" ? "ب" : "b",
    c: language === "ar" ? "ج" : "c",
  };

  return (
    <>
      {/* المثلث القائم */}
      <polygon
        points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
        fill="rgba(59, 130, 246, 0.2)"
        stroke="#3B82F6"
        strokeWidth="2"
      />
      {/* مربع على الضلع أ */}
      <rect x={x2} y={y1 - a} width={a} height={a} fill="rgba(239, 68, 68, 0.2)" stroke="#EF4444" strokeWidth="1.5" />
      {/* مربع على الضلع ب */}
      <rect x={x1 - b} y={y3 - b} width={b} height={b} fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="1.5" />
      {/* زاوية قائمة */}
      <rect x={x1} y={y1 - 15} width="15" height="15" fill="none" stroke="#1F2937" strokeWidth="1" />
      {/* التسميات */}
      <text x={(x1 + x2)/2} y={y1 + 20} textAnchor="middle" className="text-sm fill-red-500">{labels.a} = {a}</text>
      <text x={x1 - 20} y={(y1 + y3)/2} textAnchor="end" className="text-sm fill-green-500">{labels.b} = {b}</text>
      <text x={(x2 + x3)/2 + 20} y={(y2 + y3)/2 - 10} textAnchor="start" className="text-sm fill-blue-500">{labels.c} = {c.toFixed(1)}</text>
      {/* الصيغة */}
      <text x={200} y="30" textAnchor="middle" className="text-lg font-bold fill-slate-800">{labels.formula}</text>
      <text x={200} y="50" textAnchor="middle" className="text-sm fill-slate-600">{a}² + {b}² = {c.toFixed(1)}²</text>
    </>
  );
}

// الزوايا
function AnglesDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const angle1 = params.angle1 || 45;
  const angle2 = params.angle2 || 60;
  const angle3 = 180 - angle1 - angle2;
  
  const cx = 200, cy = 150;
  const r = 80;
  
  const labels = {
    angles: language === "ar" ? "الزوايا" : "Angles",
    complementary: language === "ar" ? "زوايا متتمة" : "Complementary",
    supplementary: language === "ar" ? "زوايا متكاملة" : "Supplementary",
    sum: language === "ar" ? "المجموع" : "Sum",
  };

  return (
    <>
      {/* خط الأفق */}
      <line x1="50" y1={cy} x2="350" y2={cy} stroke="#1F2937" strokeWidth="2" />
      {/* خط الزاوية الأولى */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke="#3B82F6" strokeWidth="2" />
      {/* خط الزاوية الثانية */}
      <line x1={cx} y1={cy} x2={cx + r * Math.cos(Math.PI - angle1 * Math.PI/180)} y2={cy - r * Math.sin(Math.PI - angle1 * Math.PI/180)} stroke="#10B981" strokeWidth="2" />
      {/* قوس الزاوية الأولى */}
      <path d={`M ${cx + 20} ${cy} A 20,20 0 0 1 ${cx + 20 * Math.cos((90 - angle1) * Math.PI/180)} ${cy - 20 * Math.sin((90 - angle1) * Math.PI/180)}`} fill="none" stroke="#3B82F6" strokeWidth="1.5" />
      {/* التسميات */}
      <text x={cx + 30} y={cy - 10} className="text-sm fill-blue-500">{angle1}°</text>
      <text x={cx - 40} y={cy + 20} className="text-sm fill-green-500">{angle2}°</text>
      <text x={20} y="30" className="text-sm fill-slate-700">{labels.sum}: 180°</text>
    </>
  );
}

// المتجهات
function VectorsDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const ax = params.ax || 3;
  const ay = params.ay || 4;
  const bx = params.bx || -2;
  const by = params.by || 3;
  
  const scale = 30;
  const cx = 200, cy = 200;
  
  const magA = Math.sqrt(ax * ax + ay * ay);
  const magB = Math.sqrt(bx * bx + by * by);
  const dotProduct = ax * bx + ay * by;
  
  const labels = {
    vectors: language === "ar" ? "المتجهات" : "Vectors",
    vectorA: language === "ar" ? "المتجه أ" : "Vector A",
    vectorB: language === "ar" ? "المتجه ب" : "Vector B",
    magnitude: language === "ar" ? "المقدار" : "Magnitude",
    dotProduct: language === "ar" ? "الجداء السلمي" : "Dot Product",
  };

  return (
    <>
      {/* المحاور */}
      <line x1="50" y1={cy} x2="350" y2={cy} stroke="#E5E7EB" strokeWidth="1" />
      <line x1={cx} y1="50" x2={cx} y2="280" stroke="#E5E7EB" strokeWidth="1" />
      {/* المتجه أ */}
      <line x1={cx} y1={cy} x2={cx + ax * scale} y2={cy - ay * scale} stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowBlue)" />
      <circle cx={cx + ax * scale} cy={cy - ay * scale} r="4" fill="#3B82F6" />
      {/* المتجه ب */}
      <line x1={cx} y1={cy} x2={cx + bx * scale} y2={cy - by * scale} stroke="#EF4444" strokeWidth="3" />
      <circle cx={cx + bx * scale} cy={cy - by * scale} r="4" fill="#EF4444" />
      {/* المقياس */}
      <text x={20} y="30" className="text-sm fill-blue-500">{labels.vectorA}: ({ax}, {ay}) |{labels.magnitude}| = {magA.toFixed(1)}</text>
      <text x={20} y="50" className="text-sm fill-red-500">{labels.vectorB}: ({bx}, {by}) |{labels.magnitude}| = {magB.toFixed(1)}</text>
      <text x={20} y="70" className="text-sm fill-slate-700">{labels.dotProduct}: {dotProduct}</text>
    </>
  );
}

// علم المثلثات
function TrigonometryDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const angle = params.angle || 30;
  const rad = (angle * Math.PI) / 180;
  
  const cx = 200, cy = 200;
  const r = 100;
  
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.tan(rad);
  
  const labels = {
    trigonometry: language === "ar" ? "علم المثلثات" : "Trigonometry",
    sin: "sin",
    cos: "cos",
    tan: "tan",
    angle: language === "ar" ? "الزاوية" : "Angle",
  };

  return (
    <>
      {/* دائرة الوحدة */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth="1" />
      {/* المحاور */}
      <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="#1F2937" strokeWidth="1" />
      <line x1={cx} y1={cy + r + 20} x2={cx} y2={cy - r - 20} stroke="#1F2937" strokeWidth="1" />
      {/* خط الجيب */}
      <line x1={cx + r * cosVal} y1={cy} x2={cx + r * cosVal} y2={cy - r * sinVal} stroke="#EF4444" strokeWidth="2" />
      {/* خط جيب التمام */}
      <line x1={cx} y1={cy} x2={cx + r * cosVal} y2={cy} stroke="#3B82F6" strokeWidth="2" />
      {/* نصف القطر */}
      <line x1={cx} y1={cy} x2={cx + r * cosVal} y2={cy - r * sinVal} stroke="#10B981" strokeWidth="2" />
      {/* قوس الزاوية */}
      <path d={`M ${cx + 30} ${cy} A 30,30 0 0 1 ${cx + 30 * cosVal} ${cy - 30 * sinVal}`} fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
      {/* التسميات */}
      <text x={cx + r * cosVal + 5} y={cy - r * sinVal/2} className="text-sm fill-red-500">sin = {sinVal.toFixed(2)}</text>
      <text x={cx + r * cosVal/2} y={cy + 20} className="text-sm fill-blue-500">cos = {cosVal.toFixed(2)}</text>
      <text x={cx + 40} y={cy - 5} className="text-sm fill-purple-500">{angle}°</text>
      <text x={20} y="30" className="text-sm fill-slate-700">tan = {tanVal.toFixed(2)}</text>
    </>
  );
}

// المساحة
function AreaDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const shape = params.shape || "composite";
  
  const labels = {
    area: language === "ar" ? "المساحة" : "Area",
    formula: language === "ar" ? "القانون" : "Formula",
  };

  return (
    <>
      {/* شكل مركب */}
      <rect x="100" y="100" width="100" height="80" fill="rgba(59, 130, 246, 0.3)" stroke="#3B82F6" strokeWidth="2" />
      <rect x="200" y="100" width="60" height="60" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="2" />
      <polygon points="160,100 200,60 240,100" fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="2" />
      {/* الأبعاد */}
      <text x="150" y="200" textAnchor="middle" className="text-xs fill-blue-500">100 × 80</text>
      <text x="230" y="180" textAnchor="middle" className="text-xs fill-green-500">60 × 60</text>
      <text x={20} y="30" className="text-sm fill-slate-700">{labels.area} = 8000 + 3600 + 1200 = 12800</text>
    </>
  );
}

// الحجم
function VolumeDiagram({ params, language }: { params: Record<string, number>; language: string }) {
  const type = params.volumeType || "cube";
  
  const labels = {
    volume: language === "ar" ? "الحجم" : "Volume",
    cube: language === "ar" ? "مكعب" : "Cube",
    cylinder: language === "ar" ? "أسطوانة" : "Cylinder",
    sphere: language === "ar" ? "كرة" : "Sphere",
  };

  return (
    <>
      {/* مكعب ثلاثي الأبعاد */}
      <g transform="translate(150, 50)">
        {/* الوجه الأمامي */}
        <rect x="0" y="60" width="100" height="100" fill="rgba(59, 130, 246, 0.3)" stroke="#3B82F6" strokeWidth="2" />
        {/* الوجه العلوي */}
        <polygon points="0,60 40,20 140,20 100,60" fill="rgba(59, 130, 246, 0.5)" stroke="#3B82F6" strokeWidth="2" />
        {/* الوجه الجانبي */}
        <polygon points="100,60 140,20 140,120 100,160" fill="rgba(59, 130, 246, 0.4)" stroke="#3B82F6" strokeWidth="2" />
        {/* الأبعاد */}
        <text x="50" y="180" textAnchor="middle" className="text-xs fill-slate-700">a = 10</text>
      </g>
      {/* الصيغة */}
      <text x={200} y="30" textAnchor="middle" className="text-sm fill-slate-800">V = a³ = 10³ = 1000</text>
    </>
  );
}

// مكون لعرض مجموعة رسومات
export function GeometricDiagramsGrid({ diagrams, language = "ar" }: { 
  diagrams: Array<{ type: GeometricDiagramsProps["type"]; params?: Record<string, number> }>;
  language?: "ar" | "en";
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {diagrams.map((diagram, index) => (
        <GeometricDiagram
          key={index}
          type={diagram.type}
          params={diagram.params}
          language={language}
        />
      ))}
    </div>
  );
}

export default GeometricDiagram;
