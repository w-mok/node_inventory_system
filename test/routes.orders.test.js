process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : orders', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => { return knex.migrate.latest(); })
      .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });


});

// GET a ALL orders records
describe('GET /api/v1/orders', () => {
  it('should return all orders items', (done) => {
    chai.request(server)
      .get('/api/v1/orders')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [3 product objects]}
        // res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'user_id', 'user_email', 'inventories_id', 'quantity_ordered', 'order_status'
        );
        done();
      });
  });
});

// Throw an ERROR if the product DOES NOT exist
it('should throw an error if the product does not exist', (done) => {
  chai.request(server)
    .get('/api/v1/orders/9999999')
    .end((err, res) => {
      // there should an error
      should.exist(err);
      // there should be a 404 status code
      res.status.should.equal(404);
      // the response should be JSON
      res.type.should.equal('application/json');
      // the JSON response body should have a
      // key-value pair of {"status": "error"}
      res.body.status.should.eql('error');
      // the JSON response body should have a
      // key-value pair of {"message": "That product does not exist."}
      res.body.message.should.eql('That product does not exist.');
      done();
    });
});

// GET a SINGLE orders record
describe('GET /api/v1/orders/:id', () => {
  it('should respond with a single orders record', (done) => {
    chai.request(server)
      .get('/api/v1/orders/1')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 product object}
        res.body.data[0].should.include.keys(
          'user_id', 'user_email', 'inventories_id', 'quantity_ordered', 'order_status'
        );
        done();
      });
  });
});

// POST adding a product into the orders system  
describe('POST /api/v1/orders', () => {
  it('should return the product that was added', (done) => {
    chai.request(server)
      .post('/api/v1/orders')
      .send({
        customer_id: '000004',
        first_name: 'Jose',
        last_name: 'Doe',
        date_ordered: '2020-02-01',
        order_status: 'Pending'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 product object}
        res.body.data[0].should.include.keys(
          'customer_id', 'first_name', 'last_name', 'date_ordered', 'order_status'
        );
        done();
      });
  });
});

describe('PUT /api/v1/orders', () => {
  it('should return the product that was updated', (done) => {
    knex('orders')
      .select('*')
      .then((orders) => {
        const ordersObject = orders[0];
        chai.request(server)
          .put(`/api/v1/orders/${ordersObject.id}`)
          .send({
            quantity_available: 7
          })
          .end((err, res) => {
            // there should be no errors
            should.not.exist(err);
            // there should be a 200 status code
            res.status.should.equal(200);
            // the response should be JSON
            res.type.should.equal('application/json');
            // the JSON response body should have a
            // key-value pair of {"status": "success"}
            res.body.status.should.eql('success');
            // the JSON response body should have a
            // key-value pair of {"data": 1 product object}
            res.body.data[0].should.include.keys(
              'user_id', 'user_email', 'inventories_id', 'quantity_ordered', 'order_status'
            );
            // ensure the product was in fact updated
            const newordersObject = res.body.data[0];
            newordersObject.quantity_available.should.not.eql(ordersObject.quantity_available);
            done();
          });
      });
  });
});

describe('DELETE /api/v1/orders/:id', () => {
  it('should return the product that was deleted', (done) => {
    knex('orders')
      .select('*')
      .then((orders) => {
        const ordersObject = orders[0];
        const lengthBeforeDelete = orders.length;
        chai.request(server)
          .delete(`/api/v1/orders/${ordersObject.id}`)
          .end((err, res) => {
            // there should be no errors
            should.not.exist(err);
            // there should be a 200 status code
            res.status.should.equal(200);
            // the response should be JSON
            res.type.should.equal('application/json');
            // the JSON response body should have a
            // key-value pair of {"status": "success"}
            res.body.status.should.eql('success');
            // the JSON response body should have a
            // key-value pair of {"data": 1 product object}
            res.body.data[0].should.include.keys(
              'user_id', 'user_email', 'inventories_id', 'quantity_ordered', 'order_status'
            );
            // ensure the product was in fact deleted
            knex('orders').select('*')
              .then((updatedorders) => {
                updatedorders.length.should.eql(lengthBeforeDelete - 1);
                done();
              });
          });
      });
  });
  it('should throw an error if the product does not exist', (done) => {
    chai.request(server)
      .delete('/api/v1/orders/9999999')
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That product does not exist."}
        res.body.message.should.eql('That product does not exist.');
        done();
      });
  });
});