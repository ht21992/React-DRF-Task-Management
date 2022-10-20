import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { LoadAssigneesAsync } from "./taskSlice";

const initialState = {
  isAuthenticated: null,
  error: "",
  profile: [],
  username: "",
};

// extra reducers start

export const LoadUserAsync = createAsyncThunk("auth/load_user", async () => {
  return axios.get("/profile/user").then((response) => response.data);
});

export const UpdateProfileAsync = createAsyncThunk(
  "auth/update_user",
  async (profile_object) => {
    const body = JSON.stringify({
      withCredentials: true,
      first_name: profile_object["first_name"],
      last_name: profile_object["last_name"],
      position: profile_object["position"],
      phone: profile_object["phone"],
      city: profile_object["city"],
    });
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    return axios
      .put("/profile/update/", body, config)
      .then((response) => response.data);
  }
);

// extra reduces ends

export const checkAuthenticatedAsync = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.get("/accounts/is_authenticated", config);
    if (res.data.error || res.data.isAuthenticated === "error") {
      dispatch(is_authenticated(false));
    } else if (res.data.isAuthenticated === "success") {
      dispatch(is_authenticated(true));
    } else {
      dispatch(is_authenticated(false));
    }
  } catch (err) {
    dispatch(hasError(err.message));
  }
};

export const loginAsync = (username, password) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  const body = JSON.stringify({ username, password });
  try {
    const res = await axios.post("/accounts/login/", body, config);

    if (res.data.success === "User authenticated") {
      dispatch(login(res.data));
      dispatch(LoadUserAsync());
      dispatch(LoadAssigneesAsync());
    } else {
      dispatch(hasError(res.data.error));
    }
  } catch (err) {
    dispatch(hasError(err.message));
  }
};

export const logoutAsync = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  const body = JSON.stringify({
    withCredentials: true,
  });
  try {
    const res = await axios.post("/accounts/logout/", body, config);
    dispatch(logout(res.data));
    window.localStorage.removeItem("to");
    context.tasks_num = " ";
  } catch (err) {
    dispatch(hasError(err.message));
  }
};

export const signUpAsync =
  (username, password, re_password) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    const body = JSON.stringify({ username, password, re_password });
    try {
      const res = await axios.post("/accounts/signup/", body, config);
      dispatch(signup(res.data));
    } catch (err) {
      dispatch(hasError(err.message));
    }
  };

export const delAccountAsync = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  const body = JSON.stringify({
    withCredentials: true,
  });

  try {
    const res = await axios.delete("/accounts/delete/", config, body);
    dispatch(deleteAccount());
  } catch (err) {
    dispatch(hasError(err.message));
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.profile = [];
      state.username = "";
    },
    signup: (state) => {
      state.isAuthenticated = false;
    },
    deleteAccount: (state) => {
      state.isAuthenticated = false;
      state.profile = [];
      state.username = "";
    },
    is_authenticated: (state, action) => {
      state.isAuthenticated = true;
    },
    hasError: (state, action) => {
      state.isAuthenticated = false;
      state.error = action.payload;
    },
  },
  extraReducers: {
    [LoadUserAsync.fulfilled]: (state, action) => {
      state.profile = action.payload.profile;
      state.error = "";
      state.username = action.payload.username;
      (state.first_name = action.payload.profile.first_name),
        (state.last_name = action.payload.profile.last_name),
        (state.phone = action.payload.profile.phone),
        (state.city = action.payload.profile.city),
        (context.tasks_num = action.payload.profile.tasks_num);
    },
    [LoadUserAsync.rejected]: (state, action) => {
      state.profile = [];
      state.error = action.error.message;
    },
    [UpdateProfileAsync.fulfilled]: (state, action) => {
      state.profile = action.payload.profile;
      state.username = action.payload.username;
      (state.first_name = action.payload.profile.first_name),
        (state.last_name = action.payload.profile.last_name),
        (state.phone = action.payload.profile.phone),
        (state.city = action.payload.profile.city),
        (state.error = "");
    },
    [UpdateProfileAsync.rejected]: (state, action) => {
      state.error = action.error.message;
    },
  },
});

export const {
  login,
  logout,
  signup,
  deleteAccount,
  is_authenticated,
  hasError,
} = authSlice.actions;
export default authSlice.reducer;
