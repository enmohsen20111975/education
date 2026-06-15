// Complete Simulator Map - 111 Simulators
// Maps simulation IDs from simulations.ts to React components

import type { ReactFC } from 'react';

// Physics Simulators
import { MotionSimulator } from '@/components/simulators/MotionSimulator';
import { WaveSimulator } from '@/components/simulators/WaveSimulator';
import { FreeFallSimulator } from '@/components/simulators/FreeFallSimulator';
import { ForcesSimulator } from '@/components/simulators/ForcesSimulator';
import { EnergySimulator } from '@/components/simulators/EnergySimulator';
import { ProjectileSimulator } from '@/components/simulators/ProjectileSimulator';
import { MomentumSimulator } from '@/components/simulators/MomentumSimulator';
import { SoundWaveSimulator } from '@/components/simulators/SoundWaveSimulator';
import { ElectromagnetismSimulator } from '@/components/simulators/ElectromagnetismSimulator';
import { ThermodynamicsSimulator } from '@/components/simulators/ThermodynamicsSimulator';
import { VelocitySimulator } from '@/components/simulators/VelocitySimulator';
import { MotionGraphSimulator } from '@/components/simulators/MotionGraphSimulator';
import { MotionEquationsSimulator } from '@/components/simulators/MotionEquationsSimulator';
import { PlanetaryFallSimulator } from '@/components/simulators/PlanetaryFallSimulator';
import { FrictionSimulator } from '@/components/simulators/FrictionSimulator';
import { PendulumSimulator } from '@/components/simulators/PendulumSimulator';
import { SpringSimulator } from '@/components/simulators/SpringSimulator';
import { CircularMotionSimulator } from '@/components/simulators/CircularMotionSimulator';
import { GravitySimulator } from '@/components/simulators/GravitySimulator';
import { SatelliteSimulator } from '@/components/simulators/SatelliteSimulator';

// Wave & Light Simulators
import { WaveInterferenceSimulator } from '@/components/simulators/WaveInterferenceSimulator';
import { WaveReflectionSimulator } from '@/components/simulators/WaveReflectionSimulator';
import { StandingWaveSimulator } from '@/components/simulators/StandingWaveSimulator';
import { DopplerSimulator } from '@/components/simulators/DopplerSimulator';
import { ResonanceSimulator } from '@/components/simulators/ResonanceSimulator';
import { LightReflectionSimulator } from '@/components/simulators/LightReflectionSimulator';
import { LightRefractionSimulator } from '@/components/simulators/LightRefractionSimulator';
import { LensesSimulator } from '@/components/simulators/LensesSimulator';
import { DiffractionSimulator } from '@/components/simulators/DiffractionSimulator';
import { DoubleSlitSimulator } from '@/components/simulators/DoubleSlitSimulator';

// Electricity & Magnetism Simulators
import { ElectricChargeSimulator } from '@/components/simulators/ElectricChargeSimulator';
import { ElectricFieldSimulator } from '@/components/simulators/ElectricFieldSimulator';
import { ElectricPotentialSimulator } from '@/components/simulators/ElectricPotentialSimulator';
import { SeriesParallelSimulator } from '@/components/simulators/SeriesParallelSimulator';
import { OhmsLawSimulator } from '@/components/simulators/OhmsLawSimulator';
import { ElectricPowerSimulator } from '@/components/simulators/ElectricPowerSimulator';
import { MagnetismSimulator } from '@/components/simulators/MagnetismSimulator';
import { MagneticFieldLinesSimulator } from '@/components/simulators/MagneticFieldLinesSimulator';
import { ElectromagnetSimulator } from '@/components/simulators/ElectromagnetSimulator';
import { InductionSimulator } from '@/components/simulators/InductionSimulator';
import { TransformerSimulator } from '@/components/simulators/TransformerSimulator';
import { MotorSimulator } from '@/components/simulators/MotorSimulator';

