import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const logInitialState = {
  loading: false,
  logs: [],
  error: "",
};

export const fetchLogsAsync = createAsyncThunk(
  "logs/fetchLogs",
  async (task_id) => {
    const body = JSON.stringify({
      withCredentials: true,
    });
    const response = await axios.get(`/api/logs/?filter=${task_id}`, body);
    return response.data;
  }
);

export const addLogAsync = createAsyncThunk(
  "logs/addLog",
  async (log_object) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    const body = JSON.stringify({
      user: log_object["user"],
      task: log_object["task"],
      log_text: log_object["log_text"],
      log_type: log_object["log_type"],
      log_color: log_object["log_color"],
    });

    const response = await axios.post(`/api/logs/`, body, config);
    try {
      return response.data;
    } catch (err) {
      // console.log(err)
      return err;
    }
  }
);

const LogSlice = createSlice({
  name: "log",
  initialState: logInitialState,

  extraReducers: {
    [fetchLogsAsync.pending]: (state, action) => {
      state.loading = true;
    },

    [fetchLogsAsync.fulfilled]: (state, action) => {
      state.logs = action.payload;
      state.loading = false;
    },
    [fetchLogsAsync.rejected]: (state, action) => {
      state.logs = "";
      state.error = action.error.message;
    },

    [addLogAsync.fulfilled]: (state, action) => {
      state.logs.unshift(action.payload);
    },
    [addLogAsync.rejected]: (state, action) => {
      state.error = action.error.message;
    },
  },
});

export const {} = LogSlice.actions;
export default LogSlice.reducer;
