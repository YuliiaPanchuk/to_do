let mongoose = require('mongoose');
const mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { it } = require('mocha');
const { Task } = require('../models/TaskSchema');

chai.use(chaiHttp);

describe('Tasks', () => {
  beforeEach((done) => {
    Task.remove({}, () => {
      done();
    });
  });

  describe('/POST/list/:list_id/task/', () => {
    it('it should POST a task', (done) => {
      let task = {
        task_name: 'Shopping',
      };
      chai
        .request(server)
        .post('/list/:list_id/task/')
        .send(task)
        .end((_error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('task_name').eql(task.task_name);
          done();
        });
    });

    it('handle empty task name', (done) => {
      let task = {
        task_name: '',
      };
      chai
        .request(server)
        .post('/list/:list_id/task/')
        .send(task)
        .end((_error, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('error').eql('The field cannot be empty!');
          done();
        });
    });
  });

  describe('/PUT/task/:_id', () => {
    it('it should UPDATE a task given the id', (done) => {
      let task = new Task({
        _id: '12724',
        task_name: 'Shopping',
      });
      task.save((_error, task) => {
        chai
          .request(server)
          .put('/task/' + task._id)
          .send({ task_name: 'Shopping 2' })
          .end((_error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('task_name');
            done();
          });
      });
    });
  });

  describe('/DELETE/task/:_id', () => {
    it('it should DELETE a task given the id', (done) => {
      let task = new Task({
        _id: '18721',
        task_name: 'Shopping 2',
      });

      task.save((_error, task) => {
        chai
          .request(server)
          .delete('/task/' + task._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
          });
      });
    });
  });
});
