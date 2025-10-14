import {Box, Typography, Pagination} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {UserDialog} from '../components/dialog';
import {createUserTableColumns} from '../components/table/columns';
import {useUserManagement} from '../hooks/useUserManagement';

export default function UserManagementPage() {
    const um = useUserManagement();
    const columns = createUserTableColumns();

    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{mb: 3}}>
                사용자 관리
            </Typography>

            <DataGrid
                rows={um.users}
                columns={columns}
                loading={um.isLoading}
                getRowId={(row) => row.id}
                onRowClick={(params) => um.handleRowClick(params.row.id)}
                autoHeight
                hideFooter
                sx={{
                    mb: 2,
                    '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                    },
                }}
            />

            <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                <Pagination
                    count={Math.ceil(um.totalCnt / um.sizePerPage)}
                    page={um.currentPageNo}
                    onChange={um.handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>

            <UserDialog
                open={um.dialogOpen}
                user={um.selectedUser}
                onClose={um.handleCloseDialog}
                onApprove={um.handleApprove}
                onReject={um.handleReject}
            />
        </Box>
    );
}
