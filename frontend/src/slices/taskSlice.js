import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { addLogAsync } from "./logSlice";
const taskInitialState = {
  loading: false,
  tasks: [],
  task: "",
  error: "",
  assignees: [],
  assignee_error: "",
};

// extra reducers start
export const LoadAssigneesAsync = createAsyncThunk(
  "task/load_assignees",
  async () => {
    return axios.get("/profile/profiles").then((response) => response.data);
  }
);
// extra reducers ends

export const fetchTasksAsync = createAsyncThunk(
  "tasks/fetchTasks",
  async (filter="") => {
    const response = await axios.get(`/api/tasks?filter=${filter}`);
    return response.data;
  }
);

export const fetchSingleTaskAsync = createAsyncThunk(
  "tasks/fetchSingle",
  async (taskId) => {
    const response = await axios.get(`/api/tasks/${taskId}`);
    return response.data;
  }
);

export const addTaskAsync =
  (title, desc, parent_task, assignee, add_type="task") => async (dispatch) => {

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
    const body = JSON.stringify({
      withCredentials: true,
      title: title,
      desc: desc,
      parent_task: parent_task,
      assignee: assignee,
    });

    try {

      const res = await axios.post("/api/tasks/", body, config);

      const log_object = {
        task: res.data.id,
        log_text: `Task - ${res.data.id} Created`,
        log_type: "Task Created",
        log_color: "#955251",
      };

      res.data.add_type = add_type
      dispatch(addLogAsync(log_object));
      dispatch(addTask(res.data));
    } catch (err) {
      // console.log(err.message);
      dispatch(hasError(err.message));
    }
  };

export const delTaskAsync = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };
  try {
    const response = await axios.delete(`/api/tasks/${id}`, config);

    dispatch(deleteTodo({ id: id, parent_task: response.data.parent_task }));
  } catch (err) {
    dispatch(hasError(`Error While Deleting a Task - ${err.message}`));
  }
};

export const updateTaskAsync = (task_object) => async (dispatch) => {
  const task_id = task_object["id"];

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };
  // console.log(task_object)
  const body = JSON.stringify({
    title: task_object["title"],
    desc: task_object["desc"],
    assignee: task_object["assignee"],
    parent_task: task_object["parentTask"],
    status: task_object["status"],
  });
  // console.log(body)

  try {
    const response = await axios.put(`/api/tasks/${task_id}/`, body, config);

    const log_object = {
      task: task_id,
      log_text: `Task - ${task_id} Updated`,
      log_type: "Task Updated",
      log_color: "#7FCDCD",
    };
    // console.log(response)
    dispatch(updateTodo(response.data));
    dispatch(addLogAsync(log_object));
  } catch (err) {
    // console.log(err)
    dispatch(hasError(`Error While Updating Task - ${err.message}`));
  }
};

const taskSlice = createSlice({
  name: "tasks",
  initialState: taskInitialState,

  reducers: {
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);


      const tasksListArr = state.tasks;

      tasksListArr.forEach((task, index) => {


        // Add this task to the Parent Task's Subtasks (if condition statisfied)
        if (task.id === action.payload.parent_task) {
          task.subtasks.unshift(action.payload);
        }


      });
      state.tasks = [...tasksListArr];

      // update subtaskList for the current task (if neccessary)

      if (action.payload.add_type == "subtask"){
        state.task.subtasks.unshift(action.payload);
      }



    },
    deleteTodo: (state, action) => {
      const tasksListArr = state.tasks;
      const currentTask = tasksListArr.find(
        (task) => task.id == action.payload.id
      );

      // remove the task from its parent Task , subtask list
      if (action.payload.parent_task !== "No parent") {
        const parentTask = tasksListArr.find(
          (task) => task.id == action.payload.parent_task
        );

        let parentTask_SubTasks = parentTask.subtasks;
        parentTask_SubTasks.forEach((subtask, index) => {
          parentTask_SubTasks.splice(
            parentTask_SubTasks.findIndex(({ id }) => id == subtask.id),
            1
          );
        });
      }

      // remove subtasks of the task
      let subtTasksListArr = currentTask.subtasks;
      subtTasksListArr.forEach((subtask, index) => {
        tasksListArr.splice(
          tasksListArr.findIndex(({ id }) => id == subtask.id),
          1
        );
      });

      // remove the task from tasks list
      tasksListArr.splice(
        tasksListArr.findIndex(({ id }) => id == action.payload.id),
        1
      );
    },
    updateTodo: (state, action) => {
      let subtTasksListArr;
      const tasksListArr = state.tasks;
      tasksListArr.forEach((task, index) => {
        subtTasksListArr = task.subtasks;
        if (task.id === action.payload.id) {
          task.assignee = action.payload.assignee;
          task.desc = action.payload.desc;
          task.title = action.payload.title;
          task.status = action.payload.status;
          task.parent_task = action.payload.parent_task;
          task.subtasks = action.payload.subtasks;
          task.completion_percentage = action.payload.completion_percentage;
          task.user_profile = action.payload.user_profile;
          task.user_profile_avatar = action.payload.user_profile_avatar;
        }

        // First Check : Check if any other task has this task inside its subtasks
        subtTasksListArr.forEach((subtask, index) => {
          if (subtask.id == action.payload.id) {
            subtTasksListArr.splice(index, 1);
          }
        });

        // end First Check

        // Add this task to the Parent Task's Subtasks (if condition statisfied)
        if (task.id === action.payload.parent_task) {
          task.subtasks.unshift(action.payload);
        }

        state.tasks = [...tasksListArr];
      });
    },
    hasError: (state, action) => {
      state.error = action.payload;
    },
  },

  extraReducers: {
    [fetchTasksAsync.pending]: (state, action) => {
      state.loading = true;
      state.task = "";
    },

    [fetchTasksAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
      state.error = "";
    },
    [fetchTasksAsync.rejected]: (state, action) => {
      state.loading = false;
      state.tasks = [];
      state.error = action.error.message;
    },
    [fetchSingleTaskAsync.pending]: (state, action) => {
      state.loading = true;
      state.error = "";
    },
    [fetchSingleTaskAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.task = action.payload;

      state.error = "";
    },
    [fetchSingleTaskAsync.rejected]: (state, action) => {
      state.loading = false;
      state.task = "";
      state.error = action.error.message;
    },

    [LoadAssigneesAsync.fulfilled]: (state, action) => {
      state.assignees = action.payload;
      state.assignee_error = "";
    },
    [LoadAssigneesAsync.rejected]: (state, action) => {
      state.assignees = [];
      state.assignee_error = action.error.message;
    },
  },
});

export const { addTask, updateTodo, deleteTodo, hasError } = taskSlice.actions;
export default taskSlice.reducer;
