import mock from '../../assets/mockData.json';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

export default function RelatoriosPage(){
  const labels = Array.from({length: 12}, (_,i)=>`${(i+1).toString().padStart(2,'0')}/24`);

  const lineData = {
    labels,
    datasets: [
      { label: 'Total', data: mock.series.total },
      { label: 'Ativos', data: mock.series.ativos },
      { label: 'Inativos', data: mock.series.inativos },
      { label: 'Novos', data: mock.series.novos }
    ]
  };

  const pieData = {
    labels: ['Ativos','Inativos'],
    datasets: [{ data: [mock.statusDistribuicao.ativos, mock.statusDistribuicao.inativos] }]
  };

  const stackedData = {
    labels: mock.tipos.map(t=>t.nome),
    datasets: [
      { label: 'Ativos', data: mock.tipos.map(t=>t.ativos) },
      { label: 'Inativos', data: mock.tipos.map(t=>t.inativos) }
    ]
  };

  const rankingData = {
    labels: mock.tipos.map(t=>t.nome),
    datasets: [{ label: 'Crescimento no período', data: mock.tipos.map(t=>t.crescimento) }]
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-end mb-3">
        <div>
          <h1 className="h4 mb-1">Relatórios</h1>
          <small className="text-muted">
            Período: {mock.periodo.inicio} a {mock.periodo.fim} • {mock.periodo.granularidade}
          </small>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="card p-3">
            <h6 className="mb-3">Evolução mensal de contatos</h6>
            <Line data={lineData} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h6 className="mb-3">Distribuição por status</h6>
            <Pie data={pieData} />
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3">
            <h6 className="mb-3">Tipos × Status (empilhado)</h6>
            <Bar data={stackedData} options={{ scales: { x: { stacked: true }, y: { stacked: true }}}}/>
          </div>
        </div>

        <div className="col-12">
          <div className="card p-3">
            <h6 className="mb-3">Ranking de crescimento por tipo</h6>
            <Bar data={rankingData} options={{ indexAxis: 'y' as const }}/>
          </div>
        </div>
      </div>
    </>
  );
}
