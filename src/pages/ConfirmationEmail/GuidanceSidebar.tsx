import React from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const GuidanceSidebar: React.FC = () => {
    const variables = ['User Name', 'Session Date', 'Session Time', 'Robot Type'];

    return (
        <Box
            sx={{
                width: 250,
                height: 523,
                border: '1px solid #D9E2EB',
                borderTop: '5px solid #6ECDDD',
                padding: '16px',

                backgroundColor: '#fff',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Box display='flex' alignItems='center' mb={2}>
                <IconButton sx={{ padding: 0, marginRight: '8px' }}>
                    <InfoIcon style={{ color: '#000' }} />
                </IconButton>
                <Typography variant='h6' fontWeight='bold'>
                    Guidance
                </Typography>
            </Box>
            <Typography variant='body2' color='textSecondary' mb={1} sx={{ fontSize: '14px' }} >
                Lörem ipsum lore dekavis sitskate anteda, till seren. Pregram otesamma, ifall opän. Rev äna suprassa eftersom trer det dint. Bet londe alltså arat ifall kurarade. Pregon birade halvpudel mer.
            </Typography>
            <Typography variant='body2' color='textSecondary' mb={3} sx={{ fontSize: '14px' }} >
                Lörem ipsum lore dekavis sitskate anteda, till seren. Pregram otesamma.
            </Typography>
            <Box display='flex' alignItems='center' mb={2}>
                <Typography variant='subtitle2' fontWeight='bold'>
                    Variables
                </Typography>
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
                {variables.map((variable) => (
                    <Chip
                        key={variable}
                        label={
                            <Box sx={{
                                position: 'absolute',
                                marginLeft: '-108px',
                                zIndex: 1111,
                                marginTop: '-9px'
                            }}>
                                {variable}
                            </Box>
                        }
                        sx={{
                            backgroundColor: '#F7F9FA',
                            fontWeight: 'bold',
                            height: '46px',
                            fontSize: '15px',
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default GuidanceSidebar;
