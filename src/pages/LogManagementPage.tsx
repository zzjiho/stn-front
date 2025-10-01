import React, {useEffect, useState} from 'react';
import {Alert, Box, Pagination, Typography} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {useAppDispatch, useAppSelector} from '../store';
import {fetchAllDevicesAsync} from '../store/slices/deviceSlice';
import {clearError, createLogAsync, deleteLogAsync, fetchLogsAsync, updateLogAsync} from '../store/slices/logSlice';
import type {LogResponse} from '../types/index';
import {useLogSelection} from '../hooks/useLogSelection';
import {LogDialog, LogActions, createLogTableColumns} from '../components';


export default function LogManagementPage() {
    const dispatch = useAppDispatch();
    const {allDevices} = useAppSelector((state) => state.device);
    const {logs, isLoading, error, currentPageNo, sizePerPage, totalCnt} = useAppSelector((state) => state.log);

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<LogResponse | null>(null);

    const {
        selectedRows,
        handleSelectRow,
        handleSelectAll,
        isRowSelected,
        isAllSelected,
        isIndeterminate,
        clearSelection,
    } = useLogSelection(logs);

    useEffect(() => {
        dispatch(fetchLogsAsync({page: currentPageNo, size: sizePerPage}));
        dispatch(fetchAllDevicesAsync());
    }, [dispatch, currentPageNo, sizePerPage]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const handleAddLog = async (logData: {
        deviceId: number;
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number
    }) => {
        const resultAction = await dispatch(createLogAsync(logData));
        if (createLogAsync.fulfilled.match(resultAction)) {
            dispatch(fetchLogsAsync({page: 1, size: sizePerPage}));
            setAddDialogOpen(false);
        }
    };

    const handleEditLog = async (logData: {
        deviceId: number;
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number
    }) => {
        if (!editingLog) return;

        const resultAction = await dispatch(updateLogAsync({
            usageId: editingLog.usageId,
            logData
        }));

        if (updateLogAsync.fulfilled.match(resultAction)) {
            dispatch(fetchLogsAsync({page: currentPageNo, size: sizePerPage}));
            setEditDialogOpen(false);
            setEditingLog(null);
            clearSelection();
        }
    };

    const handleDeleteLog = async (usageId: number) => {
        const resultAction = await dispatch(deleteLogAsync(usageId));
        if (deleteLogAsync.fulfilled.match(resultAction)) {
            dispatch(fetchLogsAsync({page: currentPageNo, size: sizePerPage}));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRows.length > 0) {
            for (const usageId of selectedRows) {
                await dispatch(deleteLogAsync(Number(usageId)));
            }
            clearSelection();
            dispatch(fetchLogsAsync({page: currentPageNo, size: sizePerPage}));
        }
    };

    const handleEditOpen = () => {
        if (selectedRows.length === 1) {
            const usageId = Number(selectedRows[0]);
            const log = logs.find(l => l.usageId === usageId);
            if (log) {
                setEditingLog(log);
                setEditDialogOpen(true);
            }
        }
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        dispatch(fetchLogsAsync({page, size: sizePerPage}));
    };

    const columns = createLogTableColumns({
        onSelectRow: handleSelectRow,
        onSelectAll: handleSelectAll,
        onDeleteLog: handleDeleteLog,
        isRowSelected,
        isAllSelected,
        isIndeterminate,
    });

    return (
        <Box sx={{height: 600, width: '100%'}}>
            <Typography variant="h4" sx={{mb: 2}}>
                장치 사용량 목록
            </Typography>

            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}

            <LogActions
                selectedCount={selectedRows.length}
                onAdd={() => setAddDialogOpen(true)}
                onEdit={handleEditOpen}
                onBulkDelete={handleBulkDelete}
            />

            <DataGrid
                rows={logs}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.usageId}
                hideFooter
                autoHeight
                sx={{mb: 2}}
                initialState={{
                    sorting: {
                        sortModel: [{field: 'regDate', sort: 'desc'}],
                    },
                }}
            />

            <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                <Pagination
                    count={Math.ceil(totalCnt / sizePerPage)}
                    page={currentPageNo}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>

            <LogDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onSubmit={handleAddLog}
                title="새 사용량 추가"
                submitLabel="추가"
                devices={allDevices}
            />

            <LogDialog
                open={editDialogOpen}
                onClose={() => {
                    setEditDialogOpen(false);
                    setEditingLog(null);
                }}
                onSubmit={handleEditLog}
                title="사용량 수정"
                submitLabel="수정"
                log={editingLog}
                devices={allDevices}
            />
        </Box>
    );
}
