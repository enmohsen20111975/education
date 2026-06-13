// Static data loader for client-side
// This fetches from the pre-generated JSON file

let cachedData: any = null;

export async function loadStaticData() {
  if (cachedData) return cachedData;

  try {
    const res = await fetch('/data/curriculum.json');
    if (!res.ok) throw new Error('Failed to load data');
    cachedData = await res.json();
    return cachedData;
  } catch (error) {
    console.error('Error loading static data:', error);
    return null;
  }
}

export async function getAcademicYearsStatic() {
  const data = await loadStaticData();
  return data?.academicYears || [];
}

export async function getSpecializationsStatic() {
  const data = await loadStaticData();
  return data?.specializations || [];
}

export async function getSemestersStatic() {
  const data = await loadStaticData();
  return data?.semesters || [];
}

export async function getSimulatorsStatic() {
  const data = await loadStaticData();
  return data?.simulators || [];
}

export async function getBadgesStatic() {
  const data = await loadStaticData();
  return data?.badges || [];
}

export async function getSubjectByIdStatic(id: string) {
  const data = await loadStaticData();
  for (const year of data?.academicYears || []) {
    const subject = year.Subject?.find((s: any) => s.id === id);
    if (subject) return { ...subject, AcademicYear: year };
  }
  return null;
}

export async function getLessonByIdStatic(id: string) {
  const data = await loadStaticData();
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

export async function getLessonsByUnitIdStatic(unitId: string) {
  const data = await loadStaticData();
  for (const year of data?.academicYears || []) {
    for (const subject of year.Subject || []) {
      const unit = subject.Unit?.find((u: any) => u.id === unitId);
      if (unit) return unit.Lesson || [];
    }
  }
  return [];
}

export async function getYearByCodeStatic(code: string) {
  const data = await loadStaticData();
  return data?.academicYears?.find((y: any) => y.code === code) || null;
}
