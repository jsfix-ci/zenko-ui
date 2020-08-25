import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: scroll;

  color: ${props => props.theme.brand.text};
  background-color: ${props => props.theme.brand.background};
  flex-direction:column;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;

    max-width: 600px;
    margin: 10px;
    padding: 20px;
    background-color: ${props => props.theme.brand.primaryDark1};
    border-radius: 5px;
`;

const ContainerFooter = styled.div`
    display: flex;
    justify-content: flex-end;

    margin-top: 10px;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export { Container, LoaderContainer, MainContainer, ContainerFooter };
