"use client";

import { useState, useEffect, useCallback } from "react";

interface UseApiOptions {
  enabled?: boolean;
}

export function useApi<T>(url: string | null, options: UseApiOptions = {}) {
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// نوع بيانات المواد
export interface SubjectFromApi {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  units: UnitFromApi[];
}

export interface UnitFromApi {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  lessons: LessonFromApi[];
}

export interface LessonFromApi {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  duration: number;
  isFree: boolean;
  order: number;
  unit: {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    subject: {
      id: string;
      slug: string;
      nameAr: string;
      nameEn: string;
      icon: string;
      color: string;
    };
  };
  simulators: string[];
  questionsCount: number;
}

// نوع بيانات الدرس الكامل
export interface LessonDetailFromApi {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  duration: number;
  isFree: boolean;
  order: number;
  videoUrl?: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  introduction: {
    ar: string;
    en: string;
  };
  summary: {
    ar: string;
    en: string;
  };
  unit: {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    subject: {
      id: string;
      slug: string;
      nameAr: string;
      nameEn: string;
      icon: string;
      color: string;
    };
  };
  objectives: {
    ar: string[];
    en: string[];
  };
  keyConcepts: {
    ar: { term: string; definition: string }[];
    en: { term: string; definition: string }[];
  };
  formulas: {
    ar: { formula: string; explanation: string }[];
    en: { formula: string; explanation: string }[];
  };
  examples: {
    ar: { question: string; solution: string; steps: string[] }[];
    en: { question: string; solution: string; steps: string[] }[];
  };
  simulators: string[];
  questions: any[];
  mindMap: any;
  infographic: any;
}
