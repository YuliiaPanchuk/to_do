const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const cors = require('cors');

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
app.get('/list', (request, response) => {
  connection.query('SELECT * FROM todo_list', (error, result) => {
    if (error) {
      response.status(500).json({
        message: 'Something went wrong',
      });
      console.log('Error: ', error);
    } else {
      if (result.length === 0) {
        response.status(200).json({
          result: [],
        });
        return;
      }

      connection.query(
        'SELECT * FROM task WHERE todo_id IN (?)',
        [result.map((item) => item.id)],
        (error, tasks) => {
          if (error) {
            response.status(500).json({
              message: `An error occured: ${error}`,
            });
          } else {
            response.status(200).json({
              result: result.map((list) => ({
                id: list.id,
                name: list.list_name,
                tasks: tasks
                  .filter((task) => task.todo_id === list.id)
                  .map((task) => ({
                    id: task.id,
                    name: task.task_name,
                  })),
              })),
            });
          }
        },
      );
    }
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

  const sql = `INSERT INTO task(task_name, todo_id) VALUES('${todo_name}', ${todo_id})`;
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
app.put('/list/:id/task/:id', (request, response) => {
  const task_name = request.params.task_name;
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

app.listen(PORT, () => {
  console.log(`Assignment project listening on port ${PORT}`);
});
