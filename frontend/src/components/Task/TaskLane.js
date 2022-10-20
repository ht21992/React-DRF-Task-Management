import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import Badge from "../Badge";
import Button from "../Button/Button";
import Card from "../Card/Card";
import { CardBody, CardHeader } from "../Card/partials/CardPartials";

const TaskLane = ({ laneName, tasks, laneDescription }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="col-12 col-lg-4">
        <Card
          classes="card mb-3"
          style={{ backgroundColor: "rgba(248, 248, 255, 0.3)" }}
        >
          <CardHeader
            classes="card-header"
            style={{ backgroundColor: "#ecedf6" }}
          >
            <h5 className="card-title mb-1">
              {laneName}{" "}
              <Badge
                type="badge-pill"
                text={tasks.length}
                status={laneName.toLowerCase()}
              />
            </h5>
            <small className="mb-0 text-muted">{laneDescription}</small>
          </CardHeader>
          <CardBody classes="card-body">
            {" "}
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            <Button
              extrastyle={{ border: "none", width: "100%" }}
              onClick={() => setModalOpen(true)}
              variant="primary"
            >
              Create task
            </Button>
          </CardBody>
        </Card>
      </div>
      <TaskModal
        type="create"
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default TaskLane;
