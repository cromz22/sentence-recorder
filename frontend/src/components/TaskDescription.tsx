import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

interface AgreeCheckboxProps {
  setAgreed: (value: boolean) => void;
  agreeLabel: string;
}

const AgreeCheckbox: React.FC<AgreeCheckboxProps> = ({
  setAgreed,
  agreeLabel,
}) => {
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
        <Card.Header as="h5">Instructions</Card.Header>
        <Card.Body>
          <ol className="text-start fs-5">
            <li>
			  Verify that the sentence is indeed code-switched. If not, unmark the "Code-switched" checkbox and move on to the next sentence.
            </li>
            <li>
		      Verify that the sentence has the same general meaning as the monolingual reference. If not, unmark the "Accurate translation" checkbox and move on to the next sentence.
            </li>
            <li>
		      Record yourself reading the "Sentence to be recorded."
            </li>
            <li>
			  Rate the "Fluency" of the sentence:
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
