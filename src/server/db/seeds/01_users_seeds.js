
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
      .then(function () {
        // Inserts seed entries
        return knex('users').insert([
          {
            email: 'johndoe@gmail.com',
            password: 'password1',
          },
          {
            email: 'jessedoe@gmail.com',
            password: 'password2',
          },
          {
            email: 'janedoe@gmail.com',
            password: 'password3',
          }
        ]);
      });
  };
  