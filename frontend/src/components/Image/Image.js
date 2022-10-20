import React from "react";
import { getClasses } from "../../utils/getClasses";
import classNames from "classnames";
import styles from "./Image.module.css";

const ImageTypes = {
  avatar: "avatar",
};

const Image = ({ classes, src, width, height, variant, ...rest }) => {
  var classes = getClasses([classes]);

  var ImageClass = classNames(classes, `${styles[`${ImageTypes[variant]}`]}`);

  return (
    <img
      className={ImageClass}
      src={src}
      width={width}
      height={height}
      variant=""
      {...rest}
    />
  );
};

Image.defaultProps = {
  classes: "",
  src: "/static/image/avatar.webp",
};

export default Image;
