import { simulations } from "@/lib/simulations";
import SimulationClient from "./SimulationClient";

// Generate static params for all simulations
export function generateStaticParams() {
  return simulations.map((sim) => ({
    id: sim.id,
  }));
}

export default async function SimulationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SimulationClient simId={id} />;
}
