import React from 'react';
import {Box, Checkbox, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type {GridColDef, GridRowParams} from '@mui/x-data-grid';

interface DeviceTableColumnsProps {
    onSelectRow: (deviceId: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onDeleteDevice: (deviceId: number) => void;
    isRowSelected: (deviceId: number) => boolean;
    isAllSelected: () => boolean;
    isIndeterminate: () => boolean;
}

export const createDeviceTableColumns = ({
    onSelectRow,
    onSelectAll,
    onDeleteDevice,
    isRowSelected,
    isAllSelected,
    isIndeterminate
}: DeviceTableColumnsProps): GridColDef[] => [
    {
        field: 'select',
        headerName: '',
        width: 50,
        sortable: false,
        disableColumnMenu: true,
        renderHeader: () => (
            <Checkbox
                checked={isAllSelected()}
                indeterminate={isIndeterminate()}
                onChange={(e) => onSelectAll(e.target.checked)}
            />
        ),
        renderCell: (params: GridRowParams) => (
            <Checkbox
                checked={isRowSelected(params.row.deviceId)}
                onChange={(e) => onSelectRow(params.row.deviceId, e.target.checked)}
            />
        ),
    },
    { field: 'deviceId', headerName: 'Device ID', width: 100 },
    { field: 'title', headerName: 'Device Name', width: 250 },
    { field: 'modelName', headerName: 'Model', width: 200 },
    {
        field: 'regDate',
        headerName: 'Registration Date',
        width: 180,
        valueFormatter: (params) => {
            return new Date(params).toLocaleDateString('ko-KR');
        }
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        renderCell: (params: GridRowParams) => (
            <Box>
                <IconButton
                    onClick={() => onDeleteDevice(params.row.deviceId)}
                    color="error"
                    size="small"
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        ),
    },
];