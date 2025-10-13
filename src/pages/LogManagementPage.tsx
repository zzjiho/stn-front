/**
 * 장치 사용량 관리 페이지
 * - 장치 사용량 목록 조회, 추가, 수정, 삭제 기능 제공
 */

import {Box, Pagination, Typography} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {createLogTableColumns, LogActions, LogDialog} from '../components';
import {useLogManagement} from '../hooks/useLogManagement';

export default function LogManagementPage() {
    const lm = useLogManagement();

    const columns = createLogTableColumns({
        onSelectRow: lm.handleSelectRow,
        onSelectAll: lm.handleSelectAll,
        onDeleteLog: lm.handleDeleteLog,
        isRowSelected: lm.isRowSelected,
        isAllSelected: lm.isAllSelected,
        isIndeterminate: lm.isIndeterminate,
    });

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                장치 사용량 목록
            </Typography>

            <LogActions
                selectedCount={lm.selectedRows.length}
                onAdd={() => lm.setAddDialogOpen(true)}
                onEdit={lm.handleEditOpen}
                onBulkDelete={lm.handleBulkDelete}
            />

            <DataGrid
                rows={lm.logs}
                columns={columns}
                loading={lm.isLoading}
                getRowId={(row) => row.usageId}
                hideFooter
                autoHeight
                sx={{ mb: 2 }}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'regDate', sort: 'desc' }],
                    },
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={Math.ceil(lm.totalCnt / lm.sizePerPage)}
                    page={lm.currentPageNo}
                    onChange={lm.handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>

            <LogDialog
                open={lm.addDialogOpen}
                onClose={() => lm.setAddDialogOpen(false)}
                onSubmit={lm.handleAddLog}
                title="새 사용량 추가"
                submitLabel="추가"
                devices={lm.allDevices}
            />

            <LogDialog
                open={lm.editDialogOpen}
                onClose={() => {
                    lm.setEditDialogOpen(false);
                    lm.setEditingLog(null);
                }}
                onSubmit={lm.handleEditLog}
                title="사용량 수정"
                submitLabel="수정"
                log={lm.editingLog}
                devices={lm.allDevices}
            />
        </Box>
    );
}
