'use strict'
const Model = use('Model')

class EvNewsImages extends Model {
    static get table () {
      return 'ev_news_images'
    }
    static get createdAtColumn () {
      return null
    }

    static get updatedAtColumn () {
      return null
    }
}
module.exports = EvNewsImages
