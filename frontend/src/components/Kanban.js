import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchTasksAsync } from "../slices/taskSlice";
import TaskLane from "./Task/TaskLane";
const Kanban = () => {
  const tasks = useSelector((state) => state.task.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasksAsync());
  }, []);

  const backlogTasks = tasks.filter((task) => task.status.includes("backlog"));
  const inProgressTasks = tasks.filter((task) =>
    task.status.includes("in progress")
  );
  const CompletedTasks = tasks.filter((task) =>
    task.status.includes("completed")
  );

  return (
    <div className="container py-5">
      <div className="row">
        <TaskLane
          laneName="Backlog"
          tasks={backlogTasks}
          laneDescription="need to be completed"
        />
        <TaskLane
          laneName="In Progress"
          tasks={inProgressTasks}
          laneDescription="are being completed"
        />
        <TaskLane
          laneName="Completed"
          tasks={CompletedTasks}
          laneDescription="have been completed"
        />
      </div>
    </div>
  );
};

export default Kanban;
