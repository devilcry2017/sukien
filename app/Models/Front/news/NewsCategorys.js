'use strict'
const Model = use('Model')

class NewsCategorys extends Model {
  static get table () {
    return 'news_categorys'
  }
}
module.exports = NewsCategorys
