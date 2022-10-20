import React, { useEffect, useState } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import CSRFToken from "../components/CSRFToken";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../slices/authSlice";
import Button from "../components/Button/Button";
const Login = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // && (lastName != "") && (phoneNumber != "")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // const areAllFieldsFilled = (formData['username'] != "") && (formData['password'] != "")

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAsync(username, password));
    setTimeout(function () {
      try {
        document.getElementById("alert").style.display = "block";
        setError("Invalid Username or Password");
      } catch (TypeError) {
        // Do Nothing
      }
    }, 1000);
  };

  const to = window.localStorage.getItem("to");

  if (isAuthenticated && to) {
    return <Navigate to={to} />;
  } else if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="container mt-5">
      <div
        id="alert"
        className="alert alert-warning"
        style={{ display: "none" }}
        role="alert"
      >
        {error}
      </div>

      <h1>Sign In</h1>
      <p>Sign into your account</p>
      <div
        id="alert"
        className="alert alert-danger"
        style={{ display: "none" }}
        role="alert"
      >
        Please Check your inputs
      </div>
      <form onSubmit={(e) => onSubmit(e)} autoFocus>
        <CSRFToken />
        <div className="form-group">
          <label className="form-label">Username: </label>
          <input
            className="form-control"
            type="text"
            placeholder="Username*"
            name="username"
            onChange={(e) => onChange(e)}
            value={username}
            required
            autoComplete="true"
          />
        </div>
        <div className="form-group">
          <label className="form-label mt-3">Password: </label>
          <input
            className="form-control"
            type="password"
            placeholder="Password*"
            name="password"
            onChange={(e) => onChange(e)}
            value={password}
            // minLength='6'
            required
            autoComplete="true"
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
      <p className="mt-3">
        Don't have an Account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
