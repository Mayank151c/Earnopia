import React, { useEffect } from 'react';
import '../styles/Task.css';
import Dialog from './Dialog';
import Icons from '../assets/Icons';
import { Edit, Add, Remove } from '@mui/icons-material';

function Task(props) {
  const [TaskIcon, setTaskIcon] = React.useState(props.data.Icon);
  const [state, setState] = React.useState({});

  useEffect(() => {
    if(!localStorage.getItem(`task${props.id}`)) {
      localStorage.setItem(`task${props.id}`, JSON.stringify(props.data));
    } else {
      let data = JSON.parse(localStorage.getItem(`task${props.id}`));
      setState({
        desc: data.desc,
        count: Number(data.count),
        points: Number(data.points),
        isIconsDialogOpen: false,
        isEditable: false
      });
    }
  }, []);

  const updateState = (key, value) => {
    setState((prev) => {
      let data = prev;
      data[key] = value;
      localStorage.setItem(`task${props.id}`, JSON.stringify(data));
      return data;
    });
  }
  
  const toggleEditable = (e) => {
    updateState('isEditable', !state.isEditable);
  }

  const handleSetPoints = (e) => {
    updateState('points', e.target.value);
  }

  const openIconsDialog = (e) => {
    if(state.isEditable) {
      updateState('isIconsDialogOpen', true);
    }
  }

  const closeIconsDialog = (e) => {
      setTaskIcon(Icons[e.currentTarget.id]);
      updateState('isIconsDialogOpen', false);
  }

  const handleDescChange = (e) => {
    updateState('desc', e.target.value);
  }

  const handleCount = (e, op) => {
    if(op === 'add') {
      updateState('count', state.count + 1);
    } else {
      updateState('count', state.count - 1);
    }
    props.updatePoints(op, state.points, e.target.value);
  }
  
  return (
    <div id='task' className={state.isEditable ? 'editable' : ''}>
      <Dialog title='Select Icon' open={state.isIconsDialogOpen}>
        {Icons.map((Icon, i) => <Icon key={i} id={i} onClick={closeIconsDialog} />)}
      </Dialog>
      <TaskIcon className='icon' onClick={openIconsDialog} />
      <div type='text' className='desc'>
        <input type='text' disabled={!state.isEditable} onChange={handleDescChange} value={state.desc}/>
        <br/> Points: <input disabled={!state.isEditable} onChange={handleSetPoints} value={state.points}/>
      </div>
      <div id='count'>{state.count}</div>
      <div onClick={(e) => handleCount(e, 'add')}>
        <Add style={{color: 'green', cursor: 'pointer', border: '1px solid black', borderRadius: '10%'}}/>
      </div>
      <div onClick={(e) => {if(state.count) handleCount(e, 'remove');}}>
        <Remove style={{color: 'darkred', cursor: 'pointer', border: '1px solid black', borderRadius: '10%'}}/>
      </div>
      {<Edit style={{
        backgroundColor: 'brown',
        color: state.isEditable ? 'white' : 'black',
        borderRadius: '50%',
        width: '1rem',
        height: '1rem',
        padding: '0.3rem',
        position: 'relative',
        right: '-1rem',
        top: '-1rem',
      }} onClick={toggleEditable} />}
    </div>
  );
}

export default Task;