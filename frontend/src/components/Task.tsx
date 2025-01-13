import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import TaskDescription from "./TaskDescription";
import RecordTable from "./RecordTable";
import ConfirmationModal from "./ConfirmationModal";
import { SentenceEntity } from "./types";
import config from "../config.json";

const Task = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [sentences, setSentences] = useState<SentenceEntity[] | null>(null);
  const [originalSentences, setOriginalSentences] = useState<
    SentenceEntity[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

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
        const initializedSentences = sentences.map((sentence) => ({
          ...sentence,
          audioUrl: null,
          isCodeSwitched: false,
          isAccurateTranslation: false,
          fluency: 0,
        }));
        setSentences(initializedSentences);
        setOriginalSentences(initializedSentences);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchSentences();
  }, [taskId]);

  const validateRecordings = (sentences: SentenceEntity[]) => {
    for (const sentence of sentences) {
      if (
        sentence.audioUrl &&
        (!sentence.isCodeSwitched || !sentence.isAccurateTranslation)
      ) {
        setValidationError("All recordings must have both checkboxes checked.");
        return false;
      }
      if (
        !sentence.audioUrl &&
        (sentence.isCodeSwitched || sentence.isAccurateTranslation)
      ) {
        setValidationError("Audio recording is missing for checked sentences.");
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!sentences) {
      console.error("Sentences data is not loaded.");
      return;
    }

    // Check if any changes were made
    const hasChanges =
      JSON.stringify(sentences) !== JSON.stringify(originalSentences);

    if (!hasChanges) {
      setShowConfirmation(true); // Show modal if no changes
      return;
    }

    await proceedWithSubmission(); // Directly proceed if changes are made
  };

  const proceedWithSubmission = async () => {
    if (!sentences) return;

    if (!validateRecordings(sentences)) {
      return;
    }

    const processedData = await Promise.all(
      sentences.map(async (sentence) => {
        const base64String = sentence.audioUrl
          ? await fetch(sentence.audioUrl)
              .then((res) => res.blob())
              .then((blob) => {
                const reader = new FileReader();
                return new Promise<string>((resolve, reject) => {
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
              })
          : null;

        return {
          sentenceId: sentence.sentenceId,
          audioUrl: base64String,
          isCodeSwitched: sentence.isCodeSwitched,
          isAccurateTranslation: sentence.isAccurateTranslation,
          fluency: sentence.fluency,
        };
      }),
    );

    try {
      const response = await fetch(
        `${config.backendUrl}/submit-recordings/${taskId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(processedData),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.statusText}`);
      }

      navigate("/finished");
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
        <TaskDescription />
        <RecordTable sentences={sentences} setSentences={setSentences} />
        {validationError && <Alert variant="danger">{validationError}</Alert>}
        <Button
          type="submit"
          variant="outline-primary"
          onClick={handleSubmit}
          className="fs-4 fw-bold my-5"
        >
          Submit All Checked Recordings
        </Button>

        <ConfirmationModal
          show={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          onConfirm={() => {
            setShowConfirmation(false);
            proceedWithSubmission();
          }}
          message="You haven't made any changes to the data. Do you still want to submit?"
          title="No Changes Detected"
        />
      </Container>
    </div>
  );
};

export default Task;
