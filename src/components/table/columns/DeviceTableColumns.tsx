import {Box, Checkbox, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

export interface DeviceTableColumnsProps {
    onSelectRow: (deviceId: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onDeleteDevice: (deviceId: number) => void;
    isRowSelected: (deviceId: number) => boolean;
    isAllSelected: () => boolean;
    isIndeterminate: () => boolean;
    orderType: string;
    order: 'asc' | 'desc';
    onSortChange: (orderType: string) => void;
}

export const createDeviceTableColumns = ({
    onSelectRow,
    onSelectAll,
    onDeleteDevice,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
    orderType,
    order,
    onSortChange
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
        renderCell: (params: GridRenderCellParams) => (
            <Checkbox
                checked={isRowSelected(params.row.deviceId)}
                onChange={(e) => onSelectRow(params.row.deviceId, e.target.checked)}
            />
        ),
    },
    {
        field: 'title',
        headerName: '장치명',
        flex: 1.5,
        minWidth: 200,
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
        field: 'modelName',
        headerName: '모델명',
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
                onClick={() => onSortChange('modelName')}
            >
                <span>모델명</span>
                {orderType === 'modelName' && (
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
        minWidth: 200,
        sortable: false,
        valueFormatter: (value) => new Date(value).toLocaleString('ko-KR'),
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
        flex: 0.8,
        minWidth: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
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