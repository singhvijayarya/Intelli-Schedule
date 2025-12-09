import React, { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { TimetableGrid } from '@/components/TimetableGrid';
import { mockApi } from '@/mocks/api';
import { TimetableSlot } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Calendar,
  Loader2,
  Sparkles,
  Download,
  FileSpreadsheet,
  RefreshCcw,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TimetableGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<TimetableSlot[] | null>(null);
  
  // Constraints
  const [semester, setSemester] = useState('5');
  const [department, setDepartment] = useState('cs');
  const [maxHoursPerDay, setMaxHoursPerDay] = useState([6]);
  const [breakDuration, setBreakDuration] = useState([60]);
  const [avoidBackToBack, setAvoidBackToBack] = useState(true);
  const [prioritizeMorning, setPrioritizeMorning] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast({
      title: 'Generating Timetable',
      description: 'AI is optimizing your schedule based on constraints...',
    });

    const result = await mockApi.generateTimetable({
      semester: parseInt(semester),
      department,
      maxHoursPerDay: maxHoursPerDay[0],
      breakDuration: breakDuration[0],
      avoidBackToBack,
      prioritizeMorning,
    });

    setIsGenerating(false);

    if (result.success) {
      setGeneratedTimetable(result.timetable);
      toast({
        title: 'Timetable Generated!',
        description: 'Your optimized timetable is ready for review.',
      });
    }
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: 'Your timetable is being prepared for download.',
    });
  };

  const handleReset = () => {
    setGeneratedTimetable(null);
    setSemester('5');
    setDepartment('cs');
    setMaxHoursPerDay([6]);
    setBreakDuration([60]);
    setAvoidBackToBack(true);
    setPrioritizeMorning(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">AI Timetable Generator</h1>
          <p className="text-muted-foreground">Configure constraints and generate optimized schedules</p>
        </div>
        {generatedTimetable && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Constraints Panel */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard header={
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold">Configuration</h2>
            </div>
          }>
            <div className="space-y-6">
              {/* Semester & Department */}
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="ee">Electrical Engineering</SelectItem>
                    <SelectItem value="me">Mechanical Engineering</SelectItem>
                    <SelectItem value="ce">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Hours Per Day */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Max Hours Per Day</Label>
                  <span className="text-sm text-muted-foreground">{maxHoursPerDay[0]} hours</span>
                </div>
                <Slider
                  value={maxHoursPerDay}
                  onValueChange={setMaxHoursPerDay}
                  min={4}
                  max={8}
                  step={1}
                  className="py-2"
                />
              </div>

              {/* Break Duration */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Lunch Break Duration</Label>
                  <span className="text-sm text-muted-foreground">{breakDuration[0]} min</span>
                </div>
                <Slider
                  value={breakDuration}
                  onValueChange={setBreakDuration}
                  min={30}
                  max={90}
                  step={15}
                  className="py-2"
                />
              </div>

              {/* Toggle Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Avoid Back-to-Back Labs</Label>
                  <Switch checked={avoidBackToBack} onCheckedChange={setAvoidBackToBack} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Prioritize Morning Classes</Label>
                  <Switch checked={prioritizeMorning} onCheckedChange={setPrioritizeMorning} />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Timetable
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset} className="w-full glass border-border/30">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reset Configuration
            </Button>
          </div>

          {/* Scenario Info */}
          <GlassCard size="sm" className="bg-info/10 border-info/30">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-info flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-info">Simulation Mode</p>
                <p className="text-muted-foreground mt-1">
                  Generated timetables are simulated for demo purposes. Connect to the backend for real optimization.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Timetable Preview */}
        <div className="lg:col-span-2">
          {generatedTimetable ? (
            <div className="space-y-4">
              <GlassCard className="bg-success/10 border-success/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/20">
                    <Calendar className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-success">Timetable Generated Successfully</p>
                    <p className="text-sm text-muted-foreground">
                      Semester {semester} • {department.toUpperCase()} Department • {generatedTimetable.length} slots
                    </p>
                  </div>
                </div>
              </GlassCard>

              <TimetableGrid 
                slots={generatedTimetable} 
                onSlotClick={(slot) => {
                  toast({
                    title: slot.course.name,
                    description: `${slot.day} ${slot.startTime}-${slot.endTime} • ${slot.room.name}`,
                  });
                }}
              />
            </div>
          ) : (
            <GlassCard className="h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">No Timetable Generated</h3>
                <p className="text-muted-foreground max-w-sm">
                  Configure your constraints and click "Generate Timetable" to create an optimized schedule using AI.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;
