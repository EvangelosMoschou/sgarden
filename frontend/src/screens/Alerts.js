import { useState } from "react";
import { Box, Button, Grid, IconButton, Modal, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import useGlobalState from "../use-global-state.js";
import { availableMetrics } from "../utils/constants.js";

const Alerts = () => {
    const alerts = useGlobalState((state) => state.alerts) || [];
    const triggeredAlerts = useGlobalState((state) => state.triggeredAlerts) || [];
    const addAlert = useGlobalState((state) => state.addAlert);
    const updateAlert = useGlobalState((state) => state.updateAlert);
    const deleteAlert = useGlobalState((state) => state.deleteAlert);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [metric, setMetric] = useState("");
    const [operator, setOperator] = useState(">");
    const [threshold, setThreshold] = useState("");

    const handleOpenModal = () => {
        setMetric(availableMetrics[0] || "");
        setOperator(">");
        setThreshold("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveAlert = () => {
        if (!metric || !threshold) return;
        addAlert({ metric, operator, threshold: Number(threshold) });
        handleCloseModal();
    };

    return (
        <Box data-testid="alerts-page" p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="text.primary">Alerts</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={handleOpenModal}
                    data-testid="alerts-add-button"
                >
                    Create Alert
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" mb={2} color="text.primary">Alert Rules</Typography>
                    {alerts.length === 0 ? (
                        <Box data-testid="alerts-empty" p={3} textAlign="center">
                            <Typography color="text.secondary">No alert rules created yet.</Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={2}>
                            <Table data-testid="alerts-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Metric</TableCell>
                                        <TableCell>Condition</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {alerts.map((alert) => (
                                        <TableRow key={alert.id} data-testid={`alerts-row-${alert.id}`}>
                                            <TableCell>{alert.metric}</TableCell>
                                            <TableCell>{alert.operator} {alert.threshold}</TableCell>
                                            <TableCell>
                                                <Switch 
                                                    checked={alert.enabled} 
                                                    onChange={(e) => updateAlert(alert.id, { enabled: e.target.checked })}
                                                    data-testid={`alerts-toggle-${alert.id}`}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => deleteAlert(alert.id)}
                                                    data-testid={`alerts-delete-${alert.id}`}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="h6" mb={2} color="text.primary">Triggered Alerts</Typography>
                    <Paper elevation={2}>
                        <Box data-testid="alerts-triggered-list" p={2}>
                            {triggeredAlerts.length === 0 ? (
                                <Typography color="text.secondary" textAlign="center">No alerts triggered recently.</Typography>
                            ) : (
                                triggeredAlerts.map(ta => (
                                    <Box key={ta.id} data-testid={`alerts-triggered-item-${ta.id}`} p={2} mb={1} bgcolor="error.light" borderRadius={1}>
                                        <Typography variant="body2" color="error.contrastText">
                                            <strong>{ta.metric}</strong> {ta.operator} {ta.threshold}
                                        </Typography>
                                        <Typography variant="caption" color="error.contrastText">
                                            Value was {ta.value} at {new Date(ta.triggeredAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box 
                    data-testid="alerts-form"
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)', width: 400,
                        bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
                    }}
                >
                    <Typography variant="h6" mb={3} color="text.primary">Create New Alert</Typography>
                    
                    <FormControl fullWidth mb={2} sx={{ mb: 2 }}>
                        <InputLabel>Metric</InputLabel>
                        <Select
                            value={metric}
                            label="Metric"
                            onChange={(e) => setMetric(e.target.value)}
                            inputProps={{ "data-testid": "alerts-field-metric" }}
                        >
                            {availableMetrics.map(m => (
                                <MenuItem key={m} value={m}>{m}</MenuItem>
                            ))}
                            <MenuItem value="Revenue">Revenue</MenuItem>
                            <MenuItem value="Expenses">Expenses</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth mb={2} sx={{ mb: 2 }}>
                        <InputLabel>Operator</InputLabel>
                        <Select
                            value={operator}
                            label="Operator"
                            onChange={(e) => setOperator(e.target.value)}
                            inputProps={{ "data-testid": "alerts-field-operator" }}
                        >
                            <MenuItem value=">">Greater than ({`>`})</MenuItem>
                            <MenuItem value="<">Less than ({`<`})</MenuItem>
                            <MenuItem value="=">Equals (=)</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Threshold Value"
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        inputProps={{ "data-testid": "alerts-field-threshold" }}
                        sx={{ mb: 3 }}
                    />

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button 
                            variant="outlined" 
                            onClick={handleCloseModal}
                            data-testid="alerts-form-cancel"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleSaveAlert}
                            data-testid="alerts-form-submit"
                            disabled={!metric || !threshold}
                        >
                            Save Alert
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Alerts;
