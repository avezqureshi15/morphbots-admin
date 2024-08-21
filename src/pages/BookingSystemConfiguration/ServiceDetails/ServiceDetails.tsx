import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import PrimaryButton from '../../../components/custom/PrimaryButton';
import PrimaryTextField from '../../../components/custom/PrimaryTextField';
import PrimarySelect from '../../../components/custom/PrimarySelect';
import { styled } from '@mui/system';
import AddService from './AddService';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import { getSlots, updateSlot } from '../../../slices/slotsSlice'; // Adjust the import path as needed

const ServiceDetails: React.FC = () => {
    const dispatch = useAppDispatch();
    const { slots } = useAppSelector((state) => state.slot);
    const [selectedService, setSelectedService] = React.useState<string | number>('');
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [slotDetails, setSlotDetails] = React.useState<any>(null); // Replace `any` with a more specific type if possible
    useEffect(() => {
        // Fetch slots options when component mounts
        dispatch(getSlots());
    }, [dispatch]);

    useEffect(() => {
        // Update slotDetails when selectedService changes
        const selectedSlot = slots.find(slot => slot.id === selectedService);
        setSlotDetails(selectedSlot || null);
    }, [selectedService, slots]);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
        setSelectedService(event.target.value);
    };

    const handleSave = () => {
        if (slotDetails) {
            // Create FormData object
            const formData = new FormData();
            formData.append('booking_type', slotDetails.booking_type);
            formData.append('time', String(slotDetails.time)); // Convert number to string
            formData.append('cost', String(slotDetails.cost)); // Convert number to string

            // Dispatch the updateSlot action with the FormData object
            dispatch(updateSlot({
                id: slotDetails.id,
                data: formData
            }));
        }
    };

    const serviceOptions = slots.map(slot => ({
        id: slot.id, // Use slot ID as the value
        name: slot.booking_type // Use booking type as the name
    }));

    const Container = styled('div')({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '950px',
        height: '460px',
        marginTop: '1rem',
        padding: '30px',
        borderRadius: '10px',
        border: '1px solid #eee',
        boxShadow: '0px 0px 20px 4px #0000000A',
        position: 'relative'
    });

    return (
        <>
            <Container>
                <Typography sx={{
                    fontWeight: '600',
                    fontSize: '19px',
                    width: '966px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: '#F2FAFC',
                    padding: '20px 0px 11px 45px'
                }}>Service Details</Typography>
                <Box
                    component='div'
                    style={{ marginTop: '3%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                >
                    <Box
                        component='div'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <PrimarySelect
                            label='Service Name'
                            options={serviceOptions}
                            value={selectedService}
                            onChange={handleSelectChange}
                        />
                        <PrimaryButton onClick={handleOpenPopup} variant='filled' textTransform='uppercase' height='50px' width='175px' style={{ marginTop: '24px', marginLeft: '10px' }} >
                            Add Service
                        </PrimaryButton>
                    </Box>
                    <PrimaryTextField
                        label='Duration'
                        placeholder='Enter duration'
                        width='914px'
                        value={slotDetails?.time} // Use slot details
                        onChange={(e) => setSlotDetails({ ...slotDetails, time: Number(e.target.value) })} // Update state on change
                    />
                    <PrimaryTextField
                        label='Cost'
                        placeholder='Enter cost'
                        width='914px'
                        value={slotDetails?.cost} // Use slot details
                        onChange={(e) => setSlotDetails({ ...slotDetails, cost: Number(e.target.value) })} // Update state on change
                    />
                    <PrimaryButton
                        variant='filled'
                        textTransform='uppercase'
                        height='40px'
                        width='350px'
                        style={{ marginTop: '3%' }}
                        onClick={handleSave}
                    >
                        Save
                    </PrimaryButton>
                </Box>
            </Container>
            <AddService open={isPopupOpen} onClose={handleClosePopup} />
        </>
    );
};

export default ServiceDetails;
