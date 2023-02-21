import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import SendCommentBox from "../../components/post/SendCommentBox";
import { readPost, unloadPost } from "../../modules/post";
import { setOriginalPost } from "../../modules/write";

const SendCommentBoxContainer = () => {
  return <SendCommentBox />;
};

export default SendCommentBoxContainer;
