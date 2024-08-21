import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryButton from '../../components/custom/PrimaryButton';
import AdminTable from './AdminTable';
import AddAdmin from './AddAdmin';

const AdminTeamManagement: React.FC = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <Box
            component='div'
            sx={{
                height: '100vh',
                padding: '0 ',
            }}
        >
            <Box
                component='div'
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '2px solid #EAEBF4',
                    marginBottom: '20px',
                    paddingBottom: '7px',
                    padding: '10px 50px 10px 35px'
                }}
            >
                <Typography
                    variant='h6'
                    align='left'
                    gutterBottom
                    sx={{ margin: '5px', fontWeight: 700, color: '#000', fontSize: '19px' }}
                >
                    Admin Team Management
                </Typography>
                <Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PrimaryButton onClick={handleOpenPopup} variant='filled' textTransform='uppercase' height='37px' width='207px' >
                        Add Sub-Admin
                    </PrimaryButton>
                </Box>
            </Box>

            <AdminTable />
            <AddAdmin open={isPopupOpen} onClose={handleClosePopup} />
        </Box>
    );
};

export default AdminTeamManagement;
