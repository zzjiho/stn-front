/**
 * 추가/수정 다이얼로그 분리
 */

import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import type {Log} from '../../types/index';

interface LogDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (logData: { deviceId: number; cpuUsage: number; memoryUsage: number; diskUsage: number }) => void;
    title: string;
    submitLabel: string;
    log?: Log | null;
    devices: Array<{ deviceId: number; title: string }>;
}

export function LogDialog({
    open,
    onClose,
    onSubmit,
    title,
    submitLabel,
    log,
    devices,
}: LogDialogProps) {
    const [formData, setFormData] = useState({
        deviceId: '' as number | '',
        cpuUsage: '',
        memoryUsage: '',
        diskUsage: '',
    });

    useEffect(() => {
        if (log) {
            setFormData({
                deviceId: log.deviceId,
                cpuUsage: log.cpuUsage.toString(),
                memoryUsage: log.memoryUsage.toString(),
                diskUsage: log.diskUsage.toString(),
            });
        } else {
            setFormData({
                deviceId: '',
                cpuUsage: '',
                memoryUsage: '',
                diskUsage: '',
            });
        }
    }, [log, open]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formData.deviceId && formData.cpuUsage && formData.memoryUsage && formData.diskUsage) {
            onSubmit({
                deviceId: formData.deviceId as number,
                cpuUsage: parseFloat(formData.cpuUsage),
                memoryUsage: parseFloat(formData.memoryUsage),
                diskUsage: parseFloat(formData.diskUsage),
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <FormControl fullWidth sx={{ mb: 2 }} required disabled={!!log}>
                            <InputLabel id="device-select-label">장치 선택</InputLabel>
                            <Select
                                labelId="device-select-label"
                                value={formData.deviceId}
                                label="장치 선택"
                                onChange={(e) => setFormData(prev => ({ ...prev, deviceId: e.target.value as number }))}
                            >
                                {devices.map((device) => (
                                    <MenuItem key={device.deviceId} value={device.deviceId}>
                                        {device.title} (ID: {device.deviceId})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="CPU 사용률 (%)"
                            value={formData.cpuUsage}
                            onChange={(e) => setFormData(prev => ({ ...prev, cpuUsage: e.target.value }))}
                            type="number"
                            fullWidth
                            required
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="메모리 사용률 (%)"
                            value={formData.memoryUsage}
                            onChange={(e) => setFormData(prev => ({ ...prev, memoryUsage: e.target.value }))}
                            type="number"
                            fullWidth
                            required
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="디스크 사용률 (%)"
                            value={formData.diskUsage}
                            onChange={(e) => setFormData(prev => ({ ...prev, diskUsage: e.target.value }))}
                            type="number"
                            fullWidth
                            required
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>취소</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!formData.deviceId || !formData.cpuUsage || !formData.memoryUsage || !formData.diskUsage}
                    >
                        {submitLabel}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}