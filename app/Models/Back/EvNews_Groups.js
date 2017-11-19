'use strict'
const Model = use('Model')

class EvNews_Groups extends Model {
    static get table () {
      return 'ev_groups'
    }
    static get createdAtColumn () {
      return null
    }

    static get updatedAtColumn () {
      return null
    }
}
module.exports = EvNews_Groups
