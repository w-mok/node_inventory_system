const Router = require('koa-router');
const queries = require('../db/queries/inventory');

const router = new Router();
const BASE_URL = `/api/v1/inventories`;

router.get(BASE_URL, async (ctx) => {
  try {
    const inventory = await queries.getAllInventory();
    ctx.body = {
      status: 'success',
      data: inventory
    };
  } catch (err) {
    console.log(err)
  }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const inventory = await queries.getSingleInventory(ctx.params.id);
    if (inventory.length) {
      ctx.body = {
        status: 'success',
        data: inventory
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

router.post(`${BASE_URL}`, async (ctx) => {
  try {
    const inventory = await queries.addInventory(ctx.request.body);
    if (inventory.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: inventory
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong.'
      };
    }
  } catch (err) {
    console.log(err)
  }
})

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const inventory = await queries.updateInventory(ctx.params.id, ctx.request.body);
    if (inventory.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: inventory
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That product does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const inventory = await queries.deleteProduct(ctx.params.id);
    if (inventory.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: inventory
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That product does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

module.exports = router;