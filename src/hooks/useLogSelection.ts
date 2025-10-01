import { useState } from 'react';
import type { LogResponse } from '../types/index';

export const useLogSelection = (logs: LogResponse[]) => {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

    const handleSelectRow = (usageId: number, checked: boolean) => {
        if (checked) {
            setSelectedRows(prev => [...prev, usageId]);
        } else {
            setSelectedRows(prev => prev.filter(id => Number(id) !== usageId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(logs?.map(log => log.usageId) || []);
        } else {
            setSelectedRows([]);
        }
    };

    const isRowSelected = (usageId: number) => {
        return selectedRows.some(id => Number(id) === usageId);
    };

    const isAllSelected = () => {
        return logs?.length > 0 && selectedRows.length === logs.length;
    };

    const isIndeterminate = () => {
        return selectedRows.length > 0 && selectedRows.length < (logs?.length || 0);
    };

    const clearSelection = () => {
        setSelectedRows([]);
    };

    return {
        selectedRows,
        handleSelectRow,
        handleSelectAll,
        isRowSelected,
        isAllSelected,
        isIndeterminate,
        clearSelection,
    };
};