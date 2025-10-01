import React, {useEffect, useState} from 'react';
import {Alert, Box, Pagination, Typography} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {useAppDispatch, useAppSelector} from '../store';
import {
    clearError,
    createDeviceAsync,
    deleteDeviceAsync,
    fetchDevicesAsync,
    updateDeviceAsync
} from '../store/slices/deviceSlice';
import type {Device} from '../types/index';
import {useDeviceSelection} from '../hooks/useDeviceSelection';
import {DeviceDialog, DeviceActions, createDeviceTableColumns} from '../components';

export default function DeviceManagementPage() {
    const dispatch = useAppDispatch();
    const {
        devices,
        isLoading,
        error,
        currentPageNo,
        sizePerPage,
        totalCnt,
    } = useAppSelector((state) => state.device);

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState<Device | null>(null);

    const {
        selectedRows,
        handleSelectRow,
        handleSelectAll,
        isRowSelected,
        isAllSelected,
        isIndeterminate,
        clearSelection,
    } = useDeviceSelection(devices);

    useEffect(() => {
        dispatch(fetchDevicesAsync({page: currentPageNo, size: sizePerPage}));
    }, [dispatch, currentPageNo, sizePerPage]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const handleAddDevice = async (deviceData: { title: string; modelName: string }) => {
        const resultAction = await dispatch(createDeviceAsync(deviceData));
        if (createDeviceAsync.fulfilled.match(resultAction)) {
            dispatch(fetchDevicesAsync({page: 1, size: sizePerPage}));
            setAddDialogOpen(false);
        }
    };

    const handleEditDevice = async (deviceData: { title: string; modelName: string }) => {
        if (!editingDevice) return;

        const resultAction = await dispatch(updateDeviceAsync({
            deviceId: editingDevice.deviceId,
            deviceData
        }));

        if (updateDeviceAsync.fulfilled.match(resultAction)) {
            dispatch(fetchDevicesAsync({page: currentPageNo, size: sizePerPage}));
            setEditDialogOpen(false);
            setEditingDevice(null);
            clearSelection();
        }
    };

    const handleDeleteDevice = async (deviceId: number) => {
        const resultAction = await dispatch(deleteDeviceAsync(deviceId));
        if (deleteDeviceAsync.fulfilled.match(resultAction)) {
            dispatch(fetchDevicesAsync({page: currentPageNo, size: sizePerPage}));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRows.length > 0) {
            for (const deviceId of selectedRows) {
                await dispatch(deleteDeviceAsync(Number(deviceId)));
            }
            clearSelection();
            dispatch(fetchDevicesAsync({page: currentPageNo, size: sizePerPage}));
        }
    };

    const handleEditOpen = () => {
        if (selectedRows.length === 1) {
            const deviceId = Number(selectedRows[0]);
            const device = devices.find(d => d.deviceId === deviceId);
            if (device) {
                setEditingDevice(device);
                setEditDialogOpen(true);
            }
        }
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        dispatch(fetchDevicesAsync({page, size: sizePerPage}));
    };

    const columns = createDeviceTableColumns({
        onSelectRow: handleSelectRow,
        onSelectAll: handleSelectAll,
        onDeleteDevice: handleDeleteDevice,
        isRowSelected,
        isAllSelected,
        isIndeterminate,
    });

    return (
        <Box sx={{height: 600, width: '100%'}}>
            <Typography variant="h4" sx={{mb: 2}}>
                장치 관리
            </Typography>

            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}

            <DeviceActions
                selectedCount={selectedRows.length}
                onAdd={() => setAddDialogOpen(true)}
                onEdit={handleEditOpen}
                onBulkDelete={handleBulkDelete}
            />

            <DataGrid
                rows={devices}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.deviceId}
                hideFooter
                autoHeight
                sx={{mb: 2}}
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

            <DeviceDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onSubmit={handleAddDevice}
                title="새 장치 추가"
                submitLabel="추가"
            />

            <DeviceDialog
                open={editDialogOpen}
                onClose={() => {
                    setEditDialogOpen(false);
                    setEditingDevice(null);
                }}
                onSubmit={handleEditDevice}
                title="장치 수정"
                submitLabel="수정"
                device={editingDevice}
            />
        </Box>
    );
}