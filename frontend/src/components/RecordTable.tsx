import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { useReactMediaRecorder } from "../utils/ReactMediaRecorder";
import { SentenceEntity } from "./types";

const StartStopButton: React.FC<{
  status: string;
  startRecording: () => void;
  stopRecording: () => void;
  isRecordingSomewhere: boolean;
  setIsRecordingSomewhere: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ status, startRecording, stopRecording, isRecordingSomewhere, setIsRecordingSomewhere }) => {
  useEffect(() => {
    if (status === "recording") setIsRecordingSomewhere(true);
    if (status === "stopped") setIsRecordingSomewhere(false);
  }, [status]);

  return (
    <IconButton
      onClick={status === "recording" ? stopRecording : startRecording}
      disabled={isRecordingSomewhere && status !== "recording"}
    >
      {isRecordingSomewhere && status !== "recording" ? (
        <MicIcon color="disabled" />
      ) : status === "recording" ? (
        <StopIcon color="error" />
      ) : (
        <MicIcon color="primary" />
      )}
    </IconButton>
  );
};

const RecordTableRow: React.FC<{
  sentenceEntity: SentenceEntity;
  isRecordingSomewhere: boolean;
  setIsRecordingSomewhere: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ sentenceEntity, isRecordingSomewhere, setIsRecordingSomewhere }) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (mediaBlobUrl) setAudioUrl(mediaBlobUrl);
  }, [mediaBlobUrl]);

  return (
    <tr className="fs-4">
      <td>{sentenceEntity.sentence}</td>
      <td>
        <StartStopButton
          status={status}
          startRecording={startRecording}
          stopRecording={stopRecording}
          isRecordingSomewhere={isRecordingSomewhere}
          setIsRecordingSomewhere={setIsRecordingSomewhere}
        />
      </td>
      <td>
        <audio src={audioUrl || "#"} controls />
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
    </tr>
  </thead>
);

const RecordTableBody: React.FC<{ sentences: SentenceEntity[] }> = ({ sentences }) => {
  const [isRecordingSomewhere, setIsRecordingSomewhere] = useState<boolean>(false);

  return (
    <tbody>
      {sentences.map((sentenceEntity) => (
        <RecordTableRow
          key={sentenceEntity.sentence_id}
          sentenceEntity={sentenceEntity}
          isRecordingSomewhere={isRecordingSomewhere}
          setIsRecordingSomewhere={setIsRecordingSomewhere}
        />
      ))}
    </tbody>
  );
};

const RecordTable: React.FC<{ sentences: SentenceEntity[] }> = ({ sentences }) => (
  <Table>
    <RecordTableHeader />
    <RecordTableBody sentences={sentences} />
  </Table>
);

export default RecordTable;
