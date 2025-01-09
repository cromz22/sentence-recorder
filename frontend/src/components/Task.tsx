import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import TaskDescription from "./TaskDescription";
import RecordTable from "./RecordTable";

const Task = () => {
	const [agreed, setAgreed] = useState(false);

	return (
		<div className="Task">
		  <Container className="my-5 text-center">
		    <TaskDescription setAgreed={setAgreed} />
		    <RecordTable />
		  </Container>
		</div>
	)
};

export default Task;
