import React, { Fragment } from 'react';

import { Table, Button } from 'semantic-ui-react';

const emptyTable = () => {
  return (
    <Table.Row>
      <Table.Cell collapsing colSpan="3" style={{ textAlign: 'center' }}>
        No Data
      </Table.Cell>
    </Table.Row>
  );
};

const content = (workingHoursData, onRemove) => {
  return (
    <Fragment>
      {workingHoursData.map((data, idx) => {
        return (
          <Table.Row key={idx}>
            <Table.Cell>{formatHours(data)}</Table.Cell>
            <Table.Cell>
              <div style={{ float: 'right' }}>
                <Button circular color="red" icon="trash" onClick={() => onRemove(data)} />
              </div>
            </Table.Cell>
          </Table.Row>
        );
      })}
    </Fragment>
  );
};

export default function WorkingHoursTable({ workingHoursData = [], onRemove } = {}) {
  return (
    <Table singleLine inverted>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Working Hours</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{workingHoursData.length === 0 ? emptyTable() : content(workingHoursData, onRemove)}</Table.Body>
    </Table>
  );
}

export function formatHours({ begin, end }) {
  return `${twoDigit(begin[0])}:${twoDigit(begin[1])} - ${twoDigit(end[0])}:${twoDigit(end[1])}`;
}

function twoDigit(int) {
  return String(int).padStart(2, '0');
}
