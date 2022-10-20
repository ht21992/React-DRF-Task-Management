import React from 'react'
import { getClasses } from "../../utils/getClasses";
import styles from "./button.module.scss";
import classNames from 'classnames';

const buttonTypes = {
  primary: "primary",
  secondary: "secondary",
  danger: "danger",
  modal:"modal"
};



const Button = ({type,classes,variant,dataDismiss,ariaLabel ,onClick,extrastyle,...rest }) => {

  var classes = getClasses([classes])

  var btnClass = classNames(`${classes}`,`${styles.button}`,`${styles[`button--${buttonTypes[variant]}`]}`);




  return (

    <button
      type={type}
      className={btnClass}
      data-dismiss={dataDismiss}
      aria-label={ariaLabel}
      onClick={onClick}
      style={extrastyle}
      {...rest}
    >
      {rest.children}
    </button>
  )
}


Button.defaultProps = {
    classes : "",
    type : "button",
    variant:"primary",
    dataDismiss : '',
    ariaLabel: '',
    extrastyle:{},
    onClick : () => null
}


export default Button
