import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

interface AgreeCheckboxProps {
  setAgreed: (value: boolean) => void;
  agreeLabel: string;
}

const AgreeCheckbox: React.FC<AgreeCheckboxProps> = ({ setAgreed, agreeLabel }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    setAgreed(checked);
  };

  return (
    <Form className="mb-3 fs-5 fw-bold">
      <Form.Check
        inline
        label={agreeLabel}
        checked={isChecked}
        onChange={handleChange}
      />
    </Form>
  );
};

interface TaskDescriptionProps {
  setAgreed: (value: boolean) => void;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ setAgreed }) => {
  const agreeLabel =
    "I agree that my voice will be made public as a part of a dataset.";

  return (
    <Container>
      <h1>Audio Recording</h1>
      <h5>Please read aloud the displayed sentences.</h5>
      <Card
        style={{ width: "70%" }}
        border="secondary"
        className="mx-auto my-5"
      >
        <Card.Header as="h5">Notes</Card.Header>
        <div className="mx-auto my-3 px-2 fs-5">
          <ul className="text-start">
            <li>
              Please record in a <span className="text-danger">quiet</span>{" "}
              environment.
            </li>
            <li>
              Please speak as <span className="text-danger">clearly</span> as
              possible. If you make a mistake, you can rerecord.
            </li>
            <li>
              Please use a <span className="text-danger">microphone</span> if
              possible.
            </li>
            <li>
              Please make sure that the audio is{" "}
              <span className="text-danger">actually recorded</span> before
              submission.
            </li>
            <li>
              Please note that the recorded voice will be released as a dataset
              in the future.
            </li>
          </ul>
          <AgreeCheckbox setAgreed={setAgreed} agreeLabel={agreeLabel} />
        </div>
      </Card>
    </Container>
  );
};

export default TaskDescription;
