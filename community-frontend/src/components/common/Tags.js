import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";

const TagsBlock = styled.div`
  margin-top: 0.5rem;
  .hashtag {
    display: inline-block;
    color: ${palette.cyan[7]};
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
      color: ${palette.cyan[6]};
    }
  }
`;

const Tags = ({ Hashtags }) => {
  return (
    <TagsBlock>
      {Hashtags.map((hashtag) => (
        <Link
          className="hashtag"
          to={`/?hashtag=${hashtag.title}`}
          key={hashtag.title}
        >
          #{hashtag.title}
        </Link>
      ))}
    </TagsBlock>
  );
};

export default Tags;
