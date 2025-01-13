import Card from "react-bootstrap/Card";

const Finished = () => {
  return (
    <Card
      style={{ width: "50%" }}
      border="success"
      className="mx-auto my-5 fs-5 text-center"
    >
      <Card.Body>
        <Card.Title>
          The recordings and metadata were successfully saved.
        </Card.Title>
        <Card.Text>Thank you for participating in the task!</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Finished;
