import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import ServiceDetails from './ServiceDetails/ServiceDetails';
import SchedulingSettings from './SchedulingSettings/SchedulingSettings';



const BookingSystemConfiguration: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        console.log(event);
        setSelectedTab(newValue);
    };

    return (
        <Box
            component='div'
            sx={{
                height: '100vh',
                padding: '0',
            }}
        >
            <Box
                component='div'
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
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
                    sx={{ margin: '5px', fontWeight: 700, color: '#000', fontSize: '19px', marginRight: '16px' }}
                >
                    Booking System Configuration
                </Typography>
                <Tabs value={selectedTab}
                    sx={{
                        border: '2px solid #6ecddd',
                        borderRadius: '31px',
                        padding: '2px 1px 0px 3px',
                        maxHeight: '42px !important',
                        minHeight: 'auto !important',
                    }}
                    onChange={handleTabChange} TabIndicatorProps={{ style: { display: 'none' } }}>
                    <Tab
                        label='Service Details'
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            color: selectedTab === 0 ? '#fff !important' : '#000',
                            fontSize: '14px',
                            padding: '10px 20px',
                            backgroundColor: selectedTab === 0 ? '#6ecddd' : 'transparent',
                            borderRadius: '31px',
                            maxHeight: '40px !important',
                            minHeight: 'auto !important',
                            maxWidth: '180px !important',
                            minWidth: 'auto !important',

                            border: '2px solid #fff',
                            marginBottom: '2px',
                        }}
                    />
                    <Tab
                        label='Scheduling Settings'
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            color: selectedTab === 1 ? '#fff !important' : '#000',
                            fontSize: '14px',
                            padding: '10px 20px',
                            backgroundColor: selectedTab === 1 ? '#6ecddd' : 'transparent',
                            borderRadius: '31px',
                            maxHeight: '40px !important',
                            minHeight: 'auto !important',
                            maxWidth: '180px !important',
                            minWidth: 'auto !important',

                            border: '2px solid #fff',
                            marginBottom: '2px',
                        }}
                    />
                </Tabs>
            </Box>
            <Box component='div' sx={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {selectedTab === 0 && <ServiceDetails />}
                {selectedTab === 1 && <SchedulingSettings />}
            </Box>
        </Box>
    );
};

export default BookingSystemConfiguration;
