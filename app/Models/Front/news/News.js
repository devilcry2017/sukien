'use strict'
const Model = use('Model')

class News extends Model {
    static get table () {
      return 'news'
    }
    cat () {
      return this.hasOne('App/Models/Front/news/NewsCategorys', 'cat_id', 'id');
    }
}
module.exports = News
