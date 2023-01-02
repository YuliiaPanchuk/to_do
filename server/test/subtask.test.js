const mongoose = require('mongoose');
const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { it } = require('mocha');
const { Subtask } = require('../models/SubtaskSchema');

chai.use(chaiHttp);

describe('Subtasks', () => {
  beforeEach((done) => {
    Subtask.remove({}, () => {
      done();
    });
  });

  describe('/POST/task/:task_id/subtask', () => {
    it('should POST a subtask', (done) => {
      let subtask = {
        sub_task_name: 'Coffee',
      };

      chai
        .request(server)
        .post('/task/:task_id/subtask')
        .send(subtask)
        .end((_error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('sub_task_name').eql(subtask.sub_task_name);
          done();
        });
    });

    it('should POST a subtask', (done) => {
      let subtask = {
        sub_task_name: '',
      };

      chai
        .request(server)
        .post('/task/:task_id/subtask')
        .send(subtask)
        .end((_error, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('error').eql('The field cannot be empty');
          done();
        });
    });
  });

  describe('/PUT/subtask/:_id', () => {
    it('it should UPDATE a subtask given the id', (done) => {
      let subtask = new Subtask({
        _id: '123320',
        sub_task_name: 'Suggar',
      });

      subtask.save((_error, _subtask) => {
        chai
          .request(server)
          .put('/subtask/' + subtask._id)
          .send({ sub_task_name: 'Sugar' })
          .end((_error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('sub_task_name');
            done();
          });
      });
    });
  });

  describe('/DELETE//subtask/:_id', () => {
    it('it should DELETE by given id', (done) => {
      let subtask = new Subtask({
        _id: '111321',
        sub_task_name: 'Suggar',
      });

      subtask.save((_error, _subtask) => {
        chai
          .request(server)
          .delete('/subtask/' + subtask._id)
          .end((_error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            done();
          });
      });
    });
  });
});
