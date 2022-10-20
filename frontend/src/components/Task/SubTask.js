import React from "react";
import styles from "./styles/SubTask.module.css";
import Badge from "../Badge";
import { Link } from "react-router-dom";
import Image from "../Image/Image";
const SubTask = ({ subtask }) => {


  return (

    <div className={styles.subtask} style={{"margin":"10px"}}>
      <div className="px-3">
        {subtask.user_profile_avatar ? (<Image src={subtask.user_profile_avatar}   classes="mt-3" width="25" height="25" variant="avatar" />) : (<Image src="/static/image/avatar.webp"  classes="mt-3" width="25" height="25" variant="avatar" />) }

      </div>
      <div className="px-3 pt-3 mb-3">
        {(subtask.status === "completed" && (
          <Link
            exact="true"
            to={`/task/${subtask.id}`}
            style={{ textDecoration: "line-through" }}
          >
            {subtask.id}
          </Link>
        )) || (
          <Link exact="true" to={`/task/${subtask.id}`}>
            Task - {subtask.id}
          </Link>
        )}
        <p>{subtask.title}</p>
        <Badge text={subtask.status} status={subtask.status} />
      </div>
    </div>
  );
};

export default SubTask;
