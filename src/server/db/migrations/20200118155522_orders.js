exports.up = function(knex, Promise) {
    return knex.schema.createTable('orders', function(table) {
      table.increments();
      table.integer('user_id').references('users.id');
      table.string ('user_email').references('users.email');
      table.integer('inventories_id').references('inventories.id');
      table.integer('quantity_ordered').notNullable();
      table.string('order_status').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })  
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('orders');
  };
  