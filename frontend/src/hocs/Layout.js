import React, { useEffect, Fragment } from "react";

import Navbar from "../components/Navbar";

import { checkAuthenticatedAsync, LoadUserAsync } from "../slices/authSlice";
import { LoadAssigneesAsync } from "../slices/taskSlice";

import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function extract_task_id(current_location) {
  let taskIdIndex = current_location.pathname.lastIndexOf("/");
  let id = current_location.pathname.substring(taskIdIndex + 1);
  return id;
}

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuthenticatedAsync());
    dispatch(LoadUserAsync());
    dispatch(LoadAssigneesAsync());
  }, []);

  // check the URL and
  const location = useLocation();
  const id = extract_task_id(location);
  try {
    if (id === "") {
      window.localStorage.removeItem("to");
    } else if (id !== "login") {
      window.localStorage.setItem("to", `/task/${id}`);
    }
  } catch (TypeError) {
    window.localStorage.setItem("to", `/dashboard`);
  }

  return (
    <Fragment>
      <Navbar />
      {children}
    </Fragment>
  );
};

export default Layout;
