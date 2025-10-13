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
    { field: 'usageId', headerName: '사용량 ID', flex: 0.7, minWidth: 100, sortable: false },
    { field: 'deviceId', headerName: '장치 ID', flex: 0.7, minWidth: 100, sortable: false },
    { field: 'title', headerName: '장치명', flex: 1.2, minWidth: 150, sortable: false },
    { field: 'cpuUsage', headerName: 'CPU 사용률 (%)', type: 'number', flex: 1, minWidth: 130, sortable: false, align: 'left', headerAlign: 'left' },
    { field: 'memoryUsage', headerName: '메모리 사용률 (%)', type: 'number', flex: 1.2, minWidth: 150, sortable: false, align: 'left', headerAlign: 'left' },
    { field: 'diskUsage', headerName: '디스크 사용률 (%)', type: 'number', flex: 1.2, minWidth: 150, sortable: false, align: 'left', headerAlign: 'left' },
    {
        field: 'regDate',
        headerName: '등록일',
        flex: 1.5,
        minWidth: 180,
        valueFormatter: (value) => new Date(value as string).toLocaleString('ko-KR')
    },
    {
        field: 'actions',
        headerName: '작업',
        flex: 0.7,
        minWidth: 100,
        sortable: false,
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