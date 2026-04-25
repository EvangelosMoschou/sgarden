import { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, Switch, FormControlLabel, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Card from '../components/Card.js';
import useGlobalState from '../use-global-state.js';

const Settings = () => {
    const globalDefaultPageSize = useGlobalState(state => state.defaultPageSize);
    const globalDefaultDashboard = useGlobalState(state => state.defaultDashboard);
    const globalDateFormat = useGlobalState(state => state.dateFormat);
    const globalSidebarCollapsed = useGlobalState(state => state.sidebarCollapsed);
    
    const setDefaultPageSize = useGlobalState(state => state.setDefaultPageSize);
    const setDefaultDashboard = useGlobalState(state => state.setDefaultDashboard);
    const setDateFormat = useGlobalState(state => state.setDateFormat);
    const setSidebarCollapsed = useGlobalState(state => state.setSidebarCollapsed);

    const [pageSize, setPageSize] = useState(globalDefaultPageSize);
    const [dashboard, setDashboard] = useState(globalDefaultDashboard);
    const [dateFormat, setDateFormatLocal] = useState(globalDateFormat);
    const [sidebarCollapsed, setSidebarCollapsedLocal] = useState(globalSidebarCollapsed);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setPageSize(globalDefaultPageSize);
        setDashboard(globalDefaultDashboard);
        setDateFormatLocal(globalDateFormat);
        setSidebarCollapsedLocal(globalSidebarCollapsed);
    }, [globalDefaultPageSize, globalDefaultDashboard, globalDateFormat, globalSidebarCollapsed]);

    const handleSave = () => {
        setDefaultPageSize(pageSize);
        setDefaultDashboard(dashboard);
        setDateFormat(dateFormat);
        setSidebarCollapsed(sidebarCollapsed);
        
        setSuccessMessage('Preferences saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <Grid container py={2} flexDirection="column" data-testid="settings-page">
            <Typography variant="h4" color="white.main" mb={2}>
                Global Settings
            </Typography>

            {successMessage && (
                <Box mb={2} p={2} bgcolor="success.light" borderRadius={1}>
                    <Typography color="success.main" data-testid="settings-success-message">
                        {successMessage}
                    </Typography>
                </Box>
            )}

            <Grid item xs={12} md={8} lg={6}>
                <Card title="Preferences">
                    <Box display="flex" flexDirection="column" gap={3}>
                        
                        <FormControl fullWidth>
                            <InputLabel id="page-size-label">Default Page Size</InputLabel>
                            <Select
                                labelId="page-size-label"
                                value={pageSize}
                                label="Default Page Size"
                                onChange={(e) => setPageSize(e.target.value)}
                                inputProps={{ "data-testid": "settings-page-size" }}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="default-dashboard-label">Default Dashboard</InputLabel>
                            <Select
                                labelId="default-dashboard-label"
                                value={dashboard}
                                label="Default Dashboard"
                                onChange={(e) => setDashboard(e.target.value)}
                                inputProps={{ "data-testid": "settings-default-dashboard" }}
                            >
                                <MenuItem value="/dashboard">Overview</MenuItem>
                                <MenuItem value="/dashboard1">Analytics</MenuItem>
                                <MenuItem value="/dashboard2">Insights</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="date-format-label">Date Format</InputLabel>
                            <Select
                                labelId="date-format-label"
                                value={dateFormat}
                                label="Date Format"
                                onChange={(e) => setDateFormatLocal(e.target.value)}
                                inputProps={{ "data-testid": "settings-date-format" }}
                            >
                                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={sidebarCollapsed}
                                    onChange={(e) => setSidebarCollapsedLocal(e.target.checked)}
                                    inputProps={{ "data-testid": "settings-sidebar-collapsed" }}
                                />
                            }
                            label="Collapse Sidebar by Default"
                        />

                        <Box mt={2}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleSave}
                                data-testid="settings-save-button"
                            >
                                Save Preferences
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Settings;