import React, { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import PrimaryTextField from '../../components/custom/PrimaryTextField';
import PrimaryButton from '../../components/custom/PrimaryButton';
import { styled } from '@mui/system';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook'; // Adjust import path as needed
import { createAdminThunk } from '../../slices/adminSlice'; // Adjust import path as needed

interface AddAdminProps {
    open: boolean;
    onClose: () => void;
}

const ModalBox = styled(Box)({
    //@ts-expect-error
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '460px',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: 24,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
});

const Header = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #EAEBF4',
    paddingBottom: '10px',
});

const AddAdmin: React.FC<AddAdminProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    const { status, successMessage, error } = useAppSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'admin'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(createAdminThunk(formData));
        onClose();
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='add-new-admin-title'
            aria-describedby='add-new-admin-description'
            BackdropProps={{
                style: {
                    backdropFilter: 'blur(5px)',
                },
            }}
        >
            <ModalBox>
                <Header>
                    <Typography variant='h6' sx={{ paddingLeft: '30px' }}>Add Admin</Typography>
                    <PrimaryButton
                        onClick={onClose}
                        variant='filled'
                        height='31px'
                        width='30px'
                        fontSize='15px'
                        fontWeight='800'
                        backgroundColor='#DD6E70'
                        borderColor='#DD6E70'
                        icon={CloseIcon}
                        fontFamily='Roboto, sans-serif'
                        borderRadius={2}
                        style={{ marginRight: '10px', minWidth: '10px' }}
                    />
                </Header>

                <form onSubmit={handleSubmit}>
                    <Box
                        component='div'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        <PrimaryTextField
                            width='400px'
                            label='Name'
                            name='full_name'
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                        <PrimaryTextField
                            width='400px'
                            label='Email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <PrimaryTextField
                            width='400px'
                            label='Password'
                            name='password'
                            type='password'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <PrimaryTextField
                            width='400px'
                            label='Role'
                            name='role'
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box
                        component='div'
                        sx={{
                            width: '430px',
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'end',
                            flexDirection: 'row',
                            marginTop: '1rem'
                        }}
                    >
                        <PrimaryButton
                            onClick={onClose}
                            variant='outlined'
                            height='38px'
                            width='144px'
                            fontWeight='600'
                            fontSize='13px'
                            backgroundColor='#fff'
                            borderColor='#000'
                            textColor='#000'
                            border='1'
                            style={{ marginRight: '7px' }}
                        >
                            Cancel
                        </PrimaryButton>
                        <PrimaryButton
                            type='submit'
                            variant='filled'
                            height='38px'
                            width='120px'
                            fontWeight='600'
                            fontSize='13px'
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Adding...' : 'Add'}
                        </PrimaryButton>
                    </Box>
                </form>

                {successMessage && (
                    <Typography color='green' sx={{ marginTop: '10px' }}>
                        {successMessage}
                    </Typography>
                )}
                {error && (
                    <Typography color='red' sx={{ marginTop: '10px' }}>
                        {error}
                    </Typography>
                )}
            </ModalBox>
        </Modal>
    );
};

export default AddAdmin;
