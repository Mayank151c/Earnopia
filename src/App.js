import React from 'react';
import './App.css';
import ico from './favicon.ico';
import Task from './components/Task'; 
import {Add} from '@mui/icons-material';

const Tasks = [
  {Icon: Add, desc: 'Add description here...'},
  {Icon: Add, desc: 'Add description here...'},
  {Icon: Add, desc: 'Add description here...'},
]

function App() {
  const [coin, setCoin] = React.useState(0);

  return (
    <div className='App'>

      <div id='header'>
        <img src={ico} alt='logo' />
        <div id='title'>Earnopia</div>
      </div>

      <div id='balance'>
        {'$' + String(coin).padStart(10, '0')}
      </div>

      <div id='tasks'>
        <div>Daily Tasks</div>
        {Tasks.map((data)=><Task data={data} />)}
      </div>

    </div>
  );
}

export default App;
