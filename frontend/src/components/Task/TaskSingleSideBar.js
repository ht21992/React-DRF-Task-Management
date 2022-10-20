import React from "react";
import { Calendar, Stopwatch } from "react-bootstrap-icons";
import dateFormat from "dateformat";
import { useSelector } from "react-redux";
import Card from "../Card/Card";
import styles from "./styles/TaskSingleSideBar.module.css";
const TaskSingleSideBar = ({
  assignee,
  task,
  status,
  setAssignee,
  setStatus,
}) => {
  const all_assignees = useSelector((state) => state.task.assignees);

  return (
    <Card classes="card mb-5">
      <ul className="list-group ">
        <li className={styles["list-group-item"]}>
          <p style={{ fontWeight: "bolder" }} className="mb-2">
            Assignee:
          </p>
          <select
            className="form-control"
            id="assignee"
            onChange={(e) => setAssignee(e.target.value)}
            value={assignee}
          >
            {all_assignees.map((assignee) => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.first_name} {assignee.last_name}
              </option>
            ))}
          </select>
        </li>
        <li className={styles["list-group-item"]}>
          <p style={{ fontWeight: "bolder" }} className="mb-2">
            Status:
          </p>
          <select
            style={{ textTransform: "capitalize" }}
            className="form-control"
            id="status"
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <option value="backlog">Backlog</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </li>
        <li className={styles["list-group-item"]}>
          <p style={{ fontWeight: "bolder" }} className="mb-2">
            Created:{" "}
          </p>
          <small>
            <Calendar color="black" size={15} />
            {dateFormat(task.created, " dddd, mmmm dS, yyyy ")}
            <br></br>
            <Stopwatch color="black" size={15} />
            {dateFormat(task.created, " h:MM:ss TT")}
          </small>
        </li>
        <li className={styles["list-group-item"]}>
          <p style={{ fontWeight: "bolder" }} className="mb-2">
            Updated:{" "}
          </p>
          <small>
            <Calendar color="black" size={15} />
            {dateFormat(task.updated, " dddd, mmmm dS, yyyy ")}
            <br></br>
            <Stopwatch color="black" size={15} />
            {dateFormat(task.updated, " h:MM:ss TT")}
          </small>
        </li>
      </ul>
    </Card>
  );
};

export default TaskSingleSideBar;
