import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import TaskDescription from "./TaskDescription";
import RecordTable from "./RecordTable";
import { SentenceEntity } from "./types";
import config from "../config.json";

const Task = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [sentences, setSentences] = useState<SentenceEntity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [selectedRecordings, setSelectedRecordings] = useState<
    { sentenceId: string; audioUrl: string }[]
  >([]);

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
      } catch (error) {
        setError(error.message);
      }
    };
    fetchSentences();
  }, [taskId]);

  const handleSubmit = async () => {
    if (!agreed) {
      alert("Please agree to the terms before submitting.");
      return; // Prevent submission if not agreed
    }

    if (selectedRecordings.length === 0) {
      alert("Please select at least one recording before submitting.");
      return; // Prevent submission if no recordings
    }

    const formattedData = await Promise.all(
      selectedRecordings.map(async (data) => {
        const response = await fetch(data.audioUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        const base64String = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        return {
          sentenceId: data.sentenceId,
          audioUrl: base64String,
        };
      }),
    );

    try {
      const response = await fetch(
        `${config.backendUrl}/submit-recordings/${taskId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.statusText}`);
      }

      alert("Submission successful!");
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Failed to submit recordings.");
    }
  };

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
        <RecordTable
          sentences={sentences}
          onSelectionUpdate={setSelectedRecordings}
        />
        <Button
          type="submit"
          variant="outline-primary"
          onClick={handleSubmit}
          className="fs-4 fw-bold my-4"
        >
          Submit All Checked Recordings
        </Button>
      </Container>
    </div>
  );
};

export default Task;
