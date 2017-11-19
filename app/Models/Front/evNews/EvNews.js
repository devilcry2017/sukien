'use strict'

const Model = use('Model')

class EvNews extends Model {
    static get table () {
      return 'ev_news'
    }

    groups () {
      return this.hasOne('App/Models/Front/evNews/EvNews_Groups', 'news_group', 'id');
    }

    event () {
      return this.hasMany('App/Models/Front/evNews/EvNewEvent', 'id', 'news_id');
    }

    getImages () {
      return this.hasMany('App/Models/Front/evNews/EvNewsImages', 'id', 'ev_news_id');
    }
}
module.exports = EvNews
