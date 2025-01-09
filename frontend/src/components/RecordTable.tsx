import React from "react";
import Table from "react-bootstrap/Table";
import { SentenceType } from "./types";

const RecordTableHeader = () => {
  return (
    <thead>
      <tr className="fw-bold fs-5">
        <td>Sentences to record</td>
        <td>Record / Stop</td>
        <td>Check the audio</td>
      </tr>
    </thead>
  );
};

const RecordTableBody: React.FC<{ sentences: SentenceType[] }> = ({ sentences }) => {
  return (
    <tbody>
      {sentences.map((sentence) => (
        <tr key={sentence.sentence_id} className="fs-4">
          <td>{sentence.sentence}</td>
          <td>
            <button>Start</button> / <button>Stop</button>
          </td>
          <td>
            <audio controls>
              <source src={`#`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

const RecordTable: React.FC<SentenceType[]> = ({ sentences }) => {
  return (
    <Table>
      <RecordTableHeader />
      <RecordTableBody sentences={sentences} />
    </Table>
  );
};

export default RecordTable;
