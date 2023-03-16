import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";

const TagsBlock = styled.div`
  margin-top: 0.1rem;
  span {
    display: inline-block;
    margin-left: 0.5rem;
    color: ${palette.cyan[3]};
    :last-child {
      ::after {
        content: "";
      }
    }
    :first-child {
      margin-left: 0;
    }
  }

  .hashtag {
    display: inline-block;
    color: ${palette.cyan[7]};
    text-decoration: none;
    &:hover {
      color: ${palette.cyan[6]};
    }
  }
  :first-child {
    margin-left: 0;
  }
`;

const Tags = ({ Hashtags, tagedPostCount }) => {
  return (
    <TagsBlock>
      {Hashtags &&
        Hashtags.map((hashtag) => (
          <span key={hashtag.title}>
            <Link
              className="hashtag"
              to={`/posts?hashtag=${hashtag.title}`}
              key={hashtag.title}
            >
              #{hashtag.title}
            </Link>
            {tagedPostCount && " : " + hashtag.tagedPostCount}
          </span>
        ))}
    </TagsBlock>
  );
};

export default Tags;
