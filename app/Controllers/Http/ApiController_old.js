'use strict'
const Database = use('Database')
const LoginHistorys = use('App/Model/Back/LoginHistorys')
const NewsCategorys = use('App/Model/Back/NewsCategorys')
const News = use('App/Model/Back/News')
const ProductsCategorys = use('App/Model/Back/ProductsCategorys')
const Products = use('App/Model/Back/Products')
const Colors = use('App/Model/Back/Colors')
const Sizes = use('App/Model/Back/Sizes')
const Weights = use('App/Model/Back/Weights')
const Made_ins = use('App/Model/Back/Made_ins')

//hr
const Peoples = use('App/Model/Back/Peoples')
const People_groups = use('App/Model/Back/People_groups')

//ev news
const EvNews = use('App/Model/Back/EvNews')
const EvNews_Groups = use('App/Model/Back/EvNews_Groups')
const Event = use('App/Model/Back/Event')
const EvNewEvent = use('App/Model/Back/EvNewEvent')
const EvNewsImages = use('App/Model/Back/EvNewsImages')



const _ = use('lodash')

class ApiController {
    * v1_0 (request, response, next) {
       const language_list = yield Database.from('language').where('status', 1).orderBy('arrange', 'asc').select('*')
       response.json({'language_list': language_list})
    }
    //back
    * loginHistorys(request, response, next){
      const loginHistorys = yield LoginHistorys.query().where('id', '>', 0).orderBy('id', 'desc')
      response.send(loginHistorys)
    }

    *newsCategorys(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const newsCategorys = yield NewsCategorys.query().where('id','>',0).orderBy('language_code', 'asc')
        var sorted = []
        function addItems(parent_id, level) {
                var children = _.filter(newsCategorys, { parent_id: parent_id })
          for(let child of children) {
                _.range(level).map(function() { child.cat_name = '|---- ' + child.cat_name })
                sorted.push(child)
                addItems(child.id, level + 1)
          }
        }

        addItems(0, 0);
        response.send(JSON.stringify(sorted, null, 2))
    }
    *newsCategorysLang(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const newsCategorys = yield NewsCategorys.query().where('language_code',ad_lang_active.language_code).orderBy('id', 'desc')
        var sorted = []
        function addItems(parent_id, level) {
                var children = _.filter(newsCategorys, { parent_id: parent_id })
          for(let child of children) {
                _.range(level).map(function() { child.cat_name = '|---- ' + child.cat_name })
                sorted.push(child)
                addItems(child.id, level + 1)
          }
        }

        addItems(0, 0);
        response.send(JSON.stringify(sorted, null, 2))
    }
    *news(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const news = yield News.query().where('language_code',ad_lang_active.language_code).orderBy('id', 'desc')
        response.send(news)
    }
    //product category
    *productsCategorys(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const newsCategorys = yield ProductsCategorys.query().where('language_code',ad_lang_active.language_code).orderBy('language_code', 'asc')
        var sorted = []
        function addItems(parent_id, level) {
                var children = _.filter(newsCategorys, { parent_id: parent_id })
          for(let child of children) {
                _.range(level).map(function() { child.cat_name = '|---- ' + child.cat_name })
                sorted.push(child)
                addItems(child.id, level + 1)
          }
        }

        addItems(0, 0);
        response.send(JSON.stringify(sorted, null, 2))
    }
    //products
    *products(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const products = yield Products.query().where('language_code',ad_lang_active.language_code).orderBy('id', 'desc')
        response.send(products)
    }
    *products_colors(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const colors = yield Colors.query().where('language_code',ad_lang_active.language_code).orderBy('arrange', 'asc')
        response.send(colors)
    }
    *products_sizes(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const sizes = yield Sizes.query().where('language_code',ad_lang_active.language_code).orderBy('arrange', 'asc')
        response.send(sizes)
    }
    *products_weights(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const weights = yield Weights.query().where('language_code',ad_lang_active.language_code).orderBy('arrange', 'asc')
        response.send(weights)
    }
    *products_made_ins(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const made_ins = yield Made_ins.query().where('language_code',ad_lang_active.language_code).orderBy('arrange', 'asc')
        response.send(made_ins)
    }

    * peoples(request, response, next){
      const ad_lang_active = yield request.session.get('ad_lang_active')
      const peoples = yield Peoples.query().where('language_code',ad_lang_active.language_code).orderBy('id', 'desc').with('people_groups').fetch()
      response.send(peoples)
    }

    //ev news-------------------------------------------------------------------
    * evNews(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const evNews = yield EvNews.query().where('language_code',ad_lang_active.language_code).orderBy('id', 'desc')
                             .with('groups')
                             .with('event')
                             .fetch()
        response.send(evNews)
    }
    * evNews_groups(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const evNews_Groups = yield EvNews_Groups.query().where('language_code',ad_lang_active.language_code).orderBy('group_sort', 'asc')
                             .fetch()
        response.send(evNews_Groups)
    }
    * evNews_events(request, response, next){
        const ad_lang_active = yield request.session.get('ad_lang_active')
        const event = yield Event.query().where('language_code',ad_lang_active.language_code).orderBy('event_sort', 'asc')
                             .fetch()
        response.send(event)
    }
    * evNews_edit_cat(request, response, next){
        const id = request.param('id')
        const evNewEvent = yield EvNewEvent.query().where('news_id',id)
        response.send(evNewEvent)
    }
    * evNews_edit_images(request, response, next){
        const id = request.param('id')
        const evNewsImages = yield EvNewsImages.query().where('ev_news_id',id).orderBy('ev_imgaes_sort', 'asc')
        response.send(evNewsImages)
    }
    //ev news-------------------------------------------------------------------

}

module.exports = ApiController
