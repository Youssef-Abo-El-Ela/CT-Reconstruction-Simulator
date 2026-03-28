import { useState } from 'react';
import { StepperNav } from './StepperNav';
import { useCTStore } from '@/store/ctStore';
import { ColorMapSelector } from '@/components/shared/ColorMapSelector';
import { Button } from '@/components/ui/button';
import { RotateCcw, PanelLeftClose, PanelLeft, SquareActivity } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AnimationSpeed } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXRay } from '@fortawesome/free-solid-svg-icons';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { colormap, setColormap, animationSpeed, setAnimationSpeed, resetAll } = useCTStore();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 border-r border-border/50 bg-card/30 backdrop-blur-xl shrink-0 overflow-hidden`}
      >
        <div className="w-64 h-full flex flex-col">
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faXRay} />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight">CT Simulator</h1>
                <p className="text-[10px] text-muted-foreground">Image Reconstruction</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <StepperNav />
          </div>
          <div className="p-3 border-t border-border/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground uppercase">Colormap</span>
              <ColorMapSelector value={colormap} onChange={setColormap} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground uppercase">Speed</span>
              <Select value={animationSpeed} onValueChange={(v) => setAnimationSpeed(v as AnimationSpeed)}>
                <SelectTrigger className="w-25 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="instant">Instant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 border-b border-border/30 flex items-center px-4 gap-3 bg-card/20 backdrop-blur-md shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={resetAll}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 grid-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
