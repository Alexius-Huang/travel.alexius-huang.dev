import type { FC } from 'react';
import './footer.css';
import { trim } from '~/utils/trim';
import { Link } from 'react-aria-components';

export const Footer: FC<{ className?: string}> = ({
    className
}) => {
    return (
        <footer className={trim`
            flex flex-col gap-y-1.5
            max-w-[768px] mx-auto px-1.5
            ${className}
        `}>
            <p className='flex items-center gap-x-2 justify-center text-sm'>
                &copy; 2025 by Jun-Xin (Alexius), Huang{' '}
                <br className='inline-block sm:hidden' />
                <span aria-hidden='true' className='hidden sm:inline-block rounded border-1 border-blue-500 h-4.5' />{' '}
                Made with <span role="img" aria-label="love">❤</span>
                <span aria-hidden='true' className='hidden sm:inline-block rounded border-1 border-blue-500 h-4.5' />{' '}
                All Rights Reserved
            </p>
            <p className='text-xs text-balance opacity-75'>No part of this website — including text, images, or any other content — may be copied, reproduced, distributed, or used in any manner without written permission from the copyright owner. </p>
            <p className='text-xs opacity-75'>
                For inquiries, please contact:{' '}
                <Link
                    href="mailto:alexius.huang@gmail.com"
                    className="underline opacity-100"
                >
                    alexius.huang@gmail.com
                </Link>
            </p>
        </footer>
    );
};
