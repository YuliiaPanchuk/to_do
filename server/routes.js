const express = require('express');
const app = express();
const { List } = require('./models/ListSchema');
const { Subtask } = require('./models/SubtaskSchema');
const { Task } = require('./models/TaskSchema');
const { v4: uuidv4 } = require('uuid');

// Create list
app.post('/list', async (request, response) => {
  const list_name = request.body.list_name;

  // Validate inputs
  if (list_name === '' || typeof list_name !== 'string') {
    response.status(400).json({
      error: 'Input cannot be empty',
    });
    return;
  }

  try {
    // Create record
    const result = await List.create({
      list_name,
      _id: uuidv4(),
    });

    // Respond to client
    response.status(200).json({
      list_name: list_name,
      id: result._id,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// Show all lists
app.get('/list', async (request, response) => {
  const lists = await List.find();

  // check if the the input field is empty
  if (lists.length === 0) {
    response.status(200).json({
      result: [],
    });
    return;
  }

  const tasks = await Task.find();
  const subtasks = await Subtask.find();

  response.status(200).json({
    result: lists.map((list) => ({
      id: list._id,
      name: list.list_name,
      tasks: tasks
        .filter((task) => task.list_id === list.id)
        .map((task) => ({
          id: task._id,
          list_id: list.id,
          name: task.task_name,
          subtasks: subtasks
            .filter((list) => list.task_id === task.id)
            .map((subtask) => ({
              id: subtask._id,
              name: subtask.sub_task_name,
              task_id: subtask.task_id,
            })),
        })),
    })),
  });
});

app.put('/list/:_id', async (request, response) => {
  const id = request.params._id;
  const list_name = request.body.list_name;

  await List.findOneAndUpdate({ _id: id }, { list_name });

  response.status(200).json({
    id,
    list_name,
  });
});

app.delete('/list/:id', async (request, response) => {
  const id = request.params.id;

  await List.deleteOne({ _id: id });

  response.status(200).send();
  console.log('Deleted id: ', id);
});

/*TASKS*/
app.post('/list/:list_id/task/', async (request, response) => {
  const task_name = request.body.task_name;
  const list_id = request.params.list_id;

  if (task_name === '') {
    response.status(400).json({
      error: 'The field cannot be empty!',
    });
    return;
  }

  try {
    await Task.create({
      task_name,
      list_id,
      _id: uuidv4(),
    });

    // Respond to client
    response.status(200).json({
      task_name: task_name,
      list_id: list_id,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.put('/task/:_id', async (request, response) => {
  const _id = request.params._id;
  const task_name = request.body.task_name;
  const list_id = request.body.list_id;

  await Task.findOneAndUpdate({ _id }, { task_name, list_id });

  response.status(200).json({
    _id,
    task_name,
  });
});

app.delete('/task/:_id', async (request, response) => {
  const _id = request.params._id;

  await Task.deleteOne({ _id });

  response.status(200).send();
  console.log('Deleted id: ', _id);
});

/*SUBTASKS*/
app.post('/task/:task_id/subtask', async (request, response) => {
  const sub_task_name = request.body.sub_task_name;
  const task_id = request.params.task_id;

  if (sub_task_name === '') {
    response.status(400).json({
      error: 'The field cannot be empty',
    });
    return;
  }

  try {
    await Subtask.create({
      sub_task_name,
      _id: uuidv4(),
      task_id,
    });

    // Respond to client
    response.status(200).json({
      sub_task_name,
      task_id,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.put('/subtask/:_id', async (request, response) => {
  const _id = request.params._id;
  const sub_task_name = request.body.sub_task_name;

  await Subtask.findOneAndUpdate({ _id }, { sub_task_name });

  response.status(200).json({
    _id,
    sub_task_name,
  });
});

app.delete('/subtask/:_id', async (request, response) => {
  const id = request.params._id;

  await Subtask.deleteOne({ _id: id });

  response.status(200).send();
  console.log('Deleted id: ', id);
});

module.exports = app;
