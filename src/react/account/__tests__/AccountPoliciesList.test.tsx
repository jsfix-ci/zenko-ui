import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  mockOffsetSize,
  reduxRender,
  TEST_API_BASE_URL,
  Wrapper as wrapper,
} from '../../utils/test';
import AccountPoliciesList from '../AccountPoliciesList';

const SCALITY_INTERNAL_POLICY_ID = 'LRDTTFT5ZKN6VIZCICXFSAD8I1960RBB';
const VERSION_ID = 'v1';
const SCALITY_INTERNAL_POLICY_NAME = 'storage-manager-policy';
const SCALITY_INTERNAL_USER_PATH = '/scality-internal/';
const CREATE_DATE = '2022-03-02T09:08:41Z';
const UPDATED_DATE = '2022-03-02T09:08:41Z';
const SCALITY_INTERNAL_ARN =
  'arn:aws:iam::621762876784:policy/scality-internal/storage-manager-policy';
const SCALITY_INTERNAL_ATTACHMENTS = 1;
const ATTACHABLE = true;

const NON_SCALITY_INTERNAL_POLICY_NAME = 'test-policy';
const NON_SCALITY_INTERNAL_POLICY_ID = '0DK7AW5YXVAR16WA7J5OG3X5NHQEWFNH';
const NON_SCALITY_INTERNAL_USER_PATH = '/';
const NON_SCALITY_INTERNAL_ARN = 'arn:aws:iam::377232323695:policy/test-policy';
const NON_SCALITY_INTERNAL_ATTACHMENTS = 0;

const SCALITY_DATA_CONSUMER_POLICY_NAME = 'data-consumer-policy';
const SCALITY_DATA_CONSUMER_POLICY_ARN =
  'arn:aws:iam::377232323695:policy/scality-internal/data-consumer-policy';
const SCALITY_DATA_CONSUMER_POLICY_ID = '3I17NWO7MOCSNZ1J4V2JJFUXW18UOSJF';

const nbrOfColumnsExpected = 5;

