import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button
} from '@mui/material';
import type { Device } from '../../types/index';

interface DeviceDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; modelName: string }) => void;
    title: string;
    submitLabel: string;
    device?: Device | null;
}

export const DeviceDialog: React.FC<DeviceDialogProps> = ({
    open,
    onClose,
    onSubmit,
    title,
    submitLabel,
    device
}) => {
    const [formData, setFormData] = useState({
        title: '',
        modelName: ''
    });

    // 다이얼로그가 열릴 때 기존 장치 데이터로 초기화
    useEffect(() => {
        if (open) {
            if (device) {
                setFormData({
                    title: device.title,
                    modelName: device.modelName
                });
            } else {
                setFormData({
                    title: '',
                    modelName: ''
                });
            }
        }
    }, [open, device]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="title"
                        label="장치 이름"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <TextField
                        required
                        margin="dense"
                        name="modelName"
                        label="모델명"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.modelName}
                        onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="button" onClick={onClose}>취소</Button>
                    <Button type="submit">{submitLabel}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};