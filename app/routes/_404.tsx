import { FOOTER_HEIGHT } from "~/containers/footer";
import { StatusError } from "~/containers/status-error";

export default function _404() {
    return (
        <StatusError
            className='centered-max-width-1280'
            style={{ height: `calc(100vh - ${FOOTER_HEIGHT}px)` }}
            status={404}
            message='Not Found'
        />
    );
}
