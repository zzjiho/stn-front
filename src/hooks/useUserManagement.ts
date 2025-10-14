import {useCallback, useEffect, useState} from 'react';
import type {User, UserStatusRequest} from '../types/index';
import {userService} from '../services/userService';
import {usePagination} from './usePagination';

export function useUserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const {
        currentPageNo,
        sizePerPage,
        totalCnt,
        handlePageChange,
        setPaginationData
    } = usePagination();

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        const response = await userService.getUsers({
            page: currentPageNo,
            size: sizePerPage
        }).catch(() => null);

        if (response) {
            const {users, currentPageNo, sizePerPage, totalCnt} = response.data;
            setUsers(users);
            setPaginationData({total: totalCnt, current: currentPageNo, size: sizePerPage});
        }

        setIsLoading(false);
    }, [currentPageNo, sizePerPage, setPaginationData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRowClick = useCallback((userId: number) => {
        const user = users.find((u) => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setDialogOpen(true);
        }
    }, [users]);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedUser(null);
    }, []);

    const handleApprove = useCallback(async () => {
        if (!selectedUser) return;

        const statusData: UserStatusRequest = {status: 'APPROVED'};
        const result = await userService.updateUserStatus(selectedUser.id, statusData).catch(() => null);

        if (result) {
            handleCloseDialog();
            await fetchData();
        }
    }, [selectedUser, handleCloseDialog, fetchData]);

    const handleReject = useCallback(async () => {
        if (!selectedUser) return;

        const statusData: UserStatusRequest = {status: 'REJECTED'};
        const result = await userService.updateUserStatus(selectedUser.id, statusData).catch(() => null);

        if (result) {
            handleCloseDialog();
            await fetchData();
        }
    }, [selectedUser, handleCloseDialog, fetchData]);

    return {
        // 데이터
        users,
        isLoading,
        currentPageNo,
        sizePerPage,
        totalCnt,

        // 다이얼로그
        dialogOpen,
        selectedUser,

        // 액션 핸들러
        handleRowClick,
        handleCloseDialog,
        handleApprove,
        handleReject,
        handlePageChange,
    };
}
