import React, { useEffect, useState, useCallback } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { useReactMediaRecorder } from "../utils/ReactMediaRecorder";
import { SentenceEntity } from "./types";
import "./RecordTable.css";

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
        <MicIcon color="disabled" className="micstop" />
      ) : status === "recording" ? (
        <StopIcon color="error" className="micstop" />
      ) : (
        <MicIcon color="primary" className="micstop" />
      )}
    </IconButton>
  );
};

const RecordCheckbox: React.FC<{
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ isChecked, onChange, label }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <Form>
      <Form.Check
        type="checkbox"
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
    isCodeSwitched: boolean,
	isAccurateTranslation: boolean,
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
  const [isCodeSwitched, setIsCodeSwitched] = useState<boolean>(true);
  const [isAccurateTranslation, setIsAccurateTranslation] = useState<boolean>(true);

  useEffect(() => {
    if (mediaBlobUrl && mediaBlobUrl !== audioUrl) {
      setAudioUrl(mediaBlobUrl);
    }
  }, [mediaBlobUrl, audioUrl]);

  useEffect(() => {
    onSelectionChange(
      sentenceEntity.sentenceId,
      audioUrl,
      isCodeSwitched,
      isAccurateTranslation
    );
  }, [
    audioUrl,
    isCodeSwitched,
    isAccurateTranslation,
    onSelectionChange,
    sentenceEntity.sentenceId,
  ]);

  return (
    <tr className="fs-4">
      <td>
        <div>{sentenceEntity.codeSwitchedSentence}</div>
        <div>({sentenceEntity.reference})</div>
      </td>
      <td>
        <RecordCheckbox
          isChecked={isCodeSwitched}
		  onChange={setIsCodeSwitched}
        />
      </td>
      <td>
        <RecordCheckbox
          isChecked={isAccurateTranslation}
		  onChange={setIsAccurateTranslation}
        />
      </td>
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
    </tr>
  );
};

const RecordTableHeader: React.FC = () => (
  <thead>
    <tr className="fw-bold fs-5">
      <td>
        <div>Sentence to be recorded</div>
        <div>(Monolingual reference)</div>
      </td>
      <td>Code-switched</td>
      <td>Accurate translation</td>
      <td>Record / Stop</td>
      <td>Check the audio</td>
    </tr>
  </thead>
);

const RecordTableBody: React.FC<{
  sentences: SentenceEntity[];
  onSelectionChange: (
    id: string,
    audioUrl: string | null,
    isCodeSwitched: boolean,
	isAccurateTranslation: boolean,
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
  onSelectionUpdate: (data: { sentenceId: string; audioUrl: string, isCodeSwitched: boolean, isAccurateTranslation: boolean }[]) => void;
}> = ({ sentences, onSelectionUpdate }) => {
  const [recordedData, setRecordedData] = useState<
    { sentenceId: string; audioUrl: string; isCodeSwitched: boolean, isAccurateTranslation: boolean }[]
  >([]);

  const handleSelectionChange = useCallback(
    (id: string, audioUrl: string | null, isCodeSwitched: boolean, isAccurateTranslation: boolean) => {
      setRecordedData((prev) =>
        audioUrl
          ? [
              ...prev.filter((item) => item.sentenceId !== id),
              { sentenceId: id, audioUrl, isCodeSwitched, isAccurateTranslation },
            ]
          : prev.filter((item) => item.sentenceId !== id),
      );
    },
    [],
  );

  useEffect(() => {
  onSelectionUpdate(
    recordedData.filter(
      (data) => data.isCodeSwitched && data.isAccurateTranslation
    )
  );
  }, [recordedData, onSelectionUpdate]);


  return (
    <Table hover>
      <RecordTableHeader />
      <RecordTableBody
        sentences={sentences}
        onSelectionChange={handleSelectionChange}
      />
    </Table>
  );
};

export default RecordTable;
