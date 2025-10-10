import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {Avatar, Button, TextField, Link, Box, Typography, Container, CircularProgress, Alert} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {useAppDispatch, useAppSelector} from '../store';
import {signupAsync, clearError} from '../store/slices/authSlice';

export default function SignUpPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {isLoading, error} = useAppSelector((state) => state.auth);
    const [success, setSuccess] = React.useState('');

    React.useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username') as string;
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!username || !email || !password) {
            return;
        }

        setSuccess('');

        const resultAction = await dispatch(signupAsync({username, email, password}));
        if (signupAsync.fulfilled.match(resultAction)) {
            setSuccess('회원가입 요청이 제출되었습니다. 관리자 승인을 기다려주세요.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <PersonAddAltIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 3}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                        {error && (
                            <Alert severity="error" sx={{mt: 2, width: '100%'}}>{error}</Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{mt: 2, width: '100%'}}>{success}</Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            disabled={isLoading || !!success}
                        >
                            {isLoading ? <CircularProgress size={24}/> : 'Sign Up'}
                        </Button>
                        <Link href="/login" variant="body2">
                            {"Already have an account? Sign in"}
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}