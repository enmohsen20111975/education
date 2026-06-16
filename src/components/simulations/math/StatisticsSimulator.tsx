"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart3, Plus, RotateCcw, Trash2, Shuffle } from "lucide-react";

interface StatisticsSimulatorProps {
  language: "ar" | "en";
}

interface DataPoint {
  id: string;
  value: number;
  frequency: number;
}

export function StatisticsSimulator({ language }: StatisticsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { id: "1", value: 10, frequency: 2 },
    { id: "2", value: 20, frequency: 5 },
    { id: "3", value: 30, frequency: 8 },
    { id: "4", value: 40, frequency: 4 },
    { id: "5", value: 50, frequency: 1 },
  ]);
  const [newValue, setNewValue] = useState("");
  const [newFrequency, setNewFrequency] = useState("1");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  
  const isRTL = language === "ar";
  
  const labels = {
    title: isRTL ? "محاكي الإحصاء" : "Statistics Simulator",
    addData: isRTL ? "إضافة بيانات" : "Add Data",
    value: isRTL ? "القيمة" : "Value",
    frequency: isRTL ? "التكرار" : "Frequency",
    mean: isRTL ? "المتوسط" : "Mean",
    median: isRTL ? "الوسيط" : "Median",
    mode: isRTL ? "المنوال" : "Mode",
    range: isRTL ? "المدى" : "Range",
    variance: isRTL ? "التباين" : "Variance",
    stdDev: isRTL ? "الانحراف المعياري" : "Standard Deviation",
    total: isRTL ? "الإجمالي" : "Total",
    reset: isRTL ? "إعادة تعيين" : "Reset",
    randomData: isRTL ? "بيانات عشوائية" : "Random Data",
    barChart: isRTL ? "مخطط أعمدة" : "Bar Chart",
    lineChart: isRTL ? "مخطط خطي" : "Line Chart",
    statistics: isRTL ? "الإحصاءات" : "Statistics",
    dataPoints: isRTL ? "نقاط البيانات" : "Data Points",
    noData: isRTL ? "لا توجد بيانات" : "No data",
    formulas: isRTL ? "الصيغ" : "Formulas"
  };

  // Calculate statistics
  const calculateStats = useCallback(() => {
    if (dataPoints.length === 0) return { mean: 0, median: 0, mode: 0, range: 0, variance: 0, stdDev: 0 };
    
    // Expand data with frequency
    const expandedData: number[] = [];
    dataPoints.forEach(dp => {
      for (let i = 0; i < dp.frequency; i++) {
        expandedData.push(dp.value);
      }
    });
    
    if (expandedData.length === 0) return { mean: 0, median: 0, mode: 0, range: 0, variance: 0, stdDev: 0 };
    
    // Sort for median
    const sorted = [...expandedData].sort((a, b) => a - b);
    
    // Mean
    const sum = expandedData.reduce((a, b) => a + b, 0);
    const mean = sum / expandedData.length;
    
    // Median
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    
    // Mode
    const frequencyMap = new Map<number, number>();
    expandedData.forEach(v => frequencyMap.set(v, (frequencyMap.get(v) || 0) + 1));
    let maxFreq = 0;
    let mode = sorted[0];
    frequencyMap.forEach((freq, val) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = val;
      }
    });
    
    // Range
    const range = sorted[sorted.length - 1] - sorted[0];
    
    // Variance and Standard Deviation
    const squaredDiffs = expandedData.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / expandedData.length;
    const stdDev = Math.sqrt(variance);
    
    return { mean, median, mode, range, variance, stdDev };
  }, [dataPoints]);

  const stats = calculateStats();
  const totalFrequency = dataPoints.reduce((sum, dp) => sum + dp.frequency, 0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    
    // Clear
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    
    if (dataPoints.length === 0) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels.noData, width / 2, height / 2);
      return;
    }
    
    // Calculate bounds
    const maxValue = Math.max(...dataPoints.map(d => d.frequency));
    const minValue = Math.min(...dataPoints.map(d => d.value));
    const maxValueX = Math.max(...dataPoints.map(d => d.value));
    
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / dataPoints.length * 0.8;
    const barGap = chartWidth / dataPoints.length * 0.2;
    
    // Axes
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Y-axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (chartHeight * i / 5);
      const val = Math.round(maxValue * i / 5);
      ctx.fillText(val.toString(), padding - 10, y + 4);
      
      // Grid line
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // X-axis label
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";
    ctx.fillText(labels.value, width / 2, height - 10);
    
    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(labels.frequency, 0, 0);
    ctx.restore();
    
    // Draw chart
    if (chartType === "bar") {
      dataPoints.forEach((dp, i) => {
        const x = padding + i * (barWidth + barGap) + barGap / 2;
        const barHeight = (dp.frequency / maxValue) * chartHeight;
        const y = height - padding - barHeight;
        
        // Bar
        const gradient = ctx.createLinearGradient(x, y, x, height - padding);
        gradient.addColorStop(0, "#3b82f6");
        gradient.addColorStop(1, "#1d4ed8");
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Bar border
        ctx.strokeStyle = "#1e40af";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);
        
        // Value label on bar
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(dp.frequency.toString(), x + barWidth / 2, y + 20);
        
        // X-axis value
        ctx.fillStyle = "#64748b";
        ctx.font = "12px monospace";
        ctx.fillText(dp.value.toString(), x + barWidth / 2, height - padding + 20);
      });
    } else {
      // Line chart
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      dataPoints.forEach((dp, i) => {
        const x = padding + i * (chartWidth / (dataPoints.length - 1 || 1));
        const y = height - padding - (dp.frequency / maxValue) * chartHeight;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      
      // Points
      dataPoints.forEach((dp, i) => {
        const x = padding + i * (chartWidth / (dataPoints.length - 1 || 1));
        const y = height - padding - (dp.frequency / maxValue) * chartHeight;
        
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Value labels
        ctx.fillStyle = "#64748b";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(dp.value.toString(), x, height - padding + 20);
        ctx.fillText(dp.frequency.toString(), x, y - 15);
      });
    }
    
    // Draw mean line
    const weightedSum = dataPoints.reduce((sum, dp) => sum + dp.value * dp.frequency, 0);
    const meanValue = weightedSum / totalFrequency;
    const meanX = padding + ((meanValue - minValue) / (maxValueX - minValue || 1)) * chartWidth;
    
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(meanX, padding);
    ctx.lineTo(meanX, height - padding);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Mean label
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${isRTL ? "المتوسط" : "Mean"}: ${stats.mean.toFixed(1)}`, meanX, padding - 10);
    
  }, [dataPoints, chartType, stats.mean, totalFrequency, labels, isRTL]);

  useEffect(() => {
    draw();
  }, [draw]);

  const addDataPoint = () => {
    const value = parseFloat(newValue);
    const frequency = parseInt(newFrequency) || 1;
    
    if (isNaN(value)) return;
    
    setDataPoints([...dataPoints, {
      id: Date.now().toString(),
      value,
      frequency: Math.max(1, frequency)
    }]);
    setNewValue("");
    setNewFrequency("1");
  };

  const deleteDataPoint = (id: string) => {
    setDataPoints(dataPoints.filter(dp => dp.id !== id));
  };

  const generateRandomData = () => {
    const randomData: DataPoint[] = [];
    const numPoints = Math.floor(Math.random() * 5) + 5;
    
    for (let i = 0; i < numPoints; i++) {
      randomData.push({
        id: `rand-${i}`,
        value: Math.floor(Math.random() * 100) + 1,
        frequency: Math.floor(Math.random() * 10) + 1
      });
    }
    
    setDataPoints(randomData.sort((a, b) => a.value - b.value));
  };

  const handleReset = () => {
    setDataPoints([]);
    setNewValue("");
    setNewFrequency("1");
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            {labels.title}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
            >
              {labels.barChart}
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
            >
              {labels.lineChart}
            </Button>
            <Button variant="outline" size="sm" onClick={generateRandomData}>
              <Shuffle className="w-4 h-4 mr-2" />
              {labels.randomData}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {labels.reset}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-200">
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={350}
              className="w-full h-auto bg-white"
            />
          </div>
          
          {/* Statistics */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">{labels.statistics}</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-600">{labels.mean} (μ)</p>
                <code className="text-lg font-bold text-blue-700">{stats.mean.toFixed(2)}</code>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-600">{labels.median}</p>
                <code className="text-lg font-bold text-green-700">{stats.median.toFixed(2)}</code>
              </div>
              
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-600">{labels.mode}</p>
                <code className="text-lg font-bold text-purple-700">{stats.mode.toFixed(2)}</code>
              </div>
              
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-orange-600">{labels.range}</p>
                <code className="text-lg font-bold text-orange-700">{stats.range.toFixed(2)}</code>
              </div>
              
              <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <p className="text-xs text-pink-600">{labels.variance} (σ²)</p>
                <code className="text-lg font-bold text-pink-700">{stats.variance.toFixed(2)}</code>
              </div>
              
              <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <p className="text-xs text-cyan-600">{labels.stdDev} (σ)</p>
                <code className="text-lg font-bold text-cyan-700">{stats.stdDev.toFixed(2)}</code>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">{labels.total}: <strong>{totalFrequency}</strong></p>
            </div>
            
            {/* Formulas */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm font-mono">
              <h5 className="font-medium mb-2">{labels.formulas}</h5>
              <p>μ = Σ(x·f) / Σf</p>
              <p>σ² = Σ(x-μ)² / n</p>
              <p>σ = √σ²</p>
            </div>
          </div>
        </div>
        
        {/* Add Data */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-medium mb-3">{labels.addData}</h4>
          <div className="flex gap-2 flex-wrap">
            <Input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={labels.value}
              className="w-32"
            />
            <Input
              type="number"
              value={newFrequency}
              onChange={(e) => setNewFrequency(e.target.value)}
              placeholder={labels.frequency}
              className="w-32"
              min="1"
            />
            <Button onClick={addDataPoint}>
              <Plus className="w-4 h-4 mr-2" />
              {labels.addData}
            </Button>
          </div>
        </div>
        
        {/* Data Points List */}
        <div>
          <h4 className="font-medium mb-3">{labels.dataPoints} ({dataPoints.length})</h4>
          <div className="flex flex-wrap gap-2">
            {dataPoints.sort((a, b) => a.value - b.value).map((dp) => (
              <div
                key={dp.id}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg"
              >
                <span className="font-mono">
                  <span className="text-blue-600 font-bold">{dp.value}</span>
                  <span className="text-slate-400 mx-1">×</span>
                  <span className="text-green-600 font-bold">{dp.frequency}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteDataPoint(dp.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
