import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Typography, Box, IconButton, Button } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import Dropdown from "../components/Dropdown.js";
import Card from "../components/Card.js";
import Plot from "../components/Plot.js";
import DatePicker from "../components/DatePicker.js";
import Map from "../components/Map.js";
import NotesPanel from "../components/NotesPanel.js";

import colors from "../_colors.scss";

import { availableRegions, availableMetrics } from "../utils/constants.js";
import { generateRandomDecimal, randomDate } from "../utils/dashboard.js";
import useGlobalState from "../use-global-state.js";

const Dashboard = () => {
    const { t } = useTranslation();
    const favorites = useGlobalState((state) => state.favorites);
    const toggleFavorite = useGlobalState((state) => state.toggleFavorite);
    const isFavorite = favorites.includes("/dashboard1");

    const [searchParams, setSearchParams] = useSearchParams();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);

    const [selectedRegion, setSelectedRegion] = useState("Thessaloniki");
    const [selectedMetric, setSelectedMetric] = useState(() => {
        return searchParams.get("metric") || localStorage.getItem("dashboard1_metric") || null;
    });
    const [fromDate, setFromDate] = useState(() => {
        const fromUrl = searchParams.get("from");
        if (fromUrl) return new Date(fromUrl);
        const fromLocal = localStorage.getItem("dashboard1_from");
        if (fromLocal) return new Date(fromLocal);
        return lastYear;
    });
    const [toDate, setToDate] = useState(() => {
        const toUrl = searchParams.get("to");
        if (toUrl) return new Date(toUrl);
        const toLocal = localStorage.getItem("dashboard1_to");
        if (toLocal) return new Date(toLocal);
        return today;
    });

    const isFilterActive = !!selectedMetric ||
        fromDate.getTime() !== lastYear.getTime() ||
        toDate.getTime() !== today.getTime();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let changed = false;

        if (selectedMetric) {
            if (params.get("metric") !== selectedMetric) {
                params.set("metric", selectedMetric);
                changed = true;
            }
            localStorage.setItem("dashboard1_metric", selectedMetric);
        } else {
            if (params.has("metric")) {
                params.delete("metric");
                changed = true;
            }
            localStorage.removeItem("dashboard1_metric");
        }

        if (fromDate) {
            const fromIso = fromDate.toISOString();
            if (params.get("from") !== fromIso) {
                params.set("from", fromIso);
                changed = true;
            }
            localStorage.setItem("dashboard1_from", fromIso);
        }

        if (toDate) {
            const toIso = toDate.toISOString();
            if (params.get("to") !== toIso) {
                params.set("to", toIso);
                changed = true;
            }
            localStorage.setItem("dashboard1_to", toIso);
        }

        if (changed) {
            setSearchParams(params, { replace: true });
        }
    }, [selectedMetric, fromDate, toDate, setSearchParams]);

    const handleResetFilters = () => {
        setSelectedMetric(null);
        setFromDate(lastYear);
        setToDate(today);
        localStorage.removeItem("dashboard1_metric");
        localStorage.removeItem("dashboard1_from");
        localStorage.removeItem("dashboard1_to");
    };

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
        setData((prevData) => ({ ...prevData, keyMetric }));
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

    
    const [isCompareMode, setIsCompareMode] = useState(false);
    
    const [rightSelectedRegion, setRightSelectedRegion] = useState("Thessaloniki");
    const [rightSelectedMetric, setRightSelectedMetric] = useState(null);
    const [rightFromDate, setRightFromDate] = useState(lastYear);
    const [rightToDate, setRightToDate] = useState(today);
    const [rightData, setRightData] = useState({ keyMetric: { date: randomDate(), value: generateRandomDecimal(0, 100) }, revenue: [], expenses: [], profit: [], growthRate: [] });
    const [rightMonths, setRightMonths] = useState([]);

    const changeRightPlotData = (fromD, toD) => {
        if (fromD && toD) {
            const from = new Date(fromD);
            const to = new Date(toD);
            const months = [];
            while (from <= to) {
                months.push(from.toLocaleString("en-GB", { month: "short", year: "numeric" }));
                from.setMonth(from.getMonth() + 1);
            }
            setRightMonths(months);

            const revenue = months.map(() => generateRandomDecimal(0, 20));
            const expenses = months.map(() => generateRandomDecimal(0, 30));
            const profit = months.map(() => generateRandomDecimal(0, 40));
            const growthRate = months.map(() => generateRandomDecimal(0, 50));
            setRightData({ revenue, expenses, profit, growthRate, keyMetric: rightData.keyMetric });
        }
    };

    const changeRightKeyMetricData = () => {
        const keyMetric = { date: randomDate(), value: generateRandomDecimal(0, 100) };
        setRightData((prevData) => ({ ...prevData, keyMetric }));
    };

    useEffect(() => {
        changeRightPlotData(rightFromDate, rightToDate);
    }, [rightFromDate, rightToDate]);

    useEffect(() => {
        changeRightKeyMetricData();
    }, [rightSelectedMetric]);

    useEffect(() => {
        changeRightKeyMetricData();
        changeRightPlotData(rightFromDate, rightToDate);
    }, [rightSelectedRegion]);

    const isRightFilterActive = !!rightSelectedMetric ||
        rightFromDate.getTime() !== lastYear.getTime() ||
        rightToDate.getTime() !== today.getTime();

    const handleRightResetFilters = () => {
        setRightSelectedMetric(null);
        setRightFromDate(lastYear);
        setRightToDate(today);
    };

    if (isCompareMode) {
        // Calculate delta for revenue simply by subtracting sum or averages
        const leftAvgRevenue = data.revenue.length ? data.revenue.reduce((a,b)=>a+b,0)/data.revenue.length : 0;
        const rightAvgRevenue = rightData.revenue.length ? rightData.revenue.reduce((a,b)=>a+b,0)/rightData.revenue.length : 0;
        const deltaRevenue = (leftAvgRevenue - rightAvgRevenue).toFixed(2);

        return (
            <Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="h4" color="white.main" mr={2}>Compare Mode</Typography>
                        <Box data-testid="compare-active-indicator" sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'success.main' }} />
                    </Box>
                    <Button data-testid="compare-close" variant="outlined" color="error" onClick={() => setIsCompareMode(false)}>Close Compare</Button>
                </Box>
                <Box data-testid="compare-delta-display" mb={2} p={2} bgcolor="greyDark.main" borderRadius={2}>
                    <Typography color="white.main">Delta (Left vs Right):</Typography>
                    <Typography color={deltaRevenue >= 0 ? "success.main" : "error.main"}>
                        Average Revenue Difference: {deltaRevenue}%
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6} data-testid="compare-panel-left">
                        <Dashboard1Content 
                            side="left"
                            t={t}
                            isFilterActive={isFilterActive}
                            handleResetFilters={handleResetFilters}
                            selectedRegion={selectedRegion}
                            setSelectedRegion={setSelectedRegion}
                            selectedMetric={selectedMetric}
                            setSelectedMetric={setSelectedMetric}
                            fromDate={fromDate}
                            setFromDate={setFromDate}
                            toDate={toDate}
                            setToDate={setToDate}
                            data={data}
                            months={months}
                            isCompareMode={isCompareMode}
                            setIsCompareMode={setIsCompareMode}
                            isFavorite={isFavorite}
                            toggleFavorite={toggleFavorite}
                        />
                    </Grid>
                    <Grid item xs={6} data-testid="compare-panel-right">
                        <Dashboard1Content 
                            side="right"
                            t={t}
                            isFilterActive={isRightFilterActive}
                            handleResetFilters={handleRightResetFilters}
                            selectedRegion={rightSelectedRegion}
                            setSelectedRegion={setRightSelectedRegion}
                            selectedMetric={rightSelectedMetric}
                            setSelectedMetric={setRightSelectedMetric}
                            fromDate={rightFromDate}
                            setFromDate={setRightFromDate}
                            toDate={rightToDate}
                            setToDate={setRightToDate}
                            data={rightData}
                            months={rightMonths}
                            isCompareMode={isCompareMode}
                            setIsCompareMode={setIsCompareMode}
                            isFavorite={isFavorite}
                            toggleFavorite={toggleFavorite}
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    return <Dashboard1Content 
        side="none"
        t={t}
        isFilterActive={isFilterActive}
        handleResetFilters={handleResetFilters}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        data={data}
        months={months}
        isCompareMode={isCompareMode}
        setIsCompareMode={setIsCompareMode}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
    />;

};

