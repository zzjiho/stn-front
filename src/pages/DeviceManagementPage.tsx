/**
 * 장치 관리 페이지
 * - 장치 목록 조회, 추가, 수정, 삭제 기능 제공
 */
import {Box, Pagination, Typography} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {createDeviceTableColumns, DeviceActions, DeviceDialog} from '../components';
import {useDeviceManagement} from '../hooks/useDeviceManagement';

export default function DeviceManagementPage() {
    const dm = useDeviceManagement();

    const columns = createDeviceTableColumns({
        onSelectRow: dm.handleSelectRow,
        onSelectAll: dm.handleSelectAll,
        onDeleteDevice: dm.handleDeleteDevice,
        isRowSelected: dm.isRowSelected,
        isAllSelected: dm.isAllSelected,
        isIndeterminate: dm.isIndeterminate,
        sortDir: dm.sortDir,
        onSortChange: dm.handleSortChange,
    });

    return (
        <Box sx={{height: 600, width: '100%'}}>
            <Typography variant="h4" sx={{mb: 2}}>
                장치 관리
            </Typography>

            <DeviceActions
                selectedCount={dm.selectedRows.length}
                onAdd={() => dm.setAddDialogOpen(true)}
                onEdit={dm.handleEditOpen}
                onBulkDelete={dm.handleBulkDelete}
            />

            <DataGrid
                rows={dm.devices}
                columns={columns}
                loading={dm.isLoading}
                getRowId={(row) => row.deviceId}
                hideFooter
                autoHeight
                sx={{ mb: 2 }}
            />

            <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                <Pagination
                    count={Math.ceil(dm.totalCnt / dm.sizePerPage)}
                    page={dm.currentPageNo}
                    onChange={dm.handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>

            <DeviceDialog
                open={dm.addDialogOpen}
                onClose={() => dm.setAddDialogOpen(false)}
                onSubmit={dm.handleAddDevice}
                title="새 장치 추가"
                submitLabel="추가"
            />

            <DeviceDialog
                open={dm.editDialogOpen}
                onClose={() => {
                    dm.setEditDialogOpen(false);
                    dm.setEditingDevice(null);
                }}
                onSubmit={dm.handleEditDevice}
                title="장치 수정"
                submitLabel="수정"
                device={dm.editingDevice}
            />
        </Box>
    );
}