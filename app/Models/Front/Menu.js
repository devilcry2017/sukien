'use strict'
const Model = use('Model')

class Menu extends Model {
  static get table () {
    return 'menu'
  }
  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
}
module.exports = Menu
