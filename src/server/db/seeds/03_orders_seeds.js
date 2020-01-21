
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('orders').del()
      .then(function () {
        // Inserts seed entries
        return knex('orders').insert([
          {
            user_id: 1,
            user_email: 'johndoe@gmail.com',
            inventories_id: 5,
            quantity_ordered: 1,
            order_status: 'Processing'
          }
          // ,
          // {
          //   user_id: 1,
          //   user_email: 'johndoe@gmail.com',
          //   inventories_id: 4
          // },
          // {
          //   user_id: 1,
          //   user_email: 'johndoe@gmail.com',
          //   inventories_id: 3
          // },
          // {
          //   user_id: 2,
          //   user_email: 'jessedoe@gmail.com',
          //   inventories_id: 2
          // },
          // {
          //   user_id: 2,
          //   user_email: 'jessedoe@gmail.com',
          //   inventories_id: 1
          // },
          // {
          //   user_id: 2,
          //   user_email: 'jessedoe@gmail.com',
          //   inventories_id: 5
          // },
          // {
          //   user_id: 3,
          //   user_email: 'janedoe@gmail.com',
          //   inventories_id: 4
          // },
          // {
          //   user_id: 3,
          //   user_email: 'janedoe@gmail.com',
          //   inventories_id: 3
          // },
          // {
          //   user_id: 3,
          //   user_email: 'janedoe@gmail.com',
          //   inventories_id: 2
          // },
        ]);
      });
  };
  