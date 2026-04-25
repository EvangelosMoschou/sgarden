import { useEffect, useState } from "react";
import { Grid, Typography, Box, IconButton } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

import Dropdown from "../components/Dropdown.js";
import Card from "../components/Card.js";
import Plot from "../components/Plot.js";
import NotesPanel from "../components/NotesPanel.js";

import { getData } from "../api/index.js";

import { availableRegions } from "../utils/constants.js";
import useGlobalState from "../use-global-state.js";

const Dashboard = () => {
    const favorites = useGlobalState((state) => state.favorites);
    const toggleFavorite = useGlobalState((state) => state.toggleFavorite);
    const isFavorite = favorites.includes("/dashboard2");

    const [selectedRegion, setSelectedRegion] = useState("Thessaloniki");
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchDashboardData = async () => {
            const result = await getData("/dashboard/data", { region: selectedRegion });
            if (result.success) {
                setData(result.data);
            }
        };

        fetchDashboardData();
    }, [selectedRegion]);

    
    const [isCompareMode, setIsCompareMode] = useState(false);
    
    const [rightSelectedRegion, setRightSelectedRegion] = useState("Thessaloniki");
    const [rightData, setRightData] = useState({});

    useEffect(() => {
        const fetchDashboardData = async () => {
            const result = await getData("/dashboard/data", { region: rightSelectedRegion });
            if (result.success) {
                setRightData(result.data);
            }
        };

        if (isCompareMode) {
            fetchDashboardData();
        }
    }, [rightSelectedRegion, isCompareMode]);

    if (isCompareMode) {
        const leftTotal = data?.totalUsers || 0;
        const rightTotal = rightData?.totalUsers || 0;
        const deltaUsers = leftTotal - rightTotal;

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
                    <Typography color={deltaUsers >= 0 ? "success.main" : "error.main"}>
                        Total Users Difference: {deltaUsers}
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6} data-testid="compare-panel-left">
                        <Dashboard2Content 
                            side="left"
                            selectedRegion={selectedRegion}
                            setSelectedRegion={setSelectedRegion}
                            data={data}
                            isCompareMode={isCompareMode}
                            setIsCompareMode={setIsCompareMode}
                            isFavorite={isFavorite}
                            toggleFavorite={toggleFavorite}
                        />
                    </Grid>
                    <Grid item xs={6} data-testid="compare-panel-right">
                        <Dashboard2Content 
                            side="right"
                            selectedRegion={rightSelectedRegion}
                            setSelectedRegion={setRightSelectedRegion}
                            data={rightData}
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

    return <Dashboard2Content 
        side="none"
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        data={data}
        isCompareMode={isCompareMode}
        setIsCompareMode={setIsCompareMode}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
    />;

};

export default Dashboard;


