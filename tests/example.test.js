const addContext = require('mochawesome/addContext');

describe('test suite', () => {
  beforeEach(function () {
    addContext(this, 'some context')
  });
 
  afterEach(function () {
    addContext(this, {
      title: 'afterEach context',
      value: { a: 1 }
    });
  });
 
  it('should display with beforeEach and afterEach context', () => {
    // assert something
  });
});

describe('test suite', function () {
  it('should add context', function () {
    // context can be a simple string
    addContext(this, 'simple string');

    // context can be a url and the report will create a link
    addContext(this, 'http://www.url.com/pathname');

    // context can be an image url and the report will show it inline
    addContext(this, 'http://www.url.com/screenshot-maybe.jpg');

    // context can be an object with title and value properties
    addContext(this, {
      title: 'expected output',
      value: {
        a: 1,
        b: '2',
        c: 'd'
      }
    });
  })
});

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = 'http://localhost:8000';

describe('GET /', function () {

    it('should respond base url api with data.', function (done) {
        chai.request(server)
            .get('/')
            .send()
            .end(function (err, res) {

                // there should be no errors
                should.not.exist(err);

                // there should be a 200 status code
                res.should.have.status(200);

                // the response should be JSON
                res.type.should.be.equal('application/json');
                res.body.should.have.property('result');
                res.body.should.have.property('token');
                done();
            });
    });
});