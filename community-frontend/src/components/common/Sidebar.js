import styled from "styled-components";
import palette from "../../lib/styles/palette";
import { Link } from "react-router-dom";

const Sidebarblock = styled.div`
  overflow: hidden;
  position: fixed;
  background: ${palette.gray[5]};
  padding: 0;
  z-index: 30;
  transition: all 0.3s ease-in-out;
  .menus {
    margin: 1rem 0.5rem 1rem;
  }
  li {
    width: 100%;
    margin-top: 5px;
    margin-left: -1rem;
    padding: 0.3rem 0;
    background: ${palette.gray[3]};
    border: none;
    border-radius: 4px;
  }
  .MenuItem {
    width: 100%;
    padding: 0.25rem 1rem;
  }
  &.show {
    width: 30%;
    height: 100%;
  }
  &.hide {
    visibility: visible;
    width: 0;
    height: 0;
  }
`;

const UserInfo = styled(Link)`
  background: ${palette.gray[6]};
  border-radius: 4px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  margin: 2px 0px 10px 0px;
  padding: 0.5rem 1rem;
`;

const Sidebar = ({ user, openSidebar }) => {
  return (
    <Sidebarblock className={openSidebar ? "show" : "hide"}>
      <div className="menus">
        {user ? <UserInfo to="/">{user.nick}'s myPage</UserInfo> : null}
        <ul>
          <li>
            <Link to="/posts" className="MenuItem">
              posts
            </Link>
          </li>
          <li>
            <Link to="/" className="MenuItem">
              hashtags
            </Link>
          </li>
          <li>
            <Link to="/chat" className="MenuItem">
              chat
            </Link>
          </li>
          <li>
            <Link to="/auction" className="MenuItem">
              auction
            </Link>
          </li>
        </ul>
      </div>
    </Sidebarblock>
  );
};

export default Sidebar;
