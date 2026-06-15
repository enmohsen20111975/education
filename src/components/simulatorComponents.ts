// Simulator Components Index
// All simulator components exported from a single file

export { MotionSimulator } from './simulators/MotionSimulator';
export { WaveSimulator } from './simulators/WaveSimulator';
export { FreeFallSimulator } from './simulators/FreeFallSimulator';
export { ForcesSimulator } from './simulators/ForcesSimulator';
export { EnergySimulator } from './simulators/EnergySimulator';
export { ProjectileSimulator } from './simulators/ProjectileSimulator';
export { PeriodicTableSimulator } from './simulators/PeriodicTableSimulator';
export { FunctionsSimulator } from './simulators/FunctionsSimulator';

// New simulators
export { OpticsSimulator } from './simulators/OpticsSimulator';
export { CircuitSimulator } from './simulators/CircuitSimulator';
export { TrigonometrySimulator } from './simulators/TrigonometrySimulator';
export { CellSimulator } from './simulators/CellSimulator';
export { ChemicalBondSimulator } from './simulators/ChemicalBondSimulator';
export { GeometrySimulator } from './simulators/GeometrySimulator';
export { StatisticsSimulator } from './simulators/StatisticsSimulator';
export { ThermodynamicsSimulator } from './simulators/ThermodynamicsSimulator';
export { GeneticsSimulator } from './simulators/GeneticsSimulator';
export { DNASimulator } from './simulators/DNASimulator';
export { MomentumSimulator } from './simulators/MomentumSimulator';
export { SoundWaveSimulator } from './simulators/SoundWaveSimulator';
export { ElectromagnetismSimulator } from './simulators/ElectromagnetismSimulator';
export { ReactionRateSimulator } from './simulators/ReactionRateSimulator';
export { PhotosynthesisSimulator } from './simulators/PhotosynthesisSimulator';
export { WaterCycleSimulator } from './simulators/WaterCycleSimulator';
export { PlateTectonicsSimulator } from './simulators/PlateTectonicsSimulator';

// Map simulation IDs to components
import { MotionSimulator } from './simulators/MotionSimulator';
import { WaveSimulator } from './simulators/WaveSimulator';
import { FreeFallSimulator } from './simulators/FreeFallSimulator';
import { ForcesSimulator } from './simulators/ForcesSimulator';
import { EnergySimulator } from './simulators/EnergySimulator';
import { ProjectileSimulator } from './simulators/ProjectileSimulator';
import { PeriodicTableSimulator } from './simulators/PeriodicTableSimulator';
import { FunctionsSimulator } from './simulators/FunctionsSimulator';
import { OpticsSimulator } from './simulators/OpticsSimulator';
import { CircuitSimulator } from './simulators/CircuitSimulator';
import { TrigonometrySimulator } from './simulators/TrigonometrySimulator';
import { CellSimulator } from './simulators/CellSimulator';
import { ChemicalBondSimulator } from './simulators/ChemicalBondSimulator';
import { GeometrySimulator } from './simulators/GeometrySimulator';
import { StatisticsSimulator } from './simulators/StatisticsSimulator';
import { ThermodynamicsSimulator } from './simulators/ThermodynamicsSimulator';
import { GeneticsSimulator } from './simulators/GeneticsSimulator';
import { DNASimulator } from './simulators/DNASimulator';
import { MomentumSimulator } from './simulators/MomentumSimulator';
import { SoundWaveSimulator } from './simulators/SoundWaveSimulator';
import { ElectromagnetismSimulator } from './simulators/ElectromagnetismSimulator';
import { ReactionRateSimulator } from './simulators/ReactionRateSimulator';
import { PhotosynthesisSimulator } from './simulators/PhotosynthesisSimulator';
import { WaterCycleSimulator } from './simulators/WaterCycleSimulator';
import { PlateTectonicsSimulator } from './simulators/PlateTectonicsSimulator';

