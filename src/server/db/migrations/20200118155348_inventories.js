exports.up = function(knex, Promise) {
    return knex.schema.createTable('inventories', function(table) {
      table.increments();
      table.string('title', 255).unique().notNullable();
      table.string('description').notNullable();
      table.integer('quantity_available').notNullable();
      table.decimal('price', 8, 2).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('inventories');
  };
  