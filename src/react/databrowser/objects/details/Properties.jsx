// @noflow
import Table, * as T from '../../../ui-elements/TableKeyValue2';
import { Clipboard } from '../../../ui-elements/Clipboard';
import MiddleEllipsis from '../../../ui-elements/MiddleEllipsis';
import type { ObjectMetadata } from '../../../../types/s3';
import { PrettyBytes, Toggle } from '@scality/core-ui';
import React from 'react';
import { formatShortDate } from '../../../utils';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { putObjectLegalHold } from '../../../actions/s3object';
import { usePrefixWithSlash } from '../../../utils/hooks';
import { spacing } from '@scality/core-ui/dist/style/theme';
import { AppState } from '../../../../types/state';
type Props = {
  objectMetadata: ObjectMetadata,
};

const TruncatedValue = styled.div`
  max-width: 18rem;
`;

const Icon = styled.i`
  margin-left: ${spacing.sp4};
`;

function Properties({ objectMetadata }: Props) {
  const dispatch = useDispatch();
  const loading = useSelector(
    (state: AppState) => state.networkActivity.counter > 0,
  );
  const prefixWithSlash = usePrefixWithSlash();
  const isLegalHoldEnabled = objectMetadata.isLegalHoldEnabled;

  return (
    <div>
      <Table id="object-details-table">
        <T.Body>
          <T.Group>
            <T.GroupName> Information </T.GroupName>
            <T.GroupContent>
              <T.Row>
                <T.Key> Name </T.Key>
                <T.Value> {objectMetadata.objectKey} </T.Value>
              </T.Row>
              <T.Row hidden={!objectMetadata.versionId}>
                <T.Key> Version ID </T.Key>
                <T.GroupValues>
                  <TruncatedValue copiable>
                    <MiddleEllipsis
                      text={objectMetadata.versionId}
                      trailingCharCount={7}
                      tooltipWidth="16rem"
                    />
                  </TruncatedValue>
                  <T.ExtraCell>
                    <Clipboard text={objectMetadata.versionId} />
                  </T.ExtraCell>
                </T.GroupValues>
              </T.Row>
              <T.Row>
                <T.Key> Size </T.Key>
                <T.Value>
                  {' '}
                  <PrettyBytes bytes={objectMetadata.contentLength} />{' '}
                </T.Value>
              </T.Row>
              <T.Row>
                <T.Key> Modified On </T.Key>
                <T.Value>
                  {' '}
                  {formatShortDate(new Date(objectMetadata.lastModified))}{' '}
                </T.Value>
              </T.Row>
              <T.Row>
                <T.Key> ETag </T.Key>
                <T.GroupValues>
                  <div copiable>{objectMetadata.eTag}</div>
                  <Clipboard text={objectMetadata.eTag} />{' '}
                </T.GroupValues>
              </T.Row>
            </T.GroupContent>
          </T.Group>
          <T.Group>
            <T.GroupName> Data protection </T.GroupName>
            <T.GroupContent>
              <T.Row>
                <T.Key> Lock </T.Key>
                <T.Value>
                  {objectMetadata.lockStatus === 'LOCKED' && (
                    <>
                      Locked <i className="fa fa-lock"></i>(
                      {objectMetadata.objectRetention.mode.toLowerCase()})
                      <br />
                      until {objectMetadata.objectRetention.retainUntilDate}
                    </>
                  )}
                  {objectMetadata.lockStatus === 'RELEASED' && (
                    <>
                      Released <i className="fa fa-lock-open"></i>
                      <br />
                      since {objectMetadata.objectRetention.retainUntilDate}
                    </>
                  )}
                  {objectMetadata.lockStatus === 'NONE' && 'No retention'}
                </T.Value>
              </T.Row>
              {/* Display the legal hold when the object lock is enabled at bucket level */}
              {objectMetadata.lockStatus !== 'NONE' && (
                <T.Row>
                  <T.Key>Legal Hold</T.Key>
                  <T.Value>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Toggle
                        disabled={loading}
                        toggle={isLegalHoldEnabled}
                        label={isLegalHoldEnabled ? 'Active' : 'Inactive'}
                        onChange={() =>
                          dispatch(
                            putObjectLegalHold(
                              objectMetadata.bucketName,
                              objectMetadata.objectKey,
                              objectMetadata.versionId,
                              !isLegalHoldEnabled,
                              prefixWithSlash,
                            ),
                          )
                        }
                      />
                      {isLegalHoldEnabled && (
                        <Icon className="fas fa-balance-scale"></Icon>
                      )}
                    </div>
                  </T.Value>
                </T.Row>
              )}
            </T.GroupContent>
          </T.Group>
        </T.Body>
      </Table>
    </div>
  );
}

export default Properties;
