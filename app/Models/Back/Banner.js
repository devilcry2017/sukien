'use strict'
const Model = use('Model')

class Event extends Model {
    static get table () {
      return 'banner'
    }
    static get createdAtColumn () {
      return null
    }

    static get updatedAtColumn () {
      return null
    }
}
module.exports = Event
