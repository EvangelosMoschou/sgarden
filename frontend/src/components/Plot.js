import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import Plotly from "react-plotly.js";

import colors from "../_colors.scss";

const sanitizeSlug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const escapeCsvValue = (value) => {
	if (value === null || value === undefined) {
		return "";
	}

	const text = typeof value === "object" ? JSON.stringify(value) : String(value);
	if (/[",\n\r]/.test(text)) {
		return `"${text.replace(/"/g, '""')}"`;
	}

	return text;
};

const toArray = (value) => {
	if (Array.isArray(value)) {
		return value;
	}

	return value === undefined || value === null ? [] : [value];
};

const buildCsv = (traces) => {
	const rows = [["trace", "point_index", "x", "y", "z", "value"]];

	traces.forEach((trace, traceIndex) => {
		const xValues = toArray(trace.x);
		const yValues = toArray(trace.y);
		const zValues = toArray(trace.z);
		const valueValues = toArray(trace.values);
		const pointCount = Math.max(xValues.length, yValues.length, zValues.length, valueValues.length, 1);
		const traceName = trace.name || trace.title || `Series ${traceIndex + 1}`;

		for (let pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
			rows.push([
				traceName,
				pointIndex + 1,
				xValues[pointIndex] ?? xValues[0] ?? pointIndex + 1,
				yValues[pointIndex] ?? yValues[0] ?? "",
				zValues[pointIndex] ?? zValues[0] ?? "",
				valueValues[pointIndex] ?? valueValues[0] ?? "",
			]);
		}
	});

	return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
};

const downloadCsv = (fileName, csvContent) => {
	const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement("a");

	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	link.remove();
	window.URL.revokeObjectURL(url);
};

const Plot = ({
	data: plotData, // An array of objects. Each one describes a specific subplot
	title: plotTitle = "", // Plot title
	titleColor: plotTitleColor = "primary", // Plot title color (from the list of colors e.g. secondary or global e.g. red)
	titleFontSize: plotTitleFontSize = 20, // Plot title font size
	showLegend: plotShowLegend = true, // Show plot legend or not
	legendFontSize: plotLegendFontSize = 12, // Plot legend font size
	scrollZoom: plotScrollZoom = false, // Enable or disable zoom in/out on scrolling
	editable: plotEditable = false, // Enable or disable user edit on plot (e.g. plot title)
	// eslint-disable-next-line unicorn/no-useless-undefined
	displayBar: plotDisplayBar = undefined, // Enable or disable mode bar with actions for user
	// (true for always display, false for never display, undefined for display on hover)
	width: plotWidth = "100%",
	height: plotHeight = "100%",
	background: plotBackground = "white",
	marginBottom: plotMarginBottom = 80,
	annotations: plotAnnotations = [],
	exportCsvTestId: plotExportCsvTestId = "",
	exportCsvFileName: plotExportCsvFileName = "",
}) => {
	const [data, setData] = useState(plotData);
	const [title, setTitle] = useState(plotTitle);
	const [titleColor, setTitleColor] = useState(plotTitleColor);
	const [titleFontSize, setTitleFontSize] = useState(plotTitleFontSize);
	const [showLegend, setShowLegend] = useState(plotShowLegend);
	const [legendFontSize, setLegendFontSize] = useState(plotLegendFontSize);
	const [scrollZoom, setScrollZoom] = useState(plotScrollZoom);
	const [editable, setEditable] = useState(plotEditable);
	const [displayBar, setDisplayBar] = useState(plotDisplayBar);
	const [width, setWidth] = useState(plotWidth);
	const [height, setHeight] = useState(plotHeight);
	const [background, setBackground] = useState(plotBackground);
	const [marginBottom, setMarginBottom] = useState(plotMarginBottom);
	const [annotations, setAnnotations] = useState(plotAnnotations);
	const exportCsvTestId = plotExportCsvTestId || `export-csv-${sanitizeSlug(title || "chart")}`;
	const exportCsvFileName = plotExportCsvFileName || `${sanitizeSlug(title || exportCsvTestId.replace(/^export-csv-/, "chart"))}.csv`;

	const handleExportCsv = () => {
		downloadCsv(exportCsvFileName, buildCsv(data));
	};

	useEffect(() => {
		setData(plotData);
	}, [plotData]);

	useEffect(() => {
		setTitle(plotTitle);
	}, [plotTitle]);

	useEffect(() => {
		setTitleColor(plotTitleColor);
	}, [plotTitleColor]);

	useEffect(() => {
		setTitleFontSize(plotTitleFontSize);
	}, [plotTitleFontSize]);

	useEffect(() => {
		setShowLegend(plotShowLegend);
	}, [plotShowLegend]);

	useEffect(() => {
		setLegendFontSize(plotLegendFontSize);
	}, [plotLegendFontSize]);

	useEffect(() => {
		setScrollZoom(plotScrollZoom);
	}, [plotScrollZoom]);

	useEffect(() => {
		setEditable(plotEditable);
	}, [plotEditable]);

	useEffect(() => {
		setDisplayBar(plotDisplayBar);
	}, [plotDisplayBar]);

	useEffect(() => {
		setWidth(plotWidth);
	}, [plotWidth]);

	useEffect(() => {
		setHeight(plotHeight);
	}, [plotHeight]);

	useEffect(() => {
		setBackground(plotBackground);
	}, [plotBackground]);

	useEffect(() => {
		setMarginBottom(plotMarginBottom);
	}, [plotMarginBottom]);

	useEffect(() => {
		setAnnotations(plotAnnotations);
	}, [plotAnnotations]);

	return (
		<Box sx={{ width }}>
			<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
				<Button
					variant="outlined"
					size="small"
					onClick={handleExportCsv}
					data-testid={exportCsvTestId}
				>
					Export CSV
				</Button>
			</Box>
			<Plotly
				data={data.map((d) => ({
					x: d.x,
					y: d.y,
					z: d.z,
					type: d.type,
					name: d.title,
					text: d.texts,
					mode: d.mode,
					fill: d.fill,
					line: d.line,
					marker: { color: colors?.[d?.color] || d?.color, size: d?.markerSize ?? 6 },
					values: d.values,
					labels: d.labels,
					textFont: { color: "white" },
					hoverinfo: d.hoverinfo,
					hovertemplate: d.hovertemplate,
				}))}
				layout={{
					title: {
						text: title,
						font: { color: colors?.[titleColor] || titleColor, size: titleFontSize },
					},
					showlegend: showLegend,
					legend: {
						font: { color: colors?.[titleColor] || titleColor, size: legendFontSize },
					},
					paper_bgcolor: colors?.[background] || background,
					plot_bgcolor: colors?.[background] || background,
					margin: { t: title ? 60 : 40, l: 40, b: marginBottom, ...(!showLegend && { r: 40 }) },
					annotations,
					xaxis: { tickangle: -45 },
				}}
				config={{
					scrollZoom,
					editable,
					...(displayBar !== undefined && { displayModeBar: displayBar }),
					displaylogo: false,
				}}
				style={{ width, height }}
			/>
		</Box>
	);
};

export default Plot;
