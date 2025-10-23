import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  ChartDataset,
  ChartType,
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const PALETTE = [
  '#0d6efd', // primary
  '#198754', // success
  '#dc3545', // danger
  '#fd7e14', // orange
  '#20c997', // teal
  '#6f42c1', // purple
  '#0dcaf0', // info
  '#6c757d', // secondary
  '#6610f2', // indigo
  '#ffc107', // warning
];

function hexToRgba(hex: string, alpha = 1): string {
  const m = hex.replace('#', '');
  const bigint = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Plugin para aplicar cores automaticamente quando não informadas
const AutoColors = {
  id: 'auto-colors',
  beforeUpdate(chart: Chart) {
    const chartType = chart.config.type as ChartType;

    chart.data.datasets.forEach((ds: ChartDataset, i: number) => {
      // tipo do dataset: se não tiver, usa o tipo do chart
      const t = (ds as any).type || chartType;
      const base = PALETTE[i % PALETTE.length];

      if (t === 'line' || t === 'scatter') {
        // linha: borda forte + fundo suave
        if (!ds.borderColor) ds.borderColor = base;
        if (!ds.backgroundColor) ds.backgroundColor = hexToRgba(base, 0.18);
        if ((ds as any).tension === undefined) (ds as any).tension = 0.3;
        if ((ds as any).pointRadius === undefined) (ds as any).pointRadius = 3;
        if ((ds as any).fill === undefined) (ds as any).fill = false;
      } else if (t === 'bar') {
        // barras: fundo sólido leve + borda
        if (!ds.backgroundColor) ds.backgroundColor = hexToRgba(base, 0.75);
        if (!ds.borderColor) ds.borderColor = base;
        if ((ds as any).borderWidth === undefined) (ds as any).borderWidth = 1;
      } else if (t === 'pie' || t === 'doughnut' || t === 'polarArea') {
        // pizza/donut: uma cor por fatia
        const len = Array.isArray(ds.data) ? ds.data.length : 0;
        const bg = new Array(len).fill(0).map((_, j) => hexToRgba(PALETTE[j % PALETTE.length], 0.85));
        const bd = new Array(len).fill(0).map((_, j) => PALETTE[j % PALETTE.length]);

        if (!ds.backgroundColor) ds.backgroundColor = bg;
        if (!ds.borderColor) ds.borderColor = bd;
        if ((ds as any).borderWidth === undefined) (ds as any).borderWidth = 1;
      } else {
        // fallback (casos exóticos): usa borda/fundo padrão
        if (!ds.borderColor) ds.borderColor = base;
        if (!ds.backgroundColor) ds.backgroundColor = hexToRgba(base, 0.2);
      }
    });
  },
};

// Registra o plugin (global)
Chart.register(AutoColors);

// Defaults legíveis com Bootstrap
Chart.defaults.color = '#212529'; // texto
Chart.defaults.font.family =
  'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji",sans-serif';
Chart.defaults.plugins.legend.position = 'top';
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.tooltip.mode = 'index';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.scale.grid.color = 'rgba(0,0,0,.08)';
Chart.defaults.scale.ticks.color = '#6c757d';

// Export apenas para sinalizar uso; importar o arquivo já ativa o tema
export function applyChartTheme() { /* noop */ }
export const chartPalette = PALETTE;
export const toRGBA = hexToRgba;
