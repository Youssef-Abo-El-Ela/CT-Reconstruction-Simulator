import type { ColormapName } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COLORMAPS: { value: ColormapName; label: string }[] = [
  { value: 'grayscale', label: 'Grayscale' },
  { value: 'hot', label: 'Hot' },
  { value: 'viridis', label: 'Viridis' },
  { value: 'jet', label: 'Jet' },
  { value: 'plasma', label: 'Plasma' },
];

interface ColorMapSelectorProps {
  value: ColormapName;
  onChange: (v: ColormapName) => void;
}

export function ColorMapSelector({ value, onChange }: ColorMapSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ColormapName)}>
      <SelectTrigger className="w-32.5 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {COLORMAPS.map((cm) => (
          <SelectItem key={cm.value} value={cm.value} className="text-xs">
            {cm.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
