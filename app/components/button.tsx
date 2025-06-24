import type { FC } from 'react';
import { Button as RAButton, type ButtonProps as RAButtonProps } from 'react-aria-components';
import './button.css';

export interface ButtonProps extends RAButtonProps {
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    return (
        <RAButton
            {...props}
            className={`btn btn-${variant} btn-${size} ${props.className}`}
        >
            {props.children}
        </RAButton>
    );
};