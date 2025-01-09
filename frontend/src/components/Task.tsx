import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Container from "react-bootstrap/Container";
import TaskDescription from "./TaskDescription";
import RecordTable from "./RecordTable";
import { SentenceEntity } from "./types";
import config from "../config.json";

const Task = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [sentences, setSentences] = useState<SentenceEntity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const fetchSentences = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/read-json/${taskId}`,
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const sentences: SentenceEntity[] = await response.json();
        setSentences(sentences);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchSentences();
  }, [taskId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!sentences) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Task">
      <Container className="my-5 text-center">
        <TaskDescription setAgreed={setAgreed} />
        <RecordTable sentences={sentences} />
      </Container>
    </div>
  );
};

export default Task;
