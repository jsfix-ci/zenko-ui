import {
  Checkbox,
  CheckboxContainer,
  Fieldset,
  Input,
  Label,
} from '../../../ui-elements/FormLayout';
import React from 'react';
import { LocationDetailsFormProps } from '.';
type State = {
  bucketMatch: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  endpoint: string;
};
const INIT_STATE: State = {
  bucketMatch: false,
  accessKey: '',
  secretKey: '',
  bucketName: '',
  endpoint: '',
};
export default class LocationDetailsAzure extends React.Component<
  LocationDetailsFormProps,
  State
> {
  constructor(props: LocationDetailsFormProps) {
    super(props);
    this.state = Object.assign({}, INIT_STATE, this.props.details);
    this.state.secretKey = '';
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [target.name]: value,
    });
  };
  updateForm = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  };

  componentDidMount() {
    this.updateForm();
  }

  shouldComponentUpdate(nextProps: LocationDetailsFormProps, nextState: State) {
    return this.state !== nextState;
  }

  componentDidUpdate() {
    this.updateForm();
  }

  render() {
    return (
      <div>
        <Fieldset>
          <Label htmlFor="endpoint" required>
            Azure Storage Endpoint
          </Label>
          <Input
            name="endpoint"
            id="endpoint"
            type="text"
            placeholder="example: https://storagesample.blob.core.windows.net"
            value={this.state.endpoint}
            autoComplete="off"
            onChange={this.onChange}
          />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="accessKey" required>
            Azure Account Name
          </Label>
          <Input
            name="accessKey"
            id="accessKey"
            type="text"
            placeholder="account-name"
            value={this.state.accessKey}
            autoComplete="off"
            onChange={this.onChange}
          />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="secretKey" required>
            Azure Access Key
          </Label>
          <Input
            name="secretKey"
            id="secretKey"
            type="password"
            placeholder="azureSecretKey"
            value={this.state.secretKey}
            autoComplete="new-password"
            onChange={this.onChange}
          />
          <small>
            Your credentials are encrypted in transit, then at rest using your
            instance&apos;s RSA key pair so that we&apos;re unable to see them.
          </small>
        </Fieldset>
        <Fieldset>
          <Label htmlFor="bucketName" required>
            Target Azure Container Name
          </Label>
          <Input
            name="bucketName"
            id="bucketName"
            type="text"
            placeholder="Container Name"
            value={this.state.bucketName}
            autoComplete="off"
            onChange={this.onChange}
          />
        </Fieldset>
        <Fieldset
          style={{
            display: 'none',
          }}
        >
          <CheckboxContainer>
            <Checkbox
              name="bucketMatch"
              type="checkbox"
              value={this.state.bucketMatch}
              checked={this.state.bucketMatch}
              onChange={this.onChange}
            />
            <span> Bucket Match </span>
          </CheckboxContainer>
          <small>
            Stores objects in the target container without a source-bucket
            prefix.
          </small>
        </Fieldset>
      </div>
    );
  }
}
