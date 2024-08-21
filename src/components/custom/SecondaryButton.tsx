import React from 'react';
import { Button, styled, ButtonProps } from '@mui/material';

const StyledButton = styled(Button)({
    width: '475px',
    height: '54px',
    borderRadius: '10px',
    borderWidth: '2px',
    borderColor: '#6ECDDD',
    backgroundColor: '#6ECDDD',
    color: 'white',
    '&:hover': {
        backgroundColor: '#5cbac4',
    },
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 700,
});


interface SecondaryButtonProps extends ButtonProps {
    buttonText: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ buttonText, ...props }) => {
    return (
        <StyledButton type='submit' variant='contained' fullWidth {...props}>
            {buttonText}
        </StyledButton>
    );
};

export default SecondaryButton;
