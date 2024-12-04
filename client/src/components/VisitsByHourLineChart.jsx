/* eslint-disable react/prop-types */
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

function VisitsByHourLineChart({ visitsByHour }) {
  // Format the data into labels and values for each hour
  const labels = Array.from({ length: 25 }, (_, i) => `${i}:00`);
  const dataValues = labels.map((label, index) => visitsByHour[index] || 0);

  // Chart.js data object for the line chart
  const data = {
    labels,
    datasets: [
      {
        label: "Visits by Hour",
        data: dataValues,
        borderColor: "#32CD32", // Line color (green shade)
        backgroundColor: "rgba(50, 205, 50, 0.2)", // Fill color under the line
        pointBackgroundColor: "#006400", // Points color (dark green)
        pointBorderColor: "#006400",
        fill: true,
        tension: 0.3, // Smooths the line
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour of the Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Visits",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      className="w-full md:w-1/2 lg:w-1/3 p-4 "
      style={{ width: "100%", height: "400px" }}
    >
      <Line data={data} options={options} />
    </div>
  );
}

export default VisitsByHourLineChart;
