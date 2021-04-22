// @flow
import React, { useState } from 'react';
import { closeFolderCreateModal, createFolder } from '../../actions';
import { fontSize, padding } from '@scality/core-ui/dist/style/theme';
import { useDispatch, useSelector } from 'react-redux';
import type { Action } from '../../../types/actions';
import type { AppState } from '../../../types/state';
import { Button } from '@scality/core-ui';
import type { DispatchAPI } from 'redux';
import Input from '../../ui-elements/Input';
import { CustomModal as Modal } from '../../ui-elements/Modal';
import { addTrailingSlash } from '../../utils';
import styled from 'styled-components';

export const Description = styled.div`
    margin-top: ${padding.base};
    width: 400px;
    font-size: ${fontSize.base};
`;
export const Icon = styled.i`
    margin-right: ${padding.smaller};
`;

type Props = {
    bucketName: string,
    prefixWithSlash: string,
};
const FolderCreate = ({ bucketName, prefixWithSlash }: Props) => {
    const [folderName, setFolderName] = useState('');

    const show = useSelector((state: AppState) => state.uiObjects.showFolderCreate);

    const dispatch: DispatchAPI<Action> = useDispatch();

    if (!show) {
        return null;
    }

    const cancel = () => {
        setFolderName('');
        dispatch(closeFolderCreateModal());
    };

    const save = () => {
        if (!folderName) {
            return;
        }
        setFolderName('');
        dispatch(createFolder(bucketName, prefixWithSlash, addTrailingSlash(folderName)));
    };

    const handleChange = (e) => {
        setFolderName(e.target.value);
    };

    return (
        <Modal
            id="folder-create"
            close={cancel}
            footer={
                <div>
                    <Button id='folder-create-cancel-button' outlined onClick={cancel} size="small" text='Cancel'/>
                    <Button id='folder-create-save-button' variant="buttonSecondary" onClick={save} size="small" text='Save'/>
                </div>
            }
            isOpen={true}
            title='Create a folder'>
            <Input className='folder-create-input' value={folderName} placeholder='New folder' onChange={handleChange}/>
            <Description> <Icon className="fas fa-info-circle"></Icon>
              When you create a folder, Data Browser creates an object with
              the above name appended by suffix &quot;/&quot; and that object is displayed
              as a folder in the Data Browser. </Description>
        </Modal>
    );
};

export default FolderCreate;
