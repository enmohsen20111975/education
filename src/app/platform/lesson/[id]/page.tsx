import { lessonIds } from "@/lib/static-params";
import LessonClient from "./LessonClient";

// Generate static params for all lessons
export function generateStaticParams() {
  return lessonIds.map((id) => ({
    id,
  }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LessonClient lessonId={id} />;
}
