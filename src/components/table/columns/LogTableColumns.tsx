/**
 * 테이블 컬럼 정의 분리
 */

import {Box, Checkbox, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

export interface LogTableColumnsProps {
    onSelectRow: (usageId: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onDeleteLog: (usageId: number) => void;
    isRowSelected: (usageId: number) => boolean;
    isAllSelected: () => boolean;
    isIndeterminate: () => boolean;
    orderType: string;
    order: 'asc' | 'desc';
    onSortChange: (orderType: string) => void;
}

export const createLogTableColumns = ({
    onSelectRow,
    onSelectAll,
    onDeleteLog,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
    orderType,
    order,
    onSortChange
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
    {
        field: 'title',
        headerName: '장치명',
        flex: 1.2,
        minWidth: 150,
        sortable: false,
        renderHeader: () => (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    '&:hover': {
                        opacity: 0.7
                    }
                }}
                onClick={() => onSortChange('title')}
            >
                <span>장치명</span>
                {orderType === 'title' && (
                    <ArrowDownwardIcon
                        sx={{
                            ml: 0.5,
                            fontSize: 18,
                            transform: order === 'asc' ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                        }}
                    />
                )}
            </Box>
        )
    },
    {
        field: 'cpuUsage',
        headerName: 'CPU 사용률 (%)',
        type: 'number',
        flex: 1,
        minWidth: 130,
        sortable: false,
        align: 'left',
        headerAlign: 'left',
        renderHeader: () => (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    '&:hover': {
                        opacity: 0.7
                    }
                }}
                onClick={() => onSortChange('cpuUsage')}
            >
                <span>CPU 사용률 (%)</span>
                {orderType === 'cpuUsage' && (
                    <ArrowDownwardIcon
                        sx={{
                            ml: 0.5,
                            fontSize: 18,
                            transform: order === 'asc' ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                        }}
                    />
                )}
            </Box>
        )
    },
    {
        field: 'memoryUsage',
        headerName: '메모리 사용률 (%)',
        type: 'number',
        flex: 1.2,
        minWidth: 150,
        sortable: false,
        align: 'left',
        headerAlign: 'left',
        renderHeader: () => (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    '&:hover': {
                        opacity: 0.7
                    }
                }}
                onClick={() => onSortChange('memoryUsage')}
            >
                <span>메모리 사용률 (%)</span>
                {orderType === 'memoryUsage' && (
                    <ArrowDownwardIcon
                        sx={{
                            ml: 0.5,
                            fontSize: 18,
                            transform: order === 'asc' ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                        }}
                    />
                )}
            </Box>
        )
    },
    {
        field: 'diskUsage',
        headerName: '디스크 사용률 (%)',
        type: 'number',
        flex: 1.2,
        minWidth: 150,
        sortable: false,
        align: 'left',
        headerAlign: 'left',
        renderHeader: () => (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    '&:hover': {
                        opacity: 0.7
                    }
                }}
                onClick={() => onSortChange('diskUsage')}
            >
                <span>디스크 사용률 (%)</span>
                {orderType === 'diskUsage' && (
                    <ArrowDownwardIcon
                        sx={{
                            ml: 0.5,
                            fontSize: 18,
                            transform: order === 'asc' ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                        }}
                    />
                )}
            </Box>
        )
    },
    {
        field: 'regDate',
        headerName: '등록일',
        flex: 1.5,
        minWidth: 180,
        sortable: false,
        valueFormatter: (value) => new Date(value as string).toLocaleString('ko-KR'),
        renderHeader: () => (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    '&:hover': {
                        opacity: 0.7
                    }
                }}
                onClick={() => onSortChange('regDate')}
            >
                <span>등록일</span>
                {orderType === 'regDate' && (
                    <ArrowDownwardIcon
                        sx={{
                            ml: 0.5,
                            fontSize: 18,
                            transform: order === 'asc' ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                        }}
                    />
                )}
            </Box>
        )
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
                    <DeleteIcon/>
                </IconButton>
            </Box>
        ),
    },
];