'use strict'
const Database = use('Database')
const fs = require('fs')
const Env = use('Env')

//system
const Systems = use('App/Models/Front/Systems')
const Menu = use('App/Models/Front/Menu')

//ev news
const EvNews = use('App/Models/Front/evNews/EvNews')
const EvNews_Groups = use('App/Models/Front/evNews/EvNews_Groups')
const EvNewsImages = use('App/Models/Front/evNews/EvNewsImages')

//news
const News = use('App/Models/Front/news/News')
const NewsCategorys = use('App/Models/Front/news/NewsCategorys')


class FrontController {
    //home
    async home ({ session, view }) {
      const View = use('View')
      session.put('lang', 'vi')

      View.global('lang',session.get('lang'))
      var language = JSON.parse(fs.readFileSync('public/language/'+session.get('lang')+'/front.json', 'utf8'));
      View.global('language',language)
      View.global('url_host', Env.get('HOST_DOMAIN'))

      return view.render('front.home.home',{
        title: language.m_home
      });
    }

    async about ({ session, view }) {
      var des = "About";
      return view.render('front.about.about',{
        des: des
      });
    }

    //contact
    async contact ({ session, response, view}) {
        const googleMap = await Systems.query().where('systems_key', 'systems_google_map').first()
        const contact_info = await Menu.query().where('alias', 'lien-he').first()

        return view.render('front.contact.contact',{
          googleMap: googleMap,
          title: contact_info.meta_title,
          description: contact_info.meta_description,
          keyword: contact_info.meta_keyword
        });
    }

    //event
    async event ({ session, response, view}) {
        const news = 'xxxx';
        return view.render('front.event.event',{
          news: news
        });
    }

    //news
    async news ({ session, response, view, params }) {
        const news_info = await Menu.query().where('alias', 'tin-tuc').first()
        return view.render('front.news.list',{
          news_info: news_info,
          title: news_info.meta_title,
          description: news_info.meta_description,
          keyword: news_info.meta_keyword
        });
    }

    async slug ({ session, response, view, params }) {
      var slug = params.slug
      var evNews = await EvNews.query().where('news_status', 1).where('ev_alias', slug)
                  .with('groups').with('getImages').first()
      if(evNews){
          return view.render('front.evNews.evNews',{
            evNews: evNews,
            title: evNews.news_title,
            description: evNews.news_description,
            keyword: evNews.news_keyword
          });
      }

      //news
      const news = await News.query().where('status', 1).where('news_alias', slug)
                  .with('cat').first()
      if(news){
          return view.render('front.news.news',{
            news: news,
            title: news.meta_title,
            description: news.meta_description,
            keyword: news.meta_keyword
          });
      }

      //group
      const evNewsGroup = await EvNews_Groups.query().where('group_status', 1).where('alias', slug).first()
      if(evNewsGroup){
          const listNews = await EvNews.query().where('news_status', 1).where('news_group', evNewsGroup.id).orderBy('id', 'desc').get()
          const evNewsGroup_info = await Menu.query().where('alias', slug).first()
          return view.render('front.evNews.group',{
              listNews: listNews,
              name: evNewsGroup_info.cat_name,
              title: evNewsGroup_info.meta_title,
              description: evNewsGroup_info.meta_description,
              keyword: evNewsGroup_info.meta_keyword
          });
      }

    }
}

module.exports = FrontController
