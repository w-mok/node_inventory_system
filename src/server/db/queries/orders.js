const knex = require('../connection');

function createOrder(orders) {
  return knex('orders')
    .insert(orders)
    .returning('*');
}

function getAllOrders() {
  return knex('orders')
    .select('*');
}

function getSingleOrder(id) {
  return knex('orders')
    .select('*')
    .where({ id: parseInt(id) });
}

function updateOrder(id, order) {
  return knex('orders')
    .update(order)
    .where({ id: parseInt(id) })
    .returning('*');
}

function deleteOrder(id) {
  return knex('orders')
    .del()
    .where({ id: parseInt(id) })
    .returning('*');
}

function trxUpdateOrder(order, newQuantity) {
  // read order
  // read inventory
  // validate inventory exists
  // update inventory
  // update order
  return new Promise((resolve, reject) => {
    knex.transaction((trx) => {
      knex('inventories')
        .select('*')
        .transacting(trx)
        .where({ id: order.inventories_id})
        .then(inventories => {
          if (inventories.length <= 0) {
            trx.rollback();
            return resolve(false);
          }
          
          const [inventoryItem] = inventories;
          const updatedQuantity = (inventoryItem.quantity_available + order.quantity_ordered) - newQuantity;
          
          if (updatedQuantity < 0) {
            trx.rollback();
            return resolve(false);
          }

          order.quantity_ordered = newQuantity;
          inventoryItem.quantity_available = updatedQuantity;

          const promises = [];
          promises.push(knex('orders').update(order).transacting(trx).where({ id: order.id }));
          promises.push(knex('inventories').update(inventoryItem).transacting(trx).where({ id: inventoryItem.id }));

          return Promise.all(promises);
        })
        .then(trx.commit)
        .catch((err) => {
          trx.rollback()
          reject(err);
        });
    }).then(resolve).catch(reject);
  });
}

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  trxUpdateOrder
};