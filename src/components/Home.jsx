import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import '../styles/Home.css';
import Task from './Task';
import Header from './Header';
import API from '../config';

import EventList from './EventList';
import Navigation from './Navigation';

function Home() {
  const [amount, setAmount] = React.useState(0);
  const [totalTasks, setTotalTasks] = React.useState([]);
  const [nav, setNav] = React.useState(0);

  React.useEffect(() => {
    axios.get(API.BASE_URL('/tasks'), { withCredentials: true }).then((tasks) => {
      setTotalTasks(tasks.data);
    });
    axios.get(API.BASE_URL('/profile'), { withCredentials: true }).then((tasks) => {
      setAmount(tasks.data.amount);
    });
  }, []);

  const updateAmount = (points) => {
    axios.put(API.BASE_URL('/profile'), { amount: Number(points) }, { withCredentials: true }).then((tasks) => {
      axios.get(API.BASE_URL('/profile'), { withCredentials: true }).then((tasks) => {
        setAmount(tasks.data.amount);
      });
    });
  };

  const updatePointsToAmount = (value, points, count) => {
    if (value === 1) {
      updateAmount(amount + Number(points));
    } else {
      if (count === 0) return;
      updateAmount(amount - Number(points));
    }
  };

  const handleCreateTask = () => {
    const data = {
        points: 100,
        iconIndex: 0,
        desc: 'Add a description'
    }
    axios.post(API.BASE_URL(`/tasks`), data, { withCredentials: true }).then(() => {
      axios.get(API.BASE_URL(`/tasks`), { withCredentials: true }).then((tasks) => {
        setTotalTasks(tasks.data);
      });
    })
  };

  const deleteTask = (id) => {
    axios.delete(API.BASE_URL(`/tasks/${id}`), { withCredentials: true }).then(() => {
      axios.get(API.BASE_URL(`/tasks`), { withCredentials: true }).then((tasks) => {
        setTotalTasks(tasks.data);
      });
    });
  };

  const handleNavigation = (value) => {
    setNav(value);
  };

  return (
    <div className="Home">
      <Header amount={amount} />
      <Navigation value={nav} navigate={handleNavigation} />

      { nav===0 && 
        <div id="body">
            {totalTasks.map((data) => (
            <Task key={data._id} updatePointsToAmount={updatePointsToAmount} deleteTask={deleteTask} data={data} />
            ))}

            <Button variant="contained" onClick={() => handleCreateTask()}> Create Task </Button>
        </div>
      }
      { nav===1 && 
        <EventList /> 
      }
    </div>
  );
}

export default Home;
