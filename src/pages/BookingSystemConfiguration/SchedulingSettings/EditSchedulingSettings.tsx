import React, { useEffect, useState } from 'react';
import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import PrimaryButton from '../../../components/custom/PrimaryButton';
import { styled } from '@mui/system';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import { getDevices } from '../../../slices/deviceSlice';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrimarySelect from '../../../components/custom/PrimarySelect';
import { getConfigurations } from '../../../slices/configurationSlice';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';

const Container = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '950px',
    height: 'auto',
    marginTop: '1rem',
    padding: '30px',
    borderRadius: '10px',
    border: '1px solid #eee',
    boxShadow: '0px 0px 20px 4px #0000000A',
    position: 'relative'
});

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const defaultStartTime = '09:00';
const defaultEndTime = '17:00';

interface EditSchedulingSettingsProps {
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditSchedulingSettings: React.FC<EditSchedulingSettingsProps> = ({ setEditMode }) => {
    const dispatch = useAppDispatch();
    const [selectedService, setSelectedService] = useState<string | number>('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [scheduleType, setScheduleType] = useState('');
    const [scheduledDays, setScheduledDays] = useState('');
    // const [weeklyHours, setWeeklyHours] = useState('');
    const [dateSpecificHours, setDateSpecificHours] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    console.log(startDate)
    console.log(endDate)
    console.log(scheduleType)
    console.log(scheduledDays)


    const handleDateChange = (date: Date | null) => {
        setDateSpecificHours(date);
        setShowDatePicker(false);
    };
    const { devices } = useAppSelector((state) => state.device);
    const { configurations } = useAppSelector((state) => state.configuration);
    const handleSelectChange = (event: any) => {
        const selectedDeviceTypeId = event.target.value as string;
        dispatch(getConfigurations(selectedDeviceTypeId));
        setSelectedService(event.target.value);
    };

    console.log(configurations);

    const handleBackClick = () => {
        setEditMode(false);
    }
    useEffect(() => {
        dispatch(getDevices());
    }, [dispatch]);

    const [timezoneOffset, setTimezoneOffset] = useState<string>('');
    useEffect(() => {
        const offset = new Date().toString().match(/([-\+][0-9]+)\s/)?.[1] || '';
        setTimezoneOffset(offset);
    }, []);

    const device_types: any = devices;


    const [timings, setTimings] = useState<{ [key: string]: { start: string[], end: string[], unavailable: boolean } }>(
        Object.fromEntries(daysOfWeek.map(day => [day, { start: [defaultStartTime], end: [defaultEndTime], unavailable: false }]))
    );


    useEffect(() => {
        const configMap = configurations.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        setScheduleType(configMap['schedule_type'] || '');
        setScheduledDays(configMap['scheduled_days'] || '');
        setStartDate(configMap['scheduled_start_date'] || '');
        setEndDate(configMap['scheduled_end_date'] || '');

        const weeklyHoursData = configMap['weekly_hours'] || '';
        try {
            const weeklyHoursParsed = JSON.parse(weeklyHoursData);
            const newTimings = daysOfWeek.reduce((acc: any, day) => {
                const dayKey = day.toLowerCase();
                const value = weeklyHoursParsed[dayKey];
                if (value === 'unavailable') {
                    acc[day] = { start: [], end: [], unavailable: true };
                } else {
                    const timeRanges = value.replace(/[\[\]]/g, '').
                        //@ts-expect-error
                        split(', ').map(range => {
                            const [start, end] = range.split(' ');
                            return { start, end };
                        });

                    acc[day] = {
                        //@ts-expect-error
                        start: timeRanges.map(range => range.start),
                        //@ts-expect-error
                        end: timeRanges.map(range => range.end),
                        unavailable: false
                    };
                }
                return acc;
            }, {} as { [key: string]: { start: string[], end: string[], unavailable: boolean } });

            setTimings(newTimings);
        } catch (e) {
            console.error("Failed to parse weekly_hours data", e);
        }
    }, [configurations]);


    const handleTimingChange = (day: string, index: number, type: 'start' | 'end', value: string) => {
        if (!timings[day].unavailable) {
            setTimings(prev => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    [type]: prev[day][type].map((item, i) => (i === index ? value : item))
                }
            }));
        }
    };

    const handleAddTiming = (day: string) => {
        if (timings[day].unavailable) {
            setTimings(prev => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    unavailable: false,
                    start: [defaultStartTime, ...prev[day].start],
                    end: [defaultEndTime, ...prev[day].end]
                }
            }));
        } else {
            setTimings(prev => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    start: [...prev[day].start, defaultStartTime],
                    end: [...prev[day].end, defaultEndTime]
                }
            }));
        }
    };

    const handleRemoveTiming = (day: string, index: number) => {
        const newStart = timings[day].start.filter((_, i) => i !== index);
        const newEnd = timings[day].end.filter((_, i) => i !== index);

        setTimings(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                start: newStart,
                end: newEnd,
                unavailable: newStart.length === 0
            }
        }));
    };

    const handleUnavailableChange = (day: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setTimings(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                unavailable: event.target.checked,
                start: event.target.checked ? [] : prev[day].start,
                end: event.target.checked ? [] : prev[day].end
            }
        }));
    };

    const formatTimings = () => {
        return Object.keys(timings).reduce((acc: any, day) => {
            const { start, end, unavailable } = timings[day];
            if (unavailable) {
                acc[day.toLowerCase()] = 'unavailable';
            } else {
                const timeRanges = start.map((s, index) => `[${s}${timezoneOffset} ${end[index]}${timezoneOffset}]`).join(', ');
                acc[day.toLowerCase()] = timeRanges;
            }
            return acc;
        }, {});
    };


    const handleSubmit = () => {
        const formattedWeeklyHours = formatTimings();
        const updatedConfig = {
            ...configurations.find((config: any) => config.key === 'weekly_hours'),
            value: JSON.stringify(formattedWeeklyHours)
        };

        // Dispatch an action or handle the submission here
        toast.success('Saved Successfully');
        handleBackClick();
        console.log("Updated Configuration:", updatedConfig);
    };




    return (
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
            }}>
                <PrimaryButton onClick={handleBackClick} variant='filled' height='31px' width='30px' fontSize='15px' fontWeight='800' backgroundColor='#48C1B8' borderColor='#48C1B8' icon={ArrowBackIcon} fontFamily='Roboto, sans-serif' borderRadius={500} style={{ marginRight: '10px', minWidth: '10px' }} ></PrimaryButton>
                Scheduling Settings
            </Typography>
            <Box
                component='div'
                style={{ marginTop: '6%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
            >
                <Box
                    component='div'
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '25px'
                    }}
                >
                    <PrimarySelect
                        width='946px'
                        label='Robots'
                        options={device_types}
                        value={selectedService}
                        onChange={handleSelectChange}
                    />
                </Box>
                <Box component='div' sx={{ width: '100%' }}>
                    <Box
                        component='div'
                        sx={{
                            backgroundColor: '#F7F9FA',
                            borderBottom: '1px solid #D9E2EB',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 0',
                        }}
                    >
                        <Typography sx={{ width: '50%', color: '#000', textTransform: 'capitalize', fontWeight: 700, textAlign: 'left', paddingLeft: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Weekly hours
                            <Box
                                component='div'
                                sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                <PrimaryButton variant='outlined' textTransform='uppercase' width='134px' >Cancel</PrimaryButton>
                                <PrimaryButton variant='filled' textTransform='uppercase' width='134px' onClick={handleSubmit} >Save</PrimaryButton>
                            </Box>
                        </Typography>
                        <Typography sx={{ width: '50%', color: '#000', textTransform: 'capitalize', fontWeight: 700, textAlign: 'left', paddingLeft: '10px' }}>
                            Date-Specific Hours
                        </Typography>
                    </Box>
                    <Box
                        component='div'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '20px'
                        }}
                    >
                        <Box sx={{ width: '200px', borderRight: '1px solid #D9E2EB', paddingRight: '10px' }}>
                            {daysOfWeek.map((day) => (
                                <Box component='div' key={day} mb={1} sx={{ marginBottom: '10px', display: 'flex', flexDirection: 'row' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ width: '50px', fontWeight: 700, fontFamily: 'Roboto, sans-serif' }}>{day}</Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={timings[day].unavailable}
                                                    onChange={(e) => handleUnavailableChange(day, e)}
                                                />
                                            }
                                            label="Unavailable"
                                        />
                                    </Box>
                                    <Box
                                        component='div'
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {!timings[day].unavailable && timings[day].start.map((_, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <input type='text' value={timings[day].start[index]}
                                                    onChange={(e) => handleTimingChange(day, index, 'start', e.target.value)} style={{
                                                        fontSize: '17px',
                                                        fontWeight: 700,
                                                        padding: '8px 10px',
                                                        width: '64px',
                                                        border: '1px solid #bcbfc1',
                                                        borderRadius: '3px',
                                                        fontFamily: 'Roboto, sans-serif'
                                                    }} />
                                                <Typography sx={{ margin: '0 5px' }}> - </Typography>
                                                <input type='text' value={timings[day].end[index]}
                                                    onChange={(e) => handleTimingChange(day, index, 'end', e.target.value)} style={{
                                                        fontSize: '17px',
                                                        fontWeight: 700,
                                                        padding: '8px 10px',
                                                        width: '64px',
                                                        border: '1px solid #bcbfc1',
                                                        borderRadius: '3px',
                                                        marginRight: '1rem',
                                                        fontFamily: 'Roboto, sans-serif'
                                                    }} />
                                                <PrimaryButton
                                                    onClick={() => handleRemoveTiming(day, index)}
                                                    variant='filled'
                                                    height='31px'
                                                    width='30px'
                                                    fontSize='10px'
                                                    fontWeight='800'
                                                    backgroundColor='#DD6E70'
                                                    borderColor='#DD6E70'
                                                    icon={CloseIcon}
                                                    fontFamily='Roboto, sans-serif'
                                                    borderRadius={2}
                                                    style={{ marginRight: '5px', minWidth: '30px' }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                    {!timings[day].unavailable && (
                                        <PrimaryButton
                                            onClick={() => handleAddTiming(day)}
                                            variant='filled'
                                            height='31px'
                                            width='30px'
                                            fontSize='10px'
                                            fontWeight='800'
                                            backgroundColor='#48C1B8'
                                            borderColor='#48C1B8'
                                            icon={AddIcon}
                                            fontFamily='Roboto, sans-serif'
                                            borderRadius={2}
                                            style={{ minWidth: '30px', marginTop: '0.2rem' }}
                                        />
                                    )}
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ width: '48%', paddingLeft: '10px' }}>
                            <Typography sx={{ marginBottom: '10px', fontWeight: 400, color: '#636363', fontSize: '15px' }}>
                                Override your availability for specific dates when your hours differ from your regular weekly hours.
                            </Typography>
                            <PrimaryButton variant='filled' textTransform='capitalize' height='37px' width='291px' >
                                Add Date-Specific Hours
                            </PrimaryButton>
                        </Box>
                        {showDatePicker && (
                            <DatePicker
                                selected={dateSpecificHours}
                                onChange={handleDateChange}
                                showTimeSelect
                                dateFormat="MMMM d, yyyy h:mm aa"
                                inline
                            />
                        )}
                    </Box>
                </Box>

            </Box>
        </Container>
    );
};

export default EditSchedulingSettings;
