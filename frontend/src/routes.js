import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import TaskPage from "./pages/TaskPage";


import PrivateRoute from "./hocs/PrivateRoute";

const routes = [
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/dashboard', element: <PrivateRoute> <Dashboard /> </PrivateRoute> },
    { path: '/task/:taskId', element:<PrivateRoute> <TaskPage /> </PrivateRoute> }
  ]


export default routes