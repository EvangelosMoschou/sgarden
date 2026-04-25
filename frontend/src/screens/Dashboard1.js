import { useEffect, useState } from "react";
import { Grid, Typography, Box, IconButton } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import Dropdown from "../components/Dropdown.js";
import Card from "../components/Card.js";
import Plot from "../components/Plot.js";
import DatePicker from "../components/DatePicker.js";
import Map from "../components/Map.js";

import colors from "../_colors.scss";

import { availableRegions, availableMetrics } from "../utils/constants.js";
import { generateRandomDecimal, randomDate } from "../utils/dashboard.js";
import useGlobalState from "../use-global-state.js";

const Dashboard = () => {
    const favorites = useGlobalState((state) => state.favorites);
    const toggleFavorite = useGlobalState((state) => state.toggleFavorite);
    const isFavorite = favorites.includes("/dashboard1");

    const [selectedRegion, setSelectedRegion] = useState("Thessaloniki");
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [fromDate, setFromDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    const [toDate, setToDate] = useState(new Date());
    const [months, setMonths] = useState([]);
    const [data, setData] = useState({ keyMetric: { date: randomDate(), value: generateRandomDecimal(0, 100) }, revenue: [], expenses: [], profit: [], growthRate: [] });

    const changePlotData = (fromD, toD) => {
        if (fromD && toD) {
            const from = new Date(fromD);
            const to = new Date(toD);
            const months = [];
            while (from <= to) {
                months.push(from.toLocaleString("en-GB", { month: "short", year: "numeric" }));
                from.setMonth(from.getMonth() + 1);
            }
            setMonths(months);

            const revenue = months.map(() => generateRandomDecimal(0, 20));
            const expenses = months.map(() => generateRandomDecimal(0, 30));
            const profit = months.map(() => generateRandomDecimal(0, 40));
            const growthRate = months.map(() => generateRandomDecimal(0, 50));
            setData({ revenue, expenses, profit, growthRate, keyMetric: data.keyMetric });
        }
    };

    const changeKeyMetricData = () => {
        const keyMetric = { date: randomDate(), value: generateRandomDecimal(0, 100) };
        setData({ ...data, keyMetric });
    };

    useEffect(() => {
        changePlotData(fromDate, toDate);
    }, [fromDate, toDate]);

    useEffect(() => {
        changeKeyMetricData();
    }, [selectedMetric]);

    useEffect(() => {
        changeKeyMetricData();
        changePlotData(fromDate, toDate);
    }, [selectedRegion]);

    return (
        <Grid container py={2} flexDirection="column">
            <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h4" color="white.main" mr={1}>
                    Analytics
                </Typography>
                <IconButton
                    data-testid="bookmark-toggle-dashboard1"
                    onClick={() => toggleFavorite("/dashboard1")}
                    color="primary"
                >
                    {isFavorite ? (
                        <Star data-testid="bookmark-active-dashboard1" />
                    ) : (
                        <StarBorder />
                    )}
                </IconButton>
            </Box>

            <Grid item style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
                <Typography variant="body1" style={{ marginRight: "10px" }} color="white.main">Region:</Typography>
                <Dropdown
                    items={availableRegions.map((region) => ({ value: region, text: region }))}
                    value={selectedRegion}
                    onChange={(event) => setSelectedRegion(event.target.value)}
                />
            </Grid>

            <Grid container spacing={2}>
                <Grid container item sm={12} md={4} spacing={4}>
                        <Grid item width="100%">
                            <Card
                                title="Key Metric"
                                footer={(
                                    <Box
                                        width="100%"
                                        height="100px"
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                        alignItems="center"
                                        backgroundColor="greyDark.main"
                                        py={1}
                                    >
                                        {selectedMetric && (
                                            <>
                                                <Typography variant="body">
                                                    {`Latest value of ${selectedMetric} for ${selectedRegion}`}
                                                </Typography>
                                                <Typography variant="body1" fontWeight="bold" color="primary.main">
                                                    {`${data.keyMetric.date.toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })} - ${data.keyMetric.value.toFixed(2)}%`}
                                                </Typography>
                                            </>
                                        )}
                                        {!selectedMetric && (
                                            <>
                                                <Typography variant="body1" fontWeight="bold" color="white.main">
                                                    {"No metric selected"}
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                )}
                            >
                                <Box height="100px" display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography width="fit-content" variant="subtitle1">Metric:</Typography>
                                    <Dropdown
                                        width="50%"
                                        height="40px"
                                        size="small"
                                        placeholder="Select"
                                        background="greyDark"
                                        items={availableMetrics.map((metric) => ({ value: metric, text: metric }))}
                                        value={selectedMetric}
                                        onChange={(event) => setSelectedMetric(event.target.value)}
                                    />
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item width="100%">
                            <Card title="Regional Overview">
                                <Map />
                            </Card>
                        </Grid>
                </Grid>

                <Grid item sm={12} md={8}>
                    <Card title="Trends">
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Grid item xs={12} sm={6} display="flex" flexDirection="row" alignItems="center">
                                <Typography variant="subtitle1" align="center" mr={2}>
                                    {"From: "}
                                </Typography>
                                <DatePicker
                                    width="200px"
                                    views={["month", "year"]}
                                    inputFormat="MM/YYYY"
                                    label="From"
                                    background="greyDark"
                                    value={fromDate}
                                    onChange={(value) => setFromDate(value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
                                <Typography variant="subtitle1" align="center" mr={2}>
                                    {"To: "}
                                </Typography>
                                <DatePicker
                                    width="200px"
                                    views={["month", "year"]}
                                    inputFormat="MM/YYYY"
                                    label="To"
                                    background="greyDark"
                                    value={toDate}
                                    onChange={(value) => setToDate(value)}
                                />
                            </Grid>
                        </Box>
                        <Grid container spacing={1} width="100%">
                            <Grid item xs={12} md={6}>
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.revenue,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1},
                                            markerSize: 0,
                                            hoverinfo: "none",
                                        },
                                        {
                                            x: months,
                                            y: data.revenue,
                                            type: "scatter",
                                            mode: "markers",
                                            color: "primary",
                                            markerSize: 10,
                                            name: "",
                                            hoverinfo: "none",
                                        },
                                    ]}
                                    showLegend={false}
                                    title="Revenue"
                                    titleColor="primary"
                                    titleFontSize={16}
                                    displayBar={false}
                                    height="250px"
                                    exportCsvTestId="export-csv-revenue"
                                    exportCsvFileName="revenue.csv"
                                    annotations={[
                                        {
                                            x: months[data.revenue.indexOf(Math.min(...data.revenue))],
                                            y: Math.min(...data.revenue),
                                            xref: "x",
                                            yref: "y",
                                            text: `Min: ${Math.min(...data.revenue).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                        {
                                            x: months[data.revenue.indexOf(Math.max(...data.revenue))],
                                            y: Math.max(...data.revenue),
                                            xref: "x",
                                            yref: "y",
                                            text: `Max: ${Math.max(...data.revenue).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                    ]}
                                />
                                <Typography variant="body1" textAlign="center">
                                    {`Average: ${(data.revenue.reduce((acc, curr) => acc + curr, 0) / data.revenue.length).toFixed(2)}%`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.expenses,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1},
                                            markerSize: 0,
                                            hoverinfo: "none",
                                        },
                                        {
                                            x: months,
                                            y: data.expenses,
                                            type: "scatter",
                                            mode: "markers",
                                            color: "primary",
                                            markerSize: 10,
                                            name: "",
                                            hoverinfo: "none",
                                        },
                                    ]}
                                    showLegend={false}
                                    title="Expenses"
                                    titleColor="primary"
                                    titleFontSize={16}
                                    displayBar={false}
                                    height="250px"
                                    exportCsvTestId="export-csv-expenses"
                                    exportCsvFileName="expenses.csv"
                                    annotations={[
                                        {
                                            x: months[data.expenses.indexOf(Math.min(...data.expenses))],
                                            y: Math.min(...data.expenses),
                                            xref: "x",
                                            yref: "y",
                                            text: `Min: ${Math.min(...data.expenses).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                        {
                                            x: months[data.expenses.indexOf(Math.max(...data.expenses))],
                                            y: Math.max(...data.expenses),
                                            xref: "x",
                                            yref: "y",
                                            text: `Max: ${Math.max(...data.expenses).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                    ]}
                                />
                                <Typography variant="body1" textAlign="center">
                                    {`Average: ${(data.expenses.reduce((acc, curr) => acc + curr, 0) / data.expenses.length).toFixed(2)}%`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.profit,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1},
                                            markerSize: 0,
                                            hoverinfo: "none",
                                        },
                                        {
                                            x: months,
                                            y: data.profit,
                                            type: "scatter",
                                            mode: "markers",
                                            color: "primary",
                                            markerSize: 10,
                                            name: "",
                                            hoverinfo: "none",
                                        },
                                    ]}
                                    showLegend={false}
                                    title="Profit"
                                    titleColor="primary"
                                    titleFontSize={16}
                                    displayBar={false}
                                    height="250px"
                                    exportCsvTestId="export-csv-profit"
                                    exportCsvFileName="profit.csv"
                                    annotations={[
                                        {
                                            x: months[data.profit.indexOf(Math.min(...data.profit))],
                                            y: Math.min(...data.profit),
                                            xref: "x",
                                            yref: "y",
                                            text: `Min: ${Math.min(...data.profit).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                        {
                                            x: months[data.profit.indexOf(Math.max(...data.profit))],
                                            y: Math.max(...data.profit),
                                            xref: "x",
                                            yref: "y",
                                            text: `Max: ${Math.max(...data.profit).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                    ]}
                                />
                                <Typography variant="body1" textAlign="center">
                                    {`Average: ${(data.profit.reduce((acc, curr) => acc + curr, 0) / data.profit.length).toFixed(2)}%`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.growthRate,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1},
                                            markerSize: 0,
                                            hoverinfo: "none",
                                        },
                                        {
                                            x: months,
                                            y: data.growthRate,
                                            type: "scatter",
                                            mode: "markers",
                                            color: "primary",
                                            markerSize: 10,
                                            name: "",
                                            hoverinfo: "none",
                                        },
                                    ]}
                                    showLegend={false}
                                    title="Growth Rate"
                                    titleColor="primary"
                                    titleFontSize={16}
                                    displayBar={false}
                                    height="250px"
                                    exportCsvTestId="export-csv-growth-rate"
                                    exportCsvFileName="growth-rate.csv"
                                    annotations={[
                                        {
                                            x: months[data.growthRate.indexOf(Math.min(...data.growthRate))],
                                            y: Math.min(...data.growthRate),
                                            xref: "x",
                                            yref: "y",
                                            text: `Min: ${Math.min(...data.growthRate).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                        {
                                            x: months[data.growthRate.indexOf(Math.max(...data.growthRate))],
                                            y: Math.max(...data.growthRate),
                                            xref: "x",
                                            yref: "y",
                                            text: `Max: ${Math.max(...data.growthRate).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                    ]}
                                />
                                <Typography variant="body1" textAlign="center">
                                    {`Average: ${(data.growthRate.reduce((acc, curr) => acc + curr, 0) / data.growthRate.length).toFixed(2)}%`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
