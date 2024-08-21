import React, { useEffect } from 'react';
import { Box, Typography, TextField, TextFieldProps } from '@mui/material';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Handler for custom button click
const handleCustomButtonClick = () => {
    const fileInput = document.getElementById('hidden-file-input');
    if (fileInput) {
        fileInput.click(); // Trigger the file input's click event
    }
};

// Register the custom button in Quill
const CustomButtonHandler = function () {
    handleCustomButtonClick();
};

Quill.register('modules/customButton', CustomButtonHandler);

interface PrimaryTextFieldProps extends Omit<TextFieldProps, 'variant'> {
    label: string;
    multiline?: boolean;
    rows?: number;
    width?: string;
    height?: string;
    fieldWidth?: string;
    value?: string;
    body?: string;
    setBody?: (value: string) => void;
    handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PrimaryTextField: React.FC<PrimaryTextFieldProps> = ({
    label,
    multiline = false,
    width = '800px',
    height = '163px',
    rows = 5,
    fieldWidth = "100%",
    value = '',
    body,
    setBody,
    handleFileChange,
    ...props
}) => {

    useEffect(() => {
        setTimeout(() => {
            const customButton = document.querySelector('.ql-customButton');
            console.log("I am here")
            console.log(toolbar)
            if (customButton) {
                if (!customButton.querySelector('.bx.bx-cloud-upload')) {
                    const iconElement = document.createElement('i');
                    iconElement.classList.add('bx', 'bx-cloud-upload');
                    customButton.appendChild(iconElement);
                }
            }
        }, 1000);
    }, [open]);

    // Handler for changes in ReactQuill editor
    const handleQuillChange = (content: string) => {
        if (setBody) {
            setBody(content);
        }
    };

    return (
        <Box component='div' sx={{ marginBottom: '10px', width: width, fontFamily: 'Roboto, sans-serif' }}>
            <Typography variant='subtitle1' sx={{ marginBottom: '10px', fontWeight: 700 }}>
                {label}
            </Typography>
            {multiline ? (
                <Box>
                    <ReactQuill
                        style={{
                            height: height
                        }}
                        value={value}
                        onChange={handleQuillChange} // Handle Quill editor changes
                        modules={{
                            toolbar: {
                                container: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['customButton'],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    ['code-block'],
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                    [{ 'color': [] }, { 'background': [] }],
                                    ['link'],
                                ],
                                handlers: {
                                    customButton: CustomButtonHandler
                                }
                            }
                        }}
                        formats={[
                            'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
                            'strike', 'blockquote', 'code-block', 'script', 'indent', 'direction',
                            'size', 'color', 'background', 'align', 'link'
                        ]}
                        placeholder="Start typing..."
                    />

                    <div>
                        <input
                            type="file"
                            multiple
                            id="hidden-file-input"
                            style={{ display: 'none' }} // Hide the file input
                            onChange={handleFileChange} // Handle file input changes
                        />
                    </div>
                </Box>
            ) : (
                <TextField
                    fullWidth
                    variant='outlined'
                    value={value}
                    InputProps={{
                        sx: {
                            height: '50px', // Height for the actual input field
                            '& .MuiInputBase-input': {
                                height: '100%',
                                padding: '0 14px', // Adjust padding as needed
                            },
                            '& input::placeholder': {
                                color: '#000 !important', // Set the placeholder color
                                fontSize: '16px', // Set the placeholder font size
                                fontWeight: 700,
                                opacity: 1,
                            },
                            outline: 'none'
                        },
                    }}
                    sx={{ border: '1px solid #D9E2EB' }}
                    {...props}
                />
            )}
        </Box>
    );
};

export default PrimaryTextField;
