import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import type {User} from '../../types/index';

interface UserDialogProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
}

export default function UserDialog({open, user, onClose, onApprove, onReject}: UserDialogProps) {
    if (!user) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'success';
            case 'REJECTED':
                return 'error';
            case 'PENDING':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return '승인';
            case 'REJECTED':
                return '거부';
            case 'PENDING':
                return '대기중';
            default:
                return status;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>사용자 관리</DialogTitle>
            <DialogContent>
                <Box sx={{pt: 2}}>
                    <Box sx={{mb: 2}}>
                        <Typography variant="body2" color="text.secondary">
                            사용자명
                        </Typography>
                        <Typography variant="body1" sx={{fontWeight: 'medium'}}>
                            {user.username}
                        </Typography>
                    </Box>

                    <Box sx={{mb: 2}}>
                        <Typography variant="body2" color="text.secondary">
                            이메일
                        </Typography>
                        <Typography variant="body1" sx={{fontWeight: 'medium'}}>
                            {user.email}
                        </Typography>
                    </Box>

                    <Box sx={{mb: 2}}>
                        <Typography variant="body2" color="text.secondary">
                            권한
                        </Typography>
                        <Chip
                            label={user.role === 'ADMIN' ? '관리자' : '사용자'}
                            color={user.role === 'ADMIN' ? 'error' : 'default'}
                            size="small"
                            sx={{mt: 0.5}}
                        />
                    </Box>

                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            현재 상태
                        </Typography>
                        <Chip
                            label={getStatusLabel(user.status)}
                            color={getStatusColor(user.status)}
                            size="small"
                            sx={{mt: 0.5}}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={onClose} color="inherit">
                    취소
                </Button>
                {user.status !== 'REJECTED' && (
                    <Button onClick={onReject} color="error" variant="outlined">
                        거부
                    </Button>
                )}
                {user.status !== 'APPROVED' && (
                    <Button onClick={onApprove} color="primary" variant="contained">
                        승인
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
