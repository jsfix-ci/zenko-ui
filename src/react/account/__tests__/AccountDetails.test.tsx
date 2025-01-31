import router, { MemoryRouter } from 'react-router';
import AccountDetails from '../AccountDetails';
import { CustomTabs } from '../../ui-elements/Tabs';
import React from 'react';
import { Warning } from '../../ui-elements/Warning';
import { reduxMount } from '../../utils/test';
const account1 = {
  arn: 'arn1',
  canonicalId: 'canonicalId1',
  createDate: Date.parse('04 Jan 2000 05:12:00 GMT'),
  email: 'test@email1.com',
  id: '1',
  quotaMax: 1,
  Name: 'bart',
};
describe('AccountDetails', () => {
  beforeEach(() => {
    jest.spyOn(router, 'useParams').mockReturnValue({});
    jest.spyOn(router, 'useRouteMatch').mockReturnValue({
      url: '/',
    });
  });
  it('should render empty AccountDetails component if no account props', () => {
    const { component } = reduxMount(
      <MemoryRouter>
        <AccountDetails />
      </MemoryRouter>,
      {
        router: {
          location: {
            pathname: '/accounts/bart',
          },
        },
      },
    );
    expect(component.find(CustomTabs)).toHaveLength(0);
    expect(component.find(Warning)).toHaveLength(1);
    expect(component.find(Warning).text()).toContain('Account not found.');
  });
  it('should render AccountDetails component', () => {
    const { component } = reduxMount(
      <MemoryRouter>
        <AccountDetails account={account1} />
      </MemoryRouter>,
      {
        router: {
          location: {
            pathname: '/accounts/bart',
          },
        },
      },
    );
    expect(component.find(CustomTabs)).toHaveLength(1);
    // warning of account access key table
    expect(component.find(Warning)).toHaveLength(1);
  });
});
