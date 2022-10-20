import React from "react";
import { getClasses } from "../utils/getClasses";
import classes from "./Badge.module.css";
const Badge = ({ type, status, text, ...rest }) => {
  const nospacestatus = status.replace(/\s/g, "");

  return (
    <span
      className={getClasses([classes[nospacestatus], type, "badge", "mb-2"])}
      {...rest}
    >
      {text}
    </span>
  );
};

export default Badge;
