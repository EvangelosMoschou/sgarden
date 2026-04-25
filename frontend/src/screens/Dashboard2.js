import { useEffect, useState } from "react";
import { Grid, Typography, Box } from "@mui/material";

import Dropdown from "../components/Dropdown.js";
import Card from "../components/Card.js";

import { getData } from "../api/index.js";

import { availableRegions } from "../utils/constants.js";

const Dashboard = () => {
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

    return (
        <Grid container py={2} flexDirection="column">
            <Typography variant="h4" gutterBottom color="white.main">
                Insights
            </Typography>

            <Grid item style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
                <Typography variant="body1" style={{ marginRight: "10px" }} color="white.main">Region:</Typography>
                <Dropdown
                    items={availableRegions.map((region) => ({ value: region, text: region }))}
                    value={selectedRegion}
                    onChange={(event) => setSelectedRegion(event.target.value)}
                />
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card title="Total Users">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{data.totalUsers || 0}</Typography>
                            <Typography variant="body2" color="secondary.main">Registered across platform</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card title="Active Projects">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{data.activeProjects || 0}</Typography>
                            <Typography variant="body2" color="secondary.main">Currently in progress</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card title="Budget Utilization">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{(data.budgetUtilization || 0).toFixed(1)}%</Typography>
                            <Typography variant="body2" color="secondary.main">Current quarter</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card title="Avg Response Time">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{data.avgResponseTime || 0}ms</Typography>
                            <Typography variant="body2" color="secondary.main">API performance</Typography>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card title="Regional Distribution Details">
                        <Box p={2}>
                            <Typography variant="body1" paragraph>
                                Detailed analytics for {selectedRegion} showing distribution of resources and user engagement metrics.
                            </Typography>
                            {/* Add more detailed visualizations here */}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
