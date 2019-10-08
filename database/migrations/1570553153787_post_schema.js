'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments();
      table.string('titulo', 60).notNullable();
      table.text('descricao').notNullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
