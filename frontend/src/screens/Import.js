import React, { useState, useCallback, useRef } from 'react';
import { Grid, Typography, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Papa from 'papaparse';
import Card from '../components/Card.js';

const Import = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [summary, setSummary] = useState(null);
    const fileInputRef = useRef(null);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        handleFile(droppedFile);
    }, []);

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const handleFile = (selectedFile) => {
        if (selectedFile) {
            setFile(selectedFile);
            setSummary(null);

            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setData(results.data);
                    validateData(results.data);
                },
                error: (error) => {
                    setErrors([{ message: `File parsing error: ${error.message}` }]);
                }
            });
        }
    };

    const validateData = (parsedData) => {
        const validationErrors = [];
        parsedData.forEach((row, index) => {
            let hasError = false;
            for (const key in row) {
                if (!row[key] || row[key].trim() === '') {
                    hasError = true;
                    break;
                }
            }
            if (hasError) {
                validationErrors.push(index);
            }
        });
        setErrors(validationErrors);
    };

    const handleSubmit = () => {
        // Mock import API call
        const successfulRows = data.length - errors.length;
        setSummary(`Import successful: ${successfulRows} rows inserted, ${errors.length} errors skipped.`);
        setData([]);
        setFile(null);
    };

    const handleCancel = () => {
        setFile(null);
        setData([]);
        setErrors([]);
        setSummary(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Grid container py={2} flexDirection="column" data-testid="import-page">
            <Typography variant="h4" color="white.main" mb={2}>
                Data Import
            </Typography>

            <Grid item xs={12}>
                <Card title="Upload File">
                    <Box
                        data-testid="import-dropzone"
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                            border: '2px dashed #1976d2',
                            borderRadius: '8px',
                            padding: '40px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)'
                            }
                        }}
                    >
                        <Typography variant="h6" color="primary.main">
                            Drag and drop a CSV file here, or click to select
                        </Typography>
                        <input
                            type="file"
                            accept=".csv"
                            style={{ display: 'none' }}
                            data-testid="import-file-input"
                            ref={fileInputRef}
                            onChange={(e) => handleFile(e.target.files[0])}
                        />
                        {file && (
                            <Typography data-testid="import-file-name" mt={2} color="text.secondary">
                                Selected file: {file.name}
                            </Typography>
                        )}
                    </Box>
                </Card>
            </Grid>

            {data.length > 0 && (
                <Grid item xs={12} mt={3}>
                    <Card title="Preview Data">
                        {errors.length > 0 && (
                            <Box mb={2} p={2} bgcolor="error.light" borderRadius={1}>
                                <Typography color="error.main" data-testid="import-error-message">
                                    Found {errors.length} validation errors. Rows with missing data are highlighted.
                                </Typography>
                            </Box>
                        )}
                        
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                            <Table stickyHeader data-testid="import-preview-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        {Object.keys(data[0] || {}).map((header, i) => (
                                            <TableCell key={i}>{header}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, index) => {
                                        const isError = errors.includes(index);
                                        return (
                                            <TableRow 
                                                key={index}
                                                data-testid={isError ? `import-error-row-${index}` : `import-preview-row-${index}`}
                                                sx={{ backgroundColor: isError ? 'error.light' : 'inherit' }}
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                {Object.values(row).map((val, i) => (
                                                    <TableCell key={i}>{val}</TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box mt={3} display="flex" gap={2}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                data-testid="import-submit"
                                onClick={handleSubmit}
                            >
                                Confirm Import
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="secondary" 
                                data-testid="import-cancel"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            )}

            {summary && (
                <Grid item xs={12} mt={3}>
                    <Box p={3} bgcolor="success.light" borderRadius={2}>
                        <Typography variant="h6" color="success.main" data-testid="import-summary">
                            {summary}
                        </Typography>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default Import;