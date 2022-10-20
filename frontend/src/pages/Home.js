import React, { Fragment, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Image from "../components/Image/Image";
import Kanban from "../components/Kanban";
import Card from "../components/Card/Card";
import { CardBody } from "../components/Card/partials/CardPartials";
import Badge from "../components/Badge";
import { fetchTasksAsync } from "../slices/taskSlice";
import { useDispatch } from "react-redux";
const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const profile = useSelector((state) => state.auth.profile);
  const dispatch = useDispatch()
  const filterInputRef = useRef();
  const handleSearch = () => {
    const enteredFilter = filterInputRef.current.value;
    dispatch(fetchTasksAsync(enteredFilter))

  }


  const authLinks = (
    <Fragment>
      <div className="container mt-5 d-flex justify-content-center">
        <Card
          classes="card"
          style={{ backgroundColor: "#F8F9FA", border: "none" }}
        >
          <CardBody>
            <div className="d-flex align-items-center">
              {profile.avatar ? (
                <Image src={profile.avatar} width="155" />
              ) : (
                <Image src="/static/image/avatar.webp" width="150" />
              )}
              <div className="ml-3 w-100">
                <h4 className="mb-0 mt-0">
                  {profile.first_name} {profile.last_name}
                </h4>
                <span>{profile.position}</span>
                <div className="p-2 mt-2 d-flex justify-content-between rounded">
                  <div
                    style={{ color: "black" }}
                    className="d-flex flex-column"
                  >
                    <span className="articles">Tasks</span>

                    <Badge
                      id="TaskCounter"
                      text={context.tasks_num}
                      status="all"
                    ></Badge>
                  </div>
                </div>

                <div className="button mt-2 d-flex flex-row align-items-center">
                  <Link
                    className="btn btn-sm btn-outline-info w-100 ml-2"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="d-flex justify-content-center">
        <div className="input-group mt-5 " style={{ width: "30%" }}>
          <input type="number" className="form-control" placeholder="Search By Task Number" onChange={() => handleSearch()}  ref={filterInputRef}/>
          <div className="input-group-append">
          </div>
        </div>

      </div>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <h5>
        Click to <Link to="/login">Login</Link>
      </h5>
    </Fragment>
  );

  const kanban = (
    <Fragment>
      <Kanban />
    </Fragment>
  );
  return (
    <div className="container">
      <div className="mt-5 p-5">
        <Image src="/static/image/favicon.ico" classes="img-center" />
        <h1 className="display-4">HT Task Management</h1>
        <p className="lead">React and Django Rest Framework</p>
        <hr className="my-4" />
        {isAuthenticated ? authLinks : guestLinks}
      </div>
      {isAuthenticated ? kanban : null}
    </div>
  );
};

export default Home;
