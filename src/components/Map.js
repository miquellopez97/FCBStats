import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';


const Map = ({ jugadoras }) => {
  const getChartData = () => {
    const datasets = jugadoras.map((jugadora, index) => {
      const data = jugadora.segundosEntrada.map((entrada, i) => ({
        x: entrada / 60,
        y: index + 1,
      }));

      jugadora.segundosSalida.forEach((salida, i) => {
        data.push({
          x: salida / 60,
          y: index + 1,
        });
      });

      if (jugadora.onCourt) {
        data.push({
          x: 40,
          y: index + 1,
        });
      }

      return {
        label: jugadora.name,
        data,
        borderColor: 'black',
        tension: 0,
        fill: false,
        pointRadius: 5,
      };
    });

    return { datasets };
  };

  const chartData = getChartData();

  const chartOptions = {
    scales: {
      x: {
        type: 'linear', // Puedes probar con 'linear' o 'linear-moved'
        position: 'bottom',
        min: 0,
        max: 40,
        title: {
          display: true,
          text: 'Minuto del Partido',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Jugadoras',
        },
        ticks: {
          stepSize: 1,
          callback: (value, index) => {
            const jugadora = jugadoras[index];
            return jugadora ? jugadora.name : '';
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default Map;