export default Dashboard;


const Dashboard1Content = ({ 
    side, 
    t, 
    isFilterActive, 
    handleResetFilters, 
    selectedRegion, 
    setSelectedRegion, 
    selectedMetric, 
    setSelectedMetric, 
    fromDate, 
    setFromDate, 
    toDate, 
    setToDate, 
    data, 
    months,
    isCompareMode,
    setIsCompareMode,
    isFavorite,
    toggleFavorite
}) => {
    const alerts = useGlobalState((state) => state.alerts) || [];
    const revenueAlert = alerts.find(a => a.metric === "Revenue" && a.enabled);
    const expensesAlert = alerts.find(a => a.metric === "Expenses" && a.enabled);

    return (
        <Grid container py={2} flexDirection="column">
            <Box display="flex" alignItems="center" mb={1}>
                {!isCompareMode && (
                    <Button 
                        data-testid="compare-toggle" 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => setIsCompareMode(true)}
                        style={{ marginRight: '15px' }}
                    >
                        Compare
                    </Button>
                )}
                <Typography variant="h4" color="white.main" mr={1}>
                    {t("dashboard1.analytics")}
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
            <NotesPanel dashboardKey="/dashboard1" title="Analytics Notes" />

            <Grid item style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px", gap: "15px" }}>
                {isFilterActive && (
                    <Box
                        data-testid="filter-active-indicator"
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "secondary.main",
                        }}
                    />
                )}
                <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={handleResetFilters}
                    data-testid="filter-reset-button"
                >
                    {t("dashboard1.resetFilters")}
                </Button>
                <Box display="flex" alignItems="center">
                    <Typography variant="body1" style={{ marginRight: "10px" }} color="white.main">{t("dashboard1.region")}</Typography>
                    <Dropdown
                        items={availableRegions.map((region) => ({ value: region, text: region }))}
                        value={selectedRegion}
                        onChange={(event) => setSelectedRegion(event.target.value)}
                    />
                </Box>
            </Grid>

            <Grid container spacing={2}>
                <Grid container item sm={12} md={4} spacing={4}>
                    <Grid item width="100%">
                        <Card
                            title={t("dashboard1.keyMetricTitle")}
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
                                                {t("dashboard1.latestValue", { metric: selectedMetric, region: selectedRegion })}
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold" color="primary.main">
                                                {`${data.keyMetric.date.toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })} - ${data.keyMetric.value.toFixed(2)}%`}
                                            </Typography>
                                        </>
                                    )}
                                    {!selectedMetric && (
                                        <>
                                            <Typography variant="body1" fontWeight="bold" color="white.main">
                                                {t("dashboard1.noMetricSelected")}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            )}
                        >
                            <Box height="100px" display="flex" alignItems="center" justifyContent="space-between">
                                <Typography width="fit-content" variant="subtitle1">{t("dashboard1.metricLabel")}</Typography>
                                <Dropdown
                                    width="50%"
                                    height="40px"
                                    size="small"
                                    placeholder={t("dashboard1.select")}
                                    background="greyDark"
                                    items={availableMetrics.map((metric) => ({ value: metric, text: metric }))}
                                    value={selectedMetric}
                                    onChange={(event) => setSelectedMetric(event.target.value)}
                                    testId={side === "left" ? "compare-filter-left-metric" : side === "right" ? "compare-filter-right-metric" : "filter-metric"}
                                />
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item width="100%">
                        <Card title={t("dashboard1.regionalOverview")}>
                            <Map />
                        </Card>
                    </Grid>
                </Grid>

                <Grid item sm={12} md={8}>
                    <Card title={t("dashboard1.trendsTitle")}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Grid item xs={12} sm={6} display="flex" flexDirection="row" alignItems="center">
                                <Typography variant="subtitle1" align="center" mr={2}>
                                    {t("dashboard1.fromLabel")}
                                </Typography>
                                <DatePicker
                                    width="200px"
                                    views={["month", "year"]}
                                    inputFormat="MM/YYYY"
                                    label={t("dashboard1.from")}
                                    background="greyDark"
                                    value={fromDate}
                                    onChange={(value) => setFromDate(value)}
                                    testId={side === "left" ? "compare-filter-left-date-from" : side === "right" ? "compare-filter-right-date-from" : "filter-date-from"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
                                <Typography variant="subtitle1" align="center" mr={2}>
                                    {t("dashboard1.toLabel")}
                                </Typography>
                                <DatePicker
                                    width="200px"
                                    views={["month", "year"]}
                                    inputFormat="MM/YYYY"
                                    label={t("dashboard1.to")}
                                    background="greyDark"
                                    value={toDate}
                                    onChange={(value) => setToDate(value)}
                                    testId={side === "left" ? "compare-filter-left-date-to" : side === "right" ? "compare-filter-right-date-to" : "filter-date-to"}
                                />
                            </Grid>
                        </Box>
                        <Grid container spacing={1} width="100%">
                            <Grid item xs={12} md={6}>
                                <Box position="relative">
                                    {revenueAlert && (
                                        <Box 
                                            data-testid="chart-threshold-line"
                                            sx={{
                                                position: "absolute",
                                                top: "50%",
                                                left: 40,
                                                right: 40,
                                                height: 2,
                                                backgroundColor: "error.main",
                                                zIndex: 10,
                                                pointerEvents: "none"
                                            }} 
                                        />
                                    )}
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.revenue,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1 },
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
                                    title={t("dashboard1.revenue")}
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
                                            text: `${t("dashboard1.min")}${Math.min(...data.revenue).toFixed(2)}%`,
                                            showarrow: true,
                                            font: { size: 16, color: "#ffffff" },
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
                                            text: `${t("dashboard1.max")}${Math.max(...data.revenue).toFixed(2)}%`,
                                            showarrow: true,
                                            font: { size: 16, color: "#ffffff" },
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
                                    {`${t("dashboard1.average")}${(data.revenue.reduce((acc, curr) => acc + curr, 0) / data.revenue.length).toFixed(2)}%`}
                                </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box position="relative">
                                    {expensesAlert && (
                                        <Box 
                                            data-testid="chart-threshold-line"
                                            sx={{
                                                position: "absolute",
                                                top: "50%",
                                                left: 40,
                                                right: 40,
                                                height: 2,
                                                backgroundColor: "error.main",
                                                zIndex: 10,
                                                pointerEvents: "none"
                                            }} 
                                        />
                                    )}
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.expenses,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1 },
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
                                    title={t("dashboard1.expenses")}
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
                                            text: `${t("dashboard1.min")}${Math.min(...data.expenses).toFixed(2)}%`,
                                            showarrow: true,
                                            font: { size: 16, color: "#ffffff" },
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
                                            text: `${t("dashboard1.max")}${Math.max(...data.expenses).toFixed(2)}%`,
                                            showarrow: true,
                                            font: { size: 16, color: "#ffffff" },
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
                                    {`${t("dashboard1.average")}${(data.expenses.reduce((acc, curr) => acc + curr, 0) / data.expenses.length).toFixed(2)}%`}
                                </Typography>
                                </Box>
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
                                            line: { shape: "spline", smoothing: 1 },
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
                                    title={t("dashboard1.profit")}
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
                                            text: `${t("dashboard1.min")}${Math.min(...data.profit).toFixed(2)}%`,
                                            showarrow: true,
                                            font: { size: 16, color: "#ffffff" },
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
                                            text: `${t("dashboard1.max")}${Math.max(...data.profit).toFixed(2)}%`,
                                            showarrow: true,
                                            font: { size: 16, color: "#ffffff" },
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
                                    {`${t("dashboard1.average")}${(data.profit.reduce((acc, curr) => acc + curr, 0) / data.profit.length).toFixed(2)}%`}
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
                                            line: { shape: "spline", smoothing: 1 },
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
                                    title={t("dashboard1.growthRate")}
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
                                            text: `${t("dashboard1.min")}${Math.min(...data.growthRate).toFixed(2)}%`,
                                            showarrow: true,
                                            font: { size: 16, color: "#ffffff" },
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
                                            text: `${t("dashboard1.max")}${Math.max(...data.growthRate).toFixed(2)}%`,
                                            showarrow: true,
                                            font: { size: 16, color: "#ffffff" },
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
                                    {`${t("dashboard1.average")}${(data.growthRate.reduce((acc, curr) => acc + curr, 0) / data.growthRate.length).toFixed(2)}%`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};
