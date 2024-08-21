import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CustomTextField from '../../components/custom/AppTextField';
import SecondaryButton from '../../components/custom/SecondaryButton';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux-hook';
import { toast } from 'react-toastify';
import AuthHeader from '../../components/custom/AuthHeader';
import { resendOtp, verifyOtp } from '../../slices/authSlice';

const Container = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    borderRadius: '0px',
    height: '100vh',
    width: '100%',
    margin: '0.7rem',
    backgroundColor: 'white',
    marginTop: '5%',
});

const BackgroundBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative'
});

const Form = styled('form')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '500px',
    height: '229px',
    marginTop: '1rem',
    padding: '30px',
    borderRadius: '10px',
    border: '1px solid #eee',
    boxShadow: '0px 0px 20px 4px #0000000A',
});

const OtpScreen: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const handleResendOtp = useCallback(async () => {
        if (isTimerActive) {
            toast.info(`Retry after ${timer} seconds`);
        } else {
            setTimer(60);
            setIsTimerActive(true);
            const email = localStorage.getItem('email');
            if (email) {
                await dispatch(resendOtp({ email })).unwrap();
                toast.success('OTP resent successfully');
            }
        }
    }, [isTimerActive, timer]);

    const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const email = localStorage.getItem('email');
        if (email) {
            try {
                await dispatch(verifyOtp({ email, otp })).unwrap();
                toast.success('OTP verified successfully');
                navigate('/reset-password');
                window.location.reload();
            } catch (error) {
                toast.error('Verification failed');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container>
            <BackgroundBox>
                <AuthHeader header='Forgot Password' />
                <Form onSubmit={handleVerifyOtp}>
                    <Typography
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '500px',
                            marginRight: '2rem',
                            marginBottom: '2rem',
                            fontSize: '14px',
                            color: '#7E7E7E',
                            fontWeight: '400',
                            textAlign: 'center'
                        }}
                    >
                        An email with a verification code was just sent
                    </Typography>
                    <CustomTextField
                        placeholder='Enter Code'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Typography
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '440px',
                            marginRight: '2rem',
                            marginBottom: '2rem',
                            marginTop: '-1.8rem'
                        }}
                    >
                        <Box
                            component='div'
                            sx={{
                                color: isTimerActive ? '#ccc' : '#636363',
                                textDecoration: isTimerActive ? 'none' : 'underline',
                                fontWeight: '700',
                                cursor: isTimerActive ? 'default' : 'pointer',
                            }}
                            onClick={handleResendOtp}
                        >
                            Resend OTP
                        </Box>
                        {isTimerActive && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: '40px',
                                    color: 'red'
                                }}
                            >
                                {timer} seconds
                            </Box>
                        )}
                    </Typography>
                    <SecondaryButton disabled={loading} buttonText={loading ? 'Just a sec...' : 'Continue'} type='submit' />
                </Form>
            </BackgroundBox>
        </Container>
    );
};

export default OtpScreen;
