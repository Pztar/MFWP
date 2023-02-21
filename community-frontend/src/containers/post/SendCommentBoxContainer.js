import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import SendCommentBox from "../../components/post/SendCommentBox";
import { writeComment, updateComment } from "../../modules/comment";

const SendCommentBoxContainer = () => {
  return <SendCommentBox />;
};

export default SendCommentBoxContainer;
