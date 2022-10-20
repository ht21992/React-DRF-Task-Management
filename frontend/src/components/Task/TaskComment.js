import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";
import { useSelector } from "react-redux";
import { delCommentAsync, updateCommentAsync } from "../../slices/commentSlice";
import { useDispatch } from "react-redux";
import ElementMaker from "../ElementMaker";
import toast from "react-hot-toast";
import { Calendar, Stopwatch, Pencil, Trash } from "react-bootstrap-icons";
import Image from "../Image/Image";
const TaskComment = ({ comment }) => {
  const profile = useSelector((state) => state.auth.profile);
  const task = useSelector((state) => state.task.task);
  const taskID = task.id;
  const dispatch = useDispatch();
  const [showCommentInputEle, setshowCommentInputEle] = useState(false);
  const [postedComment, setPostedComment] = useState(comment.text);
  const [flag, setFlag] = useState(0);

  const handleDelete = () => {
    dispatch(delCommentAsync(comment.id));
  };

  useEffect(() => {
    const CommentID = comment.id;

    if (postedComment !== "" && flag !== 0) {
      dispatch(updateCommentAsync({ taskID, CommentID, postedComment }));
      toast.success("Comment Updated Successfully");
    } else {
      setFlag(1);
    }
  }, [postedComment]);

  return (
    <div className="p-2 mb-3">
      <div className="d-flex flex-row user-info">
        {comment.user_profile_avatar ? (
          <Image
            classes="ml-2"
            src={comment.user_profile_avatar}
            width="40"
            height="40"
            variant="avatar"
          />
        ) : (
          <Image
            src="/static/image/avatar.webp"
            classes="ml-2"
            width="40"
            height="40"
            variant="avatar"
          />
        )}
        <div className="d-flex flex-column justify-content-start ml-2">
          <span className="d-block font-weight-bold name">
            {comment.user_profile}{" "}
            {profile.user == comment.user ? (
              <abbr title="Delete Comment">
                <a
                  type="button"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "white",
                    border: "none",
                    fontSize: "12px",
                    color: "red",
                  }}
                  onClick={() => handleDelete()}
                >
                  <Trash color="red" size={12} className="ml-1" />
                </a>
              </abbr>
            ) : null}
          </span>
          <span className="date text-black-50">
            <small style={{ fontSize: "10px" }}>
              <Calendar color="black" size={12} className="ml-1" />
              {dateFormat(comment.updated, " dddd, mmmm dS, yyyy ")}
              <Stopwatch color="black" size={12} className="ml-1" />
              {dateFormat(comment.updated, " h:MM:ss TT")}
            </small>
          </span>
        </div>
      </div>
      <div className="mt-3 comment-text ml-5">
        {profile.user == comment.user ? (
          <>
            <abbr title="Double click on your comment to edit">
              <Pencil color="green" size={8} className="ml-1" />
            </abbr>
            <ElementMaker
              value={postedComment}
              handleChange={(Newvalue) => setPostedComment(Newvalue)}
              handleDoubleClick={() => setshowCommentInputEle(true)}
              handleBlur={() => setshowCommentInputEle(false)}
              showInputEle={showCommentInputEle}
            />
          </>
        ) : (
          postedComment
        )}
      </div>
    </div>
  );
};

export default TaskComment;
