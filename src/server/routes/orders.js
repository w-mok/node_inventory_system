
const Router = require('koa-router');
const queries = require('../db/queries/orders');
const inventoryQueries = require('../db/queries/inventory');

const router = new Router();
const BASE_URL = `/api/v1/orders`;

router.post(`${BASE_URL}`, async (ctx) => {
  try {
    const orders = await processOrder(ctx.request.body);
    if (orders.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: orders
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong.'
      };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

router.get(BASE_URL, async (ctx) => {
  try {
    const orders = await queries.getAllOrders();
    ctx.body = {
      status: 'success',
      data: orders
    };
  } catch (err) {
    console.log(err)
  }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const orders = await queries.getSingleOrder(ctx.params.id);
    console.log(orders);
    if (orders.length) {
      ctx.body = {
        status: 'success',
        data: orders
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That product does not exist.'
      };
    }
  } catch (err) {
    console.log(err)
  }
})

router.put(`${BASE_URL}/:id`, async (ctx) => {
  const new_quantity = ctx.request.body.new_quantity;
  if (new_quantity <= 0) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'new_quantity must be > 0.'
    };

    return;
  }

  try {
    // const success = await processOrderUpdate(ctx.params.id, ctx.request.body.new_quantity);
    const [order] = await queries.getSingleOrder(ctx.params.id);
    const success = await queries.trxUpdateOrder(order, ctx.request.body.new_quantity);
    if (success) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: null
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Could not update order.'
      };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const success = await processOrderDelete(ctx.params.id);
    if (success) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: null
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That product does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

async function processOrder(order) {
  const response = await inventoryQueries.getSingleInventory(order.inventories_id)
  const quantities = response[0].quantity_available;

  const diff = quantities - order.quantity_ordered;
  if (diff < 0) {
    return [] //refactor in future 
  }

  const inventoryRequestBody = {
    "quantity_available": diff
  };

  const inventoryResponse = await inventoryQueries.updateInventory(order.inventories_id, inventoryRequestBody)
  if (!inventoryResponse.length) {
    return inventoryResponse // bubble up to be caught as error
  }
  const orderResponse =  await queries.createOrder(order);
  return orderResponse
}

//If order is deleted, add the quantity back into the inventory
async function processOrderDelete(orderId) {
  const order = await queries.getSingleOrder(orderId);
  if (order.length <= 0) {
    return false
  }
  const response = await inventoryQueries.getSingleInventory(order[0].inventories_id);
  const currentTotal = response[0].quantity_available;

  const newTotal = order[0].quantity_ordered + currentTotal;
  
  const inventoryRequestBody = {
    "quantity_available": newTotal
  };

  const inventoryResponse = await inventoryQueries.updateInventory(order[0].inventories_id, inventoryRequestBody);

  const orderResponse =  await queries.deleteOrder(order[0].id);
  return true
}

async function processOrderUpdate(orderId, newQuantity) {
  if (!newQuantity || newQuantity <= 0) {
    return false;
  }

  const [order] = await queries.getSingleOrder(orderId);
  const [inventoryItem] = await inventoryQueries.getSingleInventory(order.inventories_id);
  const updatedTotal = (inventoryItem.quantity_available + order.quantity_ordered) - newQuantity;

  if (updatedTotal <= 0) {  
    return false;
  }

  const updatedInventory = {
    "quantity_available": updatedTotal
  };
  order.quantity_ordered = newQuantity;

  const inventoryResponse = await inventoryQueries.updateInventory(order.inventories_id, updatedInventory);
  const orderResponse =  await queries.updateOrder(order.id, order);

  return true;
}

module.exports = router;