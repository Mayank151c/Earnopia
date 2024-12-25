import React, { useEffect, useReducer } from 'react';
import '../styles/Task.css';
import Dialog from './Dialog';
import Icons from '../assets/Icons';
import * as MuiIcons from '@mui/icons-material';

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'toggleEditable':
      return { ...state, isEditable: !state.isEditable };
    case 'setPoints':
      return { ...state, points: action.payload };
    case 'setDesc':
      return { ...state, desc: action.payload };
    case 'setIconIndex':
      return { ...state, iconIndex: action.payload };
    case 'toggleDialog':
      return { ...state, isIconsDialogOpen: action.payload };
    case 'setCount':
      return { ...state, count: action.payload };
    default:
      return state;
  }
};

// Lazy initialization function
const init = (props) => {
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
};

function Task(props) {
  const [state, dispatch] = useReducer(reducer, props, init);
  const TaskIcon = Icons[state.iconIndex] || Icons[0];

  useEffect(() => {
    localStorage.setItem(`task${props.id}`, JSON.stringify(state));
  }, [props.id, state]);

  const setState = (type, payload) => {
    dispatch({ type, payload });
  };

  const openIconsDialog = () => {
    if (state.isEditable) {
      dispatch({ type: 'toggleDialog', payload: true });
    }
  };

  const closeIconsDialog = (e) => {
    dispatch({
      type: 'setIconIndex',
      payload: parseInt(e.currentTarget.id, 10),
    });
    dispatch({ type: 'toggleDialog', payload: false });
  };

  const handleCount = (e, op) => {
    const newCount = op === 'add' ? state.count + 1 : state.count - 1;
    dispatch({ type: 'setCount', payload: newCount });
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
      <div className="desc">
        <input
          type="text"
          disabled={!state.isEditable}
          onChange={(e) => setState('setDesc', e.target.value)}
          value={state.desc}
        />
        <br /> Points:{' '}
        <input
          type="number"
          disabled={!state.isEditable}
          onChange={(e) => setState('setPoints', e.target.value)}
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
        onClick={() => dispatch({ type: 'toggleEditable' })}
      />
    </div>
  );
}

export default Task;
