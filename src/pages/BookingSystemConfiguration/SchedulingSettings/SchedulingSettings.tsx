import React, { useEffect, useState } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, TextField, Tabs, Tab } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import PrimaryButton from '../../../components/custom/PrimaryButton';
import PrimarySelect from '../../../components/custom/PrimarySelect';
import { styled } from '@mui/system';
import AddRobot from './AddRobot';
import EditIcon from '@mui/icons-material/Edit'
import EditSchedulingSettings from './EditSchedulingSettings';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import { getDevices } from '../../../slices/deviceSlice';
import { getConfigurations } from '../../../slices/configurationSlice';
import { format, parseISO } from 'date-fns';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

const StyledTabPanel = styled('div')(() => ({
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #D9E2EB',
    padding: '16px 29px'
}));

const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;

    return (
        <StyledTabPanel
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )
            }
        </StyledTabPanel >
    );
}





const SchedulingSettings: React.FC = () => {
    const [selectedService, setSelectedService] = useState<string | number>('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('60days');
    const [tabValue, setTabValue] = useState(0);
    const [editiMode, setEditMode] = useState(false);
    console.log(selectedOption)

    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [startDateTime, setStartDateTime] = useState<Date | null>(null);
    const [endDateTime, setEndDateTime] = useState<Date | null>(null);
    const [scheduleType, setScheduleType] = useState('');
    const [scheduledDays, setScheduledDays] = useState('');
    const [weeklyHours, setWeeklyHours] = useState('');
    const [dateSpecific, setDateSpecific] = useState('');
    const dispatch = useAppDispatch();
    console.log(startDate) //2024-08-01T00:00:00+05:30
    console.log(endDate) //2024-08-30T00:00:00+05:30
    console.log(scheduleType) //days 
    console.log(scheduledDays) //60
    console.log(weeklyHours) //{"mon": "[09:00+0530 17:00+0530]", "tue": "[09:00+0530 11:00+0530, 13:00+0530 15:00+0530,16:00+0530 18:00+0530]", "wed": "[09:00+0530 17:00+0530]", "thu": "[09:00+0530 17:00+0530]", "fri": "[09:00+0530 17:00+0530]" , "sat": "unavailable", "sun": "[09:00+0530 17:00+0530]"}
    console.log(dateSpecific) //{"2024-08-16": "[09:00+0530 12:00+0530]", "2024-08-17": "unavailable"}

    const { devices } = useAppSelector((state) => state.device);
    const { configurations } = useAppSelector((state) => state.configuration); //this will be data in the array of object format for configuration settings , we have to prefill the componenet using 
    useEffect(() => {
        dispatch(getDevices());
    }, [dispatch]);

    const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
        const selectedDeviceTypeId = event.target.value as string;
        setSelectedService(selectedDeviceTypeId);
        // Fetch configurations for the selected device type
        dispatch(getConfigurations(selectedDeviceTypeId));
        // alert(JSON.stringify(selectedDeviceTypeId))
    };

    useEffect(() => {
        const configMap = configurations.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        setScheduleType(configMap['schedule_type'] || '');
        setScheduledDays(configMap['scheduled_days'] || '');
        setStartDate(configMap['scheduled_start_date'] || '');
        setEndDate(configMap['scheduled_end_date'] || '');
        setWeeklyHours(configMap['weekly_hours'] || '');
        setDateSpecific(configMap['date_specific'] || '');
    }, [configurations]);


    const handleOpenPopup = () => {
        setIsPopupOpen(true);
        setTabValue(0);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };



    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event);
        setTabValue(newValue);
    };
    const device_types: any = devices;
    console.log(device_types)
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

    const parseWeeklyHours = (hours: string) => {
        const parsedHours: any = JSON.parse(hours || '{}');
        const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        return daysOfWeek.map(day => {
            const key = day.toLowerCase();
            const value = parsedHours[key] || 'Not Set';
            return { day, value };
        });
    };

    const weeklyHoursData = parseWeeklyHours(weeklyHours);
    const handleEditClick = () => {
        setEditMode(true);
    }

    const formatTimeRange = (range: any) => {
        if (range === 'unavailable') return 'Unavailable';
        // Remove brackets and split by comma
        const times = range
            .replace(/[\[\]]/g, '')  // Remove brackets
            .split(', ')
            //@ts-expect-error
            .map(timeRange => {
                // Extract start and end times
                const [start, end] = timeRange.split(' ');
                return `${start} - ${end}`;
            });

        return times.join(', ');
    };

    useEffect(() => {
        if (startDate) {
            setStartDateTime(parseISO(startDate));
        }
        if (endDate) {
            setEndDateTime(parseISO(endDate));
        }
    }, [startDate, endDate]);

    const handleStartDateTimeChange = (date: Date | null) => {
        setStartDateTime(date);
        setStartDate(date ? format(date, "yyyy-MM-dd'T'HH:mm:ssXXX") : '');
    };

    const handleEndDateTimeChange = (date: Date | null) => {
        setEndDateTime(date);
        setEndDate(date ? format(date, "yyyy-MM-dd'T'HH:mm:ssXXX") : '');
    };
    return (
        <>
            {
                editiMode ? <EditSchedulingSettings setEditMode={setEditMode} /> :
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
                            Scheduling Settings
                        </Typography>
                        <Box
                            component="div"
                            style={{ marginTop: '6%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                        >
                            <Box
                                component="div"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '25px'
                                }}
                            >
                                <PrimarySelect
                                    label='Robots'
                                    options={device_types}
                                    value={selectedService}
                                    onChange={handleSelectChange}
                                />
                                <PrimaryButton onClick={handleOpenPopup} variant='filled' textTransform='uppercase' height='50px' width='175px' style={{ marginTop: '24px', marginLeft: '10px' }} >
                                    Add Robot
                                </PrimaryButton>
                            </Box>
                            <Box component="div" sx={{ width: '100%', marginBottom: '30px' }}>
                                <Typography variant='subtitle1' sx={{ marginBottom: '7px', fontWeight: 700 }}>
                                    Date Range
                                </Typography>
                                <Typography sx={{ marginBottom: '10px', fontWeight: 400, color: '#636363', fontSize: '15px' }}>
                                    Users can book sessions based on the availability hours given below until ...
                                </Typography>

                                <RadioGroup
                                    value={scheduleType} // Bind to scheduleType
                                    onChange={handleOptionChange}
                                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}
                                >
                                    <Box display="flex" alignItems="center">
                                        <FormControlLabel
                                            value="days"
                                            control={<Radio sx={{ color: '#6ECDDD', '&.Mui-checked': { color: '#6ECDDD' } }} />}
                                            label={
                                                <>
                                                    <TextField
                                                        variant="outlined"
                                                        value={scheduledDays} // Bind to scheduledDays
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        sx={{ marginLeft: 2, width: '50px' }}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        value="Calendar Days"
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        sx={{ marginLeft: 2, width: '150px' }}
                                                    />
                                                </>
                                            }
                                        />
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <FormControlLabel
                                            value="dateRange"
                                            control={<Radio sx={{ color: '#6ECDDD', '&.Mui-checked': { color: '#6ECDDD' } }} />}
                                            label="Within Date Range"
                                        />
                                        {scheduleType === 'scheduled_start_date' && (
                                            //@ts-expect-error
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <Box display="flex" ml={2}>
                                                    <DateTimePicker
                                                        label="Start Date & Time"
                                                        //@ts-expect-error
                                                        value={startDateTime}
                                                        onChange={handleStartDateTimeChange}
                                                        renderInput={(params: any) => <TextField {...params} sx={{ marginRight: 2 }} />}
                                                    />
                                                    <DateTimePicker
                                                        label="End Date & Time"
                                                        //@ts-expect-error
                                                        value={endDateTime}
                                                        onChange={handleEndDateTimeChange}
                                                        renderInput={(params: any) => <TextField {...params} />}
                                                    />
                                                </Box>
                                            </LocalizationProvider>
                                        )}
                                    </Box>
                                    <FormControlLabel
                                        value="indefinitely"
                                        control={<Radio sx={{ color: '#6ECDDD', '&.Mui-checked': { color: '#6ECDDD' } }} />}
                                        label="Indefinitely into the future"
                                    />
                                </RadioGroup>

                            </Box>
                            <Box component="div" sx={{ width: '100%' }}>
                                <Typography variant='subtitle1' sx={{ marginBottom: '7px', fontWeight: 700 }}>
                                    Available hours
                                </Typography>
                                <Typography sx={{ marginBottom: '10px', fontWeight: 400, color: '#636363', fontSize: '15px' }}>
                                    Set the times that users will be able to schedule the sessions with the robot
                                </Typography>
                                <Box
                                    component='div'
                                    sx={{
                                        backgroundColor: '#F7F9FA',
                                        borderBottom: '1px solid #D9E2EB',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingLeft: '10px',
                                        paddingRight: '10px'
                                    }}
                                >
                                    <Tabs
                                        value={tabValue}
                                        onChange={handleTabChange}

                                        TabIndicatorProps={{
                                            style: {
                                                backgroundColor: '#6ECDDD',
                                            }
                                        }}
                                    >
                                        <Tab label="Weekly hours" sx={{ color: '#000 !important', textTransform: 'capitalize' }} />
                                        <Tab label="Date-specific hours" sx={{ color: '#000 !important', textTransform: 'capitalize' }} />
                                        <Tab label="Booked Slots" sx={{ color: '#000 !important', textTransform: 'capitalize' }} />
                                    </Tabs>
                                    <PrimaryButton
                                        onClick={handleEditClick}
                                        variant='filled'
                                        textTransform='capitalize'
                                        height='31px'
                                        width='80px'
                                        fontWeight='600'
                                        fontSize='13px'
                                        icon={EditIcon}
                                        fontFamily='Roboto, sans-serif'
                                        letterSpacing='1px'
                                    >
                                        Edit
                                    </PrimaryButton>
                                </Box>
                                <TabPanel value={tabValue} index={0}
                                    sx={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        '& .MuiBox-root': {
                                            padding: '0 !important', // Ensure padding does not interfere
                                        },
                                    }}
                                >
                                    <Box>
                                        {weeklyHoursData.map(({ day, value }) => (
                                            <Box key={day} display="flex" alignItems="center" mb={1}>
                                                <Typography variant='body1' sx={{ width: '80px', fontWeight: 600 }}>
                                                    {day}
                                                </Typography>
                                                <Typography variant='body1'>
                                                    {formatTimeRange(value)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </TabPanel>
                                <TabPanel sx={{ padding: '0' }} value={tabValue} index={1}>
                                    <Typography sx={{ marginBottom: '10px', fontWeight: 400, color: '#636363', fontSize: '15px' }}>
                                        Override your availability for specific dates when your hours differ from your regular weekly hours.
                                    </Typography>
                                    <Box>
                                        {dateSpecific && (() => {
                                            let parsedData = {};
                                            try {
                                                parsedData = JSON.parse(dateSpecific);
                                            } catch (error) {
                                                console.error('Invalid JSON input:', error);
                                            }
                                            return Object.entries(parsedData).map(([date, hours]) => (
                                                <Box key={date} display="flex" alignItems="center" mb={1}>
                                                    <Typography variant='body1' sx={{ width: '120px', fontWeight: 600 }}>
                                                        {format(parseISO(date), 'yyyy-MM-dd')}
                                                    </Typography>
                                                    <Typography variant='body1'>
                                                        {formatTimeRange(hours)}
                                                    </Typography>
                                                </Box>
                                            ));
                                        })()}
                                    </Box>
                                    <PrimaryButton variant='filled' textTransform='capitalize' height='37px' width='291px'>
                                        Add Date-Specific Hours
                                    </PrimaryButton>
                                </TabPanel>

                            </Box>
                        </Box>
                    </Container >
            }


            <AddRobot open={isPopupOpen} onClose={handleClosePopup} />
        </>
    );
};

export default SchedulingSettings;
