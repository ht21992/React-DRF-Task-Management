import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const commentInitialState = {
  loading: false,
  comments: [],
  error: "",
};

export const fetchCommentsAsync = createAsyncThunk(
  "comments/fetchComments",

  async (task_id) => {
    const body = JSON.stringify({
      withCredentials: true,
    });

    const response = await axios.get(`/api/comments/?filter=${task_id}`, body);

    return response.data;
  }
);

export const addCommentAsync = createAsyncThunk(
  "comments/addComment",
  async (comment_object) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    const body = JSON.stringify({
      task: comment_object["id"],
      text: comment_object["newcomment"],
    });

    const response = await axios.post(`/api/comments/`, body, config);
    try {
      return response.data;
    } catch (err) {
      // console.log(err)
      return err;
    }
  }
);

export const updateCommentAsync = (comment_object) => async (dispatch) => {
  const comment_id = comment_object["CommentID"];

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };
  // console.log(task_object)
  const body = JSON.stringify({
    text: comment_object["postedComment"],
    task: comment_object["taskID"],
  });
  // console.log(body)

  try {
    const response = await axios.put(
      `/api/comments/${comment_id}/`,
      body,
      config
    );
    dispatch(updateComment(response.data));
  } catch (err) {
    // console.log(err)
    dispatch(hasError(`Error While Updating Comment - ${err.message}`));
  }
};

export const delCommentAsync = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };
  try {
    const response = await axios.delete(`/api/comments/${id}`, config);
    dispatch(deleteComment(id));
  } catch (err) {
    dispatch(hasError(`Error While Deleting a Comment - ${err.message}`));
  }
};

const commentSlice = createSlice({
  name: "comment",
  initialState: commentInitialState,

  reducers: {
    deleteComment: (state, action) => {
      const commentsListArr = state.comments;
      commentsListArr.forEach((comment, index) => {
        if (comment.id === action.payload) {
          commentsListArr.splice(index, 1);
        }
      });
      state.comments = commentsListArr;
    },
    updateTodo: (state, action) => {
      const commentsListArr = state.comments;

      commentsListArr.forEach((comment) => {
        if (comment.id === action.payload.id) {
          comment.text = action.payload.text;
        }

        state.comments = [...commentsListArr];
      });
    },
    hasError: (state, action) => {
      state.error = action.payload;
    },
  },

  extraReducers: {
    [fetchCommentsAsync.pending]: (state, action) => {
      state.loading = true;
      state.comments = [];

    },

    [fetchCommentsAsync.fulfilled]: (state, action) => {
      state.comments = action.payload;
      state.loading = false;



    },
    [fetchCommentsAsync.rejected]: (state, action) => {
      state.comments = [];
      state.error = action.error.message;
    },

    [addCommentAsync.fulfilled]: (state, action) => {
      state.comments.unshift(action.payload);
    },
    [addCommentAsync.rejected]: (state, action) => {
      state.error = action.error.message;
    },
  },
});

export const { updateTodo, hasError, deleteComment } = commentSlice.actions;
export default commentSlice.reducer;
