import { subjectIds } from "@/lib/static-params";
import SubjectClient from "./SubjectClient";

// Generate static params for all subjects
export function generateStaticParams() {
  return subjectIds.map((id) => ({
    id,
  }));
}

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubjectClient subjectId={id} />;
}
