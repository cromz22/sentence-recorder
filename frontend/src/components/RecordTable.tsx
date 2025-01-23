import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatTextdirectionLToRIcon from "@mui/icons-material/FormatTextdirectionLToR";
import FormatTextdirectionRToLIcon from "@mui/icons-material/FormatTextdirectionRToL";
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
}> = ({ isChecked, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <Form>
      <Form.Check type="checkbox" checked={isChecked} onChange={handleChange} />
    </Form>
  );
};

const RecordTableRow: React.FC<{
  rowNumber: number;
  sentenceEntity: SentenceEntity;
  isRecordingElsewhere: boolean;
  setIsRecordingElsewhere: React.Dispatch<React.SetStateAction<boolean>>;
  updateSentenceEntity: (updatedEntity: SentenceEntity) => void;
}> = ({
  rowNumber,
  sentenceEntity,
  isRecordingElsewhere,
  setIsRecordingElsewhere,
  updateSentenceEntity,
}) => {
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({ audio: true });

  // Update audioUrl in sentenceEntity when mediaBlobUrl changes
  useEffect(() => {
    if (mediaBlobUrl && mediaBlobUrl !== sentenceEntity.audioUrl) {
      updateSentenceEntity({ ...sentenceEntity, audioUrl: mediaBlobUrl });
    }
  }, [mediaBlobUrl, sentenceEntity, updateSentenceEntity]);

  const handleDeleteAudio = () => {
    clearBlobUrl();
    updateSentenceEntity({ ...sentenceEntity, audioUrl: "" });
  };

  return (
    <tr className="fs-4">
      <td>{rowNumber}</td>
      <td>
        <div>{sentenceEntity.codeSwitchedSentence}</div>
        <div>({sentenceEntity.reference})</div>
      </td>
      <td>
        <RecordCheckbox
          isChecked={sentenceEntity.isCodeSwitched}
          onChange={(isChecked) =>
            updateSentenceEntity({
              ...sentenceEntity,
              isCodeSwitched: isChecked,
            })
          }
        />
      </td>
      <td>
        <RecordCheckbox
          isChecked={sentenceEntity.isAccurateTranslation}
          onChange={(isChecked) =>
            updateSentenceEntity({
              ...sentenceEntity,
              isAccurateTranslation: isChecked,
            })
          }
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
        <audio src={sentenceEntity.audioUrl || "#"} controls />
        <IconButton onClick={handleDeleteAudio}>
          <DeleteIcon />
        </IconButton>
      </td>
      <td>
        <ButtonGroup>
          {[0, 1, 2].map((value) => (
            <Button
              key={value}
              variant={
                sentenceEntity.fluency === value ? "primary" : "outline-primary"
              }
              onClick={() =>
                updateSentenceEntity({ ...sentenceEntity, fluency: value })
              }
            >
              {value}
            </Button>
          ))}
        </ButtonGroup>
      </td>
    </tr>
  );
};

const RecordTableHeader: React.FC<{
  direction: string;
  toggleDirection: () => void;
}> = ({ direction, toggleDirection }) => (
  <thead>
    <tr className="fw-bold fs-5">
      <td>No.</td>
      <td>
        <div>
          Sentence to be recorded
          <IconButton onClick={toggleDirection}>
            {direction === "ltr" ? (
              <FormatTextdirectionLToRIcon color="primary" />
            ) : (
              <FormatTextdirectionRToLIcon color="primary" />
            )}
          </IconButton>
        </div>
        <div>(Monolingual reference)</div>
      </td>
      <td>Code-switched</td>
      <td>Accurate translation</td>
      <td>Record / Stop</td>
      <td>Check the audio</td>
      <td>Fluency</td>
    </tr>
  </thead>
);

const RecordTableBody: React.FC<{
  sentences: SentenceEntity[];
  isRecordingElsewhere: boolean;
  setIsRecordingElsewhere: React.Dispatch<React.SetStateAction<boolean>>;
  updateSentenceEntity: (updatedEntity: SentenceEntity) => void;
}> = ({
  sentences,
  isRecordingElsewhere,
  setIsRecordingElsewhere,
  updateSentenceEntity,
}) => {
  return (
    <tbody>
      {sentences.map((sentenceEntity, index) => (
        <RecordTableRow
          key={sentenceEntity.sentenceId}
          rowNumber={index + 1}
          sentenceEntity={sentenceEntity}
          isRecordingElsewhere={isRecordingElsewhere}
          setIsRecordingElsewhere={setIsRecordingElsewhere}
          updateSentenceEntity={updateSentenceEntity}
        />
      ))}
    </tbody>
  );
};

const RecordTable: React.FC<{
  sentences: SentenceEntity[];
  setSentences: React.Dispatch<React.SetStateAction<SentenceEntity[]>>;
}> = ({ sentences, setSentences }) => {
  const [isRecordingElsewhere, setIsRecordingElsewhere] = useState(false);
  const [sentenceDirection, setSentenceDirection] = useState<"ltr" | "rtl">(
    "ltr",
  );

  const updateSentenceEntity = (updatedEntity: SentenceEntity) => {
    setSentences((prev) =>
      prev.map((sentence) =>
        sentence.sentenceId === updatedEntity.sentenceId
          ? updatedEntity
          : sentence,
      ),
    );
  };

  const toggleDirection = () => {
    setSentenceDirection((prev) => (prev === "ltr" ? "rtl" : "ltr"));
    document.documentElement.style.setProperty(
      "--text-direction",
      sentenceDirection === "ltr" ? "rtl" : "ltr",
    );
  };

  return (
    <Table hover>
      <RecordTableHeader
        direction={sentenceDirection}
        toggleDirection={toggleDirection}
      />
      <RecordTableBody
        sentences={sentences}
        isRecordingElsewhere={isRecordingElsewhere}
        setIsRecordingElsewhere={setIsRecordingElsewhere}
        updateSentenceEntity={updateSentenceEntity}
      />
    </Table>
  );
};

export default RecordTable;
