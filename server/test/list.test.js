const mongoose = require('mongoose');
const mocha = require('mocha');
const { List } = require('../models/ListSchema');
const { it, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const { Task } = require('../models/TaskSchema');
const { Subtask } = require('../models/SubtaskSchema');

chai.use(chaiHttp);

describe('Lists', () => {
  beforeEach((done) => {
    List.remove({}, () => {
      done();
    });
  });

  describe('/POST list', () => {
    it('it should create a list', (done) => {
      let list = {
        list_name: 'Backlog',
      };
      chai
        .request(server)
        .post('/list')
        .send(list)
        .end((_error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('list_name').eql(list.list_name);
          done();
        });
    });
  });

  describe('/GET list', () => {
    it('it should get empty lists', (done) => {
      chai
        .request(server)
        .get('/list')
        .end((_error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });

    it('it should get all the lists', (done) => {
      let list = new List({
        _id: '404213',
        list_name: 'Shopping',
      });

      list.save((_error, list) => {
        chai
          .request(server)
          .get('/list')
          .end((_error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('result').with.lengthOf(1);
            response.body.result[0].should.have.property('id').eql(list._id);
            response.body.result[0].should.have.property('name').eql(list.list_name);
            response.body.result[0].should.have.property('tasks').with.lengthOf(0);
            done();
          });
      });
    });

    // TASK
    it('it should get all the tasks', (done) => {
      let list = new List({
        _id: '404213',
        list_name: 'Shopping',
      });

      let task = new Task({
        _id: '404013',
        task_name: 'Shopping',
        list_id: list._id,
      });

      list.save((_error, list) => {
        task.save((_error, _task) => {
          chai
            .request(server)
            .get('/list')
            .end((_error, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              response.body.should.have.property('result').with.lengthOf(1);
              response.body.result[0].should.have.property('id').eql(list._id);
              response.body.result[0].should.have.property('name').eql(list.list_name);
              response.body.result[0].should.have.property('tasks').with.lengthOf(1);
              response.body.result[0].tasks[0].should.have.property('name').eql(task.task_name);
              done();
            });
        });
      });
    });

    // SUBTASK
    it('it should get all the lists', (done) => {
      let list = new List({
        _id: '404213',
        list_name: 'Shopping',
      });

      let task = new Task({
        _id: '404013',
        task_name: 'Shopping',
        list_id: list._id,
      });

      let subtask = new Subtask({
        _id: '112450',
        sub_task_name: 'Tomato',
        task_id: task._id,
      });

      list.save((_error, list) => {
        task.save(() => {
          subtask.save((_error, _subtask) => {
            chai
              .request(server)
              .get('/list')
              .end((_error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('result').with.lengthOf(1);
                response.body.result[0].should.have.property('id').eql(list._id);
                response.body.result[0].should.have.property('name').eql(list.list_name);
                response.body.result[0].tasks[0].should.have.property('subtasks').with.lengthOf(1);
                response.body.result[0].tasks[0].subtasks[0].should.have
                  .property('name')
                  .eql(subtask.sub_task_name);
                done();
              });
          });
        });
      });
    });

    it('handle display all the tasks', (done) => {
      chai
        .request(server)
        .get('/list')
        .end((_error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          done();
        });
    });
  });

  describe('/PUT/:id list', () => {
    it('it should UPDATE a list by given the id', (done) => {
      let list = new List({ _id: '323429', list_name: 'Backlog' });
      list.save((_error, list) => {
        chai
          .request(server)
          .put('/list/' + list._id)
          .send({ list_name: 'To do' })
          .end((_error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('list_name');
            done();
          });
      });
    });
  });

  describe('/DELETE/:id list', () => {
    it('it should DELETE a list by given the id', (done) => {
      let list = new List({ _id: '13427', list_name: 'Backlog' });
      list.save((_error, list) => {
        chai
          .request(server)
          .delete('/list/' + list._id)
          .end((error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            done();
          });
      });
    });
  });
});
