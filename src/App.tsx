import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, ProtectedRoute } from './components';
import DashboardPage from './pages/DashboardPage';
import DeviceManagementPage from './pages/DeviceManagementPage';
import LogManagementPage from './pages/LogManagementPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { useAppDispatch } from './store';
import { checkAuthAsync } from './store/slices/authSlice';

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuthAsync());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                <Route path="/" element={<DashboardLayout />}>
                    <Route element={<ProtectedRoute />}>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="devices" element={<DeviceManagementPage />} />
                        <Route path="logs" element={<LogManagementPage />} />
                        <Route index element={<Navigate to="/dashboard" />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
