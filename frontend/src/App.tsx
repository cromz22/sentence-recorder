import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router";

import Task from "./components/Task";
import Finished from "./components/Finished";
import NoMatch from "./components/NoMatch";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/task/:taskId" element={<Task />} />
        <Route path="/finished" element={<Finished />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
};

export default App;
