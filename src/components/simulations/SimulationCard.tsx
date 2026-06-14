"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Beaker, Calculator, Atom, Waves, Zap, 
  Dna, FlaskConical, ChartLine, CircleDot, Lock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Simulation } from "@/lib/simulations";

interface SimulationCardProps {
  simulation: Simulation;
  language: "ar" | "en";
  onClick?: () => void;
}

const typeIcons: Record<string, any> = {
  physics: Atom,
  chemistry: FlaskConical,
  math: Calculator,
  biology: Dna,
  interactive: CircleDot
};

const categoryColors: Record<string, string> = {
  experiment: "from-blue-500 to-cyan-500",
  calculator: "from-purple-500 to-pink-500",
  visualization: "from-green-500 to-teal-500",
  game: "from-orange-500 to-red-500"
};

export function SimulationCard({ simulation, language, onClick }: SimulationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const Icon = typeIcons[simulation.type] || CircleDot;
  const gradientClass = categoryColors[simulation.category] || "from-purple-500 to-pink-500";
  
  const title = language === "ar" ? simulation.titleAr : simulation.titleEn;
  const description = language === "ar" ? simulation.descriptionAr : simulation.descriptionEn;
  const typeLabel = language === "ar" 
    ? { physics: "فيزياء", chemistry: "كيمياء", math: "رياضيات", biology: "أحياء", interactive: "تفاعلي" }[simulation.type]
    : simulation.type.charAt(0).toUpperCase() + simulation.type.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="border-0 shadow-lg overflow-hidden group">
        {/* Thumbnail Area */}
        <div className={`h-32 bg-gradient-to-br ${gradientClass} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-16 h-16 text-white/30" />
          </div>
          
          {/* Play Button Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.5 }}
                  className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center"
                >
                  {simulation.isFree ? (
                    <Play className="w-7 h-7 text-purple-600 ml-1" />
                  ) : (
                    <Lock className="w-7 h-7 text-purple-600" />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Badge */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <Badge className="bg-white/90 text-slate-700 border-0 text-xs">
              {typeLabel}
            </Badge>
            {simulation.isFree && (
              <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                {language === "ar" ? "مجاني" : "Free"}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
          
          <Button 
            className={`w-full mt-4 bg-gradient-to-r ${gradientClass} text-white`}
            size="sm"
          >
            {simulation.isFree 
              ? (language === "ar" ? "تشغيل المحاكاة" : "Start Simulation")
              : (language === "ar" ? "مقفل" : "Locked")
            }
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// مكون قائمة المحاكيات
interface SimulationListProps {
  simulations: Simulation[];
  language: "ar" | "en";
  onSimulationClick?: (simulation: Simulation) => void;
}

export function SimulationList({ simulations, language, onSimulationClick }: SimulationListProps) {
  if (simulations.length === 0) {
    return (
      <div className="text-center py-12">
        <Beaker className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <p className="text-slate-500 dark:text-slate-400">
          {language === "ar" ? "لا توجد محاكيات متاحة لهذا الدرس" : "No simulations available for this lesson"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {simulations.map((sim) => (
        <SimulationCard
          key={sim.id}
          simulation={sim}
          language={language}
          onClick={() => onSimulationClick?.(sim)}
        />
      ))}
    </div>
  );
}
