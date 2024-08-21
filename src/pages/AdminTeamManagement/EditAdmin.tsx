import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import PrimaryTextField from '../../components/custom/PrimaryTextField';
import PrimaryButton from '../../components/custom/PrimaryButton';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';

interface Admin {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface EditAdminProps {
    open: boolean;
    onClose: () => void;
    admin: Admin | null; //
    onSave: (updatedAdmin: Admin) => void;
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

const EditAdmin: React.FC<EditAdminProps> = ({ open, onClose, admin, onSave }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        if (admin) {
            setFullName(admin.full_name);
            setEmail(admin.email);
            setRole(admin.role);
        }
    }, [admin]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (admin) {
            const updatedAdmin = {
                ...admin,
                full_name: fullName,
                email,
                role,
            };
            onSave(updatedAdmin);
            toast.success('Admin Updated Successfully')
            onClose();
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='edit-admin-title'
            aria-describedby='edit-admin-description'
            BackdropProps={{
                style: {
                    backdropFilter: 'blur(5px)',
                },
            }}
        >
            <ModalBox>
                <Header>
                    <Typography variant='h6'>Edit Admin</Typography>
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
                        style={{ minWidth: '10px' }}
                    />
                </Header>

                <form onSubmit={handleSubmit}>
                    <Box
                        component='div'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <PrimaryTextField
                            width='400px'
                            label='Name'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <PrimaryTextField
                            width='400px'
                            label='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <PrimaryTextField
                            width='400px'
                            label='Role'
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
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
                            marginTop: '1rem',
                        }}
                    >
                        <PrimaryButton
                            type='button'
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
                        >
                            Save
                        </PrimaryButton>
                    </Box>
                </form>
            </ModalBox>
        </Modal>
    );
};

export default EditAdmin;