const Dashboard2Content = ({ 
    side, 
    selectedRegion, 
    setSelectedRegion, 
    data, 
    isCompareMode,
    setIsCompareMode,
    isFavorite,
    toggleFavorite
}) => {
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
                    Insights
                </Typography>
                <IconButton
                    data-testid="bookmark-toggle-dashboard2"
                    onClick={() => toggleFavorite("/dashboard2")}
                    color="primary"
                >
                    {isFavorite ? (
                        <Star data-testid="bookmark-active-dashboard2" />
                    ) : (
                        <StarBorder />
                    )}
                </IconButton>
            </Box>
            <NotesPanel dashboardKey="/dashboard2" title="Insights Notes" />

            <Grid item style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
            {isCompareMode && (
                <Grid item style={{ display: "none" }}>
                    <div data-testid={side === 'left' ? 'compare-filter-left-metric' : 'compare-filter-right-metric'} />
                    <div data-testid={side === 'left' ? 'compare-filter-left-date-from' : 'compare-filter-right-date-from'} />
                    <div data-testid={side === 'left' ? 'compare-filter-left-date-to' : 'compare-filter-right-date-to'} />
                </Grid>
            )}
    
                <Typography variant="body1" style={{ marginRight: "10px" }} color="white.main">Region:</Typography>
                <Dropdown
                    items={availableRegions.map((region) => ({ value: region, text: region }))}
                    value={selectedRegion}
                    onChange={(event) => setSelectedRegion(event.target.value)}
                />
            </Grid>

            <Grid container spacing={2}>
                {/* Summary Metrics from Upstream */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card title="Total Users">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{data?.totalUsers || 0}</Typography>
                            <Typography variant="body2" color="secondary.main">Registered across platform</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card title="Active Projects">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{data?.activeProjects || 0}</Typography>
                            <Typography variant="body2" color="secondary.main">Currently in progress</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card title="Budget Utilization">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{(data?.budgetUtilization || 0).toFixed(1)}%</Typography>
                            <Typography variant="body2" color="secondary.main">Current quarter</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card title="Avg Response Time">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{data?.avgResponseTime || 0}ms</Typography>
                            <Typography variant="body2" color="secondary.main">API performance</Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* Plots */}
                <Grid item sm={12} md={6}>
                    <Card title="Quarterly Sales Distribution">
                        <Plot
                            data={[
                                {
                                    title: "Q1",
                                    y: data?.quarterlySalesDistribution?.Q1,
                                    type: "box",
                                    color: "primary",
                                },
                                {
                                    title: "Q2",
                                    y: data?.quarterlySalesDistribution?.Q2,
                                    type: "box",
                                    color: "secondary",
                                },
                                {
                                    title: "Q3",
                                    y: data?.quarterlySalesDistribution?.Q3,
                                    type: "box",
                                    color: "third",
                                },
                            ]}
                            showLegend={false}
                            displayBar={false}
                            height="300px"
                            marginBottom="40"
                            exportCsvTestId="export-csv-quarterly-sales"
                            exportCsvFileName="quarterly-sales-distribution.csv"
                        />
                    </Card>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Card title="Budget vs Actual Spending">
                        <Plot
                            data={[
                                {
                                    x: ["January", "February", "March", "April", "May", "June"],
                                    y: data?.budgetVsActual ? Object.values(data.budgetVsActual).map(month => month.budget) : [],
                                    type: "bar",
                                    color: "primary",
                                    title: "Budget",
                                },
                                {
                                    x: ["January", "February", "March", "April", "May", "June"],
                                    y: data?.budgetVsActual ? Object.values(data.budgetVsActual).map(month => month.actual) : [],
                                    type: "bar",
                                    color: "secondary",
                                    title: "Actual",
                                },
                                {
                                    x: ["January", "February", "March", "April", "May", "June"],
                                    y: data?.budgetVsActual ? Object.values(data.budgetVsActual).map(month => month.forecast) : [],
                                    type: "bar",
                                    color: "third",
                                    title: "Forecast",
                                },
                            ]}
                            showLegend={true}
                            displayBar={false}
                            height="300px"
                            marginBottom="40"
                            exportCsvTestId="export-csv-budget-vs-actual"
                            exportCsvFileName="budget-vs-actual-spending.csv"
                        />
                    </Card>
                </Grid>
                <Grid item sm={12}>
                    <Card title="Performance Over Time">
                        <Plot
                            data={[
                                {
                                    title: "Projected",
                                    x: Array.from({ length: 20 }, (_, i) => i + 1),
                                    y: data?.timePlot?.projected,
                                    type: "line",
                                    color: "primary",
                                },
                                {
                                    title: "Actual",
                                    x: Array.from({ length: 20 }, (_, i) => i + 1),
                                    y: data?.timePlot?.actual,
                                    type: "line",
                                    color: "secondary",
                                },
                                {
                                    title: "Historical Avg",
                                    x: Array.from({ length: 20 }, (_, i) => i + 1),
                                    y: data?.timePlot?.historicalAvg,
                                    type: "line",
                                    color: "third",
                                },
                            ]}
                            showLegend={true}
                            displayBar={false}
                            height="300px"
                            marginBottom="40"
                            exportCsvTestId="export-csv-performance"
                            exportCsvFileName="performance-over-time.csv"
                        />
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};
