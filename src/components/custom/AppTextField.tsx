import React from 'react';
import { TextField, styled, InputAdornment } from '@mui/material';

const StyledTextField = styled(TextField)({
    marginBottom: '1rem',
    width: '475px',
    height: '81px',
    borderRadius: '10px',
    '& .MuiInputBase-root': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        display: 'none',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#D9E2EB',
            borderWidth: '1px',
        },
        '&:hover fieldset': {
            borderColor: '#D9E2EB',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6ECDDD',
        },
    },
});

interface AppTextFieldProps {
    placeholder: string;
    type?: string; // Make type prop optional
    endAdornment?: React.ReactNode; // Add endAdornment prop
    value?: string; // Add value prop
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>; // Add onChange prop
}

const AppTextField: React.FC<AppTextFieldProps> = ({ placeholder, type = 'text', endAdornment, value, onChange }) => {
    return (
        <StyledTextField
            type={type} // Pass type prop to TextField
            placeholder={placeholder}
            variant='outlined'
            fullWidth
            InputProps={{
                style: { color: '#B5B5B5' }, // Set text color to white
                endAdornment: endAdornment ? <InputAdornment position='end'>{endAdornment}</InputAdornment> : null, // Add endAdornment to InputProps
            }}
            InputLabelProps={{
                style: { color: '#B5B5B5' }, // Set placeholder color to grey
            }}
            value={value} // Pass value prop to TextField
            onChange={onChange} // Pass onChange prop to TextField
        />
    );
};

export default AppTextField;
