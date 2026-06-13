"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScientificCalculatorProps {
  language: "ar" | "en";
}

export function ScientificCalculator({ language }: ScientificCalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [memory, setMemory] = useState<number | null>(null);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + " " + op + " ");
    setIsNewNumber(true);
  };

  const handleFunction = (func: string) => {
    const num = parseFloat(display);
    let result: number;

    switch (func) {
      case "sqrt":
        result = Math.sqrt(num);
        break;
      case "square":
        result = num * num;
        break;
      case "cube":
        result = num * num * num;
        break;
      case "sin":
        result = Math.sin(num * Math.PI / 180);
        break;
      case "cos":
        result = Math.cos(num * Math.PI / 180);
        break;
      case "tan":
        result = Math.tan(num * Math.PI / 180);
        break;
      case "log":
        result = Math.log10(num);
        break;
      case "ln":
        result = Math.log(num);
        break;
      case "exp":
        result = Math.exp(num);
        break;
      case "1/x":
        result = 1 / num;
        break;
      case "abs":
        result = Math.abs(num);
        break;
      case "factorial":
        result = factorial(num);
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setIsNewNumber(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleEquals = () => {
    try {
      const fullEquation = equation + display;
      const result = Function('"use strict"; return (' + fullEquation.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'Math.PI') + ')')();
      setDisplay(result.toString());
      setEquation("");
      setIsNewNumber(true);
    } catch {
      setDisplay(language === "ar" ? "خطأ" : "Error");
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
      setIsNewNumber(true);
    }
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setIsNewNumber(false);
    }
  };

  const handlePlusMinus = () => {
    setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
  };

  const handlePi = () => {
    setDisplay(Math.PI.toString());
    setIsNewNumber(true);
  };

  const handleMemory = (action: "store" | "recall" | "clear") => {
    switch (action) {
      case "store":
        setMemory(parseFloat(display));
        break;
      case "recall":
        if (memory !== null) {
          setDisplay(memory.toString());
          setIsNewNumber(true);
        }
        break;
      case "clear":
        setMemory(null);
        break;
    }
  };

  const buttons = [
    [
      { label: "MC", action: () => handleMemory("clear"), variant: "outline" as const },
      { label: "MR", action: () => handleMemory("recall"), variant: "outline" as const },
      { label: "MS", action: () => handleMemory("store"), variant: "outline" as const },
      { label: "C", action: handleClear, variant: "destructive" as const },
    ],
    [
      { label: "sin", action: () => handleFunction("sin"), variant: "secondary" as const },
      { label: "cos", action: () => handleFunction("cos"), variant: "secondary" as const },
      { label: "tan", action: () => handleFunction("tan"), variant: "secondary" as const },
      { label: "√", action: () => handleFunction("sqrt"), variant: "secondary" as const },
    ],
    [
      { label: "x²", action: () => handleFunction("square"), variant: "secondary" as const },
      { label: "x³", action: () => handleFunction("cube"), variant: "secondary" as const },
      { label: "log", action: () => handleFunction("log"), variant: "secondary" as const },
      { label: "ln", action: () => handleFunction("ln"), variant: "secondary" as const },
    ],
    [
      { label: "π", action: handlePi, variant: "secondary" as const },
      { label: "eˣ", action: () => handleFunction("exp"), variant: "secondary" as const },
      { label: "1/x", action: () => handleFunction("1/x"), variant: "secondary" as const },
      { label: "n!", action: () => handleFunction("factorial"), variant: "secondary" as const },
    ],
    [
      { label: "7", action: () => handleNumber("7"), variant: "outline" as const },
      { label: "8", action: () => handleNumber("8"), variant: "outline" as const },
      { label: "9", action: () => handleNumber("9"), variant: "outline" as const },
      { label: "÷", action: () => handleOperator("/"), variant: "default" as const },
    ],
    [
      { label: "4", action: () => handleNumber("4"), variant: "outline" as const },
      { label: "5", action: () => handleNumber("5"), variant: "outline" as const },
      { label: "6", action: () => handleNumber("6"), variant: "outline" as const },
      { label: "×", action: () => handleOperator("*"), variant: "default" as const },
    ],
    [
      { label: "1", action: () => handleNumber("1"), variant: "outline" as const },
      { label: "2", action: () => handleNumber("2"), variant: "outline" as const },
      { label: "3", action: () => handleNumber("3"), variant: "outline" as const },
      { label: "-", action: () => handleOperator("-"), variant: "default" as const },
    ],
    [
      { label: "0", action: () => handleNumber("0"), variant: "outline" as const, span: 2 },
      { label: ".", action: handleDecimal, variant: "outline" as const },
      { label: "+", action: () => handleOperator("+"), variant: "default" as const },
    ],
    [
      { label: "±", action: handlePlusMinus, variant: "outline" as const },
      { label: "⌫", action: handleBackspace, variant: "outline" as const },
      { label: "=", action: handleEquals, variant: "default" as const, span: 2, className: "bg-green-500 hover:bg-green-600" },
    ],
  ];

  return (
    <Card className="max-w-sm mx-auto overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-slate-900 dark:bg-slate-950 p-4">
          <div className="text-right text-sm text-slate-400 h-5 overflow-hidden">
            {equation}
          </div>
          <div className="text-right text-3xl font-mono font-bold text-white overflow-x-auto">
            {display}
          </div>
          {memory !== null && (
            <div className="text-xs text-slate-500 mt-1">
              M: {memory}
            </div>
          )}
        </div>
        <div className="p-2 space-y-1">
          {buttons.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-1">
              {row.map((btn, btnIndex) => (
                <Button
                  key={btnIndex}
                  variant={btn.variant}
                  onClick={btn.action}
                  className={`h-12 text-lg font-semibold ${
                    btn.span === 2 ? "col-span-2" : ""
                  } ${btn.className || ""}`}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
