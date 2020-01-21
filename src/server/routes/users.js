const Router = require('koa-router');
const queries = require('../db/queries/users');

const router = new Router();
const BASE_URL = `/api/v1/users`;

router.get(BASE_URL, async (ctx) => {
  try {
    const users = await queries.getAllUsers();
    ctx.body = {
      status: 'success',
      data: users
    };
  } catch (err) {
    console.log(err)
  }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const users = await queries.getSingleUser(ctx.params.id);
    if (users.length) {
      ctx.body = {
        status: 'success',
        data: users
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That user does not exist.'
      };
    }
  } catch (err) {
    console.log(err)
  }
})

router.post(`${BASE_URL}`, async (ctx) => {
  try {
    const users = await queries.addUser(ctx.request.body);
    if (users.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: users
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'User cannot be added.'
      };
    }
  } catch (err) {
    console.log(err)
  }
})

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const users = await queries.updateUser(ctx.params.id, ctx.request.body);
    if (users.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: users
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That user does not exist.'
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
    const users = await queries.deleteUser(ctx.params.id);
    if (users.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: users
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That user does not exist.'
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