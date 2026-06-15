import { simulations } from "@/lib/simulations";
import SimulationClient from "./SimulationClient";

// Generate static params for all simulations
export function generateStaticParams() {
  return simulations.map((sim) => ({
    id: sim.id,
  }));
}

export default function SimulationPage({ params }: { params: { id: string } }) {
  return <SimulationClient simId={params.id} />;
}
