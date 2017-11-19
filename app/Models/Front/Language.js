'use strict'

const Model = use('Model')

class Language extends Model {
  static get table () {
    return 'language'
  }
}

module.exports = Language
