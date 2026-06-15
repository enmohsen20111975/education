"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export function MathRenderer({ formula, displayMode = false, className = "" }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError: false,
          trust: true,
        });
      } catch (error) {
        console.error("KaTeX error:", error);
        if (containerRef.current) {
          containerRef.current.textContent = formula;
        }
      }
    }
  }, [formula, displayMode]);

  return <span ref={containerRef} className={className} />;
}

// Component for inline math
export function InlineMath({ children }: { children: string }) {
  return <MathRenderer formula={children} displayMode={false} />;
}

// Component for block math (centered, larger)
export function BlockMath({ children }: { children: string }) {
  return (
    <div className="my-4 text-center text-xl">
      <MathRenderer formula={children} displayMode={true} />
    </div>
  );
}

// Helper function to parse text with math
export function parseMathText(text: string): React.ReactNode[] {
  // Parse text that contains math expressions
  // Format: $...$ for inline, $$...$$ for block
  const parts: React.ReactNode[] = [];
  const blockRegex = /\$\$(.*?)\$\$/g;
  const inlineRegex = /\$(.*?)\$/g;

  let lastIndex = 0;
  let key = 0;

  // First handle block math
  let textWithBlockPlaceholders = text;
  const blockMatches: { match: string; formula: string }[] = [];
  
  let blockMatch;
  while ((blockMatch = blockRegex.exec(text)) !== null) {
    blockMatches.push({
      match: blockMatch[0],
      formula: blockMatch[1],
    });
  }

  // Replace block math with placeholders
  blockMatches.forEach((m, i) => {
    textWithBlockPlaceholders = textWithBlockPlaceholders.replace(m.match, `__BLOCK_MATH_${i}__`);
  });

  // Then handle inline math
  const inlineMatches: { match: string; formula: string }[] = [];
  let inlineMatch;
  while ((inlineMatch = inlineRegex.exec(textWithBlockPlaceholders)) !== null) {
    inlineMatches.push({
      match: inlineMatch[0],
      formula: inlineMatch[1],
    });
  }

  // Build the result
  let processedText = textWithBlockPlaceholders;
  
  // Split by inline math
  const segments = processedText.split(/(\$[^$]+\$)/g);
  
  return segments.map((segment, index) => {
    // Check if it's a block math placeholder
    const blockIndex = segment.match(/__BLOCK_MATH_(\d+)__/);
    if (blockIndex) {
      const idx = parseInt(blockIndex[1]);
      return <BlockMath key={`block-${idx}`}>{blockMatches[idx].formula}</BlockMath>;
    }
    
    // Check if it's inline math
    const inlineMatch = segment.match(/\$([^$]+)\$/);
    if (inlineMatch) {
      return <InlineMath key={`inline-${index}`}>{inlineMatch[1]}</InlineMath>;
    }
    
    // Regular text
    return <span key={`text-${index}`}>{segment}</span>;
  });
}
