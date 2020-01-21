const knex = require('../connection');

function getAllUsers() {
  return knex('users')
    .select('*');
}

function getSingleUser(id) {
  return knex('users')
    .select('*')
    .where({ id: parseInt(id) });
}

function addUser(users) {
  return knex('users')
    .insert(users)
    .returning('*');
}

function updateUser(id, users) {
  return knex('users')
    .update(users)
    .where({ id: parseInt(id) })
    .returning('*');
}

function deleteUser(id) {
  return knex('users')
    .del()
    .where({ id: parseInt(id) })
    .returning('*');
}

module.exports = {
    getAllUsers,
    getSingleUser,
    addUser,
    updateUser,
    deleteUser
};