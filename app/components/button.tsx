import type { FC } from 'react';
import {
    Button as RAButton,
    type ButtonProps as RAButtonProps,
} from 'react-aria-components';
import type { IconProps } from '~/icons/type';

export interface ButtonProps extends RAButtonProps {
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    startIcon?: FC<IconProps>;
    endIcon?: FC<IconProps>;
}

export const Button: FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    startIcon: StartIcon,
    endIcon: EndIcon,
    ...props
}) => {
    return (
        <RAButton
            {...props}
            className={`btn btn-${variant} btn-${size} rounded flex items-center gap-1.5 ${props.className}`}
        >
            {StartIcon && <StartIcon size={size} />}
            <>{props.children}</>
            {EndIcon && <EndIcon size={size} />}
        </RAButton>
    );
};
