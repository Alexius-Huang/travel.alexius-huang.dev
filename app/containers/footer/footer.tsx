import { forwardRef, type ForwardedRef, } from 'react';
import { trim } from '~/utils/trim';
import { Link } from '~/components/link';

interface FooterProps {
    className?: string;
}

export const Footer = forwardRef<HTMLElement, FooterProps>((
    { className }, 
    ref
) => (
    <footer
        ref={ref}
        className={trim`
        flex flex-col gap-y-1.5
        max-w-[768px] mx-auto px-[2rem]
        ${className}
    `}
    >
        <p className="block sm:flex items-center gap-x-2 justify-center text-sm mb-1.5">
            <span className="inline-block m-1.5">
                &copy; 2025 by Jun-Xin (Alexius), Huang
            </span>
            <br className="inline-block sm:hidden" />
            <span
                aria-hidden="true"
                className="hidden sm:inline-block rounded border-1 border-blue-500 h-4.5"
            />{' '}
            <span className="text-xs sm:text-sm">
                Made with{' '}
                <span role="img" aria-label="love">
                    ❤
                </span>
            </span>
            <span
                aria-hidden="true"
                className="hidden sm:inline-block rounded border-1 border-blue-500 h-4.5"
            />{' '}
            <span className="text-xs sm:text-sm">All Rights Reserved</span>
        </p>
        <p className="text-xs opacity-80">
            No part of this website — including text, images, or any other
            content — may be copied, reproduced, distributed, or used in any
            manner without written permission from the copyright owner.{' '}
        </p>
        <p className="text-xs">
            <span className="opacity-80">
                For inquiries, please contact:
            </span>{' '}
            <Link
                href="mailto:alexius.huang@gmail.com"
                className="underline opacity-100"
            >
                alexius.huang@gmail.com
            </Link>
        </p>
    </footer>
));

Footer.displayName = 'Footer';
