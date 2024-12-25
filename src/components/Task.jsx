import React, { useEffect } from 'react';
import '../styles/Task.css';
import Dialog from './Dialog';
import Icons from '../assets/Icons';
import * as MuiIcons from '@mui/icons-material';

function Task(props) {
  const [state, setState] = React.useState(() => {
    const savedState = localStorage.getItem(`task${props.id}`);
    return savedState
      ? JSON.parse(savedState)
      : {
          desc: props.data.desc,
          count: props.data.count,
          points: props.data.points,
          isIconsDialogOpen: false,
          isEditable: false,
          iconIndex: 0,
        };
  });
  const TaskIcon = Icons[state.iconIndex] || Icons[0];

  useEffect(() => {
    localStorage.setItem(`task${props.id}`, JSON.stringify(state));
  }, [props.id, state]);

  const updateState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleEditable = (e) => {
    updateState('isEditable', !state.isEditable);
  };

  const handleSetPoints = (e) => {
    updateState('points', e.target.value);
  };

  const openIconsDialog = (e) => {
    if (state.isEditable) {
      updateState('isIconsDialogOpen', true);
    }
  };

  const closeIconsDialog = (e) => {
    updateState('iconIndex', e.currentTarget.id);
    updateState('isIconsDialogOpen', false);
  };

  const handleDescChange = (e) => {
    updateState('desc', e.target.value);
  };

  const handleCount = (e, op) => {
    if (op === 'add') {
      updateState('count', state.count + 1);
    } else {
      updateState('count', state.count - 1);
    }
    props.updatePoints(op, state.points, e.target.value);
  };

  return (
    <div id="task" className={state.isEditable ? 'editable' : ''}>
      <Dialog title="Select Icon" open={state.isIconsDialogOpen}>
        {Icons.slice(1).map((Icon, i) => (
          <Icon key={i} id={i + 1} onClick={closeIconsDialog} />
        ))}
      </Dialog>
      <TaskIcon className="icon" onClick={openIconsDialog} />
      <div type="text" className="desc">
        <input
          type="text"
          disabled={!state.isEditable}
          onChange={handleDescChange}
          value={state.desc}
        />
        <br /> Points:{' '}
        <input
          disabled={!state.isEditable}
          onChange={handleSetPoints}
          value={state.points}
        />
      </div>
      <div id="count">{state.count}</div>
      <MuiIcons.Add
        className="action-btn"
        onClick={(e) => handleCount(e, 'add')}
      />
      <MuiIcons.Remove
        className="action-btn"
        style={{ color: 'darkred' }}
        onClick={(e) => {
          if (state.count) handleCount(e, 'remove');
        }}
      />
      <MuiIcons.Edit
        className="action-btn"
        style={state.isEditable ? { color: 'white' } : { color: 'black' }}
        onClick={toggleEditable}
      />
    </div>
  );
}

export default Task;