// Chemistry Simulators
import { PeriodicTableSimulator } from '@/components/simulators/PeriodicTableSimulator';
import { ReactionRateSimulator } from '@/components/simulators/ReactionRateSimulator';
import { AtomStructureSimulator } from '@/components/simulators/AtomStructureSimulator';
import { AtomicModelsSimulator } from '@/components/simulators/AtomicModelsSimulator';
import { ElectronConfigurationSimulator } from '@/components/simulators/ElectronConfigurationSimulator';
import { OrbitalsSimulator } from '@/components/simulators/OrbitalsSimulator';
import { PeriodicTrendsSimulator } from '@/components/simulators/PeriodicTrendsSimulator';
import { ElectronegativitySimulator } from '@/components/simulators/ElectronegativitySimulator';
import { IonicBondSimulator } from '@/components/simulators/IonicBondSimulator';
import { CovalentBondSimulator } from '@/components/simulators/CovalentBondSimulator';
import { MetallicBondSimulator } from '@/components/simulators/MetallicBondSimulator';
import { MolecularGeometrySimulator } from '@/components/simulators/MolecularGeometrySimulator';
import { IntermolecularForcesSimulator } from '@/components/simulators/IntermolecularForcesSimulator';
import { PolaritySimulator } from '@/components/simulators/PolaritySimulator';
import { ReactionTypesSimulator } from '@/components/simulators/ReactionTypesSimulator';
import { BalancingEquationsSimulator } from '@/components/simulators/BalancingEquationsSimulator';
import { ActivationEnergySimulator } from '@/components/simulators/ActivationEnergySimulator';
import { ChemicalEquilibriumSimulator } from '@/components/simulators/ChemicalEquilibriumSimulator';
import { SolutionsSimulator } from '@/components/simulators/SolutionsSimulator';
import { AcidsBasesSimulator } from '@/components/simulators/AcidsBasesSimulator';

// Math Simulators
import { FunctionsSimulator } from '@/components/simulators/FunctionsSimulator';
import { GeometrySimulator } from '@/components/simulators/GeometrySimulator';
import { StatisticsSimulator } from '@/components/simulators/StatisticsSimulator';
import { TrigonometrySimulator } from '@/components/simulators/TrigonometrySimulator';
import { LinearEquationsSimulator } from '@/components/simulators/LinearEquationsSimulator';
import { LineGraphSimulator } from '@/components/simulators/LineGraphSimulator';
import { LineIntersectionSimulator } from '@/components/simulators/LineIntersectionSimulator';
import { QuadraticEquationsSimulator } from '@/components/simulators/QuadraticEquationsSimulator';
import { ParabolaGraphSimulator } from '@/components/simulators/ParabolaGraphSimulator';
import { QuadraticFormulaSimulator } from '@/components/simulators/QuadraticFormulaSimulator';
import { SystemsEquationsSimulator } from '@/components/simulators/SystemsEquationsSimulator';
import { LogarithmsSimulator } from '@/components/simulators/LogarithmsSimulator';
import { MatricesSimulator } from '@/components/simulators/MatricesSimulator';
import { AnglesSimulator } from '@/components/simulators/AnglesSimulator';
import { PolygonsSimulator } from '@/components/simulators/PolygonsSimulator';
import { CircleGeometrySimulator } from '@/components/simulators/CircleGeometrySimulator';
import { AreaVolumeSimulator } from '@/components/simulators/AreaVolumeSimulator';
import { PythagoreanSimulator } from '@/components/simulators/PythagoreanSimulator';
import { VectorsSimulator } from '@/components/simulators/VectorsSimulator';
import { DotProductSimulator } from '@/components/simulators/DotProductSimulator';
import { CrossProductSimulator } from '@/components/simulators/CrossProductSimulator';
import { TrigFunctionsSimulator } from '@/components/simulators/TrigFunctionsSimulator';
import { TrigCurvesSimulator } from '@/components/simulators/TrigCurvesSimulator';
import { TrigIdentitiesSimulator } from '@/components/simulators/TrigIdentitiesSimulator';
import { LawOfSinesSimulator } from '@/components/simulators/LawOfSinesSimulator';
import { LawOfCosinesSimulator } from '@/components/simulators/LawOfCosinesSimulator';
import { LimitsSimulator } from '@/components/simulators/LimitsSimulator';
import { DerivativesSimulator } from '@/components/simulators/DerivativesSimulator';
import { IntegralsSimulator } from '@/components/simulators/IntegralsSimulator';
import { AreaUnderCurveSimulator } from '@/components/simulators/AreaUnderCurveSimulator';
import { MaxMinSimulator } from '@/components/simulators/MaxMinSimulator';

// Biology & Geography Simulators
import { CellSimulator } from '@/components/simulators/CellSimulator';
import { GeneticsSimulator } from '@/components/simulators/GeneticsSimulator';
import { DNASimulator } from '@/components/simulators/DNASimulator';
import { PhotosynthesisSimulator } from '@/components/simulators/PhotosynthesisSimulator';
import { WaterCycleSimulator } from '@/components/simulators/WaterCycleSimulator';
import { PlateTectonicsSimulator } from '@/components/simulators/PlateTectonicsSimulator';

// Optics & Circuit Simulators (from original)
import { OpticsSimulator } from '@/components/simulators/OpticsSimulator';
import { CircuitSimulator } from '@/components/simulators/CircuitSimulator';

type SimulatorComponent = React.ComponentType<{ language: 'ar' | 'en' }>;

