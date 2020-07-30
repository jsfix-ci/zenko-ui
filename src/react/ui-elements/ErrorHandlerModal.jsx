// @noflow

import { Button } from '@scality/core-ui';
import { CustomModal as Modal } from './Modal';
import type { Node } from 'react';
import React from 'react';

type Props = {
    children: Node,
    close: () => void,
    show: boolean,
};

const ErrorHandlerModal = ({ children, close, show }: Props) => {
    if (!children) {
        return null;
    }
    return (
        <Modal
            close={close}
            footer={<Button variant="secondary" onClick={close} size="small" text="Close"/>}
            isOpen={show}
            title="Error">
            {children}
        </Modal>
    );
};

export default ErrorHandlerModal;
