import React, { useEffect } from 'react';
import { Box, Card, Stack, Typography } from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { deviceService } from '../services/deviceService';

interface SummaryCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
}

function SummaryCard({title, value, icon}: SummaryCardProps) {
    return (
        <Card sx={{display: 'flex', alignItems: 'center', p: 2}}>
            <Box sx={{flexGrow: 1}}>
                <Typography color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4">{value}</Typography>
            </Box>
            <Box>{icon}</Box>
        </Card>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = React.useState({deviceCount: 0, pendingUserCount: 0});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await deviceService.getDevices({page: 1, size: 100});
                const deviceCount = response.data?.totalCnt || 0;
                setStats({deviceCount, pendingUserCount: 0});
            } catch {
                setStats({deviceCount: 0, pendingUserCount: 0});
            }
        };
        fetchStats();
    }, []);

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Dashboard Overview
            </Typography>
            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <SummaryCard
                        title="Total Devices"
                        value={stats.deviceCount}
                        icon={<DevicesIcon sx={{ fontSize: 50, color: 'primary.main' }} />}
                    />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <SummaryCard
                        title="Pending Sign-ups"
                        value={stats.pendingUserCount}
                        icon={<PeopleAltIcon sx={{ fontSize: 50, color: 'secondary.main' }} />}
                    />
                </Box>
            </Stack>
        </Box>
    );
}