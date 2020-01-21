
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('inventories').del()
      .then(function () {
        // Inserts seed entries
        return knex('inventories').insert([
          {
            title: '2019 Macbook Pro',
            description: 'Intel Core i7',
            price: 1999.99,
            quantity_available: 10
          },
          {
            title: 'Apple AirPod Pros',
            description: 'Supports wireless charging',
            price: 150.89,
            quantity_available: 10
          },
          {
            title: 'Apple Magic Mouse',
            description: 'Space Grey',
            price: 99.00,
            quantity_available: 10
          },
          {
            title: 'iPhone 11',
            description: '128GB Storage',
            price: 355.76,
            quantity_available: 10
          },
          {
            title: 'Magic Keyboard',
            description: 'Space Grey',
            price: 225.12,
            quantity_available: 10
          },
        ]);
      });
  };
  