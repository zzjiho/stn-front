/**
 * 로그(장치 사용량) 관리 비즈니스 로직을 처리하는 Custom Hook
 */

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchAllDevicesAsync } from '../store/slices/deviceSlice';
import { clearError, createLogAsync, deleteLogAsync, fetchLogsAsync, updateLogAsync } from '../store/slices/logSlice';
import type { LogResponse } from '../types/index';
import { useLogSelection } from './useLogSelection';

export function useLogManagement() {
    const dispatch = useAppDispatch();
    const { allDevices } = useAppSelector((state) => state.device);
    const { logs, isLoading, error, currentPageNo, sizePerPage, totalCnt } = useAppSelector((state) => state.log);

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

    // 초기 데이터 로드 및 페이지 변경 시 데이터 로드
    useEffect(() => {
        dispatch(fetchLogsAsync({page: currentPageNo, size: sizePerPage}));
        dispatch(fetchAllDevicesAsync());
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

    // 로그 추가
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

    // 로그 수정
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

    // 로그 삭제
    const handleDeleteLog = async (usageId: number) => {
        await dispatch(deleteLogAsync(usageId));
    };

    // 선택한 로그 일괄 삭제
    const handleBulkDelete = async () => {
        if (selectedRows.length > 0) {
            for (const usageId of selectedRows) {
                await dispatch(deleteLogAsync(Number(usageId)));
            }
            clearSelection();
        }
    };

    // 수정 다이얼로그 열기
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

    // 페이지 변경
    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        dispatch(fetchLogsAsync({page, size: sizePerPage}));
    };

    return {
        // 상태
        logs,
        allDevices,
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
        editingLog,
        setEditingLog,

        // Selection 관련
        selectedRows,
        handleSelectRow,
        handleSelectAll,
        isRowSelected,
        isAllSelected,
        isIndeterminate,

        // 핸들러
        handleAddLog,
        handleEditLog,
        handleDeleteLog,
        handleBulkDelete,
        handleEditOpen,
        handlePageChange,
    };
}
