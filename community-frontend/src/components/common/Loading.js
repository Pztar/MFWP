import styled from "styled-components";
import Responsive from "./Responsive";

const LoadingBlock = styled(Responsive)`
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  justify-items: stretch;
  margin: 1rem;
`;

const Loading = ({ children }) => {
  return <LoadingBlock>{children}</LoadingBlock>;
};

export default Loading;
