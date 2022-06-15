import { Box, Button } from '@scality/core-ui/dist/next';
import { useForm } from 'react-hook-form';
import FormContainer, * as F from '../ui-elements/FormLayout';
import { SecondaryText } from '@scality/core-ui/dist/components/text/Text.component';
import CopyButton from '../ui-elements/CopyButton';
import { useMutation, useQueryClient } from 'react-query';
import { getListPoliciesQuery } from '../queries';
import { notFalsyTypeGuard } from '../../types/typeGuards';
import { useIAMClient } from '../IAMProvider';

import { useHistory, useParams } from 'react-router-dom';
import { handleApiError, handleClientError } from '../actions';
import { useDispatch } from 'react-redux';
import { ApiError } from '../../types/actions';

type PolicyFormValues = {
  policyName: string;
  policyDocument: string;
};

const CreateAccountPolicy = () => {
  const IAMClient = useIAMClient();
  const history = useHistory();
  const { accountName } = useParams<{ accountName: string }>();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const defaultValues = {
    policyName: '',
    policyDocument: '',
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty, errors },
  } = useForm<PolicyFormValues>({
    defaultValues,
  });

  const watchAllFields = watch();

  const createPolicyMutation = useMutation(
    ({ policyName, policyDocument }: PolicyFormValues) => {
      return notFalsyTypeGuard(IAMClient).createPolicy(
        policyName,
        policyDocument,
      );
    },
    {
      onSuccess: () => {
        history.push(`/accounts/${accountName}/policies`);
        queryClient.invalidateQueries(
          getListPoliciesQuery(accountName, notFalsyTypeGuard(IAMClient))
            .queryKey,
        );
      },
      onError: (error) => {
        try {
          dispatch(handleClientError(error));
        } catch (err) {
          dispatch(handleApiError(err as ApiError, 'byModal'));
        }
      },
    },
  );

  const onSubmit = ({ policyName, policyDocument }: PolicyFormValues) => {
    createPolicyMutation.mutate({ policyName, policyDocument });
  };

  const handleCancel = (e) => {
    if (e) {
      e.preventDefault();
    }
    history.goBack();
  };

  return (
    <FormContainer>
      <F.Form onSubmit={handleSubmit(onSubmit)}>
        <F.Title>Policy Creation</F.Title>
        <F.Hr />
        <SecondaryText> All * are mandatory fields </SecondaryText>
        <F.Fieldset>
          <F.Label htmlFor="policyName" tooltipWidth="10.5rem">
            Policy Name*
          </F.Label>
          <F.Input
            type="text"
            data-testid="policyNameInput"
            readOnly={false}
            {...register('policyName', {
              required: 'The policy name is required',
            })}
            style={{ width: '20rem' }}
          />
          <F.ErrorInput id="error-name" hasError={errors?.policyName}>
            {' '}
            {errors?.policyName?.message}{' '}
          </F.ErrorInput>
        </F.Fieldset>
        <F.Fieldset>
          <F.Label htmlFor="policyDocument" tooltipWidth="12rem">
            Policy Document*
          </F.Label>
          <Box>
            <F.LargeCustomInput
              data-testid="policyDocumentInput"
              rows={10}
              cols={72}
              {...register('policyDocument', {
                required: 'The policy document is required',
              })}
            />
            <Box mt={'1rem'}>
              <CopyButton
                text={watchAllFields.policyDocument}
                labelName={'Text'}
                disabled={!watchAllFields.policyDocument}
              />
            </Box>
          </Box>
        </F.Fieldset>
        <F.ErrorInput id="error-name" hasError={errors?.policyDocument}>
          {' '}
          {errors?.policyDocument?.message}{' '}
        </F.ErrorInput>
        <Box mb={'7rem'}>
          <SecondaryText> We are supporting AWS IAM standards. </SecondaryText>
        </Box>
        <F.Hr />
        <F.Footer>
          <F.FooterError></F.FooterError>
          <F.FooterButtons>
            <Button variant="outline" label="Cancel" onClick={handleCancel} />
            <Button
              disabled={!isDirty}
              type="submit"
              id="create-account-btn"
              variant="primary"
              label="Create"
            />
          </F.FooterButtons>
        </F.Footer>
      </F.Form>
    </FormContainer>
  );
};

export default CreateAccountPolicy;
