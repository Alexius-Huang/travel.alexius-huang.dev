import { useContext, type FC, type JSX, type PropsWithChildren } from 'react';
import { Modal as RAModal, ModalOverlay, DialogTrigger, Dialog, OverlayTriggerStateContext } from 'react-aria-components';
import { Button } from '~/components/button';
import { XMarkOutlineIcon } from '~/icons/outline/x-mark';
import { trim } from '~/utils/trim';
import './modal.css';

export interface ModalProps {
    trigger: JSX.Element;
    renderCloseButton?: boolean;
    isDismissable?: boolean;
}

const CloseButton: FC = () => {
    let state = useContext(OverlayTriggerStateContext)!;
    return (
        <Button
            onPress={() => state.close()}
            variant='secondary'
            className={trim`
                absolute right-4 top-4 rounded-[50%]
                !p-2 m-0 text-center !border-1
            `}
            aria-label='Close the current modal'
        >
            <XMarkOutlineIcon className='text-blue-500 dark:text-white' />
        </Button>
    );
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
    trigger,
    renderCloseButton = true,
    isDismissable = true,
    children
}) => {
    return (
        <DialogTrigger>
            {trigger}
            <ModalOverlay isDismissable={isDismissable} className='modal-overlay'>
                <div className='modal-linear-gradient' />
                <div className='modal-g1' />
                <div className='modal-g2' />

                <RAModal className='modal'>
                    <Dialog>
                        {renderCloseButton && (
                            <CloseButton />
                        )}

                        {children}
                    </Dialog>
                </RAModal>
            </ModalOverlay>
        </DialogTrigger>
    );
};
