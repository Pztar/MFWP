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
  span {
    white-space: nowrap;
  }
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
  reports,
}) => {
  const { id, nick } = user;
  const userId = id;
  const isUpdated = updatedTime - createdTime;
  return (
    <SubInfoBlock hasMarginTop={hasMarginTop}>
      <span>
        <b>
          <Link to={`/posts/${userId}`}>{nick}</Link>
        </b>
      </span>
      <span>
        {isUpdated ? (
          <span>
            update: {updatedTime.toLocaleString("en-ZA", { hour12: false })}
          </span>
        ) : (
          <span>
            write: {createdTime.toLocaleString("en-ZA", { hour12: false })}
          </span>
        )}
        <span>likes: {likeCount}</span>
        <span>reports: {reports}</span>
      </span>
    </SubInfoBlock>
  );
};

export default SubInfo;
