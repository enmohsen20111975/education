import fs from 'fs';
import path from 'path';

// Cache for JSON data
let cachedData: any = null;

export function getData() {
  if (cachedData) return cachedData;

  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'curriculum.json');
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    cachedData = JSON.parse(jsonData);
    return cachedData;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
}

export function getAcademicYears() {
  const data = getData();
  return data?.academicYears || [];
}

export function getSpecializations() {
  const data = getData();
  return data?.specializations || [];
}

export function getSemesters() {
  const data = getData();
  return data?.semesters || [];
}

export function getSimulators() {
  const data = getData();
  return data?.simulators || [];
}

export function getBadges() {
  const data = getData();
  return data?.badges || [];
}

export function getSubjectById(id: string) {
  const data = getData();
  for (const year of data?.academicYears || []) {
    const subject = year.Subject?.find((s: any) => s.id === id);
    if (subject) return { ...subject, AcademicYear: year };
  }
  return null;
}

export function getLessonById(id: string) {
  const data = getData();
  for (const year of data?.academicYears || []) {
    for (const subject of year.Subject || []) {
      for (const unit of subject.Unit || []) {
        const lesson = unit.Lesson?.find((l: any) => l.id === id);
        if (lesson) {
          return {
            ...lesson,
            Unit: { ...unit, Subject: subject },
          };
        }
      }
    }
  }
  return null;
}

export function getLessonsByUnitId(unitId: string) {
  const data = getData();
  for (const year of data?.academicYears || []) {
    for (const subject of year.Subject || []) {
      const unit = subject.Unit?.find((u: any) => u.id === unitId);
      if (unit) return unit.Lesson || [];
    }
  }
  return [];
}
