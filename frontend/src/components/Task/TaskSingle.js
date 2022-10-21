import React, { useState, useEffect } from "react";
import { fetchSingleTaskAsync } from "../../slices/taskSlice";
import { fetchLogsAsync } from "../../slices/logSlice";
import { fetchCommentsAsync, addCommentAsync } from "../../slices/commentSlice";
import { updateTaskAsync } from "../../slices/taskSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import TaskLog from "./TaskLog";
import toast from "react-hot-toast";
import ElementMaker from "../ElementMaker";
import TaskComment from "./TaskComment";
import SubTask from "./SubTask";
import TaskSingleSideBar from "./TaskSingleSideBar";
import { Calendar, Stopwatch, ClockHistory } from "react-bootstrap-icons";
import TaskModal from "./TaskModal";
import Button from "../Button/Button";
import Card from "../Card/Card";
import { CardBody } from "../Card/partials/CardPartials";
import { getClasses } from "../../utils/getClasses";

import Image from "../Image/Image";
const TaskSingle = () => {
  function extract_task_id(current_location) {
    let taskIdIndex = current_location.pathname.lastIndexOf("/");
    let id = current_location.pathname.substring(taskIdIndex + 1);
    return id;
  }

  const [modalOpen, setModalOpen] = useState(false);

  const location = useLocation();

  var id = extract_task_id(location);

  const task = useSelector((state) => state.task.task);
  const loading = useSelector((state) => state.task.loading);
  const logs = useSelector((state) => state.log.logs);
  const comments = useSelector((state) => state.comment.comments);
  const profile = useSelector((state) => state.auth.profile);
  const [pervAssignee, setPervAssignee] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [showTitleInputEle, setShowTitleInputEle] = useState(false);
  const [showDescInputEle, setShowDescInputEle] = useState(false);
  const [newcomment, SetNewComment] = useState("");
  const dispatch = useDispatch();
  const [flag, setFlag] = useState(0);


  function update_tasks_num(current_assignee, perv_assignee, current_user, change_frontend_element = true) {
    context.tasks_num = parseInt(context.tasks_num);
    if (perv_assignee === current_user) {
      context.tasks_num -= 1;
    } else if (current_assignee == current_user) {
      context.tasks_num += 1;
    } else {
      // Do Nothing
    }
    if (change_frontend_element){
      document.getElementById("TaskCounter").innerHTML = context.tasks_num;
    }

  }


  useEffect(() => {
    // when user clicks on subtasks
    const changed_id = extract_task_id(location);
    dispatch(fetchSingleTaskAsync(changed_id));
    dispatch(fetchLogsAsync(changed_id));
    dispatch(fetchCommentsAsync(changed_id));
    setFlag(0);



  }, [location]);

  useEffect(() => {
    setStatus(task.status);
    setTitle(task.title);
    setAssignee(task.assignee);
    setPervAssignee(task.assignee);
    setDesc(task.desc);

  }, [task.title]);


  useEffect(() => {
    // for adding subtasks
    if (task !== "") {
      setSubtasks(task.subtasks);
    }

  },[task.subtasks])

  useEffect(() => {

    if (task === "") {
      // Do nothing
    } else if (
      status === task.status &&
      assignee === task.assignee &&
      title === task.title
    ) {
      setFlag(1);
    } else if (status !== "" && assignee !== "" && title !== "" && flag !== 0) {
      dispatch(updateTaskAsync({ id, title, desc, assignee, status }));

      if (assignee !== task.assignee ){
        update_tasks_num(assignee, pervAssignee, profile.user, false);
      }

      toast.success("Task Updated Successfully");

    } else {
      setFlag(1);
    }
  }, [status, assignee, title, desc]);

  const handleCommentSend = (e) => {
    e.preventDefault();
    $("#CommentSection").show();
    $("#TaskTimeLineDiv").hide();
    dispatch(addCommentAsync({ id, newcomment }));
    $("#CommentTextArea").val("");
  };

  const handleHistoryClick = () => {
    // $('#CommentSection').css("display","none");
    $("#CommentSection").toggle();
    $("#TaskTimeLineDiv").toggle();
  };

  const loadedTask = task && (
    <div className="container">
      <div className="row align-items start">
        <div className="col-lg-8 m-15px-tb">
          <article>
            <div>
              <nav aria-label="breadcrumb">
                <ol
                  style={{ backgroundColor: "#f8f8ff" }}
                  className="breadcrumb"
                >
                  {task.parent_task && (
                    <li className="breadcrumb-item">
                      <Link exact="true" to={`/task/${task.parent_task}`}>
                        Task - {task.parent_task}
                      </Link>
                    </li>
                  )}
                  <li className="breadcrumb-item active" aria-current="page">
                    Task - {task.id}
                  </li>
                </ol>
              </nav>
              <ElementMaker
                value={title}
                handleChange={(Newvalue) => setTitle(Newvalue)}
                handleDoubleClick={() => setShowTitleInputEle(true)}
                handleBlur={() => setShowTitleInputEle(false)}
                showInputEle={showTitleInputEle}
                styles={{ fontSize: "32px", fontWeight: "bolder" }}
                currentElm="TitleInput"
              />
              <div className={getClasses(["media"])}>
                <div className={getClasses(["media-body"])}>
                  <small className="ml-3">
                    <Calendar color="black" size={15} />
                    {dateFormat(task.created, " dddd, mmmm dS, yyyy ")}
                    <Stopwatch color="black" size={15} className="ml-1" />
                    {dateFormat(task.created, " h:MM:ss TT")}
                  </small>
                </div>
              </div>
            </div>
            <div className={getClasses(["article-content"])}>
              <ElementMaker
                value={desc}
                handleChange={(Newvalue) => setDesc(Newvalue)}
                handleDoubleClick={() => setShowDescInputEle(true)}
                handleBlur={() => setShowDescInputEle(false)}
                showInputEle={showDescInputEle}
                styles={{ fontSize: "18px", marginTop: "10%" }}
              />
            </div>

            {/* Subtasks Section starts */}

                <Button variant="secondary" classes=" mt-4 ml-2" onClick={() => setModalOpen(true)} style={{ border: "none" }}>
                + SubTask
                </Button>

            {subtasks.length > 0 && <h5 className="mt-5 ml-3">Subtasks</h5>}
            <div className="row ml-3 mb-3">
              {subtasks &&
                subtasks.map((subtask) => (
                  <SubTask key={subtask.id} subtask={subtask} />
                ))}
            </div>

            {/* Subtasks Section ends */}

            <abbr title="Task History">
              <ClockHistory
                color="#585858"
                size={28}
                onClick={() => handleHistoryClick()}
                className=" float-right"
                style={{ marginRight: "11%", cursor: "pointer" }}
              />
            </abbr>
          </article>
          <div>
            {/* Comment Section Starts */}
            <div
              className="d-flex flex-column comment-section"
              style={{ width: "90%" }}
            >
              <div className="p-2 mb-4">
                <div className="d-flex flex-row align-items-start">
                  <Image variant="avatar" src={profile.avatar} width="40" />
                  <textarea
                    id="CommentTextArea"
                    placeholder="Enter Your Comment"
                    onChange={(e) => SetNewComment(e.target.value)}
                    className="form-control ml-1 shadow-none textarea"
                  ></textarea>
                </div>
                <div
                  onClick={(e) => handleCommentSend(e)}
                  className="mt-2 text-right"
                >
                  <Button variant="primary" type="submit">
                    Post Comment
                  </Button>
                </div>
              </div>
              <div id="CommentSection">
                {comments.map((comment) => (
                  <TaskComment comment={comment} key={comment.id} />
                ))}
              </div>
            </div>
            {/* Comment Section ends */}
            {/* Task History Starts */}
            <Card
              id="TaskTimeLineDiv"
              classes="mb-3 mt-3"
              style={{ display: "none", width: "90%" }}
            >
              <CardBody>
                <h5 className="mb-5">Task Timeline</h5>
                <div className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                  <div className="vertical-timeline-item vertical-timeline-element">
                    <div>
                      {logs.map((log) => (
                        <TaskLog log={log} key={log.id} />
                      ))}
                    </div>
                  </div>
                </div>
                {logs.length == 0 && <p> No Previous Logs</p>}
              </CardBody>
            </Card>
            {/* Task History Ends */}
          </div>
        </div>
        <div className="col-lg-4 m-15px-tb blog-aside">
          <TaskSingleSideBar
            assignee={assignee}
            task={task}
            status={status}
            setAssignee={setAssignee}
            setStatus={setStatus}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {loading ? null : loadedTask}
      <TaskModal
        type="create"
        variant="subtask"
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        task = {task}

      />
    </>
  );
};

export default TaskSingle;
