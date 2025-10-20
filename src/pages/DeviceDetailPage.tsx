/**
 * 장치 상세 페이지
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { deviceService } from '../services/deviceService';
import type { DeviceResponse } from '../types';

export default function DeviceDetailPage() {
    const { deviceId } = useParams<{ deviceId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [device, setDevice] = useState<DeviceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 장치 상세 조회
    useEffect(() => {
        if (!deviceId) return;

        const fetchDevice = async () => {
            setIsLoading(true);
            const response = await deviceService.getDevice(Number(deviceId)).catch(() => null);

            setDevice(response?.data ?? null);
            setIsLoading(false);
        };

        fetchDevice();
    }, [deviceId]);

    // 목록으로 돌아가기
    const handleBackToList = () => {
        const queryString = searchParams.toString();
        navigate(`/devices${queryString ? `?${queryString}` : ''}`);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!device) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" color="error">
                    장치를 찾을 수 없습니다.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackToList}
                    sx={{ mt: 2 }}
                >
                    목록으로
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToList}
                sx={{ mb: 3 }}
            >
                목록으로
            </Button>

            <Typography variant="h4" sx={{ mb: 3 }}>
                장치 상세 정보
            </Typography>

            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                장치 ID
                            </Typography>
                            <Typography variant="body1">
                                {device.deviceId}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                장치명
                            </Typography>
                            <Typography variant="body1">
                                {device.title}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                모델명
                            </Typography>
                            <Typography variant="body1">
                                {device.modelName}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                등록일
                            </Typography>
                            <Typography variant="body1">
                                {new Date(device.regDate).toLocaleString('ko-KR')}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
