import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CustomTextField from '../../components/custom/AppTextField';
import SecondaryButton from '../../components/custom/SecondaryButton';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux-hook';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthHeader from '../../components/custom/AuthHeader';
import { changePassword } from '../../slices/authSlice'; // Adjust the import path

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
    height: '272px',
    marginTop: '1rem',
    padding: '30px',
    borderRadius: '10px',
    border: '1px solid #eee',
    boxShadow: '0px 0px 20px 4px #0000000A',
});

const ChangePassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const resultAction = await dispatch(changePassword(password)).unwrap();
            if (resultAction.successMessage) {
                toast.success(resultAction.successMessage);
                navigate('/login');
            }
        } catch (error) {
            toast.error('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <BackgroundBox>
                <AuthHeader header='Change Password' />
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
                        Create a new, strong password that you don’t use for other websites
                    </Typography>
                    <CustomTextField
                        placeholder='Create Password'
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <IconButton
                                aria-label='toggle password visibility'
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge='end'
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        }
                    />
                    <CustomTextField
                        placeholder='Confirm Password'
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <SecondaryButton disabled={loading} buttonText={loading ? 'Just a sec...' : 'Continue'} type='submit' />
                </Form>
            </BackgroundBox>
        </Container>
    );
};

export default ChangePassword;
