import { useContext } from "react";
import { StatusError } from "~/containers/status-error";
import { MinContainerHeightContext } from "~/contexts/min-container-height-provider";

export default function _404() {
    const minContainerHeight = useContext(MinContainerHeightContext);

    return (
        <StatusError
            className='centered-max-width-1280'
            style={{ height: `${minContainerHeight}px` }}
            status={404}
            message='Not Found'
        />
    );
}
