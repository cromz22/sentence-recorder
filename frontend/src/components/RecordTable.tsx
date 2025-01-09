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
  isRecordingElsewhere: boolean;
  setIsRecordingElsewhere: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ status, startRecording, stopRecording, isRecordingElsewhere, setIsRecordingElsewhere }) => {
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

const RecordTableRow: React.FC<{
  sentenceEntity: SentenceEntity;
  isRecordingElsewhere: boolean;
  setIsRecordingElsewhere: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectionChange: (id: number, isSelected: boolean) => void;
}> = ({ sentenceEntity, isRecordingElsewhere, setIsRecordingElsewhere, onSelectionChange }) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(sentenceEntity.isSelected);

  useEffect(() => {
    if (mediaBlobUrl) {
		setAudioUrl(mediaBlobUrl);
		setIsChecked(true);
		onSelectionChange(sentenceEntity.sentenceId, true);
	}
  }, [mediaBlobUrl]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    onSelectionChange(sentence.sentenceId, checked);
  };

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
	    <input
		  type="checkbox"
		  checked={isChecked}
		  onChange={handleCheckboxChange}
		  aria-label="Submit this sentence"
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

const RecordTableBody: React.FC<{ sentences: SentenceEntity[] }> = ({ sentences }) => {
  const [isRecordingElsewhere, setIsRecordingElsewhere] = useState<boolean>(false);
  const [selectedSentences, setSelectedSentences] = useState<SentenceEntity[]>(sentences);

  const handleSelectionChange = (id: number, isSelected: boolean) => {
    setSelectedSentences((prev) =>
      prev.map((sentence) =>
        sentence.sentenceId === id ? { ...sentence, isSelected } : sentence
      )
    );
  };

  return (
    <tbody>
      {sentences.map((sentenceEntity) => (
        <RecordTableRow
          key={sentenceEntity.sentenceId}
          sentenceEntity={sentenceEntity}
          isRecordingElsewhere={isRecordingElsewhere}
          setIsRecordingElsewhere={setIsRecordingElsewhere}
		  onSelectionChange={handleSelectionChange}
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
