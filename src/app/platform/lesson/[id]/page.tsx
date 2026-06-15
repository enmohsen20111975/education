import { lessonIds } from "@/lib/static-params";
import LessonClient from "./LessonClient";

// Generate static params for all lessons
export function generateStaticParams() {
  return lessonIds.map((id) => ({
    id,
  }));
}

export default function LessonPage({ params }: { params: { id: string } }) {
  return <LessonClient lessonId={params.id} />;
}
