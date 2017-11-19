'use strict'

const Model = use('Model')
class EvNews_Groups extends Model {
    static get table () {
      return 'ev_groups'
    }
}
module.exports = EvNews_Groups
