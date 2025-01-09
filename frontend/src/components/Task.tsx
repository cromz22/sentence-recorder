import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Container from "react-bootstrap/Container";
import TaskDescription from "./TaskDescription";
import RecordTable from "./RecordTable";
import config from "../config.json";

const Task = () => {
	const { taskId } = useParams<{ taskId: string }>();
	const [task, setTask] = useState<TaskType | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [agreed, setAgreed] = useState(false);

	useEffect(() => {
		const fetchTask = async () => {
			try {
				const response = await fetch(`${config.backendUrl}/read-json/${taskId}`)
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const data: taskType = await response.json();
				setTask(data);
			} catch (err: any) {
				setError(err.message);
			}
		};
		fetchTask();
	}, [taskId]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!task) {
		return <div>Loading...</div>;
	}

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
