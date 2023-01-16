import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";

const SubInfoBlock = styled.div`
  ${(props) =>
    props.hasMarginTop &&
    css`
      margin-top: 1rem;
    `}
  color: ${palette.gray[6]};

  span + span:before {
    color: ${palette.gray[4]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: "\\B7";
  }
`;

const SubInfo = ({
  user,
  createdTime,
  updatedTime,
  hasMarginTop,
  likeCount,
}) => {
  const { id, nick } = user;
  const userId = id;
  return (
    <SubInfoBlock hasMarginTop={hasMarginTop}>
      <span>
        <b>
          <Link to={`/${userId}`}>{nick}</Link>
        </b>
      </span>
      <span>write:{createdTime.toLocaleString("en-ZA", { hour12: true })}</span>
      <span>
        update:{updatedTime.toLocaleString("en-ZA", { hour12: true })}
      </span>
      <span>likes:{likeCount}</span>
    </SubInfoBlock>
  );
};

export default SubInfo;
