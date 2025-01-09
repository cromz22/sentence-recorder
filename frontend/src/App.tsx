import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router";


const Task = () => {
	return (
		<div>
			Task
		</div>
	)
};

const Finished = () => {
	return (
		<div>
			Finished
		</div>
	)
};

const NoMatch = () => {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/task/:taskId" element={<Task />} />
        <Route path="/finished/:taskId" element={<Finished />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
};

export default App;
