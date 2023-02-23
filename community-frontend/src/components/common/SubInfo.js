import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";

const SubInfoBlock = styled.div`
  display: flex;
  justify-content: space-between;
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
          <Link to={`/posts/${userId}`}>{nick}</Link>
        </b>
      </span>
      <span>
        <span>
          write:{createdTime.toLocaleString("en-ZA", { hour12: true })}
        </span>
        <span>
          update:{updatedTime.toLocaleString("en-ZA", { hour12: true })}
        </span>
        {likeCount && <span>likes:{likeCount}</span>}
      </span>
    </SubInfoBlock>
  );
};

export default SubInfo;
