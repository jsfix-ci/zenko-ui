import * as T from '../ui-elements/TableKeyValue2';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorInput } from '../ui-elements/FormLayout';
import type { Locations } from '../../types/config';
import { Select, Toggle, SpacedBox } from '@scality/core-ui';
import { spacing } from '@scality/core-ui/dist/style/theme';
import { flattenFormErrors, renderSource, sourceBucketOptions } from './utils';
import Joi from '@hapi/joi';

import Input from '../ui-elements/Input';

import type { S3BucketList } from '../../types/s3';

import styled from 'styled-components';
import { useMemo } from 'react';

const flexStyle = {
  display: 'flex',
  justifyItems: 'stretch',
  flexDirection: 'row',
  alignItems: 'center',
};

const ExpirationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${T.Row} {
    height: 42px;
    min-height: 42px;
  }
`;

type Props = {
  bucketList: S3BucketList;
  locations: Locations;
  prefix?: string;
};

/*
currentVersionTriggerDelayDate: {message: '"expiration.currentVersionTriggerDelayDate" is not allowed to be empty', type: 'string.empty', ref: undefined}
filter: {objectKeyPrefix: {…}}
workflowId: {message: '"expiration.workflowId" is not allowed to be empty', type: 'string.empty', ref: input#workflowId}
*/

const PluralizeDays = ({ number }: { number: number | string }) => {
  return (
    <span style={{ width: '100px' }}>
      {number === 1 || number === '1' ? <>day</> : 'days'}
    </span>
  );
};

export const expirationSchema = {
  bucketName: Joi.string().required(),
  enabled: Joi.boolean().required(),
  filter: Joi.object({
    objectKeyPrefix: Joi.string().optional().allow(null, ''),
  }).optional(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  workflowId: Joi.string().optional().allow(null, ''),
  currentVersionTriggerDelayDate: Joi.string().optional().allow(null, ''),
  currentVersionTriggerDelayDays: Joi.number().optional().allow(null),
  previousVersionTriggerDelayDays: Joi.number().optional().allow(null),
  expireDeleteMarkersTrigger: Joi.boolean().optional().allow(null),
  incompleteMultipartUploadTriggerDelayDays: Joi.number()
    .optional()
    .allow(null),
};

export function ExpirationForm({ bucketList, locations, prefix = '' }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useFormContext();

  const currentVersionTriggerDelayDays = watch(
    `${prefix}currentVersionTriggerDelayDays`,
  );
  const previousVersionTriggerDelayDays = watch(
    `${prefix}previousVersionTriggerDelayDays`,
  );
  const incompleteMultipartUploadTriggerDelayDays = watch(
    `${prefix}incompleteMultipartUploadTriggerDelayDays`,
  );

  const errors = flattenFormErrors(formErrors);

  return (
    <ExpirationContainer>
      <input
        type="hidden"
        id="workflowId"
        {...register(`${prefix}workflowId`)}
        autoComplete="off"
      />
      <input
        type="hidden"
        id="type"
        {...register(`${prefix}type`)}
        autoComplete="off"
      />
      <T.Groups style={{ maxWidth: 'inherit' }}>
        <T.Group>
          <T.GroupName>General</T.GroupName>
          <T.GroupContent>
            <T.Row>
              <T.Key> State </T.Key>
              <T.Value>
                <Controller
                  control={control}
                  name={`${prefix}enabled`}
                  render={({ field: { onChange, value: enabled } }) => {
                    return (
                      <Toggle
                        id="enabled"
                        toggle={enabled}
                        label={enabled ? 'Active' : 'Inactive'}
                        onChange={() => onChange(!enabled)}
                      />
                    );
                  }}
                />
              </T.Value>
            </T.Row>
            <T.Row>
              <T.Key required={true}> Rule Name </T.Key>
              <T.Value>
                <Input
                  id="name"
                  {...register(`${prefix}name`)}
                  aria-invalid={!!errors[`${prefix}name`]}
                  aria-describedby="error-name"
                  autoComplete="off"
                />
                <T.ErrorContainer>
                  <ErrorInput
                    id="error-name"
                    hasError={errors[`${prefix}name`]}
                  >
                    {' '}
                    {errors[`${prefix}name`]?.message}{' '}
                  </ErrorInput>
                </T.ErrorContainer>
              </T.Value>
            </T.Row>
          </T.GroupContent>
        </T.Group>

        <T.Group>
          <T.GroupName>Source</T.GroupName>
          <T.GroupContent>
            <T.Row>
              <T.Key required={true}>Bucket Name</T.Key>
              <T.Value>
                <Controller
                  control={control}
                  name={`${prefix}bucketName`}
                  render={({ field: { onChange, value: sourceBucket } }) => {
                    const options = sourceBucketOptions(
                      [],
                      bucketList,
                      locations,
                    );

                    const result = options.find(
                      (l) => l.value === sourceBucket,
                    );

                    return (
                      <Select
                        id="sourceBucket"
                        onChange={({ value }) => onChange(value)}
                        options={options}
                        formatOptionLabel={renderSource(locations)}
                        isOptionDisabled={(option) => option.disabled === true}
                        value={result}
                      />
                    );
                  }}
                />
                <T.ErrorContainer>
                  <ErrorInput hasError={errors[`${prefix}bucketName`]}>
                    {' '}
                    {errors[`${prefix}bucketName`]?.message}{' '}
                  </ErrorInput>
                </T.ErrorContainer>
              </T.Value>
            </T.Row>
          </T.GroupContent>
        </T.Group>

        <T.Group>
          <T.GroupName>Filters (optional)</T.GroupName>
          <T.GroupContent>
            <T.Row>
              <T.Key> Prefix </T.Key>
              <T.Value>
                <Input
                  id="prefix"
                  {...register(`${prefix}filter.objectKeyPrefix`)}
                  aria-invalid={!!errors[`${prefix}filter.objectKeyPrefix`]}
                  aria-describedby="error-prefix"
                  autoComplete="off"
                />
                <T.ErrorContainer>
                  <ErrorInput
                    id="error-prefix"
                    hasError={errors[`${prefix}filter.objectKeyPrefix`]}
                  >
                    {' '}
                    {errors[`${prefix}filter.objectKeyPrefix`]?.message}{' '}
                  </ErrorInput>
                </T.ErrorContainer>
              </T.Value>
            </T.Row>
          </T.GroupContent>
        </T.Group>

        <T.Group>
          <T.GroupName>Action</T.GroupName>
          <T.GroupContent>
            <T.Row>
              <T.KeyTooltip
                tooltipMessage={`
                    If the bucket is versioned, a delete marker will be added on objects older than ${
                      currentVersionTriggerDelayDays || 'provided'
                    } days. This does not free up storage space.
                    If the bucket is not versioned, the objects older than ${
                      currentVersionTriggerDelayDays || 'provided'
                    } days will be permanently removed.
                    `}
                tooltipWidth="13rem"
                size={50}
              >
                {' '}
                Expire <span style={{ fontWeight: 'bold' }}>Current</span>{' '}
                version of objects{' '}
              </T.KeyTooltip>
              <T.Value
                style={{
                  ...flexStyle,
                }}
              >
                <Controller
                  control={control}
                  name={`${prefix}currentVersionTriggerDelayDays`}
                  render={({
                    field: { onChange, value: currentVersionTriggerDelayDays },
                  }) => {
                    return (
                      <Toggle
                        id="currentVersionTriggerDelayDaysToggle"
                        toggle={currentVersionTriggerDelayDays !== null && currentVersionTriggerDelayDays !== undefined}
                        onChange={(e) => {
                          onChange(e.target.checked ? 7 : null);
                          if (e.target.checked) {
                            setValue(
                              `${prefix}expireDeleteMarkersTrigger`,
                              false,
                            );
                          }
                        }}
                      />
                    );
                  }}
                />

                <div
                  style={{
                    ...flexStyle,
                    marginLeft: 'auto',
                    opacity: currentVersionTriggerDelayDays !== null && currentVersionTriggerDelayDays !== undefined ? 1 : 0.5,
                  }}
                >
                  after
                  <SpacedBox mr={8} />
                  <Controller
                    control={control}
                    name={`${prefix}currentVersionTriggerDelayDays`}
                    render={({
                      field: {
                        onChange,
                        value: currentVersionTriggerDelayDays,
                      },
                    }) => {
                      return (
                        <Input
                          id="currentVersionTriggerDelayDays"
                          name="currentVersionTriggerDelayDays"
                          value={currentVersionTriggerDelayDays}
                          onChange={(e) => onChange(e.target.value)}
                          type="number"
                          style={{
                            width: '3rem',
                            textAlign: 'right',
                          }}
                          min={1}
                          disabled={currentVersionTriggerDelayDays === null || currentVersionTriggerDelayDays === undefined}
                        />
                      );
                    }}
                  />
                  <SpacedBox mr={8} />
                  <PluralizeDays number={currentVersionTriggerDelayDays} />
                </div>
              </T.Value>
            </T.Row>
            <T.Row>
              <T.KeyTooltip
                tooltipMessage={`
                All the objects that become previous versions older than ${
                  previousVersionTriggerDelayDays || 'provided'
                } days will be permanently deleted. 
                `}
                tooltipWidth="13rem"
                size={50}
              >
                {' '}
                Expire <span style={{ fontWeight: 'bold' }}>Previous</span>{' '}
                version of objects{' '}
              </T.KeyTooltip>
              <T.Value
                style={{
                  ...flexStyle,
                }}
              >
                <Controller
                  control={control}
                  name={`${prefix}previousVersionTriggerDelayDays`}
                  render={({
                    field: { onChange, value: previousVersionTriggerDelayDays },
                  }) => {
                    return (
                      <Toggle
                        id="previousVersionTriggerDelayDaysToggle"
                        toggle={previousVersionTriggerDelayDays !== null && previousVersionTriggerDelayDays !== undefined}
                        onChange={(e) => onChange(e.target.checked ? 7 : null)}
                      />
                    );
                  }}
                />

                <div
                  style={{
                    ...flexStyle,
                    marginLeft: 'auto',
                    opacity: previousVersionTriggerDelayDays !== null && previousVersionTriggerDelayDays !== undefined ? 1 : 0.5,
                  }}
                >
                  after
                  <SpacedBox mr={8} />
                  <Controller
                    control={control}
                    name={`${prefix}previousVersionTriggerDelayDays`}
                    render={({
                      field: {
                        onChange,
                        value: previousVersionTriggerDelayDays,
                      },
                    }) => {
                      return (
                        <Input
                          id="previousVersionTriggerDelayDays"
                          name={`${prefix}previousVersionTriggerDelayDays`}
                          value={previousVersionTriggerDelayDays}
                          onChange={(e) => onChange(e.target.value)}
                          type="number"
                          style={{
                            width: '3rem',
                            textAlign: 'right',
                          }}
                          min={1}
                          disabled={previousVersionTriggerDelayDays === null || previousVersionTriggerDelayDays === undefined}
                        />
                      );
                    }}
                  />
                  <SpacedBox mr={8} />
                  <PluralizeDays number={previousVersionTriggerDelayDays} />
                </div>
              </T.Value>
            </T.Row>
            <T.Row>
              <T.KeyTooltip
                tooltipMessage={`
                When you delete a versioned object, a delete marker is created.
                If all previous versions of the object subsequently expire, an expired-object Delete marker is left.
                Removing unneeded Delete markers will improve the listing of object versions.                
                `}
                tooltipWidth="13rem"
                size={50}
              >
                {' '}
                Remove expired Delete markers{' '}
              </T.KeyTooltip>
              <T.Value
                style={{
                  ...flexStyle,
                  opacity: currentVersionTriggerDelayDays ? 0.5 : 1,
                }}
              >
                <Controller
                  control={control}
                  name={`${prefix}expireDeleteMarkersTrigger`}
                  render={({
                    field: { onChange, value: expireDeleteMarkersTrigger },
                  }) => {
                    return (
                      <Toggle
                        disabled={currentVersionTriggerDelayDays}
                        id="expireDeleteMarkersTrigger"
                        toggle={expireDeleteMarkersTrigger}
                        onChange={(e) =>
                          onChange(e.target.checked ? true : null)
                        }
                      />
                    );
                  }}
                />
                {currentVersionTriggerDelayDays ? (
                  <>
                    This action is disabled when "Expire Current version of
                    objects" is active
                  </>
                ) : (
                  ''
                )}
              </T.Value>
            </T.Row>
            <T.Row>
              <T.KeyTooltip
                tooltipMessage={`
                When you upload or copy an object, it could be done as a set of parts.
                These multiparts are not visible in the browser until the operation is complete.
                Removing these incomplete multipart uploads after a number of days after the initiating the operation prevents you from having unused S3 storage.
                    `}
                tooltipWidth="13rem"
                size={50}
              >
                {' '}
                Expire incomplete Multipart uploads{' '}
              </T.KeyTooltip>
              <T.Value
                style={{
                  ...flexStyle,
                }}
              >
                <Controller
                  control={control}
                  name={`${prefix}incompleteMultipartUploadTriggerDelayDays`}
                  render={({
                    field: {
                      onChange,
                      value: incompleteMultipartUploadTriggerDelayDays,
                    },
                  }) => {
                    return (
                      <Toggle
                        id="incompleteMultipartUploadTriggerDelayDaysToggle"
                        toggle={
                          incompleteMultipartUploadTriggerDelayDays !== null && incompleteMultipartUploadTriggerDelayDays !== undefined
                        }
                        onChange={(e) => onChange(e.target.checked ? 7 : null)}
                      />
                    );
                  }}
                />

                <div
                  style={{
                    ...flexStyle,
                    marginLeft: 'auto',
                    opacity:
                      incompleteMultipartUploadTriggerDelayDays !== null && incompleteMultipartUploadTriggerDelayDays !== undefined
                        ? 1
                        : 0.5,
                  }}
                >
                  after
                  <SpacedBox mr={8} />
                  <Controller
                    control={control}
                    name={`${prefix}incompleteMultipartUploadTriggerDelayDays`}
                    render={({
                      field: {
                        onChange,
                        value: incompleteMultipartUploadTriggerDelayDays,
                      },
                    }) => {
                      return (
                        <Input
                          id="incompleteMultipartUploadTriggerDelayDays"
                          name={`${prefix}incompleteMultipartUploadTriggerDelayDays`}
                          value={incompleteMultipartUploadTriggerDelayDays}
                          onChange={(e) => onChange(e.target.value)}
                          type="number"
                          style={{
                            width: '3rem',
                            textAlign: 'right',
                          }}
                          min={1}
                          disabled={
                            incompleteMultipartUploadTriggerDelayDays === null || incompleteMultipartUploadTriggerDelayDays === undefined
                          }
                        />
                      );
                    }}
                  />
                  <SpacedBox mr={8} />
                  <PluralizeDays
                    number={incompleteMultipartUploadTriggerDelayDays}
                  />
                </div>
              </T.Value>
            </T.Row>
          </T.GroupContent>
        </T.Group>
      </T.Groups>
    </ExpirationContainer>
  );
}
