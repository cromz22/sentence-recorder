import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { useReactMediaRecorder } from "../utils/ReactMediaRecorder";
import { SentenceEntity } from "./types";
import config from "../config.json";

const StartStopButton: React.FC<{
  status: string;
  startRecording: () => void;
  stopRecording: () => void;
  isRecordingElsewhere: boolean;
  setIsRecordingElsewhere: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  status,
  startRecording,
  stopRecording,
  isRecordingElsewhere,
  setIsRecordingElsewhere,
}) => {
  useEffect(() => {
    if (status === "recording") setIsRecordingElsewhere(true);
    if (status === "stopped") setIsRecordingElsewhere(false);
  }, [status]);

  return (
    <IconButton
      onClick={status === "recording" ? stopRecording : startRecording}
      disabled={isRecordingElsewhere && status !== "recording"}
    >
      {isRecordingElsewhere && status !== "recording" ? (
        <MicIcon color="disabled" />
      ) : status === "recording" ? (
        <StopIcon color="error" />
      ) : (
        <MicIcon color="primary" />
      )}
    </IconButton>
  );
};

const RecordCheckbox: React.FC<{
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ isChecked, onChange, label }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <Form>
      <Form.Check
        type="checkbox"
        label={label}
        checked={isChecked}
        onChange={handleChange}
      />
    </Form>
  );
};

const RecordTableRow: React.FC<{
  sentenceEntity: SentenceEntity;
  isRecordingElsewhere: boolean;
  setIsRecordingElsewhere: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectionChange: (id: string, audioUrl: string | null, isChecked: boolean) => void;
}> = ({
  sentenceEntity,
  isRecordingElsewhere,
  setIsRecordingElsewhere,
  onSelectionChange,
}) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(
    !!sentenceEntity.isSelected,
  );

  useEffect(() => {
    if (mediaBlobUrl) {
      setAudioUrl(mediaBlobUrl);
      setIsChecked(true);
      onSelectionChange(sentenceEntity.sentenceId, mediaBlobUrl, true);
    }
  }, [mediaBlobUrl]);

  return (
    <tr className="fs-4">
      <td>{sentenceEntity.sentence}</td>
      <td>
        <StartStopButton
          status={status}
          startRecording={startRecording}
          stopRecording={stopRecording}
          isRecordingElsewhere={isRecordingElsewhere}
          setIsRecordingElsewhere={setIsRecordingElsewhere}
        />
      </td>
      <td>
        <audio src={audioUrl || "#"} controls />
      </td>
      <td>
        <RecordCheckbox
          isChecked={isChecked}
          onChange={(checked) => {
            setIsChecked(checked);
            onSelectionChange(sentenceEntity.sentenceId, audioUrl, checked);
          }}
        />
      </td>
    </tr>
  );
};

const RecordTableHeader: React.FC = () => (
  <thead>
    <tr className="fw-bold fs-5">
      <td>Sentences to record</td>
      <td>Record / Stop</td>
      <td>Check the audio</td>
      <td>Submit the audio</td>
    </tr>
  </thead>
);

const RecordTableBody: React.FC<{
  sentences: SentenceEntity[];
  onSubmissionUpdate: (data: { sentenceId: string; audioUrl: string }[]) => void;
}> = ({ sentences, onSubmissionUpdate }) => {
  const [isRecordingElsewhere, setIsRecordingElsewhere] =
    useState<boolean>(false);
  const [recordedData, setRecordedData] = useState<
    { sentenceId: string; audioUrl: string; isChecked: boolean }[]
  >([]);

  const handleSelectionChange = (id: string, audioUrl: string | null, isChecked: boolean) => {
    setRecordedData((prev) =>
      audioUrl
        ? [
            ...prev.filter((item) => item.sentenceId !== id),
            { sentenceId: id, audioUrl, isChecked },
          ]
        : prev.filter((item) => item.sentenceId !== id),
    );
  };

  useEffect(() => {
    // Filter and send only checked recordings
    onSubmissionUpdate(recordedData.filter((data) => data.isChecked));
  }, [recordedData]);

  return (
    <tbody>
      {sentences.map((sentenceEntity) => (
        <RecordTableRow
          key={sentenceEntity.sentenceId}
          sentenceEntity={sentenceEntity}
          isRecordingElsewhere={isRecordingElsewhere}
          setIsRecordingElsewhere={setIsRecordingElsewhere}
          onSelectionChange={(id, audioUrl, isChecked) =>
            handleSelectionChange(id, audioUrl, isChecked)
          }
        />
      ))}
    </tbody>
  );
};

const RecordTable: React.FC<{ sentences: SentenceEntity[] }> = ({ sentences }) => {
  const [submittedData, setSubmittedData] = useState<
    { sentenceId: string; audioUrl: string }[]
  >([]);

  const handleSubmit = async () => {
    if (submittedData.length === 0) {
      alert("Please select at least one recording before submitting.");
      return;
    }

	const formattedData = await Promise.all(
	  submittedData.map(async (data) => {
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
	  })
	);

    try {
      const response = await fetch(`${config.backendUrl}/submit-recordings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.statusText}`);
      }

      alert("Submission successful!");
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Failed to submit recordings.");
    }
  };

  return (
    <div>
      <Table>
        <RecordTableHeader />
        <RecordTableBody
          sentences={sentences}
          onSubmissionUpdate={setSubmittedData}
        />
      </Table>
	  <Button
        type="submit"
        variant="outline-primary"
        onClick={handleSubmit}
        className="fs-4 fw-bold my-4"
      >
        Submit All Checked Recordings
      </Button>
    </div>
  );
};

export default RecordTable;
