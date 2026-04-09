interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  colorClass?: string;
}

export function MetricCard({ label, value, unit, colorClass }: MetricCardProps) {
  const formatted = typeof value === 'number' ? value.toFixed(3) : value;

  return (
    <div className="glass-panel p-3 text-center">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </div>

      <div
        className={`flex flex-col md:flex-row items-center justify-center gap-1 font-mono text-lg font-bold ${
          colorClass || 'text-primary'
        }`}
      >
        <span>{formatted}</span>

        {unit && (
          <span className="text-xs text-muted-foreground md:ml-1 md:mt-1">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}