'use strict'
const Model = use('Model')

class Currencys extends Model {
  static get table () {
    return 'currencys'
  }
}

module.exports = Currencys
