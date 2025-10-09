import {useCallback, useEffect, useState} from 'react';
import type {Device, DeviceRequest} from '../types/index';
import {deviceService} from '../services/deviceService';
import {useDeviceSelection} from './useDeviceSelection';
import {ApiException} from '../exceptions/ApiException';

export function useDeviceManagement() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPageNo, setCurrentPageNo] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);

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

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await deviceService.getDevices({ page: currentPageNo, size: sizePerPage });
            const { devices, currentPageNo: newCurrentPageNo, sizePerPage: newSizePerPage, totalCnt } = response.data;
            setDevices(devices);
            setCurrentPageNo(Math.max(1, newCurrentPageNo));
            setSizePerPage(newSizePerPage);
            setTotalCnt(totalCnt);
        } catch (e) {
            if (e instanceof ApiException) {
                setError(e.message);
            } else {
                console.error(e);
                setError('알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentPageNo, sizePerPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleAddDevice = async (deviceData: DeviceRequest) => {
        try {
            await deviceService.createDevice(deviceData);
            setAddDialogOpen(false);
            await fetchData();
        } catch (e) {
            if (e instanceof ApiException) setError(e.message);
        }
    };

    const handleEditDevice = async (deviceData: DeviceRequest) => {
        if (!editingDevice) return;
        try {
            await deviceService.updateDevice(editingDevice.deviceId, deviceData);
            setEditDialogOpen(false);
            setEditingDevice(null);
            clearSelection();
            await fetchData();
        } catch (e) {
            if (e instanceof ApiException) setError(e.message);
        }
    };

    const handleDeleteDevice = async (deviceId: number) => {
        try {
            await deviceService.deleteDevice(deviceId);
            await fetchData();
        } catch (e) {
            if (e instanceof ApiException) setError(e.message);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRows.length > 0) {
            try {
                for (const deviceId of selectedRows) {
                    await deviceService.deleteDevice(Number(deviceId));
                }
                clearSelection();
                await fetchData();
            } catch (e) {
                if (e instanceof ApiException) setError(e.message);
            }
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
        setCurrentPageNo(page);
    };

    return {
        devices,
        isLoading,
        error,
        currentPageNo,
        sizePerPage,
        totalCnt,
        addDialogOpen,
        setAddDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        editingDevice,
        setEditingDevice,
        selectedRows,
        handleSelectRow,
        handleSelectAll,
        isRowSelected,
        isAllSelected,
        isIndeterminate,
        handleAddDevice,
        handleEditDevice,
        handleDeleteDevice,
        handleBulkDelete,
        handleEditOpen,
        handlePageChange,
    };
}