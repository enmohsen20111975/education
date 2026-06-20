import { yearCodes } from "@/lib/static-params";
import YearClient from "./YearClient";

// Generate static params for all years
export function generateStaticParams() {
  return yearCodes.map((code) => ({
    code,
  }));
}

export default async function YearPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <YearClient yearCode={code} />;
}
