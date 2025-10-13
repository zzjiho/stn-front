import {useCallback, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../store';
import {fetchAllDevicesAsync} from '../store/slices/deviceSlice';
import type {Log, LogRequest} from '../types/index';
import {logService} from '../services/logService';
import {useLogSelection} from './useLogSelection';
import {usePagination} from './usePagination';

export function useLogManagement() {
    const dispatch = useAppDispatch();
    const { allDevices } = useAppSelector((state) => state.device);

    // 데이터 상태
    const [logs, setLogs] = useState<Log[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 다이얼로그 상태
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<Log | null>(null);

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
    } = useLogSelection(logs);

    // 전체 장치 목록 로드
    useEffect(() => {
        dispatch(fetchAllDevicesAsync());
    }, [dispatch]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        const response = await logService.getLogs({
            page: currentPageNo,
            size: sizePerPage
        }).catch(() => null);

        if (response) {
            const { deviceUsages, currentPageNo, sizePerPage, totalCnt } = response.data;
            setLogs(deviceUsages);
            setPaginationData({ total: totalCnt, current: currentPageNo, size: sizePerPage });
        }

        setIsLoading(false);
    }, [currentPageNo, sizePerPage, setPaginationData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 로그 추가
    const handleAddLog = async (logData: LogRequest) => {
        const result = await logService.createLog(logData).catch(() => null);
        if (result) {
            setAddDialogOpen(false);
            await fetchData();
        }
    };

    // 로그 수정
    const handleEditLog = async (logData: LogRequest) => {
        if (!editingLog) return;

        const result = await logService.updateLog(editingLog.usageId, logData).catch(() => null);
        if (result) {
            setEditDialogOpen(false);
            setEditingLog(null);
            clearSelection();
            await fetchData();
        }
    };

    // 로그 삭제
    const handleDeleteLog = async (usageId: number) => {
        const result = await logService.deleteLog(usageId).catch(() => null);
        if (result) {
            await fetchData();
        }
    };

    // 선택한 로그 일괄 삭제
    const handleBulkDelete = async () => {
        if (selectedRows.length > 0) {
            for (const usageId of selectedRows) {
                await logService.deleteLog(Number(usageId)).catch(() => null);
            }
            clearSelection();
            await fetchData();
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

    return {
        // 데이터
        logs,
        allDevices,
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
        editingLog,
        setEditingLog,

        // 행 선택 (체크박스)
        selectedRows,
        handleSelectRow,
        handleSelectAll,
        isRowSelected,
        isAllSelected,
        isIndeterminate,

        // 액션 핸들러
        handleAddLog,
        handleEditLog,
        handleDeleteLog,
        handleBulkDelete,
        handleEditOpen,
        handlePageChange,
    };
}
