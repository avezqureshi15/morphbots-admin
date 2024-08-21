import React, { useState } from 'react';
import { Box, Modal, Typography, IconButton, Card, CardContent, Chip } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import PrimaryTextField from '../../../components/custom/PrimaryTextField';
import PrimaryButton from '../../../components/custom/PrimaryButton';
import { styled } from '@mui/system';
import { useAppDispatch } from '../../../hooks/redux-hook';
import { createDeviceType } from '../../../slices/deviceSlice';

interface AddRobotProps {
    open: boolean;
    onClose: () => void;
}

const ModalBox = styled(Box)({
    //@ts-expect-error
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
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

const AddRobot: React.FC<AddRobotProps> = ({ open, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);

    const dispatch = useAppDispatch();

    const handleRemoveFile = (index: any) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = {
            name,
            description
        };
        dispatch(createDeviceType(formData));
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='add-new-robot-title'
            aria-describedby='add-new-robot-description'
            BackdropProps={{
                style: {
                    backdropFilter: 'blur(5px)',
                },
            }}
        >
            <ModalBox>
                <Header>
                    <Typography variant='h6' sx={{ paddingLeft: '30px' }}>Add Robot</Typography>
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            width='750px'
                            label='Name'
                        />
                        <PrimaryTextField
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            width='750px'
                            fieldWidth='378px'
                            label='Description'
                            multiline
                            rows={7}
                        />
                    </Box>
                    <Box>
                        {/* <h4 style={{ margin: '3rem 1rem 1rem 1.5rem' }}>Attachments:</h4> */}
                        <ul
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                padding: 0,
                            }}
                        >
                            {files.map((file: any, index) => {
                                const fileName = file.name;
                                const fileExtension = fileName.split('.').pop();
                                const baseName = fileName.slice(0, fileName.lastIndexOf('.'));
                                const displayName = baseName.length > 4 ? `${baseName.slice(0, 7)}...` : baseName;

                                return (
                                    <Card
                                        key={index}
                                        sx={{
                                            width: 160,
                                            backgroundColor: '#e3f2fd',
                                            boxShadow: 3,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                            }}
                                        >
                                            <Typography variant='body2' noWrap sx={{ maxWidth: '120px' }}>
                                                {`${displayName}.${fileExtension}`}
                                            </Typography>
                                            <IconButton
                                                size='small'
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <CloseIcon fontSize='small' sx={{ color: '#dd6e70' }} />
                                            </IconButton>
                                        </CardContent>
                                        <Chip
                                            label={fileExtension}
                                            size='small'
                                            sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#bbdefb' }}
                                        />
                                    </Card>
                                );
                            })}
                        </ul>
                    </Box>
                    <Box
                        component='div'
                        sx={{
                            width: '790px',
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'end',
                            flexDirection: 'row'
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
                            variant='filled'
                            height='38px'
                            width='120px'
                            fontWeight='600'
                            fontSize='13px'
                            type='submit'
                        >
                            Add
                        </PrimaryButton>
                    </Box>
                </form>
            </ModalBox>
        </Modal>
    );
};

export default AddRobot;
