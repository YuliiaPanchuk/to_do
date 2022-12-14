const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const cors = require('cors');
const util = require('util');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;
const baseUrl = 'http://localhost:3001';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todo',
});

const execQuery = util.promisify(connection.query.bind(connection));

connection.connect((error) => {
  if (error) throw error;
  console.log('Connected');
});

// Create list (To do, in progress, done)
app.post('/list', (request, response) => {
  const list_name = request.body.list_name;

  if (list_name === '' || typeof list_name !== 'string') {
    response.send('Input cannot be empty');
    return;
  }

  connection.query('INSERT INTO todo_list SET ?', { list_name }, (error, result) => {
    if (error) {
      console.error(error);
      response.status(500).json();
    } else {
      response.status(200).json({
        list_name: list_name,
        id: result.insertId,
      });
      console.log('Created todo');
    }
  });
});

// Show all lists
app.get('/list', async (request, response) => {
  const lists = await execQuery('SELECT * FROM todo_list');

  if (lists.length === 0) {
    response.status(200).json({
      result: [],
    });
    return;
  }

  const lists_id = lists.map((list) => list.id);
  const tasks = await execQuery('SELECT * FROM task WHERE todo_id IN (?)', [lists_id]);

  const tasks_id = tasks.map((task) => task.id);
  const subtasks =
    tasks_id.length > 0
      ? await execQuery('SELECT * FROM sub_task WHERE task_id IN (?)', [tasks_id])
      : [];

  response.status(200).json({
    result: lists.map((list) => ({
      id: list.id,
      name: list.list_name,
      tasks: tasks
        .filter((task) => task.todo_id === list.id)
        .map((task) => ({
          id: task.id,
          name: task.task_name,
          subtasks: subtasks.filter((subtask) => subtask.task_id === task.id),
        })),
    })),
  });
});

// Update todo_list name
app.put('/list/:id', (request, response) => {
  const id = request.params.id;
  const name = request.params.list_name;

  connection.query(
    'UPDATE todo_list SET list_name = ? WHERE id = ?',
    [name, id],
    (error, _result) => {
      if (error) {
        response.status(500).json({
          message: 'Something went wrong',
        });
      } else {
        response.status(200).json({
          id,
          name,
        });
      }
    },
  );
});

// Delete todo_list
app.delete('/list/:id', (request, response) => {
  const id = request.params.id;

  connection.query('DELETE FROM todo_list WHERE id = ?', [id], (error, result) => {
    if (error) {
      response.status(500).json({
        message: 'Something went wrong',
      });
      console.log('Error: ', error);
    } else {
      response.status(200).send();
      console.log('Deleted id: ', id);
      return;
    }
  });
});

//
// Create to-do TASK
app.post('/list/:id/task/', (request, response) => {
  const todo_name = request.body.task_name;
  const todo_id = request.params.id;

  if (todo_name === '') {
    response.send('The field cannot be empty!');
    return;
  }

  const sql = `INSERT INTO task(task_name, todo_id) VALUES('${todo_name}', ${todo_id})`; // task_name or todo_name???
  connection.query(sql, (error, _result) => {
    if (error) {
      response.status(500).json({
        status: '!OK',
        message: 'Something went wrong',
      });
      console.log('Error:', error);
    } else {
      response.status(200).json({
        todo_name: todo_name,
        todo_id: todo_id,
      });
      return;
    }
  });
});

// Display all tasks
app.get('/list/task', (request, response) => {
  connection.query('SELECT * FROM task', (error, result) => {
    if (error) {
      response.status(500).json({
        status: '!OK',
        message: 'Something went wrong',
      });
      console.log('Error:', error);
    } else {
      response.status(200).json({
        result,
      });
      return;
    }
  });
});

// Update todo
app.put('/task/:id', (request, response) => {
  const task_name = request.body.task_name;
  const id = request.params.id;

  connection.query(
    'UPDATE task SET task_name = ? WHERE id = ?',
    [task_name, id],
    (error, result) => {
      if (error) {
        response.status(500).json({
          status: '!OK',
          message: 'Something went wrong',
        });
        console.log('Error:', error);
      } else {
        response.status(200).json({
          task_name,
          id,
        });
        return;
      }
    },
  );
});

// Delete specific task
app.delete('/list/:id/task/:id', (request, response) => {
  const id = request.params.id;

  connection.query('DELETE FROM task WHERE id = ?', id, (error, result) => {
    if (error) {
      response.status(500).json({
        status: '!OK',
        message: 'Something went wrong',
      });
      console.log('Error: ', error);
    } else {
      response.status(200).send();
      console.log('Deleted id: ', id);
      return;
    }
  });
});

/*Create SUBTASKS*/
app.post('/task/:task_id/subtask', (request, response) => {
  const sub_task_name = request.body.sub_task_name;
  const task_id = request.params.task_id;

  connection.query('INSERT INTO sub_task SET ?', { sub_task_name, task_id }, (error, result) => {
    if (error) {
      console.log(error);
      response.status(500).json();
    } else {
      response.status(200).json({
        sub_task_name: sub_task_name,
        task_id: task_id,
      });
      console.log('Created sub task');
    }
  });
});

//Display all subtasks
app.get('/task/subtask', (request, response) => {
  connection.query('SELECT * FROM sub_task', (error, result) => {
    if (error) {
      response.status(500).json({
        status: '!OK',
        message: 'Something went wrong',
      });
      console.log('Error', error);
    } else {
      response.status(200).json({
        result,
      });
      return;
    }
  });
});

app.delete('/subtask/:id', (request, response) => {
  const id = request.params.id;

  connection.query('DELETE FROM sub_task WHERE id = ?', [id], (error, result) => {
    if (error) {
      response.status(500).json({
        message: 'Something went wrong',
      });
      console.log('Error: ', error);
    } else {
      response.status(200).send();
      console.log('Deleted id: ', id);
      return;
    }
  });
});

app.listen(PORT, () => {
  console.log(`Assignment project listening on port ${PORT}`);
});
