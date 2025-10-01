/**
 * 액션 버튼들 분리
 */

import React from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface LogActionsProps {
    selectedCount: number;
    onAdd: () => void;
    onEdit: () => void;
    onBulkDelete: () => void;
}

export const LogActions: React.FC<LogActionsProps> = ({
    selectedCount,
    onAdd,
    onEdit,
    onBulkDelete,
}) => {
    return (
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
            >
                사용량 추가
            </Button>
            <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEdit}
                disabled={selectedCount !== 1}
            >
                사용량 수정
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
};