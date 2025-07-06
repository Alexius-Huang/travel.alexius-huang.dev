import type { FC, ReactNode } from 'react';
import {
    NavLink as RRNavLink,
    type NavLinkProps as RRNavLinkProps,
} from 'react-router';
import { trim } from '~/utils/trim';
import type { ButtonProps } from './button';
import './nav-link.css';

export interface NavLinkProps extends RRNavLinkProps {
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    startIcon?: FC<{ className?: string }>;
    endIcon?: FC<{ className?: string }>;
    children: ReactNode;
}

export const NavLink: FC<NavLinkProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    startIcon: StartIcon,
    endIcon: EndIcon,
    children,
    ...props
}) => {
    return (
        <RRNavLink
            {...props}
            className={({ isActive, isPending }) => trim`
                nav-link
                nav-link-${variant}
                nav-link-${size}
                ${isActive ? 'nav-link-active' : ''}
                ${isPending ? 'nav-link-pending' : ''}
                ${className}
            `}
        >
            {StartIcon && <StartIcon className="nav-link-icon" />}
            {children}
            {EndIcon && <EndIcon className="nav-link-icon" />}
        </RRNavLink>
    );
};
