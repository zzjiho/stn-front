import {Button, Stack} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface UserActionsProps {
    selectedCount: number;
    onApprove: () => void;
    onReject: () => void;
}

export function UserActions({selectedCount, onApprove, onReject}: UserActionsProps) {
    return (
        <Stack direction="row" spacing={1}>
            <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon/>}
                onClick={onApprove}
                disabled={selectedCount !== 1}
            >
                승인
            </Button>
            <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon/>}
                onClick={onReject}
                disabled={selectedCount !== 1}
            >
                거부
            </Button>
        </Stack>
    );
}