const server = setupServer(
  rest.post(`${TEST_API_BASE_URL}/`, (req, res, ctx) => {
    const params = new URLSearchParams(req.body);
    if (params.get('Action') === 'ListPolicyVersions') {
      return res(
        ctx.xml(`
<ListPolicyVersionsResponse xmlns="https://iam.amazonaws.com/doc/2010-05-08/">
  <ListPolicyVersionsResult>
    <Versions>
      <member>
        <CreateDate>2022-06-14T12:42:46Z</CreateDate>
        <IsDefaultVersion>true</IsDefaultVersion>
        <VersionId>v1</VersionId>
      </member>
    </Versions>
    <IsTruncated>false</IsTruncated>
  </ListPolicyVersionsResult>
  <ResponseMetadata>
    <RequestId>976aa56f5944abe75a41</RequestId>
  </ResponseMetadata>
</ListPolicyVersionsResponse>;
      `),
      );
    }
    return res(
      ctx.xml(`
<ListPoliciesResponse xmlns="https://iam.amazonaws.com/doc/2010-05-08/">
    <ListPoliciesResult>
        <Policies>
            <member>
                <PolicyName>${SCALITY_INTERNAL_POLICY_NAME}</PolicyName>
                <DefaultVersionId>${VERSION_ID}</DefaultVersionId>
                <PolicyId>${SCALITY_INTERNAL_POLICY_ID}</PolicyId>
                <Path>${SCALITY_INTERNAL_USER_PATH}</Path>
                <Arn>${SCALITY_INTERNAL_ARN}</Arn>
                <AttachmentCount>${SCALITY_INTERNAL_ATTACHMENTS}</AttachmentCount>
                <IsAttachable>${ATTACHABLE}</IsAttachable>
                <CreateDate>${CREATE_DATE}</CreateDate>
                <UpdateDate>${UPDATED_DATE}</UpdateDate>
            </member>
            <member>
                <PolicyName>${NON_SCALITY_INTERNAL_POLICY_NAME}</PolicyName>
                <DefaultVersionId>${VERSION_ID}</DefaultVersionId>
                <PolicyId>${NON_SCALITY_INTERNAL_POLICY_ID}</PolicyId>
                <Path>${NON_SCALITY_INTERNAL_USER_PATH}</Path>
                <Arn>${NON_SCALITY_INTERNAL_ARN}</Arn>
                <AttachmentCount>${NON_SCALITY_INTERNAL_ATTACHMENTS}</AttachmentCount>
                <IsAttachable>${ATTACHABLE}</IsAttachable>
                <CreateDate>${CREATE_DATE}</CreateDate>
                <UpdateDate>${UPDATED_DATE}</UpdateDate>
           </member>
           <member>
                <PolicyName>${SCALITY_DATA_CONSUMER_POLICY_NAME}</PolicyName>
                <DefaultVersionId>${VERSION_ID}</DefaultVersionId>
                <PolicyId>${SCALITY_DATA_CONSUMER_POLICY_ID}</PolicyId>
                <Path>${SCALITY_INTERNAL_USER_PATH}</Path>
                <Arn>${SCALITY_DATA_CONSUMER_POLICY_ARN}</Arn>
                <AttachmentCount>${NON_SCALITY_INTERNAL_ATTACHMENTS}</AttachmentCount>
                <IsAttachable>${ATTACHABLE}</IsAttachable>
                <CreateDate>${CREATE_DATE}</CreateDate>
                <UpdateDate>${UPDATED_DATE}</UpdateDate>
           </member>
        </Policies>
        <IsTruncated>false</IsTruncated>
    </ListPoliciesResult>
    <ResponseMetadata>
        <RequestId>61221a552b4592e5b784</RequestId>
    </ResponseMetadata>
</ListPoliciesResponse>
    `),
    );
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  mockOffsetSize(200, 100);
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AccountPoliciesList', () => {
  it('should render header buttons and a table with user policies', async () => {
    try {
      reduxRender(<AccountPoliciesList accountName="account" />, {
        wrapper,
      });

      expect(screen.getAllByText('Loading policies...')).toHaveLength(2);

      expect(
        screen.getByPlaceholderText(/Search by Policy Name/i),
      ).toBeInTheDocument();

      const createButton = screen.getByText('Create Policy');
      expect(createButton).toBeInTheDocument();

      /**********           Number of columns :         ************/
      expect(screen.getAllByRole('columnheader').length).toEqual(
        nbrOfColumnsExpected,
      );

      expect(
        screen.getByPlaceholderText(/Search by Policy Name/i),
      ).toBeInTheDocument();

      /**********           Table columns exist :         ************/
      expect(screen.getByText('Policy Path')).toBeInTheDocument();
      expect(screen.getByText('Policy Name')).toBeInTheDocument();
      expect(screen.getByText('Last Modified')).toBeInTheDocument();
      expect(screen.getByText('Attachments')).toBeInTheDocument();
    } catch (error: any) {
      console.log('error: ', error.message);
    }
  });
  it('should render enabled Attach button', async () => {
    reduxRender(<AccountPoliciesList accountName="account" />, {
      wrapper,
    });
    //E
    await waitFor(() => screen.getAllByText(/Edit/i));
    //V
    const attachButton = screen.getByLabelText(
      `Attach ${SCALITY_INTERNAL_POLICY_NAME}`,
    );
    expect(attachButton).not.toBeDisabled();
  });
  it('should render Edit button for Non Scality internal Policy', async () => {
    reduxRender(<AccountPoliciesList accountName="account" />, {
      wrapper,
    });
    //E
    await waitFor(() => screen.getAllByText('Edit'));
    //V
    const editButton = screen.getByRole('button', {
      name: new RegExp(`Edit ${NON_SCALITY_INTERNAL_POLICY_NAME}`, 'i'),
    });

    expect(editButton).toBeInTheDocument();
  });
  it('should render view button for Scality internal Policies', async () => {
    reduxRender(<AccountPoliciesList accountName="account" />, {
      wrapper,
    });
    //E
    await waitFor(() => screen.getAllByText('Edit'));
    //V
    const viewButton = screen.getByRole('button', {
      name: new RegExp(`View ${SCALITY_INTERNAL_POLICY_NAME}`, 'i'),
    });

    expect(viewButton).toBeInTheDocument();
  });
  it('should render enabled Copy ARN button', async () => {
    reduxRender(<AccountPoliciesList accountName="account" />, {
      wrapper,
    });
    //E
    await waitFor(() => screen.getAllByText(/Copy ARN/i));
    //V
    const arnButton = screen.getByRole('button', {
      name: new RegExp(`Copy ARN ${SCALITY_INTERNAL_POLICY_NAME}`, 'i'),
    });
    expect(arnButton).not.toBeDisabled();
  });
  it('should render disabled Delete button for Scality internal policy', async () => {
    reduxRender(<AccountPoliciesList accountName="account" />, {
      wrapper,
    });

    await waitFor(() => screen.getAllByText(/Edit/i));
    const deleteButton = screen.getByRole('button', {
      name: new RegExp(`Delete ${SCALITY_INTERNAL_POLICY_NAME}`, 'i'),
    });
    expect(deleteButton).toBeDisabled();
  });
  it('should render enabled Delete button for non Scality internal policy', async () => {
    reduxRender(<AccountPoliciesList accountName="account" />, {
      wrapper,
    });

    await waitFor(() => screen.getAllByText(/Edit/i));

    const deleteButton = screen.getByRole('button', {
      name: new RegExp(`Delete ${NON_SCALITY_INTERNAL_POLICY_NAME}`, 'i'),
    });
    expect(deleteButton).not.toBeDisabled();
  });
  it('should render view button for non internal policies when their default version is not the latest one', async () => {
    //S
    server.use(
      rest.post(`${TEST_API_BASE_URL}/`, (req, res, ctx) => {
        const params = new URLSearchParams(req.body);
        if (params.get('Action') === 'ListPolicyVersions') {
          return res(
            ctx.xml(`
  <ListPolicyVersionsResponse xmlns="https://iam.amazonaws.com/doc/2010-05-08/">
    <ListPolicyVersionsResult>
    <Versions>
        <member>
          <CreateDate>2022-06-14T12:44:46Z</CreateDate>
          <IsDefaultVersion>false</IsDefaultVersion>
          <VersionId>v2</VersionId>
        </member>
        <member>
          <CreateDate>2022-06-14T12:42:46Z</CreateDate>
          <IsDefaultVersion>true</IsDefaultVersion>
          <VersionId>v1</VersionId>
        </member>
      </Versions>
      <IsTruncated>false</IsTruncated>
    </ListPolicyVersionsResult>
    <ResponseMetadata>
      <RequestId>976aa56f5944abe75a41</RequestId>
    </ResponseMetadata>
  </ListPolicyVersionsResponse>;
        `),
          );
        }
      }),
    );

    reduxRender(<AccountPoliciesList accountName="account" />, {
      wrapper,
    });
    //E
    await waitFor(() => screen.getAllByText('View'));
    //V
    const viewButton = screen.getByRole('button', {
      name: new RegExp(`View ${NON_SCALITY_INTERNAL_POLICY_NAME}`, 'i'),
    });

    expect(viewButton).toBeInTheDocument();
  });
});
