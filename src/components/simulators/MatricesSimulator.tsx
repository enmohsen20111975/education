"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Grid3X3, RotateCcw, Play, Plus, Minus, X, Divide, ArrowRight } from "lucide-react";

interface MatricesSimulatorProps {
  language: "ar" | "en";
}

type Operation = "add" | "subtract" | "multiply" | "determinant" | "inverse";

export function MatricesSimulator({ language }: MatricesSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix A (2x2)
  const [matrixA, setMatrixA] = useState([
    [1, 2],
    [3, 4],
  ]);

  // Matrix B (2x2)
  const [matrixB, setMatrixB] = useState([
    [5, 6],
    [7, 8],
  ]);

  const [operation, setOperation] = useState<Operation>("add");
  const [showResult, setShowResult] = useState(false);
  const [scalar, setScalar] = useState(2);

  // Text translations
  const texts = {
    ar: {
      title: "محاكي المصفوفات",
      description: "تعلم العمليات على المصفوفات",
      matrixA: "المصفوفة أ",
      matrixB: "المصفوفة ب",
      result: "النتيجة",
      addition: "الجمع",
      subtraction: "الطرح",
      multiplication: "الضرب",
      determinant: "المحدد",
      inverse: "المعكوس",
      calculate: "احسب",
      reset: "إعادة",
      enterValue: "أدخل القيم",
      operations: "العمليات",
      properties: "خصائص المصفوفات",
      notInvertible: "المصفوفة غير قابلة للعكس (المحدد = 0)",
      determinantValue: "قيمة المحدد",
      scalarMultiply: "الضرب في عدد",
      scalarValue: "القيمة",
      rows: "الصفوف",
      columns: "الأعمدة",
      interpretation: "التفسير الرياضي",
    },
    en: {
      title: "Matrices Simulator",
      description: "Learn matrix operations",
      matrixA: "Matrix A",
      matrixB: "Matrix B",
      result: "Result",
      addition: "Addition",
      subtraction: "Subtraction",
      multiplication: "Multiplication",
      determinant: "Determinant",
      inverse: "Inverse",
      calculate: "Calculate",
      reset: "Reset",
      enterValue: "Enter Values",
      operations: "Operations",
      properties: "Matrix Properties",
      notInvertible: "Matrix is not invertible (determinant = 0)",
      determinantValue: "Determinant Value",
      scalarMultiply: "Scalar Multiplication",
      scalarValue: "Value",
      rows: "Rows",
      columns: "Columns",
      interpretation: "Mathematical Interpretation",
    },
  };

  const t = texts[language];

  // Calculate determinant of 2x2 matrix
  const determinant2x2 = (m: number[][]): number => {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  };

  // Calculate inverse of 2x2 matrix
  const inverse2x2 = (m: number[][]): number[][] | null => {
    const det = determinant2x2(m);
    if (det === 0) return null;

    return [
      [m[1][1] / det, -m[0][1] / det],
      [-m[1][0] / det, m[0][0] / det],
    ];
  };

  // Matrix operations
  const getResult = useCallback(() => {
    switch (operation) {
      case "add":
        return [
          [matrixA[0][0] + matrixB[0][0], matrixA[0][1] + matrixB[0][1]],
          [matrixA[1][0] + matrixB[1][0], matrixA[1][1] + matrixB[1][1]],
        ];
      case "subtract":
        return [
          [matrixA[0][0] - matrixB[0][0], matrixA[0][1] - matrixB[0][1]],
          [matrixA[1][0] - matrixB[1][0], matrixA[1][1] - matrixB[1][1]],
        ];
      case "multiply":
        return [
          [
            matrixA[0][0] * matrixB[0][0] + matrixA[0][1] * matrixB[1][0],
            matrixA[0][0] * matrixB[0][1] + matrixA[0][1] * matrixB[1][1],
          ],
          [
            matrixA[1][0] * matrixB[0][0] + matrixA[1][1] * matrixB[1][0],
            matrixA[1][0] * matrixB[0][1] + matrixA[1][1] * matrixB[1][1],
          ],
        ];
      case "determinant":
        return determinant2x2(matrixA);
      case "inverse":
        return inverse2x2(matrixA);
      default:
        return null;
    }
  }, [operation, matrixA, matrixB]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Helper function to draw matrix
    const drawMatrix = (
      matrix: number[][],
      x: number,
      y: number,
      label: string,
      color: string
    ) => {
      const cellWidth = 60;
      const cellHeight = 40;
      const rows = matrix.length;
      const cols = matrix[0]?.length || 1;

      // Bracket
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;

      // Left bracket
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 10, y);
      ctx.lineTo(x - 10, y + rows * cellHeight);
      ctx.lineTo(x, y + rows * cellHeight);
      ctx.stroke();

      // Right bracket
      const rightX = x + cols * cellWidth;
      ctx.beginPath();
      ctx.moveTo(rightX, y);
      ctx.lineTo(rightX + 10, y);
      ctx.lineTo(rightX + 10, y + rows * cellHeight);
      ctx.lineTo(rightX, y + rows * cellHeight);
      ctx.stroke();

      // Values
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "center";

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const val = matrix[i]?.[j];
          const cellX = x + j * cellWidth + cellWidth / 2;
          const cellY = y + i * cellHeight + cellHeight / 2 + 6;
          ctx.fillText(
            val !== undefined ? val.toFixed(2) : "?",
            cellX,
            cellY
          );
        }
      }

      // Label
      ctx.fillStyle = color;
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(label, x + (cols * cellWidth) / 2, y - 15);
    };

    // Draw matrices
    const startY = 100;

    // Matrix A
    drawMatrix(matrixA, 50, startY, t.matrixA, "#3b82f6");

    // Operation symbol
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 30px system-ui";
    ctx.textAlign = "center";
    const opSymbol =
      operation === "add" ? "+" :
      operation === "subtract" ? "-" :
      operation === "multiply" ? "×" :
      operation === "determinant" ? "det" :
      operation === "inverse" ? "⁻¹" : "?";
    ctx.fillText(opSymbol, 200, startY + 50);

    // Matrix B (for binary operations)
    if (["add", "subtract", "multiply"].includes(operation)) {
      drawMatrix(matrixB, 240, startY, t.matrixB, "#22c55e");
    }

    // Equals sign
    if (showResult) {
      ctx.fillText("=", 400, startY + 50);

      // Result
      const result = getResult();
      if (result !== null) {
        if (operation === "determinant") {
          // Single value result
          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 24px system-ui";
          ctx.fillText(`= ${(result as number).toFixed(2)}`, 440, startY + 50);
        } else if (operation === "inverse" && result === null) {
          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 14px system-ui";
          ctx.fillText(t.notInvertible, 440, startY + 50);
        } else {
          drawMatrix(result as number[][], 440, startY, t.result, "#ef4444");
        }
      }
    }

    // Operation explanation
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui";
    ctx.textAlign = "left";
    
    const explanation = language === "ar"
      ? getExplanationAr()
      : getExplanationEn();
    
    ctx.fillText(explanation, 50, height - 40);

  }, [matrixA, matrixB, operation, showResult, getResult, t, language]);

  // Get explanation in Arabic
  const getExplanationAr = () => {
    switch (operation) {
      case "add":
        return "جمع المصفوفات: نجمع العناصر المتناظرة";
      case "subtract":
        return "طرح المصفوفات: نطرح العناصر المتناظرة";
      case "multiply":
        return "ضرب المصفوفات: مجموع حاصل ضرب الصفوف بالأعمدة";
      case "determinant":
        return `المحدد = أ₁₁×أ₂₂ - أ₁₂×أ₂₁ = ${determinant2x2(matrixA).toFixed(2)}`;
      case "inverse":
        const det = determinant2x2(matrixA);
        return det === 0 ? "المصفوفة غير قابلة للعكس" : `المعكوس = (1/${det.toFixed(2)}) × [مصفوفة المرافقات]`;
      default:
        return "";
    }
  };

  // Get explanation in English
  const getExplanationEn = () => {
    switch (operation) {
      case "add":
        return "Matrix addition: Add corresponding elements";
      case "subtract":
        return "Matrix subtraction: Subtract corresponding elements";
      case "multiply":
        return "Matrix multiplication: Sum of row × column products";
      case "determinant":
        return `Determinant = a₁₁×a₂₂ - a₁₂×a₂₁ = ${determinant2x2(matrixA).toFixed(2)}`;
      case "inverse":
        const det = determinant2x2(matrixA);
        return det === 0 ? "Matrix is not invertible" : `Inverse = (1/${det.toFixed(2)}) × [adjugate matrix]`;
      default:
        return "";
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Update matrix value
  const updateMatrixValue = (
    matrix: "A" | "B",
    row: number,
    col: number,
    value: number
  ) => {
    if (matrix === "A") {
      const newMatrix = [...matrixA];
      newMatrix[row][col] = value;
      setMatrixA(newMatrix);
    } else {
      const newMatrix = [...matrixB];
      newMatrix[row][col] = value;
      setMatrixB(newMatrix);
    }
    setShowResult(false);
  };

  // Reset
  const handleReset = () => {
    setMatrixA([
      [1, 2],
      [3, 4],
    ]);
    setMatrixB([
      [5, 6],
      [7, 8],
    ]);
    setShowResult(false);
    setOperation("add");
    setScalar(2);
  };

  const result = getResult();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Grid3X3 className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription className="text-purple-100">{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Operation Selection */}
        <div className="flex gap-2 flex-wrap">
          {([
            { op: "add", icon: Plus },
            { op: "subtract", icon: Minus },
            { op: "multiply", icon: X },
            { op: "determinant", icon: Divide },
            { op: "inverse", icon: ArrowRight },
          ] as { op: Operation; icon: typeof Plus }[]).map(({ op, icon: Icon }) => (
            <Button
              key={op}
              variant={operation === op ? "default" : "outline"}
              onClick={() => {
                setOperation(op);
                setShowResult(false);
              }}
              className={operation === op ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              <Icon className="w-4 h-4 mr-2" />
              {t[op]}
            </Button>
          ))}
        </div>

        {/* Matrix A Input */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-3">
          <h3 className="font-bold text-blue-600">{t.matrixA}</h3>
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            {[0, 1].map((row) =>
              [0, 1].map((col) => (
                <div key={`${row}-${col}`} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">[{row},{col}]</span>
                  <Input
                    type="number"
                    value={matrixA[row][col]}
                    onChange={(e) =>
                      updateMatrixValue("A", row, col, parseFloat(e.target.value) || 0)
                    }
                    className="w-20"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Matrix B Input (for binary operations) */}
        {["add", "subtract", "multiply"].includes(operation) && (
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg space-y-3">
            <h3 className="font-bold text-green-600">{t.matrixB}</h3>
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {[0, 1].map((row) =>
                [0, 1].map((col) => (
                  <div key={`${row}-${col}`} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">[{row},{col}]</span>
                    <Input
                      type="number"
                      value={matrixB[row][col]}
                      onChange={(e) =>
                        updateMatrixValue("B", row, col, parseFloat(e.target.value) || 0)
                      }
                      className="w-20"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <Button onClick={() => setShowResult(true)} className="bg-purple-500 hover:bg-purple-600">
            <Play className="w-4 h-4 mr-2" />
            {t.calculate}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={700} height={300} className="w-full bg-slate-50" />
        </div>

        {/* Result Details */}
        {showResult && (
          <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-950 rounded-lg">
            <h4 className="font-bold mb-3">{t.result}</h4>
            
            {operation === "determinant" && (
              <div className="flex items-center gap-4">
                <span className="font-mono text-lg">det(A) = </span>
                <span className="text-3xl font-mono font-bold text-purple-600">
                  {(result as number).toFixed(2)}
                </span>
              </div>
            )}

            {operation === "inverse" && (
              <div>
                {result === null ? (
                  <p className="text-red-500">{t.notInvertible}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-w-xs">
                    {[0, 1].map((row) =>
                      [0, 1].map((col) => (
                        <div key={`${row}-${col}`} className="p-2 bg-white dark:bg-slate-800 rounded">
                          <span className="text-xs text-slate-500">[{row},{col}]</span>
                          <p className="font-mono font-bold">
                            {(result as number[][])[row][col].toFixed(4)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {["add", "subtract", "multiply"].includes(operation) && (
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                {[0, 1].map((row) =>
                  [0, 1].map((col) => (
                    <div key={`${row}-${col}`} className="p-2 bg-white dark:bg-slate-800 rounded">
                      <span className="text-xs text-slate-500">[{row},{col}]</span>
                      <p className="font-mono font-bold">
                        {(result as number[][])[row][col].toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Properties */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
          <h4 className="font-bold mb-3">{t.properties}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <p className="font-mono text-purple-600">A + B = B + A</p>
              <p className="text-xs text-slate-500">
                {language === "ar" ? "التبادلية في الجمع" : "Commutative property of addition"}
              </p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <p className="font-mono text-purple-600">(A + B) + C = A + (B + C)</p>
              <p className="text-xs text-slate-500">
                {language === "ar" ? "التجميع في الجمع" : "Associative property"}
              </p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <p className="font-mono text-purple-600">A × B ≠ B × A</p>
              <p className="text-xs text-slate-500">
                {language === "ar" ? "الضرب غير تبادلي" : "Multiplication is not commutative"}
              </p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded">
              <p className="font-mono text-purple-600">det(A × B) = det(A) × det(B)</p>
              <p className="text-xs text-slate-500">
                {language === "ar" ? "محدد حاصل الضرب" : "Determinant of product"}
              </p>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <h4 className="font-bold mb-2">{t.interpretation}</h4>
          <p className="text-sm">
            {operation === "determinant"
              ? (language === "ar"
                  ? "المحدد هو رقم يلخص خصائص المصفوفة. إذا كان صفراً، المصفوفة غير قابلة للعكس."
                  : "The determinant is a number summarizing matrix properties. If zero, the matrix is not invertible.")
              : operation === "inverse"
                ? (language === "ar"
                    ? "المصفوفة المعكوسة هي التي عند ضربها بالمصفوفة الأصلية تعطي مصفوفة الوحدة."
                    : "The inverse matrix, when multiplied by the original, gives the identity matrix.")
                : (language === "ar"
                    ? "المصفوفات هي جداول أرقام مستخدمة في التحويلات الخطية وحل أنظمة المعادلات."
                    : "Matrices are number tables used in linear transformations and solving equation systems.")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
