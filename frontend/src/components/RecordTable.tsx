import Table from "react-bootstrap/Table";

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

const RecordTableBody = () => {
  return(
	<tbody>
	  <tr className="fs-4">
	    <td>text</td>
	    <td>start/stop button</td>
		<td>audio controller</td>
	  </tr>
	</tbody>
  );
}

const RecordTable = (props: any) => {
  return (
    <Table>
      <RecordTableHeader />
	  <RecordTableBody />
    </Table>
  );
};

export default RecordTable;
