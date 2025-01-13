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
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [unchangedRows, setUnchangedRows] = useState<number[]>([]);
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
      } catch (error) {
        setError(error.message);
      }
    };
    fetchSentences();
  }, [taskId]);

  const validateRecordings = (sentences: SentenceEntity[]) => {
    const errors: string[] = [];

    sentences.forEach((sentence, index) => {
      const sentenceNo = index + 1;
      if (
        sentence.audioUrl &&
        (!sentence.isCodeSwitched || !sentence.isAccurateTranslation)
      ) {
        errors.push(
          `Sentence No. ${sentenceNo}: All recordings must have both checkboxes checked.`,
        );
      }
      if (
        !sentence.audioUrl &&
        (sentence.isCodeSwitched || sentence.isAccurateTranslation)
      ) {
        errors.push(
          `Sentence No. ${sentenceNo}: Audio recording is missing for checked sentences.`,
        );
      }
    });

    if (errors.length > 0) {
      setValidationError(errors.join(" "));
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!sentences) {
      console.error("Sentences data is not loaded.");
      return;
    }

    if (!validateRecordings(sentences)) {
      return;
    }

    const unchangedRows = sentences
      .map((sentence, index) =>
        !sentence.audioUrl &&
        !sentence.isCodeSwitched &&
        !sentence.isAccurateTranslation &&
        sentence.fluency === 0
          ? index + 1
          : null,
      )
      .filter((row) => row !== null) as number[];

    if (unchangedRows.length > 0) {
      setUnchangedRows(unchangedRows);
      setShowConfirmation(true);
      return;
    }

    await proceedWithSubmission();
  };

  const proceedWithSubmission = async () => {
    if (!sentences) return;

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
          Submit All Recordings & Metadata
        </Button>

        <ConfirmationModal
          show={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          onConfirm={() => {
            setShowConfirmation(false);
            proceedWithSubmission();
          }}
          message={`The following rows have no changes: No. ${unchangedRows.join(
            ", ",
          )}. Do you still want to submit?`}
          title="Unchanged Rows Detected"
        />
      </Container>
    </div>
  );
};

export default Task;
