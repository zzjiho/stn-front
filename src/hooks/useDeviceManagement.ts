import {useCallback, useEffect, useState} from 'react';
import type {Device, DeviceRequest} from '../types/index';
import {deviceService} from '../services/deviceService';
import {useDeviceSelection} from './useDeviceSelection';

export function useDeviceManagement() {

    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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

        const response = await deviceService.getDevices({
            page: currentPageNo,
            size: sizePerPage
        }).catch(() => null);

        if (response) {
            const { devices, currentPageNo: newCurrentPageNo, sizePerPage: newSizePerPage, totalCnt } = response.data;
            setDevices(devices);
            setCurrentPageNo(Math.max(1, newCurrentPageNo));
            setSizePerPage(newSizePerPage);
            setTotalCnt(totalCnt);
        }

        setIsLoading(false);
    }, [currentPageNo, sizePerPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddDevice = async (deviceData: DeviceRequest) => {
        const result = await deviceService.createDevice(deviceData).catch(() => null);
        if (result) {
            setAddDialogOpen(false);
            await fetchData();
        }
    };

    const handleEditDevice = async (deviceData: DeviceRequest) => {
        if (!editingDevice) return;

        const result = await deviceService.updateDevice(editingDevice.deviceId, deviceData).catch(() => null);
        if (result) {
            setEditDialogOpen(false);
            setEditingDevice(null);
            clearSelection();
            await fetchData();
        }
    };

    const handleDeleteDevice = async (deviceId: number) => {
        const result = await deviceService.deleteDevice(deviceId).catch(() => null);
        if (result) {
            await fetchData();
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRows.length > 0) {
            for (const deviceId of selectedRows) {
                await deviceService.deleteDevice(Number(deviceId)).catch(() => null);
            }
            clearSelection();
            await fetchData();
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