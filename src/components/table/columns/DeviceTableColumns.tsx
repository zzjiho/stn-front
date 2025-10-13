import {Box, Checkbox, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

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
        renderCell: (params: GridRenderCellParams) => (
            <Checkbox
                checked={isRowSelected(params.row.deviceId)}
                onChange={(e) => onSelectRow(params.row.deviceId, e.target.checked)}
            />
        ),
    },
    { field: 'deviceId', headerName: '장치 ID', flex: 0.8, minWidth: 100, sortable: false },
    { field: 'title', headerName: '장치명', flex: 1.5, minWidth: 200, sortable: false },
    { field: 'modelName', headerName: '모델명', flex: 1.2, minWidth: 150, sortable: false },
    {
        field: 'regDate',
        headerName: '등록일',
        flex: 1.5,
        minWidth: 200,
        valueFormatter: (value) => new Date(value).toLocaleString('ko-KR')
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