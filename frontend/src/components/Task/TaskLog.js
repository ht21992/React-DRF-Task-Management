import React from "react";
import dateFormat from "dateformat";
import { Calendar, Stopwatch } from "react-bootstrap-icons";
const TaskLog = ({ log }) => {
  return (
    <div
      key={log.id}
      className="vertical-timeline-element-content bounce-in  mb-3"
    >
      <b style={{ fontSize: "12px" }} className="timeline-title">
        <span
          className="mr-2"
          style={{
            height: "15px",
            width: "15px",
            backgroundColor: log.log_color,
            borderRadius: "50%",
            display: "inline-block",
          }}
        ></span>
        {log.log_type} by {log.user_profile}
      </b>
      <p style={{ fontSize: "12px" }}>{log.log_text}</p>
      <span className="vertical-timeline-element-date">
        <small style={{ fontSize: "10px" }}>
          <Calendar color="black" size={10} className="ml-1" />
          {dateFormat(log.updated, " dddd, mmmm dS, yyyy ")}
          <Stopwatch color="black" size={10} className="ml-1" />
          {dateFormat(log.updated, " h:MM:ss TT")}
        </small>
      </span>
    </div>
  );
};

export default TaskLog;
