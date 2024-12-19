import React from 'react';
import '../styles/Task.css';
import Dialog from './Dialog';
import Icons from '../assets/Icons';

function Task(props) {
  const [TaskIcon, setTaskIcon] = React.useState(props.data.Icon);
  const [isIconsDialogOpen, setIsIconsDialogOpen] = React.useState(false);
  
  const openIconsDialog = (e) => {
    setIsIconsDialogOpen(true);
  }

  const closeIconsDialog = (e) => {
      setTaskIcon(Icons[e.currentTarget.id]);
      setIsIconsDialogOpen(false);
  }
  
  return (
    <div id='task'>
      <Dialog title='Select Icon' open={isIconsDialogOpen}>
        {Icons.map((Icon, i) => <Icon key={i} id={i} onClick={closeIconsDialog} />)}
      </Dialog>
      <TaskIcon onClick={openIconsDialog} style={{fontSize: '1.75rem', border: '1px solid black', padding: '0.5rem', borderRadius: '10%', background: 'rgba(255, 255, 255, 0.2)'}}/>
      <div style={{fontSize: '1.2rem', fontWeight: '500'}}>{props.data.desc}</div>
    </div>
  );
}

export default Task;