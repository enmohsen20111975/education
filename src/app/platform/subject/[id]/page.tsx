import { subjectIds } from "@/lib/static-params";
import SubjectClient from "./SubjectClient";

// Generate static params for all subjects
export function generateStaticParams() {
  return subjectIds.map((id) => ({
    id,
  }));
}

export default function SubjectPage({ params }: { params: { id: string } }) {
  return <SubjectClient subjectId={params.id} />;
}