export const simulatorMap: Record<string, React.ComponentType<{ language: 'ar' | 'en' }>> = {
  // ==========================================
  // PHYSICS SIMULATORS (21)
  // ==========================================
  'sim-physics-motion-1': MotionSimulator,
  'sim-physics-motion-2': MotionSimulator,
  'sim-physics-motion-3': MotionSimulator,
  'sim-physics-wave-1': WaveSimulator,
  'sim-physics-wave-2': WaveSimulator,
  'sim-physics-sound-1': SoundWaveSimulator,
  'sim-physics-electricity-1': CircuitSimulator,
  'sim-physics-electricity-2': CircuitSimulator,
  'sim-physics-electromagnetism-1': ElectromagnetismSimulator,
  'sim-physics-optics-1': OpticsSimulator,
  'sim-physics-optics-2': OpticsSimulator,
  'sim-physics-optics-3': OpticsSimulator,
  'sim-physics-force-1': ForcesSimulator,
  'sim-physics-force-2': ForcesSimulator,
  'sim-physics-momentum-1': MomentumSimulator,
  'sim-physics-energy-1': EnergySimulator,
  'sim-physics-energy-2': EnergySimulator,
  'sim-physics-projectile-1': ProjectileSimulator,
  'sim-physics-freefall-1': FreeFallSimulator,
  'sim-physics-thermodynamics-1': ThermodynamicsSimulator,
  'sim-physics-thermodynamics-2': ThermodynamicsSimulator,
  
  // ==========================================
  // CHEMISTRY SIMULATORS (7)
  // ==========================================
  'sim-chemistry-periodic-1': PeriodicTableSimulator,
  'sim-chemistry-atomic-1': PeriodicTableSimulator,
  'sim-chemistry-bond-1': ChemicalBondSimulator,
  'sim-chemistry-bond-2': ChemicalBondSimulator,
  'sim-chemistry-bond-3': ChemicalBondSimulator,
  'sim-chemistry-reaction-1': ReactionRateSimulator,
  'sim-chemistry-reaction-2': ReactionRateSimulator,
  
  // ==========================================
  // BIOLOGY SIMULATORS (8)
  // ==========================================
  'sim-biology-cell-1': CellSimulator,
  'sim-biology-cell-2': CellSimulator,
  'sim-biology-genetics-1': GeneticsSimulator,
  'sim-biology-genetics-2': GeneticsSimulator,
  'sim-biology-dna-1': DNASimulator,
  'sim-biology-dna-2': DNASimulator,
  'sim-biology-photosynthesis-1': PhotosynthesisSimulator,
  'sim-biology-ecology-1': CellSimulator,
  
  // ==========================================
  // MATH SIMULATORS (20)
  // ==========================================
  'sim-math-functions-1': FunctionsSimulator,
  'sim-math-functions-2': FunctionsSimulator,
  'sim-math-functions-3': FunctionsSimulator,
  'sim-math-equations-1': FunctionsSimulator,
  'sim-math-equations-2': FunctionsSimulator,
  'sim-math-equations-3': FunctionsSimulator,
  'sim-math-equations-4': FunctionsSimulator,
  'sim-math-geometry-1': GeometrySimulator,
  'sim-math-geometry-2': GeometrySimulator,
  'sim-math-geometry-3': GeometrySimulator,
  'sim-math-trig-1': TrigonometrySimulator,
  'sim-math-trig-2': TrigonometrySimulator,
  'sim-math-trig-3': TrigonometrySimulator,
  'sim-math-calculus-1': FunctionsSimulator,
  'sim-math-calculus-2': FunctionsSimulator,
  'sim-math-calculus-3': FunctionsSimulator,
  'sim-math-statistics-1': StatisticsSimulator,
  'sim-math-statistics-2': StatisticsSimulator,
  'sim-math-statistics-3': StatisticsSimulator,
  'sim-math-statistics-4': StatisticsSimulator,
  
  // ==========================================
  // GEOGRAPHY SIMULATORS (3)
  // ==========================================
  'sim-geography-watercycle-1': WaterCycleSimulator,
  'sim-geography-tectonics-1': PlateTectonicsSimulator,
  'sim-geography-tectonics-2': PlateTectonicsSimulator,
  
  // Legacy mappings
  'sim-math-algebra-1': FunctionsSimulator,
  'sim-math-algebra-2': FunctionsSimulator,
  'sim-math-trigonometry-1': TrigonometrySimulator,
  'sim-math-trigonometry-2': TrigonometrySimulator,
};
