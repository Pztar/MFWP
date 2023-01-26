import styled from "styled-components";
import palette from "../../lib/styles/palette";
import { Link } from "react-router-dom";

const Sidebarblock = styled.div`
  background: ${palette.gray[5]};
  padding: 5.5rem 10px 10px 10px;
  width: 200px;
  height: auto;
  position: absolute;
  border-radius: 5px;

  li {
    width: 100%;
    margin-top: 5px;
    background: ${palette.gray[3]};
    border: none;
    border-radius: 4px;
  }
  .MenuItem {
    display: block;
    width: 100%;
    padding: 0.25rem 1rem;
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

const Sidebar = ({ user }) => {
  return (
    <>
      <Sidebarblock>
        {user ? <UserInfo to="/">{user.nick}'s myPage</UserInfo> : null}
        <ul>
          <li>
            <Link to="/" className="MenuItem">
              posts
            </Link>
          </li>
          <li>
            <Link to="/" className="MenuItem">
              hashtags
            </Link>
          </li>
          <li>
            <Link to="/" className="MenuItem">
              chat
            </Link>
          </li>
          <li>
            <Link to="/auction" className="MenuItem">
              auction
            </Link>
          </li>
        </ul>
      </Sidebarblock>
    </>
  );
};

export default Sidebar;
