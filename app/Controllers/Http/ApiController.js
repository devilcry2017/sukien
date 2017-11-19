'use strict'
//system
const Systems = use('App/Models/Front/Systems')
const Language = use('App/Models/Front/Language')

const Menu = use('App/Models/Front/Menu')

//ev news
const EvNews = use('App/Models/Back/EvNews')
const EvNews_Groups = use('App/Models/Back/EvNews_Groups')
const EvNewsImages = use('App/Models/Back/EvNewsImages')

//mocule
const Banner = use('App/Models/Back/Banner')

//news
const News = use('App/Models/Front/news/News')
const NewsCategorys = use('App/Models/Front/news/NewsCategorys')

//products
const Products = use('App/Models/Front/products/Products')
const ProductsCategorys = use('App/Models/Front/products/ProductsCategorys')


const _ = use('lodash')

class ApiController {
    //language------------------------------------------------------------------
    async language ({ session, response }) {
      var language = await Language.query().where('status', 1).orderBy('arrange', 'asc').get()
      response.send(language)
    }
    //language------------------------------------------------------------------

    //system--------------------------------------------------------------------
    async system ({ session, response }) {
      var system = [];
      var logo = await Systems.query().where('systems_key', 'systems_logo').first()
      var favicon = await Systems.query().where('systems_key', 'systems_favicon').first()
      var address = await Systems.query().where('systems_key', 'systems_company_address').where('language_code', session.get('lang')).first()
      var email = await Systems.query().where('systems_key', 'systems_company_email').where('language_code', session.get('lang')).first()
      var phone = await Systems.query().where('systems_key', 'systems_company_phone').where('language_code', session.get('lang')).first()
      var hotline = await Systems.query().where('systems_key', 'systems_company_hotline').where('language_code', session.get('lang')).first()
      var taxcode = await Systems.query().where('systems_key', 'systems_company_taxcode').where('language_code', session.get('lang')).first()
      var company_name = await Systems.query().where('systems_key', 'systems_company_name').where('language_code', session.get('lang')).first()
      var website = await Systems.query().where('systems_key', 'systems_website').first()
      var copyright = await Systems.query().where('systems_key', 'systems_copyright').where('language_code', session.get('lang')).first()
      var googleMap = await Systems.query().where('systems_key', 'systems_google_map').first()


      system.push({logo:logo.systems_description})
      system.push({favicon:favicon.systems_description})
      system.push({address:address.systems_description})
      system.push({email:email.systems_description})
      system.push({phone:phone.systems_description})
      system.push({hotline:hotline.systems_description})
      system.push({taxcode:taxcode.systems_description})
      system.push({company_name:company_name.systems_description})
      system.push({website:website.systems_description})
      system.push({copyright:copyright.systems_description})
      system.push({googleMap:googleMap.systems_description})
      response.send(JSON.stringify(system, null, 2))
    }
    //system--------------------------------------------------------------------

    //ev news-------------------------------------------------------------------
    async evNews ({ session, response }) {
      var evNews = await EvNews.query().orderBy('id', 'desc')
                  .where('news_status', 1)
                  .with('groups')
                  .with('getImages')
                  .fetch()
      response.send(evNews)
    }


    async evNewsHightlightLimit ({ session, response, params}) {
      var evNewsHightlightLimit = await EvNews.query().orderBy('news_hightlights', 'desc')
                  .where('news_status', 1)
                  .with('groups')
                  .with('getImages')
                  .limit(params.limit)
                  .fetch()
      response.send(evNewsHightlightLimit)
    }

    //ev news where views
    async evNewsViewtLimit ({ session, response, params}) {
      var evNewsViewtLimit = await EvNews.query().orderBy('news_views', 'desc')
                  .where('news_status', 1)
                  .with('groups')
                  .with('getImages')
                  .limit(params.limit)
                  .fetch()
      response.send(evNewsViewtLimit)
    }
    //ev news lastest
    async evLastestNewsLimit ({ session, response, params}) {
      var evLastestNewsLimit = await EvNews.query().orderBy('id', 'desc')
                  .where('news_status', 1)
                  .with('groups')
                  .with('getImages')
                  .limit(params.limit)
                  .fetch()
      response.send(evLastestNewsLimit)
    }


    async evNewsGroup({ session, response, params}){
        const evNews_Groups = await EvNews_Groups.query().where('language_code',session.get('lang')).orderBy('group_sort', 'asc')
                             .fetch()
        response.send(evNews_Groups)
    }

