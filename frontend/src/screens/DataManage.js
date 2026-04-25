import React, { useState, useMemo } from "react";
import { Box, Button, Grid, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, TableSortLabel } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";
import useGlobalState from "../use-global-state.js";

const categories = ["Hardware", "Software", "Services", "Subscriptions", "Other"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const units = ["USD", "EUR", "GBP", "Count", "Hours"];

const DataManage = () => {
    const salesRecords = useGlobalState((state) => state.salesRecords) || [];
    const addSalesRecord = useGlobalState((state) => state.addSalesRecord);
    const updateSalesRecord = useGlobalState((state) => state.updateSalesRecord);
    const deleteSalesRecord = useGlobalState((state) => state.deleteSalesRecord);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [editingRecordId, setEditingRecordId] = useState(null);

    // Form state
    const [category, setCategory] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [value, setValue] = useState("");
    const [unit, setUnit] = useState("USD");
    const [notes, setNotes] = useState("");

    // Table state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecordId(record.id);
            setCategory(record.category || "");
            setMonth(record.month || "");
            setYear(record.year || new Date().getFullYear());
            setValue(record.value || "");
            setUnit(record.unit || "USD");
            setNotes(record.notes || "");
        } else {
            setEditingRecordId(null);
            setCategory("");
            setMonth("");
            setYear(new Date().getFullYear());
            setValue("");
            setUnit("USD");
            setNotes("");
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecordId(null);
    };

    const handleSaveRecord = () => {
        const payload = { category, month, year: Number(year), value: Number(value), unit, notes };
        if (editingRecordId) {
            updateSalesRecord(editingRecordId, payload);
        } else {
            addSalesRecord(payload);
        }
        handleCloseModal();
    };

    const confirmDelete = (id) => {
        setRecordToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (recordToDelete) {
            deleteSalesRecord(recordToDelete);
        }
        setIsDeleteDialogOpen(false);
        setRecordToDelete(null);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedRecords = useMemo(() => {
        return [...salesRecords].sort((a, b) => {
            let valA = a[orderBy];
            let valB = b[orderBy];
            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [salesRecords, order, orderBy]);

    const paginatedRecords = sortedRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box data-testid="sales-data-page" p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="text.primary">Manage Sales Data</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenModal()}
                    data-testid="sales-data-add-button"
                >
                    Add Record
                </Button>
            </Box>

            <Paper elevation={2}>
                {salesRecords.length === 0 ? (
                    <Box data-testid="sales-data-empty" p={5} textAlign="center">
                        <Typography color="text.secondary">No sales records found. Add a record to get started.</Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table data-testid="sales-data-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel active={orderBy === 'category'} direction={orderBy === 'category' ? order : 'asc'} onClick={() => handleRequestSort('category')}>
                                                Category
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel active={orderBy === 'month'} direction={orderBy === 'month' ? order : 'asc'} onClick={() => handleRequestSort('month')}>
                                                Month
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel active={orderBy === 'year'} direction={orderBy === 'year' ? order : 'asc'} onClick={() => handleRequestSort('year')}>
                                                Year
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel active={orderBy === 'value'} direction={orderBy === 'value' ? order : 'asc'} onClick={() => handleRequestSort('value')}>
                                                Value
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Unit</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedRecords.map((record) => (
                                        <TableRow key={record.id} data-testid={`sales-data-row-${record.id}`}>
                                            <TableCell>{record.category}</TableCell>
                                            <TableCell>{record.month}</TableCell>
                                            <TableCell>{record.year}</TableCell>
                                            <TableCell>{record.value}</TableCell>
                                            <TableCell>{record.unit}</TableCell>
                                            <TableCell align="right">
                                                <IconButton 
                                                    color="primary" 
                                                    onClick={() => handleOpenModal(record)}
                                                    data-testid={`sales-data-edit-${record.id}`}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => confirmDelete(record.id)}
                                                    data-testid={`sales-data-delete-${record.id}`}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            data-testid="sales-data-pagination"
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={salesRecords.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Paper>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box 
                    data-testid="sales-data-form"
                    sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)', width: 500,
                        bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
                    }}
                >
                    <Typography variant="h6" mb={3} color="text.primary">
                        {editingRecordId ? "Edit Record" : "Add New Record"}
                    </Typography>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                            inputProps={{ "data-testid": "sales-data-field-category" }}
                        >
                            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Month</InputLabel>
                                <Select
                                    value={month}
                                    label="Month"
                                    onChange={(e) => setMonth(e.target.value)}
                                    inputProps={{ "data-testid": "sales-data-field-month" }}
                                >
                                    {months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Year"
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                inputProps={{ "data-testid": "sales-data-field-year" }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                label="Value"
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                inputProps={{ "data-testid": "sales-data-field-value" }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel>Unit</InputLabel>
                                <Select
                                    value={unit}
                                    label="Unit"
                                    onChange={(e) => setUnit(e.target.value)}
                                    inputProps={{ "data-testid": "sales-data-field-unit" }}
                                >
                                    {units.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        label="Notes"
                        multiline
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        inputProps={{ "data-testid": "sales-data-field-notes" }}
                        sx={{ mb: 3 }}
                    />

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button 
                            variant="outlined" 
                            onClick={handleCloseModal}
                            data-testid="sales-data-form-cancel"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleSaveRecord}
                            data-testid="sales-data-form-submit"
                            disabled={!category || !month || !year || value === ""}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this record?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} data-testid="sales-data-delete-cancel">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" data-testid="sales-data-delete-confirm">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DataManage;
