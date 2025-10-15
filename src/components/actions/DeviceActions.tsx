import {Box, Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeviceActionsProps {
    selectedCount: number;
    onAdd: () => void;
    onEdit: () => void;
    onBulkDelete: () => void;
}

export function DeviceActions({
    selectedCount,
    onAdd,
    onEdit,
    onBulkDelete
}: DeviceActionsProps) {
    return (
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
            >
                장치 추가
            </Button>
            <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEdit}
                disabled={selectedCount !== 1}
            >
                장치 수정
            </Button>
            <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onBulkDelete}
                disabled={selectedCount === 0}
            >
                선택 삭제 ({selectedCount})
            </Button>
        </Box>
    );
}