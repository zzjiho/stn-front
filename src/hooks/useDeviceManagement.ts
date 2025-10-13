import {useCallback, useEffect, useState} from 'react';
import type {Device, DeviceRequest} from '../types/index';
import {deviceService} from '../services/deviceService';
import {useDeviceSelection} from './useDeviceSelection';
import {usePagination} from './usePagination';

export function useDeviceManagement() {

    // 데이터 상태
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 다이얼로그 상태
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState<Device | null>(null);

    // 페이지네이션
    const {
        currentPageNo,
        sizePerPage,
        totalCnt,
        handlePageChange,
        setPaginationData
    } = usePagination();

    // 행 선택 기능 (체크박스)
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
            const {devices, currentPageNo, sizePerPage, totalCnt} = response.data;
            setDevices(devices);
            setPaginationData({total: totalCnt, current: currentPageNo, size: sizePerPage});
        }

        setIsLoading(false);
    }, [currentPageNo, sizePerPage, setPaginationData]);

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

    return {
        // 데이터
        devices,
        isLoading,
        currentPageNo,
        sizePerPage,
        totalCnt,

        // 추가 다이얼로그
        addDialogOpen,
        setAddDialogOpen,

        // 수정 다이얼로그
        editDialogOpen,
        setEditDialogOpen,
        editingDevice,
        setEditingDevice,

        // 행 선택 (체크박스)
        selectedRows,
        handleSelectRow,
        handleSelectAll,
        isRowSelected,
        isAllSelected,
        isIndeterminate,

        // 액션 핸들러
        handleAddDevice,
        handleEditDevice,
        handleDeleteDevice,
        handleBulkDelete,
        handleEditOpen,
        handlePageChange,
    };
}