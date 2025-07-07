import type { CSSProperties, FC } from "react";
import { NavLink } from "~/components/nav-link";

export interface StatusErrorProps {
    status: number;
    message: string;
    className?: string;
    style?: CSSProperties
}
export const StatusError: FC<StatusErrorProps> = ({
    status,
    message,
    className,
    style
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center ${className}`}
            style={style}
        >
            <h1 className='text-blue-500 text-[7rem] font-black leading-12'>
                {status}
                <br />
                <span className='text-white text-4xl uppercase'>{message}</span>
            </h1>

            <NavLink to='/' className='mt-12'>
                Back to Home Page
            </NavLink>
        </div>
    )
};
