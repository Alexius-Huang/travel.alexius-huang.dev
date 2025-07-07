import { useContext } from "react";
import { NavLink } from "~/components/nav-link";
import { MinContainerHeightContext } from "~/contexts/min-container-height-provider";

export default function _404() {
    const minContainerHeight = useContext(MinContainerHeightContext);

    return (
        <div
            className='centered-max-width-1280 text-center flex flex-col items-center justify-center'
            style={{ height: `${minContainerHeight}px` }}
        >
            <h1 className='text-blue-500 text-[7rem] font-black leading-12'>
                404
                <br />
                <span className='text-white text-4xl uppercase'>Not Found</span>
            </h1>

            <NavLink to='/' className='mt-12'>
                Back to Home Page
            </NavLink>
        </div>
    );
}
