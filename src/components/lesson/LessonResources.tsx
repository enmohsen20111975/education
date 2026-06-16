"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Beaker, Brain, BarChart3, Play, ChevronRight,
  Atom, FlaskConical, Calculator, Dna, Globe, BookOpen, Languages
} from "lucide-react";
import { MindMapViewer } from "@/components/mindmap/MindMapViewer";
import { Infographic } from "@/components/Infographic";
import { getInfographicsBySubject, INFOGRAPHICS } from "@/lib/infographics";
import { getSimulationsBySubject } from "@/lib/simulations";
import { allMindMaps } from "@/lib/mindmaps";
import { simulatorMap } from "@/components/simulatorComponents";

interface LessonResourcesProps {
  subjectName: string;
  lessonTitle?: string;
  language: "ar" | "en";
}

// Subject to simulation type mapping
const subjectToType: Record<string, string> = {
  "الفيزياء": "physics",
  "Physics": "physics",
  "الكيمياء": "chemistry", 
  "Chemistry": "chemistry",
  "الأحياء": "biology",
  "Biology": "biology",
  "الرياضيات": "math",
  "Mathematics": "math",
  "الرياضيات (1)": "math",
  "الرياضيات (2)": "math",
  "الجغرافيا": "geography",
  "Geography": "geography",
  "اللغة العربية": "arabic",
  "Arabic Language": "arabic",
  "اللغة الإنجليزية": "english",
  "English Language": "english",
};

