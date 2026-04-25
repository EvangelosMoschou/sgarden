import { useState, useEffect } from "react";
import { 
    Grid, 
    Typography, 
    Box, 
    Button, 
    TextField, 
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import api from "../api/index.js";

const Activity = () => {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({
        user: "",
        action: "",
        dateFrom: "",
        dateTo: ""
    });

    const fetchActivity = async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 10,
                ...(filters.user && { user: filters.user }),
                ...(filters.action && { action: filters.action }),
                ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
                ...(filters.dateTo && { dateTo: filters.dateTo })
            };
            
            const response = await api.get("activity", params);
            if (response.success) {
                setLogs(response.logs);
                setPagination({
                    currentPage: response.currentPage,
                    totalPages: response.totalPages
                });
            }
        } catch (error) {
            console.error("Error fetching activity logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, [filters, pagination.currentPage]);

    const handleFilterChange = (field) => (event) => {
        setFilters({ ...filters, [field]: event.target.value });
        setPagination({ ...pagination, currentPage: 1 });
    };

    return (
        <Grid container py={2} flexDirection="column" data-testid="activity-page">
            <Typography variant="h4" gutterBottom color="white.main" px={2}>
                Activity Log
            </Typography>

            <Box p={2} display="flex" gap={2} flexWrap="wrap" bgcolor="background.paper" borderRadius={1} mx={2} mb={2}>
                <TextField
                    label="User ID"
                    variant="outlined"
                    size="small"
                    value={filters.user}
                    onChange={handleFilterChange("user")}
                    inputProps={{ "data-testid": "activity-filter-user" }}
                />

                <TextField
                    select
                    label="Action"
                    size="small"
                    sx={{ minWidth: 150 }}
                    value={filters.action}
                    onChange={handleFilterChange("action")}
                    inputProps={{ "data-testid": "activity-filter-action" }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="login">Login</MenuItem>
                    <MenuItem value="profile_update">Profile Update</MenuItem>
                    <MenuItem value="password_change">Password Change</MenuItem>
                    <MenuItem value="dashboard_view">Dashboard View</MenuItem>
                </TextField>

                <TextField
                    label="Date From"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={filters.dateFrom}
                    onChange={handleFilterChange("dateFrom")}
                    inputProps={{ "data-testid": "activity-filter-date-from" }}
                />

                <TextField
                    label="Date To"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={filters.dateTo}
                    onChange={handleFilterChange("dateTo")}
                    inputProps={{ "data-testid": "activity-filter-date-to" }}
                />
            </Box>

            <Box px={2}>
                <TableContainer component={Paper} data-testid="activity-table">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" data-testid="activity-empty">
                                        No logs match the current filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log._id} data-testid={`activity-row-${log._id}`}>
                                        <TableCell>
                                            {new Date(log.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {log.userId ? log.userId.username || log.userId.email || log.userId : "Unknown"}
                                        </TableCell>
                                        <TableCell sx={{ textTransform: "capitalize" }}>
                                            {log.action.replace("_", " ")}
                                        </TableCell>
                                        <TableCell>
                                            {log.details || "-"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {!loading && logs.length > 0 && (
                    <Box mt={2} display="flex" justifyContent="center" alignItems="center" gap={2} data-testid="activity-pagination">
                        <IconButton 
                            data-testid="activity-pagination-prev"
                            disabled={pagination.currentPage <= 1}
                            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                        >
                            <ChevronLeft />
                        </IconButton>
                        
                        <Typography>
                            Page {pagination.currentPage} of {Math.max(1, pagination.totalPages)}
                        </Typography>
                        
                        <IconButton 
                            data-testid="activity-pagination-next"
                            disabled={pagination.currentPage >= pagination.totalPages}
                            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Grid>
    );
};

export default Activity;
