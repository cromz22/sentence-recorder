import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

interface TaskDescriptionProps {
  setAgreed: (value: boolean) => void;
}

const TaskDescription: React.FC<TaskDescriptionProps> = () => {
  return (
    <Container>
      <h1>Audio Recording</h1>
      <Card
        style={{ width: "70%" }}
        border="secondary"
        className="mx-auto my-5"
      >
        <Card.Header as="h5">Instructions</Card.Header>
        <Card.Body className="text-start fs-5 mx-4 my-2">
          <Card.Text>For each code-switched sentence below,</Card.Text>
          <ol className="my-0">
            <li className="my-2">
              Verify that the sentence is indeed code-switched, and mark the "
              <span className="fw-bold">Code-switched</span>" checkbox. If not,
              leave it unmarked and move on to the next sentence.
            </li>
            <li className="my-2">
              Verify that the sentence has the same general meaning as the
              monolingual reference, and mark the "
              <span className="fw-bold">Accurate translation</span>" checkbox.
              If not, leave it unmarked and move on to the next sentence.
            </li>
            <li className="my-2">
              Record yourself reading the "
              <span className="fw-bold">Sentence to be recorded</span>."
            </li>
            <li className="my-2">
              Rate the "<span className="fw-bold">Fluency</span>" (how natural
              the code-switched sentence feels like):
              <ol start="0">
                <li>Unnatural</li>
                <li>Not perfectly natural, but might be produced by people</li>
                <li>Perfectly natural</li>
              </ol>
            </li>
          </ol>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TaskDescription;
