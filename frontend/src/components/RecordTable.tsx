import React, { useEffect, useState, useCallback } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { useReactMediaRecorder } from "../utils/ReactMediaRecorder";
import { SentenceEntity } from "./types";

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
  }, [status, setIsRecordingElsewhere]);

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
  onSelectionChange: (
    id: string,
    audioUrl: string | null,
    isChecked: boolean,
  ) => void;
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
    if (mediaBlobUrl && mediaBlobUrl !== audioUrl) {
      setAudioUrl(mediaBlobUrl);
      setIsChecked(true);
      onSelectionChange(sentenceEntity.sentenceId, mediaBlobUrl, true);
    }
  }, [mediaBlobUrl, audioUrl, onSelectionChange, sentenceEntity.sentenceId]);

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
  onSelectionChange: (
    id: string,
    audioUrl: string | null,
    isChecked: boolean,
  ) => void;
}> = ({ sentences, onSelectionChange }) => {
  const [isRecordingElsewhere, setIsRecordingElsewhere] =
    useState<boolean>(false);

  return (
    <tbody>
      {sentences.map((sentenceEntity) => (
        <RecordTableRow
          key={sentenceEntity.sentenceId}
          sentenceEntity={sentenceEntity}
          isRecordingElsewhere={isRecordingElsewhere}
          setIsRecordingElsewhere={setIsRecordingElsewhere}
          onSelectionChange={onSelectionChange}
        />
      ))}
    </tbody>
  );
};

const RecordTable: React.FC<{
  sentences: SentenceEntity[];
  onSelectionUpdate: (data: { sentenceId: string; audioUrl: string }[]) => void;
}> = ({ sentences, onSelectionUpdate }) => {
  const [recordedData, setRecordedData] = useState<
    { sentenceId: string; audioUrl: string; isChecked: boolean }[]
  >([]);

  const handleSelectionChange = useCallback(
    (id: string, audioUrl: string | null, isChecked: boolean) => {
      setRecordedData((prev) =>
        audioUrl
          ? [
              ...prev.filter((item) => item.sentenceId !== id),
              { sentenceId: id, audioUrl, isChecked },
            ]
          : prev.filter((item) => item.sentenceId !== id),
      );
    },
    [],
  );

  useEffect(() => {
    // Filter and send only checked recordings
    onSelectionUpdate(recordedData.filter((data) => data.isChecked));
  }, [recordedData, onSelectionUpdate]);

  return (
    <Table>
      <RecordTableHeader />
      <RecordTableBody
        sentences={sentences}
        onSelectionChange={handleSelectionChange}
      />
    </Table>
  );
};

export default RecordTable;
