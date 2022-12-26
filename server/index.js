const fs = require('fs');
const express = require('express');
const cors = require('cors');
const util = require('util');
const app = express();
const connect = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`An error occured ${error}`);
  }
}

// const execQuery = util.promisify(connection.query.bind(connection));



// Create list (To do, in progress, done)
app.post('/list', (request, response) => {
  const status_name = request.body.status_name;

  if (status_name === '' || typeof status_name !== 'string') {
    response.send('Input cannot be empty');
    return;
  }

  connection.query('INSERT INTO status_list SET ?', { status_name }, (error, result) => {
    if (error) {
      console.error(error);
      response.status(500).json();
    } else {
      response.status(200).json({
        status_name: status_name,
        id: result.insertId,
      });
      console.log('Created todo');
    }
  });
});

// Show all lists
app.get('/list', async (request, response) => {
  const lists = await execQuery('SELECT * FROM status_list');

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
      name: list.status_name,
      tasks: tasks
        .filter((task) => task.todo_id === list.id)
        .map((task) => ({
          id: task.id,
          status_list_id: list.id,
          name: task.task_name,
          subtasks: subtasks.filter((subtask) => subtask.task_id === task.id),
        })),
    })),
  });
});

// Update status name
app.put('/list/:id', (request, response) => {
  const id = request.params.id;
  const name = request.params.status_name;

  connection.query(
    'UPDATE status_list SET status_name = ? WHERE id = ?',
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

// Delete status
app.delete('/list/:id', (request, response) => {
  const id = request.params.id;

  connection.query('DELETE FROM status_list WHERE id = ?', [id], (error, result) => {
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

// Create to-do TASK
//
//
app.post('/list/:id/task/', (request, response) => {
  const todo_name = request.body.task_name;
  const todo_id = request.params.id;

  if (todo_name === '') {
    response.send('The field cannot be empty!');
    return;
  }

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

// Update task
app.put('/task/:id', (request, response) => {
  const task_name = request.body.task_name;
  const id = Number(request.params.id);
  const status_list_id = request.body.status_list_id;

  connection.query(
    'UPDATE task SET task_name = ?, todo_id = ? WHERE id = ?',
    [task_name, status_list_id, id],
    (error, _result) => {
      if (error) {
        response.status(500).json({
          status: '!OK',
          message: 'Something went wrong',
        });
        console.log('Error:', error);
      } else {
        response.status(200).json({
          task_name,
          status_list_id,
          id,
        });
        return;
      }
    },
  );
});

// Delete specific task
app.delete('/task/:id', (request, response) => {
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

  if (sub_task_name === '') {
    response.send('The field cannot be empty');
    return;
  }

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
    console.log(result);
    if (error) {
      response.status(500).json({
        message: 'Something went wrong',
      });
      console.log('Error: ', error);
    } else if (result.affectedRows === 0) {
      response.status(404).json('Not deleted');
    } else {
      response.status(200).json();
      console.log('Deleted id: ', id);
    }
  });
});

// Update  subtask
app.put('/subtask/:id', (request, response) => {
  const sub_task_name = request.body.sub_task_name
  const id = request.params.id
  const task_id = request.body.task_id

  connection.query(
    'UPDATE sub_task SET sub_task_name = ?, task_id = ? WHERE id = ?',
    [sub_task_name, task_id, id],
    (error, _result) => {
      if (error) {
        response.status(500).json({
          status: '!OK',
          message: 'Something went wrong',
        });
        console.log('Error:', error);
      } else {
        response.status(200).json({
          sub_task_name,
          task_id,
          id,
        });
        return;
      }
    },
  )
})