    async evNewsEditImages({ session, response, params}){
        const id = params.id
        const evNewsImages = await EvNewsImages.query().where('ev_news_id',id).orderBy('ev_imgaes_sort', 'asc')
        response.send(evNewsImages)
    }
    //ev news-------------------------------------------------------------------

    //menu----------------------------------------------------------------------
    async menu ({ session, response }) {
      const menu = await Menu.query().where('language_code',session.get('lang')).orderBy('arrange', 'asc')
      var sorted = []
      function addItems(parent_id, level) {
              var children = _.filter(menu, { parent_id: parent_id })
        for(let child of children) {
              _.range(level).map(function() { child.cat_name = '|---- ' + child.cat_name })
              sorted.push(child)
              addItems(child.id, level + 1)
        }
      }
      addItems(0, 0);
      response.send(JSON.stringify(sorted, null, 2))
    }
    async menu_header ({ session, response }) {
      const menu = await Menu.query().where('language_code',session.get('lang')).where('group', 1).orderBy('arrange', 'asc')
      response.send(JSON.stringify(menu, null, 2))
    }
    async menu_footer ({ session, response }) {
      const menu = await Menu.query().where('language_code',session.get('lang')).where('group', 2).orderBy('arrange', 'asc')
      response.send(JSON.stringify(menu, null, 2))
    }
    //menu----------------------------------------------------------------------

    //news cat------------------------------------------------------------------
    async newsCat ({ session, response }) {
      const newsCategorys = await NewsCategorys.query().where('language_code',session.get('lang')).orderBy('id', 'desc')
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
    //news cat------------------------------------------------------------------

    //news----------------------------------------------------------------------
    async news ({ session, response }) {
      const news = await News.query().where('language_code',session.get('lang')).orderBy('id', 'desc')
      response.send(news)
    }
    async newsLastestLimit ({ session, response, params}) {
      const news = await News.query().where('language_code',session.get('lang')).limit(params.limit).orderBy('id', 'desc')
      response.send(news)
    }
    //news----------------------------------------------------------------------



    //banner--------------------------------------------------------------------
    async banner ({ session, response }) {
      const banner = await Banner.query().where('language_code',session.get('lang')).orderBy('banner_sort', 'asc')
      response.send(banner)
    }
    async banner_top ({ session, response }) {
      const banner = await Banner.query().where('language_code',session.get('lang')).where('banner_group',1).orderBy('banner_sort', 'asc').first()
      response.send(banner)
    }
    async banner_right ({ session, response }) {
      const banner = await Banner.query().where('language_code',session.get('lang')).where('banner_group',2).limit(4).orderBy('banner_sort', 'asc')
      response.send(banner)
    }
    //banner--------------------------------------------------------------------

    //product category----------------------------------------------------------
    async productsCat({ session, response, params}){

        const productsCat = await ProductsCategorys.query().where('language_code',session.get('lang')).orderBy('id', 'desc')
        var sorted = []
        function addItems(parent_id, level) {
                var children = _.filter(productsCat, { parent_id: parent_id })
          for(let child of children) {
                _.range(level).map(function() { child.cat_name = '|---- ' + child.cat_name })
                sorted.push(child)
                addItems(child.id, level + 1)
          }
        }

        addItems(0, 0);
        response.send(JSON.stringify(sorted, null, 2))
    }
    //product category----------------------------------------------------------

    //products------------------------------------------------------------------
    async products({ session, response, params}){
        const products = await Products.query().where('language_code',session.get('lang')).orderBy('id', 'desc')
        response.send(products)
    }
    //products------------------------------------------------------------------

    async products_colors(request, response, next){
        const ad_lang_active = await request.session.get('ad_lang_active')
        const colors = await Colors.query().where('language_code',ad_lang_active.language_code).orderBy('arrange', 'asc')
        response.send(colors)
    }
    async products_sizes(request, response, next){
        const ad_lang_active = await request.session.get('ad_lang_active')
        const sizes = await Sizes.query().where('language_code',ad_lang_active.language_code).orderBy('arrange', 'asc')
        response.send(sizes)
    }
    async products_weights(request, response, next){
        const ad_lang_active = await request.session.get('ad_lang_active')
        const weights = await Weights.query().where('language_code',ad_lang_active.language_code).orderBy('arrange', 'asc')
        response.send(weights)
    }
    async products_made_ins(request, response, next){
        const ad_lang_active = await request.session.get('ad_lang_active')
        const made_ins = await Made_ins.query().where('language_code',ad_lang_active.language_code).orderBy('arrange', 'asc')
        response.send(made_ins)
    }
}

module.exports = ApiController
