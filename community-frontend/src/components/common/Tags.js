import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";

const TagsBlock = styled.div`
  margin-top: 0.1rem;
  .hashtag {
    display: inline-block;
    color: ${palette.cyan[7]};
    text-decoration: none;
    margin-left: 0.5rem;
    &:hover {
      color: ${palette.cyan[6]};
    }
    :first-child {
      margin-left: 0;
    }
    span {
      margin-left: 0.5rem;
      color: ${palette.cyan[3]};
    }
    ::after {
      margin-left: 0.5rem;
      content: "/";
    }
    :last-child {
      ::after {
        content: "";
      }
    }
  }
`;

const Tags = ({ Hashtags, tagedPostCount }) => {
  return (
    <TagsBlock>
      {Hashtags &&
        Hashtags.map((hashtag) => (
          <Link
            className="hashtag"
            to={`/posts?hashtag=${hashtag.title}`}
            key={hashtag.title}
          >
            #{hashtag.title}
            <span>{tagedPostCount && ": " + hashtag.tagedPostCount}</span>
          </Link>
        ))}
    </TagsBlock>
  );
};

export default Tags;
