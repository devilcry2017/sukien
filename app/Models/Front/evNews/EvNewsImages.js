'use strict'

const Model = use('Model')
class EvNewsImages extends Model {
    static get table () {
      return 'ev_news_images'
    }
    static get createTimestamp () {
      return null
    }
    static get updateTimestamp () {
      return null
    }
}
module.exports = EvNewsImages
