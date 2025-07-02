import type { FC } from 'react';
import {
    Link as RALink,
    type LinkProps as RALinkProps,
} from 'react-aria-components';
import { trim } from '~/utils/trim';
import './link.css';

export interface LinkProps extends RALinkProps {
    variant?: 'primary' | 'secondary';
}

export const Link: FC<LinkProps> = ({
    className,
    variant = 'primary',
    children,
    ...props
}) => {
    return (
        <RALink
            {...props}
            className={trim`
                link link-${variant}
                ${className}
            `}
        >
            {children}
        </RALink>
    );
};
