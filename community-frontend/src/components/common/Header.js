import styled from "styled-components";
import Responsive from "./Responsive";
import Button from "./Button";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import { useState } from "react";
import Sidebar from "./Sidebar";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.8);
`;

const Wrapper = styled(Responsive)`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .right {
    display: flex;
    align-items: center;
  }
`;

const Spacer = styled.div`
  height: 3rem;
`;

const Header = ({ user, onLogout }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const toggleOpenSidebar = () => {
    setOpenSidebar(!openSidebar);
  };
  return (
    <>
      {openSidebar ? <Sidebar user={user} /> : null}
      <HeaderBlock>
        <Wrapper>
          <Button onClick={toggleOpenSidebar}>menu</Button>
          <Link to="/" className="logo">
            REACTERS
          </Link>
          {user ? (
            <div className="right">
              <Button onClick={onLogout}>logout</Button>
            </div>
          ) : (
            <div className="right">
              <Button to="/login">login</Button>
            </div>
          )}
        </Wrapper>
        <Menu />
      </HeaderBlock>
      <Spacer />
    </>
  );
};

export default Header;
