import { useMemo } from "react";
import { useCTStore } from "@/store/ctStore";
import { CanvasViewer } from "@/components/shared/CanvasViewer";
import { MetricCard } from "@/components/shared/MetricCard";
import { computeAllMetrics } from "@/lib/metrics";
import { ALGO_NAMES, ALGO_COLORS } from "@/types";
import type { ReconMethod, Metrics } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
} from "recharts";
import { motion } from "framer-motion";
import { ChartColumn } from "lucide-react";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="backdrop-blur-xl bg-linear-to-br from-slate-900/95 to-slate-950/95 border border-slate-700/50 rounded-lg shadow-2xl p-4 min-w-fit"
    >
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full transition-all hover:scale-150"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium text-slate-300">
              {entry.name}
            </span>
            <span
              className="text-xs font-bold ml-2"
              style={{ color: entry.color }}
            >
              {typeof entry.value === "number"
                ? entry.value.toFixed(2)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export function ComparisonStep() {
  const { reconstructions, phantomData, phantomSize } = useCTStore();

  const methods = Object.keys(reconstructions) as ReconMethod[];

  const metricsData = useMemo(() => {
    if (!phantomData) return {};
    const result: Record<string, Metrics & { timeMs: number }> = {};
    for (const method of methods) {
      const recon = reconstructions[method];
      if (recon) {
        const metrics = computeAllMetrics(recon.data, phantomData, phantomSize);
        result[method] = { ...metrics, timeMs: recon.timeMs };
      }
    }
    return result;
  }, [reconstructions, phantomData, phantomSize, methods]);

  const chartData = useMemo(() => {
    return [
      {
        metric: "PSNR (dB)",
        ...Object.fromEntries(
          methods.map((m) => [ALGO_NAMES[m], metricsData[m]?.psnr ?? 0]),
        ),
      },
      {
        metric: "SSIM",
        ...Object.fromEntries(
          methods.map((m) => [
            ALGO_NAMES[m],
            (metricsData[m]?.ssim ?? 0) * 100,
          ]),
        ),
      },
      {
        metric: "SNR (dB)",
        ...Object.fromEntries(
          methods.map((m) => [ALGO_NAMES[m], metricsData[m]?.snr ?? 0]),
        ),
      },
    ];
  }, [metricsData, methods]);

  if (methods.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-4">
          <span>
            <ChartColumn className="h-8 w-8" />
          </span>
          Comparison Dashboard
        </h2>
        <div className="glass-panel p-8 text-center text-muted-foreground">
          Run at least one reconstruction algorithm first.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span>
            <ChartColumn className="h-8 w-8" />
          </span>
          Comparison Dashboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Compare {methods.length} reconstruction method
          {methods.length > 1 ? "s" : ""} side by side
        </p>
      </div>

      {/* Grid of reconstructions */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Original */}
        <CanvasViewer
          data={phantomData}
          width={phantomSize}
          height={phantomSize}
          label="Original Phantom"
          showControls={false}
        />
        {methods.map((method) => (
          <CanvasViewer
            key={method}
            data={reconstructions[method]?.data ?? null}
            width={phantomSize}
            height={phantomSize}
            label={`${ALGO_NAMES[method]} (${reconstructions[method]?.timeMs.toFixed(0)}ms)`}
            borderColor={ALGO_COLORS[method]}
            showControls={false}
          />
        ))}
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {methods.map((method) => {
          const m = metricsData[method];
          if (!m) return null;
          return (
            <div key={method} className="space-y-2">
              <div
                className="text-xs font-bold text-center"
                style={{ color: ALGO_COLORS[method] }}
              >
                {ALGO_NAMES[method]}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard label="RMSE" value={m.rmse} />
                <MetricCard label="PSNR" value={m.psnr} unit="dB" />
                <MetricCard label="SSIM" value={m.ssim} />
                <MetricCard
                  label="Time"
                  value={`${m.timeMs.toFixed(0)}`}
                  unit="ms"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      {methods.length > 1 && (
        <div className="glass-panel p-4">
          <h3 className="text-sm font-medium mb-4">
            Quality Metrics Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(222, 20%, 18%)"
                opacity={0.5}
              />
              <XAxis
                dataKey="metric"
                tick={{ fontSize: 12, fill: "hsl(215, 20%, 55%)" }}
                axisLine={{ stroke: "hsl(222, 20%, 18%)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(215, 20%, 55%)" }}
                axisLine={{ stroke: "hsl(222, 20%, 18%)" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "rgba(59, 130, 246, 0.1)",
                  radius: 4,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                iconType="square"
              />
              {methods.map((method) => (
                <Bar
                  key={method}
                  dataKey={ALGO_NAMES[method]}
                  fill={ALGO_COLORS[method]}
                  radius={[6, 6, 0, 0]}
                  animationDuration={500}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Metrics table */}
      <div className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-3 text-xs text-muted-foreground uppercase">
                Method
              </th>
              <th className="text-right p-3 text-xs text-muted-foreground uppercase">
                Time (ms)
              </th>
              <th className="text-right p-3 text-xs text-muted-foreground uppercase">
                RMSE
              </th>
              <th className="text-right p-3 text-xs text-muted-foreground uppercase">
                PSNR (dB)
              </th>
              <th className="text-right p-3 text-xs text-muted-foreground uppercase">
                SSIM
              </th>
              <th className="text-right p-3 text-xs text-muted-foreground uppercase">
                SNR (dB)
              </th>
            </tr>
          </thead>
          <tbody>
            {methods.map((method) => {
              const m = metricsData[method];
              if (!m) return null;
              return (
                <tr
                  key={method}
                  className="border-b border-border/20 hover:bg-accent/30 transition-colors"
                >
                  <td
                    className="p-3 font-medium"
                    style={{ color: ALGO_COLORS[method] }}
                  >
                    {ALGO_NAMES[method]}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {m.timeMs.toFixed(0)}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {m.rmse.toFixed(4)}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {m.psnr.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {m.ssim.toFixed(4)}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {m.snr.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