export const simulatorMap: Record<string, SimulatorComponent> = {
  // ==========================================
  // الفيزياء - الميكانيكا (25 محاكي)
  // ==========================================
  'sim-physics-motion-1': MotionSimulator,
  'sim-physics-motion-2': MotionGraphSimulator,
  'sim-physics-motion-3': VelocitySimulator,
  'sim-physics-motion-4': MotionEquationsSimulator,
  'sim-physics-freefall-1': FreeFallSimulator,
  'sim-physics-freefall-2': PlanetaryFallSimulator,
  'sim-physics-forces-1': ForcesSimulator,
  'sim-physics-forces-2': ForcesSimulator,
  'sim-physics-newton-1': ForcesSimulator,
  'sim-physics-newton-2': ForcesSimulator,
  'sim-physics-newton-3': ForcesSimulator,
  'sim-physics-newton-4': FrictionSimulator,
  'sim-physics-projectile-1': ProjectileSimulator,
  'sim-physics-projectile-2': ProjectileSimulator,
  'sim-physics-energy-1': EnergySimulator,
  'sim-physics-energy-2': EnergySimulator,
  'sim-physics-energy-3': PendulumSimulator,
  'sim-physics-energy-4': SpringSimulator,
  'sim-physics-momentum-1': MomentumSimulator,
  'sim-physics-momentum-2': MomentumSimulator,
  'sim-physics-work-1': EnergySimulator,
  'sim-physics-circular-1': CircularMotionSimulator,
  'sim-physics-gravity-1': GravitySimulator,
  'sim-physics-satellite-1': SatelliteSimulator,
  'sim-physics-thermodynamics-1': ThermodynamicsSimulator,

  // ==========================================
  // الفيزياء - الموجات (15 محاكي)
  // ==========================================
  'sim-physics-wave-1': WaveSimulator,
  'sim-physics-wave-2': WaveSimulator,
  'sim-physics-wave-3': WaveInterferenceSimulator,
  'sim-physics-wave-4': WaveReflectionSimulator,
  'sim-physics-wave-5': StandingWaveSimulator,
  'sim-physics-sound-1': SoundWaveSimulator,
  'sim-physics-sound-2': DopplerSimulator,
  'sim-physics-sound-3': ResonanceSimulator,
  'sim-physics-sound-4': SoundWaveSimulator,
  'sim-physics-light-1': LightReflectionSimulator,
  'sim-physics-light-2': LightRefractionSimulator,
  'sim-physics-light-3': LensesSimulator,
  'sim-physics-light-4': DiffractionSimulator,
  'sim-physics-light-5': DoubleSlitSimulator,
  'sim-physics-optics-1': OpticsSimulator,

  // ==========================================
  // الفيزياء - الكهرباء والمغناطيسية (16 محاكي)
  // ==========================================
  'sim-physics-electricity-1': ElectricChargeSimulator,
  'sim-physics-electricity-2': ElectricFieldSimulator,
  'sim-physics-electricity-3': ElectricPotentialSimulator,
  'sim-physics-circuit-1': CircuitSimulator,
  'sim-physics-circuit-2': SeriesParallelSimulator,
  'sim-physics-circuit-3': OhmsLawSimulator,
  'sim-physics-circuit-4': ElectricPowerSimulator,
  'sim-physics-circuit-5': SeriesParallelSimulator,
  'sim-physics-magnetism-1': MagnetismSimulator,
  'sim-physics-magnetism-2': MagneticFieldLinesSimulator,
  'sim-physics-electromagnetism-1': ElectromagnetSimulator,
  'sim-physics-electromagnetism-2': InductionSimulator,
  'sim-physics-electromagnetism-3': TransformerSimulator,
  'sim-physics-electromagnetism-4': MotorSimulator,
  'sim-physics-electromagnetism-5': ElectromagnetismSimulator,

  // ==========================================
  // الكيمياء - البنية الذرية والجدول الدوري (15 محاكي)
  // ==========================================
  'sim-chemistry-atom-1': AtomStructureSimulator,
  'sim-chemistry-atom-2': AtomicModelsSimulator,
  'sim-chemistry-atom-3': ElectronConfigurationSimulator,
  'sim-chemistry-atom-4': OrbitalsSimulator,
  'sim-chemistry-periodic-1': PeriodicTableSimulator,
  'sim-chemistry-periodic-2': PeriodicTrendsSimulator,
  'sim-chemistry-periodic-3': ElectronegativitySimulator,
  'sim-chemistry-periodic-4': PeriodicTableSimulator,
  'sim-chemistry-bond-1': IonicBondSimulator,
  'sim-chemistry-bond-2': CovalentBondSimulator,
  'sim-chemistry-bond-3': MetallicBondSimulator,
  'sim-chemistry-bond-4': IntermolecularForcesSimulator,
  'sim-chemistry-bond-5': MolecularGeometrySimulator,
  'sim-chemistry-bond-6': PolaritySimulator,
  'sim-chemistry-nomenclature-1': PeriodicTableSimulator,

  // ==========================================
  // الكيمياء - التفاعلات الكيميائية (10 محاكي)
  // ==========================================
  'sim-chemistry-reaction-1': ReactionTypesSimulator,
  'sim-chemistry-reaction-2': BalancingEquationsSimulator,
  'sim-chemistry-reaction-3': ReactionRateSimulator,
  'sim-chemistry-reaction-4': ActivationEnergySimulator,
  'sim-chemistry-reaction-5': ChemicalEquilibriumSimulator,
  'sim-chemistry-reaction-6': ChemicalEquilibriumSimulator,
  'sim-chemistry-solution-1': SolutionsSimulator,
  'sim-chemistry-solution-2': SolutionsSimulator,
  'sim-chemistry-acid-1': AcidsBasesSimulator,
  'sim-chemistry-acid-2': AcidsBasesSimulator,

  // ==========================================
  // الرياضيات - الجبر والمعادلات (15 محاكي)
  // ==========================================
  'sim-math-equations-1': LinearEquationsSimulator,
  'sim-math-equations-2': LineGraphSimulator,
  'sim-math-equations-3': LineIntersectionSimulator,
  'sim-math-quadratic-1': QuadraticEquationsSimulator,
  'sim-math-quadratic-2': ParabolaGraphSimulator,
  'sim-math-quadratic-3': QuadraticFormulaSimulator,
  'sim-math-systems-1': SystemsEquationsSimulator,
  'sim-math-systems-2': SystemsEquationsSimulator,
  'sim-math-systems-3': SystemsEquationsSimulator,
  'sim-math-log-1': LogarithmsSimulator,
  'sim-math-log-2': LogarithmsSimulator,
  'sim-math-functions-1': FunctionsSimulator,
  'sim-math-functions-2': FunctionsSimulator,
  'sim-matrices-1': MatricesSimulator,
  'sim-matrices-2': MatricesSimulator,

  // ==========================================
  // الرياضيات - الهندسة وعلم المثلثات (15 محاكي)
  // ==========================================
  'sim-math-geometry-1': AnglesSimulator,
  'sim-math-geometry-2': PolygonsSimulator,
  'sim-math-geometry-3': CircleGeometrySimulator,
  'sim-math-geometry-4': AreaVolumeSimulator,
  'sim-math-geometry-5': PythagoreanSimulator,
  'sim-math-trig-1': TrigFunctionsSimulator,
  'sim-math-trig-2': TrigonometrySimulator,
  'sim-math-trig-3': TrigCurvesSimulator,
  'sim-math-trig-4': TrigIdentitiesSimulator,
  'sim-math-trig-5': LawOfSinesSimulator,
  'sim-math-trig-6': LawOfCosinesSimulator,
  'sim-math-trig-7': LawOfSinesSimulator,
  'sim-math-vectors-1': VectorsSimulator,
  'sim-math-vectors-2': DotProductSimulator,
  'sim-math-vectors-3': CrossProductSimulator,

  // ==========================================
  // الرياضيات - التفاضل والتكامل (10 محاكي)
  // ==========================================
  'sim-math-calculus-1': LimitsSimulator,
  'sim-math-calculus-2': LimitsSimulator,
  'sim-math-calculus-3': DerivativesSimulator,
  'sim-math-calculus-4': DerivativesSimulator,
  'sim-math-calculus-5': DerivativesSimulator,
  'sim-math-calculus-6': MaxMinSimulator,
  'sim-math-calculus-7': FunctionsSimulator,
  'sim-math-calculus-8': IntegralsSimulator,
  'sim-math-calculus-9': IntegralsSimulator,
  'sim-math-calculus-10': AreaUnderCurveSimulator,

  // ==========================================
  // محاكيات عامة وأدوات (5 محاكي)
  // ==========================================
  'sim-calc-scientific': FunctionsSimulator,
  'sim-unit-converter': FunctionsSimulator,
  'sim-graphing-tool': FunctionsSimulator,
  'sim-statistics-1': StatisticsSimulator,
  'sim-probability-1': StatisticsSimulator,
};

// Helper function to get simulator component
export function getSimulatorComponent(id: string): SimulatorComponent | undefined {
  return simulatorMap[id];
}

// Count total mapped simulators
export function getSimulatorCount(): number {
  return Object.keys(simulatorMap).length;
}
