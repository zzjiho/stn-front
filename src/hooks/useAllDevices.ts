import {useCallback, useEffect, useState} from 'react';
import {deviceService} from '../services/deviceService';
import type {Device} from '../types';

export function useAllDevices() {

    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAllDevices = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await deviceService.getAllDevices();
            setAllDevices(response.data);
        } catch {
            setAllDevices([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllDevices();
    }, [fetchAllDevices]);

    return { allDevices, isLoading, fetchAllDevices };
}
