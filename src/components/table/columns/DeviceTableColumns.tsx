import {Box, Checkbox, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

interface DeviceTableColumnsProps {
    onSelectRow: (deviceId: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onDeleteDevice: (deviceId: number) => void;
    isRowSelected: (deviceId: number) => boolean;
    isAllSelected: () => boolean;
    isIndeterminate: () => boolean;
    sortDir: 'ASC' | 'DESC';
    onSortChange: (sortDir: 'ASC' | 'DESC') => void;
}

export const createDeviceTableColumns = ({
    onSelectRow,
    onSelectAll,
    onDeleteDevice,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
    sortDir,
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
        sortable: false
    },
    {
        field: 'modelName',
        headerName: '모델명',
        flex: 1.2,
        minWidth: 150,
        sortable: false
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
                onClick={() => onSortChange(sortDir === 'DESC' ? 'ASC' : 'DESC')}
            >
                <span>등록일</span>
                <ArrowDownwardIcon
                    sx={{
                        ml: 0.5,
                        fontSize: 18,
                        transform: sortDir === 'ASC' ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s'
                    }}
                />
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