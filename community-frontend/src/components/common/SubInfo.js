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
    .userLevel {
      font-size: 0.8rem;
      margin: 0 0.1rem;
      padding: 0 0.3rem;
      border-radius: 5px;
      background-color: ${palette.gray[4]};
      color: ${(props) => props.userLevelColor};
      text-shadow: 0px 0px 2px black;
    }

    .likes {
      color: ${(props) => props.likeCountColor};
    }
    .reports {
      color: ${(props) => props.reportsColor};
      text-shadow: ${(props) =>
        props.reportsColor ? `0px 0px 2px black` : null};
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
  const userLevel = Math.trunc(Math.pow(user.experience / 100, 2 / 3));
  const userLevelColor = `hsl(${userLevel % 360} ${
    10 * (userLevel % 10)
  }% 65%)`;
  const likesColor = `hsl(0 100% 45%)`;
  const hatesColor = `hsl(240 100% 45%)`;
  const reportsColor = `hsl(60 100% 50%)`;

  return (
    <SubInfoBlock
      hasMarginTop={hasMarginTop}
      likeCount={views > 10 && likeCount}
      reports={views > 10 && reports}
      views={views}
      userLevelColor={userLevelColor}
      likeCountColor={
        views < likeCount * likeCount &&
        (likeCount > 0 ? likesColor : hatesColor)
      }
      reportsColor={views < reports * reports && reportsColor}
    >
      <span>
        <b>
          <span className="userLevel">{userLevel}</span>
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
