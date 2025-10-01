import { useState } from 'react';
import type { Device } from '../types/index';

export const useDeviceSelection = (devices: Device[]) => {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

    const handleSelectRow = (deviceId: number, checked: boolean) => {
        if (checked) {
            setSelectedRows(prev => [...prev, deviceId]);
        } else {
            setSelectedRows(prev => prev.filter(id => Number(id) !== deviceId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(devices.map(device => device.deviceId));
        } else {
            setSelectedRows([]);
        }
    };

    const isRowSelected = (deviceId: number) => {
        return selectedRows.some(id => Number(id) === deviceId);
    };

    const isAllSelected = () => {
        return devices.length > 0 && selectedRows.length === devices.length;
    };

    const isIndeterminate = () => {
        return selectedRows.length > 0 && selectedRows.length < devices.length;
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
        setSelectedRows
    };
};