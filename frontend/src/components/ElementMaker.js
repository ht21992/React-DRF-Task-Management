import React, { useRef } from "react";
import toast from "react-hot-toast";

function ElementMaker(props) {
  const InputBox = useRef(null);



  const handleSubmit = (e) => {
    if (e.target.tagName == "INPUT") {
      if (e.which == 13 || e.keyCode == 13) {
        if (InputBox.current.value.length <= 0) {
          props.handleChange(props.value);
          toast("Nothing Changed", {
            icon: "💡",
          });
          props.handleBlur();
        } else {
          props.handleChange(InputBox.current.value);
          props.handleBlur();
        }
      }
    }
    // pressing Change Button
    else {
      if (InputBox.current.value.length <= 0) {
        props.handleChange(props.value);
        toast("Nothing Changed", {
          icon: "💡",
        });
        props.handleBlur();
      } else {
        props.handleChange(InputBox.current.value);
        props.handleBlur();
      }
    }
  };

  return (
    <span className="ml-3 ">
      {props.showInputEle ? (
        <div className="input-group mb-3">
          <input
            ref={InputBox}
            type="text"
            className="form-control"
            placeholder={props.value}
            autoFocus
            onKeyDown={handleSubmit}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              onClick={handleSubmit}
              type="submit"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <span
          onDoubleClick={props.handleDoubleClick}
          style={{
            display: "inline-block",
            height: "25px",
            minWidth: "300px",
          }}
        >
          <p style={props.styles}>{props.value}</p>
        </span>
      )}
    </span>
  );
}

export default ElementMaker;
