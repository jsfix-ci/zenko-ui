import styled from "styled-components";
import * as T from '../ui-elements/TableKeyValue2';

export const WorkflowFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${T.Row} {
    height: 25px;
    max-height: 25px;
  }
`;
