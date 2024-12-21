import React from 'react';
import './App.css';
import ico from './favicon.ico';
import Task from './components/Task'; 
import {Add, CurrencyBitcoinOutlined} from '@mui/icons-material';

const totalTasks = [
  {Icon: Add, count: 0, desc: 'Excerise', points: 500},
  {Icon: Add, count: 0, desc: 'Morning Walk', points: 100},
  {Icon: Add, count: 0, desc: 'Leetcode QOTD', points: 1000},
  {Icon: Add, count: 0, desc: 'Add a task', points: 100},
  {Icon: Add, count: 0, desc: 'Add a task', points: 100},
  {Icon: Add, count: 0, desc: 'Add a task', points: 100},
  {Icon: Add, count: 0, desc: 'FAP', points: 5000},
];

function App() {
  const [coin, setCoin] = React.useState(0);

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
        <div id='title'>Earnopia</div>
      </div>

      <div id='balance'>
        <CurrencyBitcoinOutlined style={{fontSize: '1.75rem', color: 'goldenrod'}}/>
        {String(coin).padStart(10, '0')}
      </div>

      <div id='tasks'>
        <div>Total Tasks</div>
        {totalTasks.map((data, i) => <Task key={i} id={i} updatePoints={updatePoints} data={data} />)}
      </div>

    </div>
  );
}

export default App;
