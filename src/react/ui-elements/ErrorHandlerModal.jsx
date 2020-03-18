// @noflow

import { Button, Modal } from '@scality/core-ui';
import type { Node } from 'react';
import React from 'react';

type Props = {
    children: Node,
    show: boolean,
    close: () => void,
};

class ErrorHandlerModal extends React.Component<Props> {
    render () {
        if (!this.props.children) { // TODO TESTME
            return null;
        }
        return (
            <Modal
                close={this.props.close}
                footer={<div style={{display: 'flex', justifyContent: 'space-between'}}> <Button outlined onClick={this.props.close} size="small" text="Close"/> </div>}
                isOpen={this.props.show}
                title="Error">
                <div style={{margin: '10px 0px 20px'}}>
                    {this.props.children}
                </div>
            </Modal>
        );
    }
}

export default ErrorHandlerModal;
