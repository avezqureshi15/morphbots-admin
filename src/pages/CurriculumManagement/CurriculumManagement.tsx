import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryButton from '../../components/custom/PrimaryButton';
import AccordionsWithChapters from './Accordion';
import AddNewTutorial from './Tutorial/AddNewTutorial';

const CurriculumManagement: React.FC = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <Box component='div' sx={{ height: '100vh', padding: '0' }}>
            <Box
                component='div'
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '2px solid #EAEBF4',
                    marginBottom: '20px',
                    paddingBottom: '7px',
                    padding: '10px 50px 10px 35px',
                }}
            >
                <Typography
                    variant='h6'
                    align='left'
                    gutterBottom
                    sx={{ margin: '5px', fontWeight: 700, color: '#000', fontSize: '19px' }}
                >
                    Curriculum Management
                </Typography>
                <Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PrimaryButton variant='filled' textTransform='uppercase' height='37px' onClick={handleOpenPopup}>
                        Add New
                    </PrimaryButton>
                </Box>
            </Box>
            <AccordionsWithChapters />
            <AddNewTutorial open={isPopupOpen} onClose={handleClosePopup} />
        </Box>
    );
};

export default CurriculumManagement;
