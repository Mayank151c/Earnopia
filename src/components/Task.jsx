import React from 'react';
import axios from 'axios';
import * as MuiIcons from '@mui/icons-material';
import '../styles/Task.css';
import Dialog from './Dialog';
import Icons from '../assets/Icons';
import API from '../config';

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

const init = (props) => ({
    id: props.data._id,
    desc: props.data.desc,
    count: props.data.count,
    points: props.data.points,
    iconIndex: props.data.iconIndex,
    isIconsDialogOpen: false,
    isEditable: false,
});

function Task(props) {
  const [state, dispatch] = React.useReducer(reducer, props, init);
  const TaskIcon = Icons[state.iconIndex] || Icons[0];
  const EditSaveIcon = state.isEditable ? MuiIcons.Save : MuiIcons.Edit;

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

  const handleCount = (e, value) => {
    const newCount = state.count + value;
    const data = {
        desc: state.desc,
        points: state.points*value,
    }
    axios.post(API.BASE_URL(`/events`), data).then(() => {
        dispatch({ type: 'setCount', payload: newCount });
        props.updatePoints(value, state.points, e.target.value);
    });
  };

  const handleEditSave = async (e) => {
    if(state.isEditable) {
      const data = {
        desc: state.desc,
        count: state.count,
        points: state.points,
        iconIndex: state.iconIndex
      }
      await axios.put(API.BASE_URL(`/tasks/${state.id}`), data);
    }
    dispatch({ type: 'toggleEditable' });
  }

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
        <br /> {'Points: '}
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
        onClick={(e) => handleCount(e, 1)}
      />
      <MuiIcons.Remove
        className="action-btn"
        style={{ color: 'darkred' }}
        onClick={(e) => {
          if (state.count) handleCount(e, -1);
        }}
      />
      <EditSaveIcon
        className="action-btn"
        style={{ color: 'black' }}
        onClick={(e) => handleEditSave(e)}
      />
    </div>
  );
}

export default Task;
