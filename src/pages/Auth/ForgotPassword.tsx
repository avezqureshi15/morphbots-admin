import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CustomTextField from '../../components/custom/AppTextField';
import SecondaryButton from '../../components/custom/SecondaryButton';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook';
import { forgotPassword } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import AuthHeader from '../../components/custom/AuthHeader';

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

const ForgotPasswordForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const authError = useAppSelector((state) => state.auth.error);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            localStorage.setItem('email', email);
            await dispatch(forgotPassword({ email })).unwrap();
            navigate('/verify-otp');
        } catch (error) {
            toast.error(authError || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <BackgroundBox>
                <AuthHeader header='Forgot Password' />
                <Form onSubmit={handleSubmit}>
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
                        Enter an email address where Morphbots can send you a verification code
                    </Typography>
                    <CustomTextField
                        placeholder='Enter your Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <SecondaryButton disabled={loading} buttonText={loading ? 'Just a sec...' : 'Continue'} type='submit' />
                </Form>
            </BackgroundBox>
        </Container>
    );
};

export default ForgotPasswordForm;
