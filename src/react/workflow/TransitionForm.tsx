import Joi from '@hapi/joi';
import type { S3BucketList } from '../../types/s3';
import type { Locations } from '../../types/config';
import { useFormContext } from 'react-hook-form';
import { WorkflowFormContainer } from '../ui-elements/WorkflowFormContainer';

export const transitionSchema = {
    workflowId: Joi.string().optional().allow(null, ''),
    type: Joi.string().required(),
    enabled: Joi.boolean().label('State').required(),
    bucketName: Joi.string().label('Bucket Name').required(),
    applyToVersions: Joi.string().valid('current','previous').required(),
    locationName: Joi.string().label('Location Name').required(),
    triggerDelayDays: Joi.string().label('Trigger delay days').required(),
    filter: Joi.object({
        objectKeyPrefix: Joi.string().label('Prefix').optional().allow(null, ''),
        tags: Joi.array().items(Joi.string()).label('Tags').optional().allow(null)
    })
  };
  
type Props = {
    bucketList: S3BucketList;
    locations: Locations;
    prefix?: string;
};

export const TransitionForm = ({ bucketList, locations, prefix = '' }: props) => {
    const { register, control, watch, getValues, setValue, formState, trigger } =
    useFormContext();

    return <WorkflowFormContainer>
        
    </WorkflowFormContainer>;
}