export function LessonResources({ subjectName, lessonTitle, language }: LessonResourcesProps) {
  const [activeTab, setActiveTab] = useState("simulations");
  const [selectedSim, setSelectedSim] = useState<string | null>(null);
  const [selectedMindMapId, setSelectedMindMapId] = useState<string | null>(null);
  const [selectedInfographic, setSelectedInfographic] = useState<string | null>(null);
  
  const isRTL = language === "ar";
  const subjectType = subjectToType[subjectName] || "physics";
  
  // Get resources for this subject
  const subjectSimulations = getSimulationsBySubject(subjectName);
  const subjectMindMaps = allMindMaps.filter(m => 
    m.subject.toLowerCase() === subjectType || 
    m.subject.toLowerCase().includes(subjectType) ||
    (subjectType === 'math' && m.subject.toLowerCase() === 'mathematics')
  );
  const subjectInfographics = getInfographicsBySubject(subjectType);

  // Labels
  const labels = {
    simulations: isRTL ? "المحاكيات" : "Simulations",
    mindMaps: isRTL ? "الخرائط الذهنية" : "Mind Maps",
    infographics: isRTL ? "المخططات البيانية" : "Infographics",
    selectSim: isRTL ? "اختر محاكاة" : "Select a Simulation",
    selectMindMap: isRTL ? "اختر خريطة ذهنية" : "Select a Mind Map",
    selectInfographic: isRTL ? "اختر مخطط" : "Select an Infographic",
    noSims: isRTL ? "لا توجد محاكيات لهذه المادة" : "No simulations for this subject",
    noMindMaps: isRTL ? "لا توجد خرائط ذهنية لهذه المادة" : "No mind maps for this subject",
    noInfographics: isRTL ? "لا توجد مخططات لهذه المادة" : "No infographics for this subject",
    back: isRTL ? "رجوع" : "Back",
    resources: isRTL ? "المصادر التعليمية" : "Educational Resources",
    free: isRTL ? "مجاني" : "Free",
    underDev: isRTL ? "المحاكاة قيد التطوير" : "Simulation under development",
  };

  // Type icons
  const typeIcons: Record<string, React.ReactNode> = {
    physics: <Atom className="w-5 h-5" />,
    chemistry: <FlaskConical className="w-5 h-5" />,
    biology: <Dna className="w-5 h-5" />,
    math: <Calculator className="w-5 h-5" />,
    geography: <Globe className="w-5 h-5" />,
    arabic: <BookOpen className="w-5 h-5" />,
    english: <Languages className="w-5 h-5" />,
  };

  // Render simulation component
  const renderSimulation = (simId: string) => {
    const SimComponent = simulatorMap[simId];
    if (!SimComponent) {
      return (
        <div className="text-center py-12 text-slate-500">
          <Beaker className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{labels.underDev}</p>
        </div>
      );
    }
    return <SimComponent language={language} />;
  };

  // Render selected mind map
  const renderMindMap = (mapId: string) => {
    const mapData = allMindMaps.find(m => m.id === mapId);
    if (!mapData) {
      return (
        <div className="text-center py-12 text-slate-500">
          <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{isRTL ? "الخريطة قيد التطوير" : "Mind map under development"}</p>
        </div>
      );
    }
    return (
      <div className="h-[500px]">
        <MindMapViewer 
          data={mapData.data}
          title={mapData.title}
          titleAr={mapData.titleAr}
          subject={mapData.subject}
          subjectAr={mapData.subjectAr}
          language={language}
        />
      </div>
    );
  };

  // Render selected infographic
  const renderInfographic = (infoId: string) => {
    const info = INFOGRAPHICS[infoId as keyof typeof INFOGRAPHICS];
    if (!info) {
      return (
        <div className="text-center py-12 text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{isRTL ? "المخطط قيد التطوير" : "Infographic under development"}</p>
        </div>
      );
    }
    return <Infographic type={info.type} data={info.data} language={language} />;
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10">
        <CardTitle className="flex items-center gap-2">
          {typeIcons[subjectType]}
          <span>{labels.resources}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
            <TabsTrigger value="simulations" className="gap-2">
              <Beaker className="w-4 h-4" />
              {labels.simulations}
            </TabsTrigger>
            <TabsTrigger value="mindMaps" className="gap-2">
              <Brain className="w-4 h-4" />
              {labels.mindMaps}
            </TabsTrigger>
            <TabsTrigger value="infographics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              {labels.infographics}
            </TabsTrigger>
          </TabsList>

          {/* Simulations Tab */}
          <TabsContent value="simulations" className="p-4 m-0">
            <AnimatePresence mode="wait">
              {selectedSim ? (
                <motion.div
                  key="simulation-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedSim(null)}
                    className="mb-4"
                  >
                    <ChevronRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
                    {labels.back}
                  </Button>
                  {renderSimulation(selectedSim)}
                </motion.div>
              ) : (
                <motion.div
                  key="simulation-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {subjectSimulations.length > 0 ? (
                    subjectSimulations.map((sim) => (
                      <motion.button
                        key={sim.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSim(sim.id)}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 text-left transition-colors bg-white dark:bg-slate-800"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <Play className="w-5 h-5 text-purple-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 dark:text-white">
                              {isRTL ? sim.titleAr : sim.titleEn}
                            </h4>
                            <p className="text-sm text-slate-500 line-clamp-2">
                              {isRTL ? sim.descriptionAr : sim.descriptionEn}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {sim.category}
                              </Badge>
                              {sim.isFree && (
                                <Badge variant="outline" className="text-xs text-green-600">
                                  {labels.free}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 text-slate-500">
                      <Beaker className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{labels.noSims}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Mind Maps Tab */}
          <TabsContent value="mindMaps" className="p-4 m-0">
            <AnimatePresence mode="wait">
              {selectedMindMapId ? (
                <motion.div
                  key="mindmap-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedMindMapId(null)}
                    className="mb-4"
                  >
                    <ChevronRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
                    {labels.back}
                  </Button>
                  {renderMindMap(selectedMindMapId)}
                </motion.div>
              ) : (
                <motion.div
                  key="mindmap-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  {subjectMindMaps.length > 0 ? (
                    subjectMindMaps.map((mapData) => (
                      <motion.button
                        key={mapData.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMindMapId(mapData.id)}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-left transition-colors bg-white dark:bg-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <Brain className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-white">
                              {isRTL ? mapData.titleAr : mapData.title}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {isRTL ? mapData.subjectAr : mapData.subject}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 text-slate-500">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{labels.noMindMaps}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Infographics Tab */}
          <TabsContent value="infographics" className="p-4 m-0">
            <AnimatePresence mode="wait">
              {selectedInfographic ? (
                <motion.div
                  key="infographic-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedInfographic(null)}
                    className="mb-4"
                  >
                    <ChevronRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
                    {labels.back}
                  </Button>
                  {renderInfographic(selectedInfographic)}
                </motion.div>
              ) : (
                <motion.div
                  key="infographic-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {subjectInfographics.length > 0 ? (
                    subjectInfographics.map((info: any) => (
                      <motion.button
                        key={info.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedInfographic(info.id)}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 text-left transition-colors bg-white dark:bg-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                            <BarChart3 className="w-5 h-5 text-cyan-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-white">
                              {isRTL ? info.titleAr : info.title}
                            </h4>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {info.type}
                            </Badge>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 text-slate-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{labels.noInfographics}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default LessonResources;
