process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : inventory', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => { return knex.migrate.latest(); })
      .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });


});

// GET a ALL iventory records
describe('GET /api/v1/inventories', () => {
  it('should return all inventory items', (done) => {
    chai.request(server)
      .get('/api/v1/inventories')
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
        // key-value pair of {"data": [3 inventory objects]}
        // res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'title', 'description', 'price', 'quantity_available'
        );
        done();
      });
  });
});

// Throw an ERROR if the product DOES NOT exist
it('should throw an error if the product does not exist', (done) => {
  chai.request(server)
    .get('/api/v1/inventories/9999999')
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

// GET a SINGLE inventory record
describe('GET /api/v1/inventories/:id', () => {
  it('should respond with a single inventory record', (done) => {
    chai.request(server)
      .get('/api/v1/inventories/1')
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
          'title', 'description', 'price', 'quantity_available'
        );
        done();
      });
  });
});

// POST adding a product into the inventory system  
describe('POST /api/v1/inventories', () => {
  it('should return the product that was added', (done) => {
    chai.request(server)
      .post('/api/v1/inventories')
      .send({
        title: 'Test Product 4',
        description: 'dummy text',
        price: 39.99,
        quantity_available: 10
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
          'title', 'description', 'price', 'quantity_available'
        );
        done();
      });
  });
});

describe('PUT /api/v1/inventories', () => {
  it('should return the product that was updated', (done) => {
    knex('inventories')
      .select('*')
      .then((inventory) => {
        const inventoryObject = inventory[0];
        chai.request(server)
          .put(`/api/v1/inventories/${inventoryObject.id}`)
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
              'title', 'description', 'price', 'quantity_available'
            );
            // ensure the product was in fact updated
            const newInventoryObject = res.body.data[0];
            newInventoryObject.quantity_available.should.not.eql(inventoryObject.quantity_available);
            done();
          });
      });
  });
});

describe('DELETE /api/v1/inventories/:id', () => {
  it('should return the product that was deleted', (done) => {
    knex('inventories')
      .select('*')
      .then((inventory) => {
        const inventoryObject = inventory[0];
        const lengthBeforeDelete = inventory.length;
        chai.request(server)
          .delete(`/api/v1/inventories/${inventoryObject.id}`)
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
              'title', 'description', 'price', 'quantity_available'
            );
            // ensure the product was in fact deleted
            knex('inventories').select('*')
              .then((updatedInventory) => {
                updatedInventory.length.should.eql(lengthBeforeDelete - 1);
                done();
              });
          });
      });
  });
  it('should throw an error if the product does not exist', (done) => {
    chai.request(server)
      .delete('/api/v1/inventories/9999999')
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