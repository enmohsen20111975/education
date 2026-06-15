"use client";

import { MathRenderer, BlockMath, InlineMath, parseMathText } from "./MathRenderer";

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function ContentRenderer({ content, className = "" }: ContentRendererProps) {
  // Check if content has math
  const hasMath = content.includes("$");

  if (!hasMath) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div className={className}>
      {parseMathText(content)}
    </div>
  );
}

// Example formulas for physics and math
export const mathExamples = {
  // Physics formulas
  velocity: "v = \\frac{\\Delta x}{\\Delta t}",
  acceleration: "a = \\frac{\\Delta v}{\\Delta t}",
  newtonSecond: "F = ma",
  kineticEnergy: "E_k = \\frac{1}{2}mv^2",
  potentialEnergy: "E_p = mgh",
  waveEquation: "v = f\\lambda",
  ohmsLaw: "V = IR",
  power: "P = IV = I^2R = \\frac{V^2}{R}",
  
  // Math formulas
  quadratic: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  pythagorean: "a^2 + b^2 = c^2",
  circleArea: "A = \\pi r^2",
  sphereVolume: "V = \\frac{4}{3}\\pi r^3",
  sineLaw: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
  cosineLaw: "c^2 = a^2 + b^2 - 2ab\\cos C",
  derivative: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
  integral: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
  
  // Chemistry formulas
  idealGas: "PV = nRT",
  molarity: "M = \\frac{n}{V}",
  ph: "pH = -\\log[H^+]",
  
  // Biology formulas
  hardyWeinberg: "p^2 + 2pq + q^2 = 1",
};
