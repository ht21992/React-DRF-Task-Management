import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskAsync,
  updateTaskAsync,
  delTaskAsync,
} from "../../slices/taskSlice";
import toast from "react-hot-toast";
import CSRFToken from "../CSRFToken";
import Badge from "../Badge";
import Button from "../Button/Button";
import Image from "../Image/Image";

function update_tasks_num(current_assignee, perv_assignee, current_user, change_frontend_element = true) {
  context.tasks_num = parseInt(context.tasks_num);

  if (perv_assignee === current_user) {
    context.tasks_num -= 1;
    if (context.tasks_num < 0){
      context.tasks_num = 0
    }
  } else if (current_assignee == current_user) {
    context.tasks_num += 1;
  } else {
    // Do Nothing
  }
  if (change_frontend_element){
    document.getElementById("TaskCounter").innerHTML = context.tasks_num;
  }



}

const TaskModal = ({ type,variant='',modalOpen, setModalOpen, task }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [pervAssignee, setPervAssignee] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("");
  const [parentTask, setParentTask] = useState(null);
  const all_assignees = useSelector((state) => state.task.assignees);
  const all_tasks = useSelector((state) => state.task.tasks);
  const profile = useSelector((state) => state.auth.profile);

  const dispatch = useDispatch();

  useEffect(() => {
    // console.clear()
    if (type === "update" && task) {
      setTitle(task.title);
      setDesc(task.desc);
      setAssignee(task.assignee);
      setPervAssignee(task.assignee);
      setStatus(task.status);
      if (parentTask === "") {
        setParentTask("");
      } else if (task.parent_task && !parentTask) {
        setParentTask(task.parent_task);
      } else {
        setParentTask(parentTask);
      }
    } else {
      setTitle("");
      setDesc("");
      setAssignee("");
      setStatus("");
      setParentTask("");
    }
  }, [type, task, modalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title === "" && desc === "") {
      toast.error("Please fill the fields");
      return;
    }
    if (assignee === "") {
      toast.error("Please select a assignee");
      return;
    }

    if (type === "create") {
      if (variant === "subtask"){
        const current_parent = task.id
        dispatch(addTaskAsync(title, desc, current_parent, assignee,'subtask'));
        update_tasks_num(assignee, "no one", profile.user, false);
        toast.success(`SubTask - ${title} created successfully`);
      }
      else{
        dispatch(addTaskAsync(title, desc, parentTask, assignee));
        update_tasks_num(assignee, "no one", profile.user);
        toast.success(`${title} has been created successfully`);
      }


    } else if (type === "update") {
      let id = task.id;

      if (
        task.title !== title ||
        task.desc !== desc ||
        task.assignee !== assignee ||
        task.parent_task !== parentTask ||
        task.status !== status
      ) {
        dispatch(
          updateTaskAsync({ id, title, desc, assignee, parentTask, status })

        );
        if (task.assignee !== assignee){
          update_tasks_num(assignee, pervAssignee, profile.user);

        }



        toast.success("Task Updated successfully");
      } else {
        toast.error("No changes has been made");
        return;
      }
    }

    setModalOpen(false);
    $("#closeModalBtn").click();
  };

  const handleDelete = () => {
    dispatch(delTaskAsync(task.id));
    update_tasks_num("no one", pervAssignee, profile.user);
    toast.success("Todo Deleted Successfully");
    setModalOpen(false);
    $("#closeModalBtn").click();
  };

  $(document).ready(function () {
    $("#MyModal").modal();
    $("#MyModal").on("hidden.bs.modal", function () {
      $("#closeModalBtn").click();
    });
  });

  return (
    modalOpen && (
      <div id="MyModal" className="modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content" style={{ backgroundColor: "#ecedf6" }}>
            <div className="modal-header">
              <h5 className="modal-title">
                {type === "create" ? "Create New Task" : `Update Task - ${task.id}`}
              </h5>
              <Button
                id="closeModalBtn"
                dataDismiss="modal"
                ariaLabel="Close"
                onClick={() => setModalOpen(false)}
                classes="close"
                variant="modal"
              >
                <span
                  aria-hidden="true"
                  style={{ color: "black", fontSize: "32px" }}
                >
                  &times;
                </span>
              </Button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleSubmit(e)}>
                <CSRFToken />
                <div className="form-group">
                  <label htmlFor="InputTitle">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="InputTitle"
                    aria-describedby="titleHelp"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <small id="titleHelp" className="form-text text-muted">
                    Enter Task Title
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="InputDescription">Description</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="InputDescription"
                    placeholder="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <small id="titleHelp" className="form-text text-muted">
                    Enter Task Description
                  </small>
                </div>
                {task && variant !=="subtask" && (
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      className="form-control"
                      id="status"
                      onChange={(e) => setStatus(e.target.value)}
                      value={status}
                    >
                      {" "}
                      <option disabled value="">
                        Status
                      </option>
                      <option value="backlog">Backlog</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
                { variant === "subtask" ?  null : (<>
                  <label htmlFor="assignee">Parent Task</label>
                <select
                  className="form-control"
                  id="assignee"
                  onChange={(e) => setParentTask(e.target.value)}
                  value={parentTask}
                >
                  <option value="">No Parent</option>
                  {all_tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      Task - {t.id}
                    </option>
                  ))}
                </select>
                </>) }


                <label className="mt-1" htmlFor="assignee">
                  Assignee
                </label>
                <select
                  className="form-control mb-2"
                  id="assignee"
                  onChange={(e) => setAssignee(e.target.value)}
                  value={assignee}
                >
                  <option disabled value="">
                    Select Assignee
                  </option>
                  {all_assignees.map((assignee) => (
                    <option key={assignee.id} value={assignee.id}>
                      {assignee.first_name} {assignee.last_name}
                    </option>
                  ))}
                </select>
                {type !== "create" && task.subtasks.length > 0 && (
                  <b className="mb-3">Subtasks:</b>
                )}
                <ul className="list-group">
                  {type !== "create" &&
                    task.subtasks.length > 0 &&
                    task.subtasks.map((subtask) => (
                      <li key={subtask.id} className="list-group-item ">
                        <span
                          className="float-right"
                          style={{ fontSize: "12px" }}
                        >
                          {subtask.user_profile}{" "}
                          {subtask.user_profile_avatar ? (
                            <Image
                              classes="ml-2"
                              src={subtask.user_profile_avatar}
                              width="15"
                              height="15"
                              variant="avatar"
                            />
                          ) : (
                            <Image
                              src="/static/image/avatar.webp"
                              classes="ml-2"
                              width="15"
                              height="15"
                              variant="avatar"
                            />
                          )}
                        </span>{" "}
                        Task - {subtask.id}{" "}
                        <span className="ml-5">
                          {" "}
                          <Badge
                            text={subtask.status}
                            status={subtask.status}
                          />{" "}
                        </span>
                      </li>
                    ))}
                </ul>

                {task && (
                  <Button
                    ariaLabel="Close"
                    onClick={() => handleDelete()}
                    classes="mt-5"
                    variant="danger"
                  >
                    Delete Task
                  </Button>
                )}
                <Button
                  type="submit"
                  ariaLabel="Close"
                  onClick={(e) => handleSubmit(e)}
                  classes="float-right mt-5 ml-2"
                  variant="secondary"
                >
                  {" "}
                  {type === "create" ? "Create" : "Update"} Task
                </Button>
                <Button
                  dataDismiss="modal"
                  ariaLabel="Close"
                  onClick={() => setModalOpen(false)}
                  classes="mt-5 float-right"
                >
                  Close
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default TaskModal;
