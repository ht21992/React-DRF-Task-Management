import React, { useState } from "react";
// import classes from "./styles/TaskCard.module.css";
import { getClasses } from "../../utils/getClasses";
import Badge from "../Badge";
import TaskModal from "./TaskModal";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import { CardBody } from "../Card/partials/CardPartials";
import Image from "../Image/Image";
const TaskCard = ({ task }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card classes="card mb-3" style={{ cursor: "pointer" }}>
        <div onClick={() => setModalOpen(true)}>
          <CardBody
            classes="card-body"
            style={{ backgroundColor: "rgba(236, 237, 246, 0.3)" }}
          >
            {task.user_profile_avatar ? (
              <Image
                src={task.user_profile_avatar}
                classes="mb-2"
                width="50"
                height="50"
                variant="avatar"
              />
            ) : (
              <Image
                src="/static/image/avatar.webp"
                classes="mb-2"
                width="50"
                height="50"
                variant="avatar"
              />
            )}{" "}
            <span>{task.user_profile}</span>
            <br></br>
            {(task.status === "completed" && (
              <Link
                className="navbar-brand mb-0"
                exact="true"
                to={`/task/${task.id}`}
                style={{ textDecoration: "line-through" }}
              >
                Task - {task.id}
              </Link>
            )) || (
              <Link
                className="navbar-brand mb-0"
                exact="true"
                to={`/task/${task.id}`}
              >
                Task - {task.id}
              </Link>
            )}
            <p style={{ color: "gray", fontSize: "15px" }}>{task.title}</p>
            <p style={{ color: "gray", fontSize: "10px" }}>{task.desc}</p>
            <Badge text={task.status} status={task.status} />
            <div className="text-right">
              <small className="text-muted mb-1 d-inline-block">
                {task.completion_percentage}
              </small>
            </div>
            <div className="progress" style={{ height: "5px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${task.completion_percentage}%`,
                  backgroundColor: "#45B8AC",
                }}
                aria-valuenow={task.completion_percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </CardBody>
        </div>
      </Card>
      <TaskModal
        type="update"
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        task={task}
      />
    </>
  );
};

export default TaskCard;
