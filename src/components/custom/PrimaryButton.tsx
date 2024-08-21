import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
    variant?: 'text' | 'outlined' | 'contained' | 'filled';
    icon?: React.ElementType; // Correct type for icon prop
    textTransform?: 'uppercase' | 'capitalize' | 'none';
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
    fontWeight?: string | number;
    textColor?: string;
    borderColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    letterSpacing?: string;
    border?: string;
    borderRadius?: number;

}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    variant = 'contained',
    icon: IconComponent,
    textTransform = 'uppercase',
    width = '170px',
    height = '40px',
    fontSize = '17px',
    fontWeight = '700',
    textColor = '#6ECDDD',
    borderColor = '#6ECDDD',
    backgroundColor = '#6ECDDD',
    fontFamily = 'Nunito, sans-serif',
    letterSpacing = '2px',
    border = '2',
    borderRadius = 0,
    ...props
}) => {
    return (
        <Button
            variant={variant as any} // Type assertion to any for variant
            startIcon={IconComponent && <IconComponent />}
            sx={{
                textTransform: textTransform,
                borderRadius: borderRadius,
                color: variant === 'filled' ? '#fff' : textColor,
                border: `${border}px solid ${borderColor}`,
                fontFamily: fontFamily,
                fontWeight: fontWeight,
                letterSpacing: letterSpacing,
                width: width,
                height: height,
                fontSize: fontSize,
                backgroundColor: variant === 'filled' ? backgroundColor : 'transparent',
                '&:hover': {
                    backgroundColor: variant === 'filled' ? backgroundColor : 'transparent',
                    borderColor: borderColor,
                    color: variant === 'filled' ? '#fff' : textColor,
                },
                '& .MuiButton-label': {
                    color: variant === 'filled' ? '#FFF' : textColor,
                },
                '& .MuiButton-startIcon': {
                    marginLeft: '6px', // Adjust the margin for the start icon
                },
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default PrimaryButton;
