import styled from "styled-components";
import palette from "../../lib/styles/palette";
import { Link } from "react-router-dom";
import Responsive from "./Responsive";

const LoadingBlock = styled(Responsive)`
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  justify-items: stretch;
`;

const Loading = ({ children }) => {
  return <LoadingBlock>{children}</LoadingBlock>;
};

export default Loading;
