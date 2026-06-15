import { yearCodes } from "@/lib/static-params";
import YearClient from "./YearClient";

// Generate static params for all years
export function generateStaticParams() {
  return yearCodes.map((code) => ({
    code,
  }));
}

export default function YearPage({ params }: { params: { code: string } }) {
  return <YearClient yearCode={params.code} />;
}
