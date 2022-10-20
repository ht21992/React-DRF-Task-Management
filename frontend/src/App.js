import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./hocs/Layout";

import { Toaster } from "react-hot-toast";
import routes from "./routes";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            {routes.map((route) => (
              <Route
                exact
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Layout>
      </Router>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: "1.1rem",
          },
        }}
      />
    </>
  );
}

export default App;
