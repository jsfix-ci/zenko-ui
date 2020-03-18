import { Link, Route } from 'react-router-dom';
import CreateUser from './user/CreateUser';
import DataBrowser from './databrowser/DataBrowser';
import Groups from './group/Groups';
import { Navbar } from '@scality/core-ui';
import React from 'react';
import Users from './user/Users';
import Workflows from './workflow/Workflows';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: scroll;

  color: #fff;
  background-color: #0c0c0d;
  flex-direction:column;
`;

const NavbarContainer = styled.div`
  display: flex;
  width: 100%;
  .sc-navbar{
      width: 100%;
  }
`;

function isSelected(location, tabName){
    return location.pathname === tabName;
}

class Routes extends React.Component{
    render() {
        const location = this.props.location;
        return <Layout>
            <NavbarContainer>
                <Navbar
                    rightActions={[
                        {
                            type: 'dropdown',
                            text: 'Nicolas2bert',
                            icon: <i className='fas fa-user' />,
                        },
                    ]}
                    tabs={[
                        {
                            link: <Link to="/groups">Groups</Link>,
                            selected: isSelected(location, '/groups'),
                        },
                        {
                            link: <Link to="/users">Users</Link>,
                            selected: isSelected(location, '/users'),
                        },
                        {
                            link: <Link to="/databrowser">Data Browser</Link>,
                            selected: isSelected(location, '/databrowser'),
                        },
                        {
                            link: <Link to="/workflow">Data Workflow</Link>,
                            selected: isSelected(location, '/workflow'),
                        },
                    ]}
                />
            </NavbarContainer>
            <Route exact path="/users" component={Users} />
            <Route path="/users/create" component={CreateUser} />
            <Route path="/groups" component={Groups} />
            <Route path="/databrowser" component={DataBrowser} />
            <Route path="/workflow" component={Workflows} />
        </Layout>;
    }
}

function mapStateToProps(state) {
    return {
        location: state.router.location,
    };
}

export default connect(mapStateToProps)(Routes);
