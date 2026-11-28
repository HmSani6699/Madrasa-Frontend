import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  PieChart,
  Pie,
} from "recharts";
import {
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  ArrowUpDown,
  Trophy,
  Layers,
  Calculator,
} from "lucide-react";

const CHART_PALETTE = [
  { main: "#1C7D5A", light: "#34A87E" },
  { main: "#EAB33C", light: "#F5CA63" },
  { main: "#0EA5E9", light: "#38BDF8" },
  { main: "#8B5CF6", light: "#A78BFA" },
  { main: "#123628", light: "#255B45" },
  { main: "#F97316", light: "#FB923C" },
  { main: "#EC4899", light: "#F472B6" },
  { main: "#14B8A6", light: "#2DD4BF" },
];

const formatShortLabel = (label = "", maxLen = 11) => {
  const text = String(label).trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
};

const CustomChartTooltip = ({ active, payload, total }) => {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0]?.payload;
  if (!entry) return null;

  const percentage = total > 0 ? ((entry.count / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl shadow-slate-900/10 min-w-[168px]">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <p className="text-xs font-bold text-slate-800 truncate">{entry.name}</p>
        </div>
        {entry.rank ? (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 shrink-0">
            #{entry.rank}
          </span>
        ) : null}
      </div>
      <div className="flex items-baseline justify-between gap-4 pt-1 border-t border-slate-100">
        <span className="text-base font-bold text-slate-900">
          {entry.count.toLocaleString()}
          <span className="text-xs font-medium text-slate-500 ml-1">Students</span>
        </span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${entry.color}18`,
            color: entry.color,
          }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
};

const ClassDistributionCard = ({ data = [], totalStudents = 0, loading = false }) => {
  const [viewMode, setViewMode] = useState("bar");
  const [sortByCount, setSortByCount] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const normalized = useMemo(() => {
    const base = (Array.isArray(data) ? data : []).map((item, idx) => ({
      name: item?.name || item?.className || item?.class || `Class ${idx + 1}`,
      count: Number(item?.count ?? item?.studentCount ?? item?.students ?? 0) || 0,
      originalIndex: idx,
    }));

    // Assign rank by student count descending
    const rankOrder = [...base]
      .sort((a, b) => b.count - a.count)
      .reduce((acc, item, i) => {
        acc[item.originalIndex] = i + 1;
        return acc;
      }, {});

    const ordered = sortByCount
      ? [...base].sort((a, b) => b.count - a.count)
      : base;

    return ordered.map((item, idx) => {
      const palette = CHART_PALETTE[idx % CHART_PALETTE.length];
      return {
        ...item,
        color: palette.main,
        lightColor: palette.light,
        gradientId: `classBarGrad-${idx % CHART_PALETTE.length}`,
        rank: rankOrder[item.originalIndex],
      };
    });
  }, [data, sortByCount]);

  const totalClassStudents = useMemo(
    () => normalized.reduce((sum, item) => sum + item.count, 0),
    [normalized]
  );

  const nonZeroItems = useMemo(
    () => normalized.filter((item) => item.count > 0),
    [normalized]
  );

  const displayTotal = totalClassStudents || Number(totalStudents) || 0;

  const insights = useMemo(() => {
    if (normalized.length === 0) {
      return { topClass: null, avgPerClass: 0 };
    }
    const topClass = normalized.reduce(
      (best, cur) => (cur.count > best.count ? cur : best),
      normalized[0]
    );
    const avgPerClass = Math.round(totalClassStudents / normalized.length);
    return { topClass, avgPerClass };
  }, [normalized, totalClassStudents]);

  const needsHorizontalScroll = normalized.length > 8;
  const chartMinWidth = needsHorizontalScroll ? normalized.length * 72 : undefined;
  const angleLabels = normalized.length > 6;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-snug">
              Class-wise Student Distribution
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Interactive enrollment breakdown across all active classes
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {/* Total Students Pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 border border-primary/15">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">
              {displayTotal.toLocaleString()} Students
            </span>
          </div>

          {/* Sort Toggle */}
          {normalized.length > 1 && (
            <button
              type="button"
              onClick={() => setSortByCount((prev) => !prev)}
              title={sortByCount ? "Sort by default order" : "Sort by highest students"}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                sortByCount
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {sortByCount ? "Highest" : "Default"}
              </span>
            </button>
          )}

          {/* View Mode Segmented Switch */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/70">
            <button
              type="button"
              onClick={() => setViewMode("bar")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "bar"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("donut")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "donut"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Donut</span>
            </button>
          </div>
        </div>
      </div>

      {/* Micro Insights Strip */}
      {!loading && normalized.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 border border-slate-100 px-3 py-2">
            <div className="p-1.5 rounded-lg bg-white text-primary shadow-2xs border border-slate-100 hidden sm:flex">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Classes
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {normalized.length} Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/80 px-3 py-2">
            <div className="p-1.5 rounded-lg bg-white text-emerald-600 shadow-2xs border border-emerald-100 hidden sm:flex">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-emerald-700/70 uppercase tracking-wider">
                Top Class
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {insights.topClass
                  ? `${insights.topClass.name} (${insights.topClass.count})`
                  : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-amber-50/50 border border-amber-100/80 px-3 py-2">
            <div className="p-1.5 rounded-lg bg-white text-amber-600 shadow-2xs border border-amber-100 hidden sm:flex">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-amber-700/70 uppercase tracking-wider">
                Avg / Class
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {insights.avgPerClass} Students
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
          <div className="h-[260px] rounded-xl bg-slate-50/80 border border-slate-100 p-6 flex items-end justify-around gap-3">
            {[55, 85, 42, 95, 68, 74, 50].map((heightPct, idx) => (
              <div
                key={idx}
                className="w-full max-w-[44px] rounded-t-lg bg-slate-200/80 animate-pulse"
                style={{ height: `${heightPct}%` }}
              />
            ))}
          </div>
        </div>
      ) : normalized.length === 0 ? (
        <div className="py-14 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center mx-auto mb-3 text-slate-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No class distribution data available yet
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Add classes and enroll students to visualize enrollment statistics here.
          </p>
        </div>
      ) : viewMode === "bar" ? (
        <div className="w-full overflow-x-auto pb-1">
          <div
            className="h-[290px] w-full"
            style={chartMinWidth ? { minWidth: `${chartMinWidth}px` } : undefined}
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={normalized}
                margin={{
                  top: 26,
                  right: 14,
                  left: -14,
                  bottom: angleLabels ? 24 : 6,
                }}
                barCategoryGap="22%"
                onMouseLeave={() => setActiveId(null)}
              >
                <defs>
                  {CHART_PALETTE.map((palette, idx) => (
                    <linearGradient
                      key={palette.main}
                      id={`classBarGrad-${idx}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={palette.light} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={palette.main} stopOpacity={1} />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeOpacity={0.75}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={angleLabels ? -20 : 0}
                  textAnchor={angleLabels ? "end" : "middle"}
                  height={angleLabels ? 48 : 30}
                  tickFormatter={(val) => formatShortLabel(val, angleLabels ? 10 : 13)}
                  tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                  domain={[0, (dataMax) => (dataMax > 0 ? Math.ceil(dataMax * 1.15) : 5)]}
                />

                <Tooltip
                  content={<CustomChartTooltip total={totalClassStudents} />}
                  cursor={{ fill: "rgba(28, 125, 90, 0.06)", radius: 10 }}
                />

                <Bar
                  dataKey="count"
                  maxBarSize={48}
                  radius={[10, 10, 4, 4]}
                  background={{ fill: "#f8fafc", radius: 10 }}
                  animationDuration={650}
                  onMouseEnter={(entry) =>
                    setActiveId(entry?.originalIndex ?? null)
                  }
                >
                  <LabelList
                    dataKey="count"
                    position="top"
                    offset={8}
                    style={{
                      fill: "#334155",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  />
                  {normalized.map((entry) => (
                    <Cell
                      key={`${entry.name}-${entry.originalIndex}`}
                      fill={`url(#${entry.gradientId})`}
                      fillOpacity={
                        activeId === null || activeId === entry.originalIndex
                          ? 1
                          : 0.42
                      }
                      style={{ transition: "fill-opacity 200ms ease" }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[230px_1fr] items-center pt-1">
          {/* Interactive Recharts Donut */}
          <div className="relative h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={nonZeroItems}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="none"
                  onMouseEnter={(entry) =>
                    setActiveId(entry?.originalIndex ?? null)
                  }
                  onMouseLeave={() => setActiveId(null)}
                >
                  {nonZeroItems.map((entry) => (
                    <Cell
                      key={`${entry.name}-slice-${entry.originalIndex}`}
                      fill={entry.color}
                      fillOpacity={
                        activeId === null || activeId === entry.originalIndex
                          ? 1
                          : 0.45
                      }
                      style={{ transition: "fill-opacity 200ms ease" }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip total={totalClassStudents} />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-slate-800 leading-none">
                {displayTotal.toLocaleString()}
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400 mt-1.5 font-semibold">
                Students
              </p>
            </div>
          </div>

          {/* Interactive Ranked Progress Bars */}
          <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
            {normalized.map((item) => {
              const percentage = totalClassStudents
                ? Math.round((item.count / totalClassStudents) * 100)
                : 0;
              const isHighlighted = activeId === item.originalIndex;

              return (
                <div
                  key={`${item.name}-${item.originalIndex}`}
                  onMouseEnter={() => setActiveId(item.originalIndex)}
                  onMouseLeave={() => setActiveId(null)}
                  className={`p-2 rounded-lg transition-colors ${
                    isHighlighted ? "bg-slate-50" : "hover:bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-slate-700 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 font-medium">
                        {percentage}%
                      </span>
                      <span className="font-bold text-slate-700 min-w-[24px] text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDistributionCard;
