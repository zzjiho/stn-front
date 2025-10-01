/**
 * 장치 관리 비즈니스 로직을 처리하는 Custom Hook
 */

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
    clearError,
    createDeviceAsync,
    deleteDeviceAsync,
    fetchDevicesAsync,
    updateDeviceAsync
} from '../store/slices/deviceSlice';
import type { Device } from '../types/index';
import { useDeviceSelection } from './useDeviceSelection';

export function useDeviceManagement() {
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

    // 초기 데이터 로드 및 페이지 변경 시 데이터 로드
    useEffect(() => {
        dispatch(fetchDevicesAsync({page: currentPageNo, size: sizePerPage}));
    }, [dispatch, currentPageNo, sizePerPage]);

    // 에러 자동 제거 (5초 후)
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    // 장치 추가
    const handleAddDevice = async (deviceData: { title: string; modelName: string }) => {
        const resultAction = await dispatch(createDeviceAsync(deviceData));
        if (createDeviceAsync.fulfilled.match(resultAction)) {
            dispatch(fetchDevicesAsync({page: 1, size: sizePerPage}));
            setAddDialogOpen(false);
        }
    };

    // 장치 수정
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

    // 장치 삭제
    const handleDeleteDevice = async (deviceId: number) => {
        await dispatch(deleteDeviceAsync(deviceId));
    };

    // 선택한 장치 일괄 삭제
    const handleBulkDelete = async () => {
        if (selectedRows.length > 0) {
            for (const deviceId of selectedRows) {
                await dispatch(deleteDeviceAsync(Number(deviceId)));
            }
            clearSelection();
        }
    };

    // 수정 다이얼로그 열기
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

    // 페이지 변경
    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        dispatch(fetchDevicesAsync({page, size: sizePerPage}));
    };

    return {
        // 상태
        devices,
        isLoading,
        error,
        currentPageNo,
        sizePerPage,
        totalCnt,

        // 다이얼로그 상태
        addDialogOpen,
        setAddDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        editingDevice,
        setEditingDevice,

        // Selection 관련
        selectedRows,
        handleSelectRow,
        handleSelectAll,
        isRowSelected,
        isAllSelected,
        isIndeterminate,

        // 핸들러
        handleAddDevice,
        handleEditDevice,
        handleDeleteDevice,
        handleBulkDelete,
        handleEditOpen,
        handlePageChange,
    };
}
