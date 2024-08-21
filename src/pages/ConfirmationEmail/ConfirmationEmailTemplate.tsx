import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryButton from '../../components/custom/PrimaryButton';
import PrimaryTextField from '../../components/custom/PrimaryTextField';
import axiosInstance from '../../api/axiosInstance';
import { URLS } from '../../constants/urlConstants';
import GuidanceSidebar from './GuidanceSidebar';
import { toast } from 'react-toastify';


const ConfirmationEmailTemplate: React.FC = () => {
    const [subject, setSubject] = useState('Subject Will be here');
    const [body, setBody] = useState(
        `Dear {{name}},

Thank you for choosing the Morphbots platform to explore the fascinating world of robotics! We are excited to inform you that your booking for a coding session has been successfully processed. This email serves as your booking confirmation and contains all the details you need to know.

Booking Details:
- Session Date: {{session_date}}
- Session Time: {{session_time}}
- Duration: {{slot}} Minutes
- Robot Type: {{color}} - {{robot_type}}
- Robot Number: #{{id}}
- Session Link: {{link}}

Please ensure that you keep this email for reference purposes.

Important Notes:
1. Before the session:
   - Make sure you have a stable internet connection.
   - Familiarize yourself with our platform.
   - Be ready at least 5 minutes before the scheduled start time.

2. After the session:
   - We encourage you to provide feedback on your experience, as it helps us improve our services. Write to us at support@morphbots.co.
   - If you have any further questions or need assistance, please don't hesitate to reach out to our support team.

Payment Details:
- Booking Amount: $ {{ cost }}
- Payment Method: {{payment_method}}
- Transaction ID: {{order_id}}

Please note that in the event of any unforeseen circumstances or technical difficulties, we will make every effort to reschedule your session at a mutually convenient time.

We are thrilled to have you onboard and look forward to a productive and engaging coding session with our remote robot. If you have any additional questions or concerns, please don't hesitate to contact us at support@morphbots.co.

Best regards,
The Morphbots Team`
    );
    const replacePlaceholders = (template: string) => {
        return template.replace(/{{\s*([^\s}]+)\s*}}/g, '%s');
    };

    const formattedBody = replacePlaceholders(body);

    const handleSave = async () => {

        const payload = {
            subject,
            body: formattedBody,
            variables: ['name', 'session_date', 'session_time', 'slot', 'color', 'robot_type', 'id', 'link', 'cost', 'payment_method', 'order_id']
        };
        try {
            const response = await axiosInstance.put(URLS.UPDATE_CONFIRMATION_EMAIL, payload);
            console.log(response.data);
            toast.success("Sent Successfully")
        } catch (error) {
            console.error('Error updating email template:', error);
        }
    };

    const handleFileChange = (e: any) => {
        //@ts-expect-error
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    return (

        <>
            <Box
                component='div'
                sx={{
                    height: '100 %',
                    width: 'calc(100 % - 352px)',
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
                        Confirmation Email Template
                    </Typography>
                    <Box
                        component='div'
                        sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <PrimaryButton variant='outlined' textTransform='uppercase' width='134px' >Edit</PrimaryButton>
                        <PrimaryButton variant='filled' textTransform='uppercase' width='134px' onClick={handleSave}>Save</PrimaryButton>
                    </Box>
                </Box>
                <Box
                    component='div'
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        component='div'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >

                        <form>
                            <PrimaryTextField
                                label='Subject'
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                width='750px'
                            />
                            <PrimaryTextField
                                width='750px'
                                height='415px'
                                label='Body'
                                multiline
                                value={body}
                                rows={8}
                                setBody={setBody}
                                handleFileChange={handleFileChange}
                            />
                        </form>
                    </Box>
                    <GuidanceSidebar />
                </Box>
            </Box>
        </>
    );
};

export default ConfirmationEmailTemplate;
