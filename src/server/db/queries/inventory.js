const knex = require('../connection');

function getAllInventory() {
  return knex('inventories')
    .select('*');
}

function getSingleInventory(id) {
  return knex('inventories')
    .select('*')
    .where({ id: parseInt(id) });
}

function addInventory(inventory) {
  return knex('inventories')
    .insert(inventory)
    .returning('*');
}

function updateInventory(id, inventory) {
  return knex('inventories')
    .update(inventory)
    .where({ id: parseInt(id) })
    .returning('*');
}

function deleteProduct(id) {
  return knex('inventories')
    .del()
    .where({ id: parseInt(id) })
    .returning('*');
}

module.exports = {
  getAllInventory,
  getSingleInventory,
  addInventory,
  updateInventory,
  deleteProduct
};