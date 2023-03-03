import React from "react";
import {
	Chart as Chartjs,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	ArcElement,
	Legend,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
Chartjs.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	ArcElement,
	Legend
);

export const LineChart = ({ Data }) => {
	const labels = ["Initial Amount", "Amount Earned"];

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "bottom",
			},
			title: {
				display: true,
				text: "ERNINGS'..",
			},
		},
	};

	const data = {
		labels: ["Initial Amount", "Amount Earned"],
		datasets: [
			{
				backgroundColor: ["tomato"],
				hoverBackgroundColor: ["rgb(197, 72, 49)"],
				data: [0, Data.totalAmount],
			},
		],
	};

	return <Line options={options} data={data} />;
};

export const DoughnutChart = ({ Data }) => {
	const labels = ["Out of Stock", "InStock"];
	const data = {
		labels: ["Out of Stock", "InStock"],
		datasets: [
			{
				backgroundColor: ["#00A6B4", "#6800B4"],
				hoverBackgroundColor: ["#4B5000", "#35014F"],
				data: [Data.outOfStock, Data.stock],
				borderWidth: 1,
			},
		],
	};
	return <Doughnut data={data} />;
};
