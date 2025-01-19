import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import './App.css';
import Task from './components/Task';
import UpdateLocalStorage from './components/UpdateLocalStorage';
import Header from './components/Header';
import API from './config';

function App() {
  const [coin, setCoin] = React.useState(0);
  const [updateLS, setUpdateLS] = React.useState(false);
  const [totalTasks, setTotalTasks] = React.useState([]);

  React.useEffect(() => {
    axios.get(API.BASE_URL('/tasks')).then((tasks) => {
      setTotalTasks(tasks.data);
    });
  }, []);

  // store in localstorage
  React.useEffect(() => {
    if (!localStorage.getItem('coin')) {
      localStorage.setItem('coin', coin);
    } else {
      setCoin(Number(localStorage.getItem('coin')));
    }
    // eslint-disable-next-line
  }, []);

  const updateCoin = (points) => {
    setCoin(Number(points));
    localStorage.setItem('coin', Number(points));
  };

  const updatePoints = (value, points, count) => {
    if (value === 1) {
      updateCoin(coin + Number(points));
    } else {
      if (count === 0) return;
      updateCoin(coin - Number(points));
    }
  };

  const handleCreateTask = () => {
    const data = {
        count: 0,
        points: 100,
        iconIndex: 0,
        desc: 'Add a description'
    }
    axios.post(API.BASE_URL(`/tasks`), data).then(() => {
      axios.get(API.BASE_URL(`/tasks`)).then((tasks) => {
        setTotalTasks(tasks.data);
      });
    })
  };

  return (
    <div className="App">
      <Header coin={coin} />

      <div id="body">
        <div>Total Tasks</div>
        {totalTasks.map((data) => (
          <Task key={data._id} updatePoints={updatePoints} data={data} />
        ))}

        <Button variant="contained" onClick={() => handleCreateTask()}> Create Task </Button>

        <Button variant="contained" onClick={() => setUpdateLS(!updateLS)}>
          {updateLS ? 'Hide' : 'Show'} Local Storage
        </Button>
      </div>
      { updateLS && <UpdateLocalStorage /> }
    </div>
  );
}

export default App;
