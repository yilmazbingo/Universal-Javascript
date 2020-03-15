import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
const Header = ({ auth }) => {
  console.log("auth in Header", auth);

  const authButton = auth ? (
    //we are being proxied through render server
    //browser does not see what happens pass the proxy
    <a href="/api/logout">Logout</a>
  ) : (
    <a href="/api/auth/google">Login</a>
  );
  return (
    <StyledHeader>
      <Link to="/">React SSR</Link>
      <StyledNav>
        <Link to="/users">Users</Link>
        <Link to="/admins">Admins</Link>
        {authButton}
      </StyledNav>
    </StyledHeader>
  );
};

const mapStateToProps = ({ auth }) => {
  return { auth };
};
export default connect(mapStateToProps)(Header);

const StyledHeader = styled.div`
  background-color: yellow;
  display: flex;
  height: 50px;
  justify-content: space-between;
`;

const StyledNav = styled.div`
  display: flex;
  justify-content: space-between;
`;
