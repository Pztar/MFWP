import styled from "styled-components";
import palette from "../../lib/styles/palette";
import { Link } from "react-router-dom";
import Responsive from "./Responsive";

const MenuBlock = styled(Responsive)`
  height: 2rem;
  background: ${palette.gray[1]};
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  justify-items: stretch;

  .MenuItem {
    width: 20%;
    background: ${palette.gray[3]};
    border: none;
    border-radius: 4px;
    padding: 0.25rem 1rem;
    text-align: center;
  }
`;

const Menu = () => {
  return (
    <MenuBlock>
      <Link to="/" className="MenuItem">
        posts
      </Link>
      <Link to="/" className="MenuItem">
        hashtags
      </Link>
      <Link to="/" className="MenuItem">
        chat
      </Link>
      <Link to="/" className="MenuItem">
        advertisement
      </Link>
    </MenuBlock>
  );
};

export default Menu;
