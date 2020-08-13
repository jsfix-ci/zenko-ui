import AccountCreate from '../AccountCreate';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { reduxMount } from '../../utils/test';

describe('AccountCreate', () => {
    it('should render AccountCreate component with no error banner', () => {
        const { component } = reduxMount(<AccountCreate/>);

        expect(component.find('#zk-error-banner')).toHaveLength(0);
    });

    it('should render AccountCreate component with error banner', () => {
        const errorMessage = 'error message test';
        const { component } = reduxMount(<AccountCreate/>, {
            uiErrors: {
                errorMsg: errorMessage,
                errorType: 'byComponent',
            },
        });

        expect(component.find('#zk-error-banner')).toHaveLength(1);
        expect(component.find('#zk-error-banner').text()).toContain(errorMessage);
    });

    // * error input
    //   * button click

    const tests = [
        {
            description: 'should render no error if both name and email are valid',
            name: 'ba',
            email: 'test@test.com',
            quota: '',
            expectedNameError: '',
            expectedEmailError: '',
            expectedQuotaError: '',
        },
        {
            description: 'should render no error if name, email and quota are valid',
            name: 'ba',
            email: 'test@test.com',
            quota: '1',
            expectedNameError: '',
            expectedEmailError: '',
            expectedQuotaError: '',
        },
        {
            description: 'should render error if name is missing',
            name: '',
            email: 'test@test.com',
            quota: '1',
            expectedNameError: '"Name" is not allowed to be empty',
            expectedEmailError: '',
            expectedQuotaError: '',
        },
        {
            description: 'should render error if email is missing',
            name: 'bart',
            email: '',
            quota: '1',
            expectedNameError: '',
            expectedEmailError: '"Root Account Email" is not allowed to be empty',
            expectedQuotaError: '',
        },
        {
            description: 'should render 2 errors if name and email are missing',
            name: '',
            email: '',
            quota: '1',
            expectedNameError: '"Name" is not allowed to be empty',
            expectedEmailError: '"Root Account Email" is not allowed to be empty',
            expectedQuotaError: '',
        },
        {
            description: 'should render error if name is too short',
            name: 'b',
            email: 'test@test.com',
            quota: '1',
            expectedNameError: '"Name" length must be at least 2 characters long',
            expectedEmailError: '',
            expectedQuotaError: '',
        },
        {
            description: 'should render error if name is too long (> 64)',
            name: 'b'.repeat(65),
            email: 'test@test.com',
            quota: '1',
            expectedNameError: '"Name" length must be less than or equal to 64 characters long',
            expectedEmailError: '',
            expectedQuotaError: '',
        },
        {
            description: 'should render error if name is invalid',
            name: '^^',
            email: 'test@test.com',
            quota: '1',
            expectedNameError: 'Invalid Name',
            expectedEmailError: '',
            expectedQuotaError: '',
        },
        {
            description: 'should render error if email is invalid',
            name: 'bart',
            email: 'invalid',
            quota: '1',
            expectedNameError: '',
            expectedEmailError: 'Invalid Root Account Email',
            expectedQuotaError: '',
        },
        {
            description: 'should render error if email is too long (> 256)',
            name: 'bart',
            email: `${'b'.repeat(257)}@long.com`,
            quota: '1',
            expectedNameError: '',
            expectedEmailError: '"Root Account Email" length must be less than or equal to 256 characters long',
            expectedQuotaError: '',
        },
        {
            description: 'should render error if quota is invalid',
            name: 'bart',
            email: 'test@test.com',
            quota: '-1',
            expectedNameError: '',
            expectedEmailError: '',
            expectedQuotaError: '"Quota" must be a positive number',
        },
        {
            description: 'should render error if quota is set to 0',
            name: 'bart',
            email: 'test@test.com',
            quota: '0',
            expectedNameError: '',
            expectedEmailError: '',
            expectedQuotaError: '"Quota" must be a positive number',
        },
    ];

    tests.forEach(t => {
        it(`Simulate click: ${t.description}`, async () => {
            const { component } = reduxMount(<AccountCreate/>);
            // NOTE: All validation methods in React Hook Form are treated
            // as async functions, so it's important to wrap async around your act.
            await act(async () => {
                const elementName = component.find('input#name');
                elementName.getDOMNode().value = t.name;
                elementName.getDOMNode().dispatchEvent(new Event('input'));

                const elementEmail = component.find('input#email');
                elementEmail.getDOMNode().value = t.email;
                elementEmail.getDOMNode().dispatchEvent(new Event('input'));

                const elementQuota = component.find('input#quota');
                elementQuota.getDOMNode().value = t.quota;
                elementQuota.getDOMNode().dispatchEvent(new Event('input'));

                component.find('Button#create-account-btn').simulate('click');
            });

            if (t.expectedNameError) {
                expect(component.find('ErrorInput#error-name').text()).toContain(t.expectedNameError);
            } else {
                expect(component.find('ErrorInput#error-name').text()).toBeFalsy();
            }
            if (t.expectedEmailError) {
                expect(component.find('ErrorInput#error-email').text()).toContain(t.expectedEmailError);
            } else {
                expect(component.find('ErrorInput#error-email').text()).toBeFalsy();
            }
            if (t.expectedQuotaError) {
                expect(component.find('ErrorInput#error-quota').text()).toContain(t.expectedQuotaError);
            } else {
                expect(component.find('ErrorInput#error-quota').text()).toBeFalsy();
            }
        });
    });
});
