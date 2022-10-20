import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UpdateProfileAsync, delAccountAsync } from "../slices/authSlice";
import toast from "react-hot-toast";
import Card from "../components/Card/Card";
import Button from "../components/Button/Button";
import { CardBody } from "../components/Card/partials/CardPartials";
import Image from "../components/Image/Image";
import Badge from "../components/Badge";
const Dashboard = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
  });
  const profile = useSelector((state) => state.auth.profile);
  const error = useSelector((state) => state.auth.error);
  const first_name_global = profile["first_name"];
  const last_name_global = profile["last_name"];
  const position_global = profile["position"];
  const phone_global = profile["phone"];
  const city_global = profile["city"];

  localStorage.removeItem("to");

  const dispatch = useDispatch();

  const { first_name, last_name, position, phone, city } = formData;

  useEffect(() => {
    setFormData({
      first_name: first_name_global,
      last_name: last_name_global,
      phone: phone_global,
      position: position_global,
      city: city_global,
    });
  }, [first_name_global]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    dispatch(delAccountAsync());
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      first_name === first_name_global &&
      last_name === last_name_global &&
      phone === phone_global &&
      position === position_global &&
      city === city_global
    ) {
      toast.error("Nothing Changed");
      return;
    } else {
      dispatch(
        UpdateProfileAsync({ first_name, last_name, position, phone, city })
      );
      if (error === "") {
        toast.success("Profile Updated Successfully");
      } else {
        toast.error(error);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">Dashboard</h1>
      <div className="row gutters-sm mt-4 ml-3">
        <div className="col-md-4 mb-3">
          <Card>
            <CardBody>
              <div className="d-flex flex-column align-items-center text-center">
                {profile.avatar ? (
                  <Image src={profile.avatar} variant="avatar" width="150" />
                ) : (
                  <Image
                    src="/static/image/avatar.webp"
                    variant="avatar"
                    width="150"
                  />
                )}

                <div className="mt-3">
                  <h4>
                    {profile.first_name} {profile.last_name}
                  </h4>
                  <p className="text-secondary mb-1">{profile.position}</p>
                  <p
                    style={{ fontSize: "14px" }}
                    className="text-secondary mb-1"
                  >
                    <b>Mobile : </b> {profile.phone}
                  </p>
                  <p style={{ fontSize: "14px" }} className="text-muted">
                    <b>City : </b> {profile.city}
                  </p>
                  <p>
                    <b>Assigned Tasks : </b>{" "}
                    <Badge text={context.tasks_num} status="all"></Badge>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-8">
          <Card>
            <CardBody classes="card-body">
              <form onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                  <label className="form-label" htmlFor="first_name">
                    First Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="first_name"
                    placeholder={first_name_global}
                    onChange={(e) => onChange(e)}
                    value={first_name || ""}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label mt-3" htmlFor="last_name">
                    Last Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="last_name"
                    placeholder={last_name_global}
                    onChange={(e) => onChange(e)}
                    value={last_name || ""}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label mt-3" htmlFor="position">
                    Position
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="position"
                    placeholder={position_global}
                    onChange={(e) => onChange(e)}
                    value={position || ""}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label mt-3" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="form-control"
                    type="tel"
                    name="phone"
                    placeholder={phone_global}
                    onChange={(e) => onChange(e)}
                    value={phone || ""}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label mt-3" htmlFor="city">
                    City
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="city"
                    placeholder={city_global}
                    onChange={(e) => onChange(e)}
                    value={city || ""}
                  />
                </div>

                <Button type="submit" classes="float-right" variant="secondary">
                  Update Profile
                </Button>
              </form>

              <p style={{ fontWeight: "bolder", marginTop: "100px" }}>
                Click the button below to delete your user account
              </p>
              <Button
                ariaLabel="Close"
                onClick={handleDeleteAccount}
                variant="danger"
              >
                Delete Account
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
