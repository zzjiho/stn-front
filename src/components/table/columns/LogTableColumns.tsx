/**
 * 테이블 컬럼 정의 분리
 */

import {Box, Checkbox, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

interface LogTableColumnsProps {
    onSelectRow: (usageId: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onDeleteLog: (usageId: number) => void;
    isRowSelected: (usageId: number) => boolean;
    isAllSelected: () => boolean;
    isIndeterminate: () => boolean;
}

export const createLogTableColumns = ({
    onSelectRow,
    onSelectAll,
    onDeleteLog,
    isRowSelected,
    isAllSelected,
    isIndeterminate
}: LogTableColumnsProps): GridColDef[] => [
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
        renderCell: (params: GridRenderCellParams) => (
            <Checkbox
                checked={isRowSelected(params.row.usageId)}
                onChange={(e) => onSelectRow(params.row.usageId, e.target.checked)}
            />
        ),
    },
    { field: 'usageId', headerName: 'Log ID', width: 100 },
    { field: 'deviceId', headerName: 'Device ID', width: 100 },
    { field: 'title', headerName: '장치명', width: 180 },
    {
        field: 'regDate',
        headerName: '기록 시간',
        width: 180,
        valueFormatter: (value) => new Date(value as string).toLocaleString('ko-KR')
    },
    { field: 'cpuUsage', headerName: 'CPU 사용률 (%)', type: 'number', width: 130 },
    { field: 'memoryUsage', headerName: '메모리 사용률 (%)', type: 'number', width: 150 },
    { field: 'diskUsage', headerName: '디스크 사용률 (%)', type: 'number', width: 150 },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
            <Box>
                <IconButton
                    onClick={() => onDeleteLog(params.row.usageId)}
                    color="error"
                    size="small"
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        ),
    },
];