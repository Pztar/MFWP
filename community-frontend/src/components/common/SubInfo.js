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

    .likes {
      color: ${(props) => props.likeCountColor};
      font-weight: ${(props) =>
        400 * (1 + Math.abs(props.likeCount) / props.views)};
    }
    .reports {
      color: ${(props) => props.reportsColor};
      font-weight: ${(props) => 400 * (1 + props.reports / props.views)};
    }
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
  views,
  likeCount,
  reports,
}) => {
  const { id, nick } = user;
  const userId = id;
  const isUpdated = updatedTime - createdTime;
  const likesColor = `hsl(0 ${(10 * 100 * likeCount) / views}% 45%)`;
  const hatesColor = `hsl(240 ${(10 * -100 * likeCount) / views}% 45%)`;
  const reportsColor = `hsl(60 ${(10 * 100 * reports) / views}% 45%)`;
  return (
    <SubInfoBlock
      hasMarginTop={hasMarginTop}
      likeCount={views > 10 && likeCount}
      reports={views > 10 && reports}
      views={views}
      likeCountColor={views > 10 && (likeCount > 0 ? likesColor : hatesColor)}
      reportsColor={reportsColor}
    >
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
        {views ? <span>views: {views}</span> : null}
        <span className="likes">likes: {likeCount}</span>
        <span className="reports">reports: {reports}</span>
      </span>
    </SubInfoBlock>
  );
};

export default SubInfo;
