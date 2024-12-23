import React from 'react';
import './App.css';
import ico from './favicon.ico';
import Task from './components/Task'; 
import UpdateLocalStorage from './components/UpdateLocalStorage';
import Button from '@mui/material/Button';
import * as MuiIcons from '@mui/icons-material';

const totalTasks = [
  { count: 0, desc: 'Excerise', points: 500},
  { count: 0, desc: 'Morning Walk', points: 250},
  { count: 0, desc: 'Leetcode QOTD', points: 1000},
  { count: 0, desc: 'Leetcode High', points: 1000},
  { count: 0, desc: 'Walk 5000 Steps', points: 250},
  { count: 0, desc: 'Drink a Glass of Water', points: 20},
  { count: 0, desc: 'Add a task', points: 100},
  { count: 0, desc: 'Add a task', points: 100},
  { count: 0, desc: 'Add a task', points: 100},
  { count: 0, desc: 'Add a task', points: 100},
  { count: 0, desc: 'Add a task', points: 100},
];

function App() {
  const [coin, setCoin] = React.useState(0);
  const [updateLS, setUpdateLS] = React.useState(false);

  // store in localstorage
  React.useEffect(() => {
    if(!localStorage.getItem('coin')) {
      localStorage.setItem('coin', coin);
    } else {
      setCoin(Number(localStorage.getItem('coin')));
    }
  }, []);

  const updateCoin = (points) => {
    setCoin(Number(points));
    localStorage.setItem('coin', Number(points));
  }

  const updatePoints = (op, points, count) => {
    if(op === 'add') {
      updateCoin(coin + Number(points));
    } else {
      if(count === 0) return;
      updateCoin(coin - Number(points));
    }
  }

  return (
    <div className='App'>

      <div id='header'>
        <img src={ico} alt='logo' />
        <div className='title'>Earnopia</div>
        <div className='balance'>
          <MuiIcons.CurrencyBitcoinOutlined />
          {String(coin).padStart(10, '0')}
        </div>
      </div>


      <div id='body'>
        <div>Total Tasks</div>
        {totalTasks.map((data, i) => <Task key={i} id={i} updatePoints={updatePoints} data={data} />)}
      </div>
      <Button variant='contained' onClick={()=>setUpdateLS(!updateLS)}>{updateLS ? 'Hide' : 'Show'} Local Storage</Button>
      {updateLS && <UpdateLocalStorage />}
    </div>
  );
}

export default App;
