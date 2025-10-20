import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, ProtectedRoute } from './components';
import DeviceManagementPage from './pages/DeviceManagementPage';
import LogManagementPage from './pages/LogManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { useAppDispatch } from './store';
import { checkAuthAsync } from './store/slices/authSlice';
import { ErrorProvider } from './contexts/ErrorContext';

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuthAsync());
    }, [dispatch]);

    return (
        <ErrorProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    <Route path="/" element={<DashboardLayout />}>
                        <Route element={<ProtectedRoute />}>
                            <Route path="devices" element={<DeviceManagementPage />} />
                            <Route path="logs" element={<LogManagementPage />} />
                            <Route path="users" element={<UserManagementPage />} />
                            <Route index element={<Navigate to="/devices" />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </ErrorProvider>
    );
}

export default App;
