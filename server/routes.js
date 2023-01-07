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
      color: list.color,
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
              isChecked: subtask.isChecked,
            })),
        })),
    })),
  });
});

app.put('/list/:_id', async (request, response) => {
  const id = request.params._id;
  const list_name = request.body.list_name;
  const color = request.body.color;

  await List.findOneAndUpdate({ _id: id }, { list_name, color });

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
  const isChecked = request.body.isChecked;

  await Subtask.findOneAndUpdate({ _id }, { sub_task_name, isChecked });

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

app.get('/loadSample', async (_, response) => {
  await List.deleteMany();
  await Task.deleteMany();
  await Subtask.deleteMany();

  const backlogList = new List({
    _id: '001',
    list_name: 'Backlog',
    color: '#697689',
  });

  const toDoList = new List({
    _id: '002',
    list_name: 'To do',
    color: '#2CCCE4',
  });

  const inProgressList = new List({
    _id: '003',
    list_name: 'In progress',
    color: '#FF8A65',
  });

  const doneList = new List({
    _id: '004',
    list_name: 'Done',
    color: '#37D67A',
  });

  //TASKS
  const programmingTask = new Task({
    _id: '100',
    task_name: 'Programming',
    list_id: backlogList._id,
  });

  const shoppingTask = new Task({
    _id: '101',
    task_name: 'Shopping',
    list_id: backlogList._id,
  });

  const gamesTask = new Task({
    _id: '102',
    task_name: 'Playing games',
    list_id: backlogList._id,
  });

  const studyTask = new Task({
    _id: '103',
    task_name: 'Study',
    list_id: toDoList._id,
  });

  const foodTask = new Task({
    _id: '104',
    task_name: 'Make food',
    list_id: inProgressList._id,
  });

  const appTask = new Task({
    _id: '105',
    task_name: 'Create to-do app',
    list_id: doneList._id,
  });

  // SUBTASKS
  const improveSub = new Subtask({
    _id: '111',
    sub_task_name: 'Improve to-do app',
    task_id: programmingTask._id,
  });

  const testSub = new Subtask({
    _id: '112',
    sub_task_name: 'more tests',
    task_id: programmingTask._id,
  });

  const cleanSub = new Subtask({
    _id: '113',
    sub_task_name: 'cleanup the code',
    task_id: programmingTask._id,
  });

  const learnSub = new Subtask({
    _id: '114',
    sub_task_name: 'clearn AWS',
    task_id: studyTask._id,
  });

  const kutiaSub = new Subtask({
    _id: '115',
    sub_task_name: 'kutia',
    task_id: foodTask._id,
  });

  const holubtsiSub = new Subtask({
    _id: '116',
    sub_task_name: 'holubtsi',
    task_id: foodTask._id,
    isChecked: true,
  });

  const varenykySub = new Subtask({
    _id: '117',
    sub_task_name: 'varenyky',
    task_id: foodTask._id,
    isChecked: true,
  });

  const uzvarSub = new Subtask({
    _id: '118',
    sub_task_name: 'uzvar',
    task_id: foodTask._id,
  });

  const borshchSub = new Subtask({
    _id: '119',
    sub_task_name: 'borshch',
    task_id: foodTask._id,
    isChecked: true,
  });

  const dragableSub = new Subtask({
    _id: '120',
    sub_task_name: 'dragable card',
    task_id: appTask._id,
    isChecked: true,
  });

  const listSub = new Subtask({
    _id: '121',
    sub_task_name: 'create list',
    task_id: appTask._id,
    isChecked: true,
  });

  const taskSub = new Subtask({
    _id: '122',
    sub_task_name: 'create task',
    task_id: appTask._id,
    isChecked: true,
  });

  const subSub = new Subtask({
    _id: '123',
    sub_task_name: 'create subtask',
    task_id: appTask._id,
    isChecked: true,
  });

  const colorSub = new Subtask({
    _id: '124',
    sub_task_name: 'change list color',
    task_id: appTask._id,
    isChecked: true,
  });

  const markSub = new Subtask({
    _id: '125',
    sub_task_name: 'mark done subtasks',
    task_id: appTask._id,
    isChecked: true,
  });

  await backlogList.save();
  await toDoList.save();
  await inProgressList.save();
  await doneList.save();

  await Promise.all([
    programmingTask.save(),
    shoppingTask.save(),
    gamesTask.save(),
    studyTask.save(),
    foodTask.save(),
    appTask.save(),
  ]);
  await Promise.all([
    improveSub.save(),
    testSub.save(),
    cleanSub.save(),
    learnSub.save(),
    kutiaSub.save(),
    holubtsiSub.save(),
    varenykySub.save(),
    uzvarSub.save(),
    borshchSub.save(),
    dragableSub.save(),
    listSub.save(),
    taskSub.save(),
    subSub.save(),
    colorSub.save(),
    markSub.save()
  ]);

  response.send("OK");
});

module.exports = app;
