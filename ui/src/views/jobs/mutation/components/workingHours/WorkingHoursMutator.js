import React, { useState } from 'react';
import { Button, Message, Modal } from 'semantic-ui-react';

import './WorkingHoursMutator.less';

function toIntArray(timeString) {
  return timeString.split(':').map((str) => Number.parseInt(str));
}

const initialWorkingHours = { begin: '08:00', end: '22:00' };

export default function WorkingHoursMutator({ onVisibilityChanged, visible = false, onData } = {}) {
  const [workingHoursBegin, setWorkingHoursBegin] = useState(initialWorkingHours.begin);
  const [workingHoursEnd, setWorkingHoursEnd] = useState(initialWorkingHours.end);
  const [validationMessage, setValidationMessage] = useState(null);
  const validate = () => {
    if (workingHoursBegin == null || workingHoursEnd == null) {
      return 'Please define working hours or cancel the setup, for 24/7 working hours.';
    }
    return null;
  };

  const onSubmit = (doStore) => {
    if (doStore) {
      const validationResult = validate();
      if (validationResult != null) {
        setValidationMessage(validationResult);
        return;
      }

      onData({
        begin: toIntArray(workingHoursBegin),
        end: toIntArray(workingHoursEnd),
      });
    }

    setWorkingHoursBegin(initialWorkingHours.begin);
    setWorkingHoursEnd(initialWorkingHours.end);
    onVisibilityChanged(false);
  };

  return (
    <Modal onClose={() => onVisibilityChanged(false)} onOpen={() => onVisibilityChanged(true)} open={visible}>
      <Modal.Header>Adding new WorkingHours</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          {validationMessage != null && (
            <Message negative>
              <Message.Header>Houston we have a problem...</Message.Header>
              <p>{validationMessage}</p>
            </Message>
          )}

          <p>
            Here you can define when the job will run.
            <br />
            Maybe there are hours you don't want to be disturbed, maybe there are hours you won't be able to respond
            anyway.
            <br />
            Fredy can sleep during those times and not use up any of your precious free ScrapingAnt API calls.
          </p>
          <p>Not defining any working hours will result in Fredy working 24/7.</p>
          <p style={{ color: '#ff0000' }}>
            If you're running Fredy on a server, remember to adjust for your server timezone.
          </p>
          <label>
            When should Fred start working?
            <input
              className="providerMutator__fields"
              type="time"
              name="begin"
              required
              defaultValue={initialWorkingHours.begin}
              onChange={(e) => setWorkingHoursBegin(e.target.value)}
            />
            <input
              type="time"
              name="end"
              required
              defaultValue={initialWorkingHours.end}
              onChange={(e) => setWorkingHoursEnd(e.target.value)}
            />
          </label>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => onSubmit(false)}>
          Cancel
        </Button>
        <Button content="Save" labelPosition="right" icon="checkmark" onClick={() => onSubmit(true)} positive />
      </Modal.Actions>
    </Modal>
  );
}
