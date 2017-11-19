'use strict'


const Database = use('Database')
const fs = require('fs')
const Helpers = use('Helpers')
const Env = use('Env')
const Validator = use('Validator')

const Language = use('App/Models/Back/Language')

const Systems = use('App/Models/Back/Systems')
const Currencys = use('App/Models/Back/Currencys')
const LoginHistorys = use('App/Models/Back/LoginHistorys')

//news
const NewsCategorys = use('App/Models/Back/NewsCategorys')
const News = use('App/Models/Back/News')

const ProductsCategorys = use('App/Models/Back/ProductsCategorys')
const Products = use('App/Models/Back/Products')
//const Recursive = require('recursive-readdir')
//const imagesss = await Recursive(Helpers.publicPath('images/upload'))
//console.log(imagesss)

//ev news
const EvNews = use('App/Models/Back/EvNews')
const EvNews_Groups = use('App/Models/Back/EvNews_Groups')
const Event = use('App/Models/Back/Event')
const EvNewEvent = use('App/Models/Back/EvNewEvent')
const EvNewsImages = use('App/Models/Back/EvNewsImages')


const { validate } = use('Validator')



var HOME_URL = 'http://localhost:3333';
var IMG_FOLDER = '/images/';

class BackController {

    async lang ({session, response, view}) {
        const View = use('View')
        session.put('lang_ad', 'vi')
        View.global('lang_ad_active',session.get('lang_ad'))

        var lang_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        View.global('lang_ad',lang_ad)
        View.global('url_admin', Env.get('HOST_DOMAIN')+'administrator/')
        View.global('url_host', Env.get('HOST_DOMAIN'))

        View.global('getForIndex', function (collection, index) {
           return collection[index]
        })
        response.redirect('/administrator/home')
    }

    async postLang (request, response) {
        const language_code = request.input('language_code')
        const ad_lang_active = await Database.from('language').where('status', 1).where('language_code', language_code).first()
        await request.session.put({'ad_lang_active':ad_lang_active})
        response.redirect('/administrator/home')
    }
    //filde upload--------------------------------------------------------------
    async files(request, response){
      request.csrfToken()
      const images = fs.readdirSync(Helpers.publicPath('images/upload'))
      var sorted = []
      for (let item of images){
          if(item.split('.').pop() === 'png'
          || item.split('.').pop() === 'jpg'
          || item.split('.').pop() === 'jpeg'
          || item.split('.').pop() === 'svg'){
              var abc = {
                    "image" : "/images/upload/"+item,
                    "folder" : '/'
              }
              sorted.push(abc)
          }else{
              const images2 = fs.readdirSync(Helpers.publicPath('images/upload/'+item))
              for (let items of images2){
                  if(items.split('.').pop() === 'png'
                  || items.split('.').pop() === 'jpg'
                  || items.split('.').pop() === 'jpeg'
                  || items.split('.').pop() === 'svg'){
                      var abc = {
                            "image" : "/images/upload/"+item+'/'+items,
                           "folder" : item
                      }
                      sorted.push(abc)
                  }
              }
          }
      }

      await response.send(sorted);
    }

    async upload_token (request, response, next) {
       const upload_token = request.csrfToken()
       response.json({'upload_token': upload_token})
    }

    async upload(request, response){
        const lang = await request.session.get('language_list')
        const ad_lang_active = await request.session.get('ad_lang_active')
        var data_lang = JSON.parse(fs.readFileSync('public/language/'+ad_lang_active.language_code+'/lang.json', 'utf8'));
        //upload file
        if(request.file('flFileUpload') && request.file('flFileUpload').clientName() !== ''){
            const flFileUpload = request.file('flFileUpload', {
                maxSize: '2mb',
                allowedExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg']
            })
            var d = new Date();
            var n = d.getTime();
            const fileName = 'upload_'+n+`.${flFileUpload.extension()}`
            const folder = request.input('txtFolderUpload')

            if(folder !== '/'){
              await flFileUpload.move(Helpers.publicPath('/images/upload/'+folder+'/'), fileName)
            }else{
              await flFileUpload.move(Helpers.publicPath('/images/upload/'), fileName)
            }
            response.redirect('back')
        }else{
            response.redirect('back')
        }
    }

    async delete_file(request, response){
        var url_del = Helpers.publicPath() + request.input('url_del')
        if(fs.existsSync(url_del)){
            fs.unlinkSync(url_del)
        }
        response.redirect('back')
    }

    async creat_folder(request, response){
        var folder = Helpers.publicPath('/images/upload/') + request.input('folder')
        if(!fs.existsSync(folder)){
            fs.mkdirSync(folder)
            var readStream = fs.createReadStream(Helpers.publicPath('/images/no-image.png'));
            var writeStream = fs.createWriteStream(folder+'/no-image.png');
            readStream.pipe(writeStream);
        }
        response.redirect('back')
    }

    async edit_folder(request, response){
      var folder = request.input('folder')
      var folder_edit = request.input('folder_edit')
      fs.renameSync(Helpers.publicPath('/images/upload/'+folder), Helpers.publicPath('/images/upload/'+folder_edit))
      response.redirect('back')
    }

    async delete_folder(request, response){
        var folder_del = Helpers.publicPath('/images/upload/') + request.input('folder_del')
        var images = fs.readdirSync(folder_del)
        for (let item of images){
          fs.unlinkSync(folder_del+'/'+item);
        }
        fs.rmdirSync(Helpers.publicPath('/images/upload/') + request.input('folder_del'))
        response.redirect('back')
    }
    //end filde upload----------------------------------------------------------

    //ev news-------------------------------------------------------------------
    async evNews({session,request, params, response, view}){
          var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

          return view.render('back.evNews.back_evNews',{
            evNews: 'active',
            btn_add: '/administrator/evNews/add',
            title: language_ad.ev_news,
            heading:language_ad.ev_news
          })
    }
    async evNews_add({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.evNews.evNews_add',{
         evNews: 'active',
         title: language_ad.ev_news_add,
         heading:language_ad.ev_news_add
       })
    }
    async evNews_add_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const postData = request.all()
        const rules = {
          txtName: 'required',
          txtPrice: 'required',
          txtEvContact: 'required',
          txtEvContactPhone: 'required'
        }
        const validation = await Validator.validate(postData, rules)
        if(request.input('txtPriceSale') > 0 && (request.input('txtPrice') <= request.input('txtPriceSale'))){
            await request.with({ error: data_lang.a_ev_price_error}).flash()
            response.redirect('back')
            return
        }

        if (validation.fails()) {
            await request.with({ error: data_lang.a_ms_error}).flash()
            response.redirect('back').with(postData)
        }else{

            const evNews = new EvNews()
            evNews.news_code = request.input('txtCode')
            evNews.language_code = ad_lang_active.language_code
            evNews.news_group = request.input('sltGroup')
            evNews.news_status = 1
            evNews.news_sort = request.input('txtArrange')

            evNews.news_price = request.input('txtPrice')
            evNews.news_price_new = request.input('txtPriceSale')
            evNews.news_people = request.input('txtEvContact')
            evNews.news_phone = request.input('txtEvContactPhone')

            evNews.news_views = request.input('txtViews')
            evNews.news_hightlights = request.input('txtHightlights')
            evNews.news_name = request.input('txtName')
            evNews.news_small_content = request.input('txtSmallDescription')
            evNews.news_content = request.input('txtDescription')
            evNews.news_title = request.input('txtMetaTitle')
            evNews.news_description = request.input('txtMetaDescription')
            evNews.news_keyword = request.input('txtMetaKeyword')
            await evNews.save()

            if(request.file('flImage') && request.file('flImage').clientName() !== ''){
                const flImage = request.file('flImage', {
                    maxSize: '2mb',
                    allowedExtensions: ['jpg', 'png', 'jpeg']
                })
                const fileName = flImage.clientName()
                await flImage.move(Helpers.publicPath('/images/evnews/'), fileName)

                const lastId = await EvNews.last()
                const evNews = await EvNews.findBy('id', lastId.id)
                evNews.fill({
                  news_image: flImage.clientName()
                })
                await evNews.save()
            }

            //category
            if(request.input('ckbCat') && request.input('ckbCat') !== ''){
                for(let val of request.input('ckbCat')) {
                    const lastId = await EvNews.last()
                    const evNewEvent =  new EvNewEvent()
                    evNewEvent.news_id = lastId.id
                    evNewEvent.event_id = val
                    await evNewEvent.save()
                }
            }
            //images detail
            if(request.file('flImageDetail') && request.file('flImageDetail').length > 0){
                const profilePics = request.file('flImageDetail')
                const lastId = await EvNews.last()
                for(let val of profilePics) {
                    const fileName = val.clientName()

                    const evNewsImages = new EvNewsImages()
                    evNewsImages.ev_news_id = lastId.id
                    evNewsImages.ev_imgaes_name = fileName
                    evNewsImages.ev_imgaes_description = fileName
                    evNewsImages.ev_imgaes_sort = 1
                    await evNewsImages.save()

                    await val.move(Helpers.publicPath('/images/evnews/details/'), fileName)
                }
            }

            response.redirect('/administrator/evNews')
        }
    }
    async evNews_edit({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = params.id
      const event_edit = await EvNews.query().where('language_code',session.get('lang_ad'))
                           .where('id', id)
                           .with('groups')
                           .with('event')
                           .first()
      const eventAll = await Event.query().where('language_code',session.get('lang_ad')).orderBy('event_sort', 'asc')
                            .fetch()

      const evNewEvent = await EvNewEvent.query()
                            .where('news_id',id)
                            .fetch()

      return view.render('back.evNews.evNews_edit',{
         evNews: 'active',
         event_edit: event_edit,
         eventAll: eventAll,
         evNewEvent: evNewEvent,
         title: language_ad.ev_news_edit,
         heading:language_ad.ev_news_edit
       })
    }
    async evNews_edit_post({session,request, params, response, view}){
          const ad_lang_active = await request.session.get('ad_lang_active')
          var data_lang = JSON.parse(fs.readFileSync('public/language/'+ad_lang_active.language_code+'/lang.json', 'utf8'))
          const postData = request.all()

          const rules = {
            txtName: 'required',
            txtPrice: 'required',
            txtEvContact: 'required',
            txtEvContactPhone: 'required'
          }
          const validation = await Validator.validate(postData, rules)
          if(request.input('txtPriceSale') > 0 && (request.input('txtPrice') <= request.input('txtPriceSale'))){
              await request.with({ error: data_lang.a_ev_price_error}).flash()
              response.redirect('back')
              return
          }

          if (validation.fails()) {
              await request.with({ error: data_lang.a_ms_error}).flash()
              response.redirect('back').with(postData)
          }else{
              const evNews = await EvNews.findBy('id', request.input('id'))
              evNews.fill({
                news_group: request.input('sltGroup'),
                news_status: request.input('sltStatus'),
                news_sort: request.input('txtArrange'),
                news_price: request.input('txtPrice'),
                news_price_new: request.input('txtPriceSale'),
                news_people: request.input('txtEvContact'),
                news_phone: request.input('txtEvContactPhone'),
                news_views: request.input('txtViews'),
                news_hightlights: request.input('txtHightlights'),
                news_name: request.input('txtName'),
                news_small_content: request.input('txtSmallDescription'),
                news_content: request.input('txtDescription'),
                news_title: request.input('txtMetaTitle'),
                news_description: request.input('txtMetaDescription'),
                news_keyword: request.input('txtMetaKeyword')
              })
              await evNews.save()

              if(request.file('flImage') && request.file('flImage').clientName() !== ''){
                  //delete image
                  var url_avatar = Helpers.publicPath('images/evnews/') + evNews.news_image
                  if(fs.existsSync(url_avatar)){
                      fs.unlinkSync(url_avatar)
                  }
                  //upload new image
                  const flImage = request.file('flImage', {
                      maxSize: '2mb',
                      allowedExtensions: ['jpg', 'png', 'jpeg']
                  })
                  const fileName = flImage.clientName()
                  await flImage.move(Helpers.publicPath('/images/evnews/'), fileName)
                  //update table
                  evNews.fill({
                    news_image: flImage.clientName()
                  })
                  await evNews.save()
              }

              //category
              if(request.input('ckbCat') && request.input('ckbCat') !== ''){
                  //delete cat
                  const evNewEvent = await EvNewEvent.query().where('news_id', request.input('id'))
                  if(evNewEvent.length > 0){
                      for (let item2 of evNewEvent){
                        const ev = await EvNewEvent.findBy('id', item2.id)
                        await ev.delete()
                      }
                  }

                  //add new cat
                  for(let val of request.input('ckbCat')) {
                      const evNewEvent =  new EvNewEvent()
                      evNewEvent.news_id = request.input('id')
                      evNewEvent.event_id = val
                      await evNewEvent.save()
                  }
              }

              await request.with({ error: data_lang.a_message_finish}).flash()
              response.redirect('/administrator/evNews')
         }
    }

    async evNews_add_images({session,request, params, response, view}){

        const flImage = request.file('fileUp', {
            maxSize: '2mb',
            allowedExtensions: ['jpg', 'png', 'jpeg']
        })
        const fileName = flImage.clientName()
        await flImage.move(Helpers.publicPath('/images/evnews/details'), fileName)

        const evNewsImages = new EvNewsImages()
        evNewsImages.ev_news_id = request.input('id')
        evNewsImages.ev_imgaes_name = fileName
        evNewsImages.ev_imgaes_description = request.input('txtTitle')
        evNewsImages.ev_imgaes_sort = request.input('txtNumber')
        await evNewsImages.save()
    }

    async evNews_edit_images({session,request, params, response, view}){
          const evNewsImages = await EvNewsImages.findBy('id', request.input('id'))
          evNewsImages.fill({
            ev_imgaes_description: request.input('ev_imgaes_description'),
            ev_imgaes_sort: request.input('ev_imgaes_sort')
          })
          await evNewsImages.save()
    }

    async evNews_delete_images({session,request, params, response, view}){
        const ev2 = await EvNewsImages.findBy('id', request.input('id'))
        var url_del = Helpers.publicPath('images/evnews/details/') + ev2.ev_imgaes_name
        if(fs.existsSync(url_del)){
            fs.unlinkSync(url_del)
        }
        await ev2.delete()
    }

    async evNews_del({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const cbk =  request.input('ckb')
        if(cbk === null){
          await request.with({ error: language_ad.a_ms_error_dell_notcheck}).flash()
          response.redirect('/administrator/evNews')
        }
        for (let item of cbk){
          const evNews = await EvNews.findBy('id', item)
          var url_avatar = Helpers.publicPath('images/evnews/') + evNews.news_image
          if(fs.existsSync(url_avatar)){
              fs.unlinkSync(url_avatar)
          }
          await evNews.delete()

          //delete news to event
          const evNewEvent = await EvNewEvent.query().where('news_id', item)
          if(evNewEvent.length > 0){
              for (let item2 of evNewEvent){
                const ev = await EvNewEvent.findBy('id', item2.id)
                await ev.delete()
              }
          }

          //delete evNews images detail
          const evNewsImages = await EvNewsImages.query().where('ev_news_id', item)
          if(evNewsImages.length > 0){
              for (let item3 of evNewsImages){
                const ev2 = await EvNewsImages.findBy('id', item3.id)
                var url_del = Helpers.publicPath('images/evnews/details/') + ev2.ev_imgaes_name
                if(fs.existsSync(url_del)){
                    fs.unlinkSync(url_del)
                }
                await ev2.delete()
              }
          }
        }
        response.redirect('/administrator/evNews')
    }

    //evgroups
    async evNewsGroup({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        return view.render('back.evNews.group.back_evNewsGroup',{
          evNews: 'active',
          btn_add: '/administrator/evNews/add',
          title: language_ad.ev_news,
          heading: language_ad.ev_news
        })
    }

    //evNewcat
    async evNewsCat({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        return view.render('back.evNews.cat.back_evNewsCat',{
          evNews: 'active',
          btn_add: '/administrator/evNews/add',
          title: language_ad.ev_news,
          heading: language_ad.ev_news
        })
    }

    //ev news-------------------------------------------------------------------

    //home----------------------------------------------------------------------
    async home ({session,request, response, view}) {
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.home.home',{
        active:'home',
        title: language_ad.a_template_system,
        heading: language_ad.a_template_system
      });
    }
    //home----------------------------------------------------------------------

    //system--------------------------------------------------------------------
    async system ({session,request, response, view}) {
       var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

       const systems_logo = await Systems.query().where('systems_key', 'systems_logo').first()
       const systems_favicon = await Systems.query().where('systems_key', 'systems_favicon').first()
       const systems_website = await Systems.query().where('systems_key', 'systems_website').first()
       const systems_google_analytic = await Systems.query().where('systems_key', 'systems_google_analytic').first()
       const systems_google_map = await Systems.query().where('systems_key', 'systems_google_map').first()

       const systems_company_name = await Systems.query().where('systems_key', 'systems_company_name')
       const systems_company_address = await Systems.query().where('systems_key', 'systems_company_address')
       const systems_company_taxcode = await Systems.query().where('systems_key', 'systems_company_taxcode')
       const systems_company_phone = await Systems.query().where('systems_key', 'systems_company_phone')
       const systems_company_hotline = await Systems.query().where('systems_key', 'systems_company_hotline')
       const systems_company_email = await Systems.query().where('systems_key', 'systems_company_email')
       const systems_copyright = await Systems.query().where('systems_key', 'systems_copyright')

       const ad_currency_default = await Currencys.query().where('currency_default', 1).first()
       const ad_currency_normal = await Currencys.query().where('currency_default', 0).first()

       var language_a = await Language.query().where('status', 1).orderBy('arrange', 'asc').get()

       return view.render('back.system.back_system',{
         system:'active',
         language_a:language_a,
         title: language_ad.a_m_system_config,
         heading:language_ad.a_m_system_config,
         systems_logo: systems_logo,
         systems_favicon: systems_favicon,
         systems_website: systems_website,
         systems_google_analytic: systems_google_analytic,
         systems_google_map: systems_google_map,
         ad_currency_default: ad_currency_default,
         ad_currency_normal: ad_currency_normal,
         systems_company_name: systems_company_name,
         systems_company_address: systems_company_address,
         systems_company_taxcode: systems_company_taxcode,
         systems_company_phone: systems_company_phone,
         systems_company_hotline: systems_company_hotline,
         systems_company_email: systems_company_email,
         systems_copyright:systems_copyright
       })
    }
    async systemPost(request, response){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const systems = new Systems()
      const currencys = new Currencys()
      //logo
      if(request.file('flLogo') && request.file('flLogo').clientName() !== ''){
          const flLogo = request.file('flLogo', {
              maxSize: '2mb',
              allowedExtensions: ['jpg', 'png', 'jpeg']
          })
          const fileName = flLogo.clientName()
          await flLogo.move(Helpers.publicPath('/images/logo/'), fileName)

          const systems = await Systems.findBy('systems_key', 'systems_logo')
          systems.fill({
            language_code: 'vi',
            systems_description: flLogo.clientName()
          })
          await systems.save()
      }
      //favicon
      if(request.file('flFavicon') && request.file('flFavicon').clientName() !== ''){
          const flFavicon = request.file('flFavicon', {
              maxSize: '2mb',
              allowedExtensions: ['png']
          })
          const fileName = flFavicon.clientName()
          await flFavicon.move(Helpers.publicPath('/images/fav/'), fileName)

          const systems = await Systems.findBy('systems_key', 'systems_favicon')
          systems.fill({
            language_code: 'vi',
            systems_description: flFavicon.clientName()
          })
          await systems.save()
      }

      //systems website
      if(request.input('txtWebsite')){
          const systems = await Systems.findBy('systems_key', 'systems_website')
          systems.fill({
            language_code: 'vi',
            systems_description: request.input('txtWebsite')
          })
          await systems.save()
      }else{
        const systems = await Systems.findBy('systems_key', 'systems_website')
        systems.fill({
          language_code: 'vi',
          systems_description: ''
        })
        await systems.save()
      }
      //google analytic
      if(request.input('txtGoogleAnalytic')){
        const systems = await Systems.findBy('systems_key', 'systems_google_analytic')
        systems.fill({
          language_code: 'vi',
          systems_description: request.input('txtGoogleAnalytic')
        })
        await systems.save()
      }else{
        const systems = await Systems.findBy('systems_key', 'systems_google_analytic')
        systems.fill({
          language_code: 'vi',
          systems_description: ''
        })
        await systems.save()
      }
      //google map
      if(request.input('txtGoogleMap')){
        const systems = await Systems.findBy('systems_key', 'systems_google_map')
        systems.fill({
          language_code: 'vi',
          systems_description: request.input('txtGoogleMap')
        })
        await systems.save()
      }else{
        const systems = await Systems.findBy('systems_key', 'systems_google_map')
        systems.fill({
          language_code: 'vi',
          systems_description: ''
        })
        await systems.save()
      }
      //currency
      if(request.input('txtCurrency')){
          const currency_code = request.input('txtCurrencyCode')
          for (let item of currency_code){
            const currencys = await Currencys.findBy('currency_code', item)
            currencys.fill({
              currency_code: item,
              currency_value: request.input('txtCurrency')[item]
            })
            await currencys.save()
          }
      }
      //company name
      if(request.input('txtCompanyStore')){
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_name', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: request.input('txtCompanyStore')[item.language_code]
              })
              await systems.save()
            }
          }
      }else{
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_name', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: ''
              })
              await systems.save()
            }
          }
      }
      //company address
      if(request.input('txtAddress')){
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_address', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: request.input('txtAddress')[item.language_code]
              })
              await systems.save()
            }
          }
      }else{
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_address', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: ''
              })
              await systems.save()
            }
          }
      }
      //cmpany email
      if(request.input('txtEmail')){
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_email', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: request.input('txtEmail')[item.language_code]
              })
              await systems.save()
            }
          }
      }else{
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_email', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: ''
              })
              await systems.save()
            }
          }
      }
      //company phone
      if(request.input('txtPhone')){
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_phone', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: request.input('txtPhone')[item.language_code]
              })
              await systems.save()
            }
          }
      }else{
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_phone', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: ''
              })
              await systems.save()
            }
          }
      }
      //company hotline
      if(request.input('txtHotline')){
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_hotline', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: request.input('txtHotline')[item.language_code]
              })
              await systems.save()
            }
          }
      }else{
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_hotline', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: ''
              })
              await systems.save()
            }
          }
      }
      //company taxcode
      if(request.input('txtTaxcode')){
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_taxcode', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: request.input('txtTaxcode')[item.language_code]
              })
              await systems.save()
            }
          }
      }else{
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_company_taxcode', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: ''
              })
              await systems.save()
            }
          }
      }
      //copyright
      if(request.input('txtCopyright')){
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_copyright', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: request.input('txtCopyright')[item.language_code]
              })
              await systems.save()
            }
          }
      }else{
          if(lang){
            for (let item of lang){
              const systems = await Systems.findBy({systems_key:'systems_copyright', language_code:item.language_code})
              systems.fill({
                language_code: item.language_code,
                systems_description: ''
              })
              await systems.save()
            }
          }
      }

      session.flash({ finish_ms: language_ad.a_ms_finish })
      response.redirect('/administrator/system')
    }
    //system--------------------------------------------------------------------

    //language------------------------------------------------------------------
    async language ({session,request, response, view}) {
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
      var language_list = await Language.query().where('status', 1).orderBy('arrange', 'asc').get()
       return view.render('back.language.back_language',{
         language: 'active',
        language_list :language_list,
         title: language_ad.a_m_system_lang,
         heading:language_ad.a_m_system_lang
       })
    }
    //language------------------------------------------------------------------

    //login history-------------------------------------------------------------
    async api_login_history({session, request, response, view}){
      var loginHistorys = await LoginHistorys.query().where('id', '>', 0).orderBy('id', 'desc')
      response.send(loginHistorys)
    }
    async login_history({session, request, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        session.put('flash_ms', 'OK')

        return view.render('back.loginHistory.loginHistory',{
           loginHistorys: 'active',
           title: language_ad.a_m_login_history,
           heading:language_ad.a_m_login_history
         })
    }
    async login_history_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
          session.flash({ error_del_ms: language_ad.a_ms_error_dell_notcheck })
          return response.redirect('back')
        }
        for (let item of all.ckb){
          const loginHistorys = await LoginHistorys.findBy('id', item)
          await loginHistorys.delete()
        }
        session.flash({ finish_ms: language_ad.a_ms_finish })
        response.redirect('/administrator/login_history')
    }
    //login history-------------------------------------------------------------

    //news category
    async news_categorys({session,request, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        return view.render('back.news_categorys.news_cat',{
           news_cat: 'active',
           title: language_ad.a_m_news_catgory,
           heading:language_ad.a_m_news_catgory,
           btn_add: '/administrator/news_categorys/add'
         })
    }
    async news_categorys_add({session,request,response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.news_categorys.cat_add',{
         news_cat: 'active',
         title: language_ad.a_m_news_catgory_add,
         heading:language_ad.a_m_news_catgory_add
       })
    }
    async news_categorys_add_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const all = request.all()
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : '* Tên danh mục không được để trống'
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          const newsCategorys = new NewsCategorys()
          newsCategorys.parent_id = all.sltParentId
          newsCategorys.language_code = session.get('lang_ad')
          newsCategorys.status = 1
          newsCategorys.arrange = all.txtArrange
          newsCategorys.views = all.txtViews
          newsCategorys.hightlights = all.txtHightlights
          newsCategorys.cat_name = all.txtName
          newsCategorys.small_description = all.txtSmallDescription
          newsCategorys.description = all.txtDescription
          newsCategorys.meta_title = all.txtMetaTitle
          newsCategorys.meta_description = all.txtMetaDescription
          newsCategorys.meta_keyword = all.txtMetaKeyword
          await newsCategorys.save()
          session.flash({ finish_ms: language_ad.a_ms_finish })
          response.redirect('/administrator/news_categorys')
        }
    }
    async news_categorys_edit({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = params.id
      const data_edit = await NewsCategorys.query().where('id', id).first()

      return view.render('back.news_categorys.cat_edit',{
         news_cat: 'active',
         title: language_ad.a_m_news_catgory_edit,
         heading:language_ad.a_m_news_catgory_edit,
         data_edit:data_edit
       })
    }
    async news_categorys_edit_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const all = request.all()
        const newsCategorys = await NewsCategorys.findBy('id', all.txtId)
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : '* Tên danh mục không được để trống'
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          newsCategorys.parent_id = all.sltParentId
          newsCategorys.language_code = session.get('lang_ad')
          newsCategorys.status = 1
          newsCategorys.arrange = all.txtArrange
          newsCategorys.views = all.txtViews
          newsCategorys.hightlights = all.txtHightlights
          newsCategorys.cat_name = all.txtName
          newsCategorys.small_description = all.txtSmallDescription
          newsCategorys.description = all.txtDescription
          newsCategorys.meta_title = all.txtMetaTitle
          newsCategorys.meta_description = all.txtMetaDescription
          newsCategorys.meta_keyword = all.txtMetaKeyword

          await newsCategorys.save()
          response.redirect('/administrator/news_categorys')
        }
    }
    async news_categorys_del({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
          session.flash({ error_del_ms: language_ad.a_ms_error_dell_notcheck })
          return response.redirect('back')
        }
        for (let item of all.ckb){
          const newsCategorys = await NewsCategorys.findBy('id', item)
          await newsCategorys.delete()
        }
        session.flash({ finish_ms: language_ad.a_ms_finish })
        response.redirect('/administrator/news_categorys')
    }
    //news
    async news({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        return view.render('back.news.news',{
           news_cat: 'active',
           btn_add: '/administrator/news/add',
           title: language_ad.a_m_news_list,
           heading:language_ad.a_m_news_list
         })
    }
    async news_add({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.news.news_add',{
         news_cat: 'active',
         title: language_ad.a_m_news_add,
         heading:language_ad.a_m_news_add
       })
    }
    async news_add_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : '* Tên tin tức không được để trống'
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
            const news = new News()
            news.cat_id = all.sltParentId
            news.language_code = session.get('lang_ad')
            news.status = 1
            news.arrange = all.txtArrange
            news.views = all.txtViews
            news.hightlights = all.txtHightlights
            news.news_name = all.txtName
            news.small_description = all.txtSmallDescription
            news.description = all.txtDescription
            news.meta_title = all.txtMetaTitle
            news.meta_description = all.txtMetaDescription
            news.meta_keyword = all.txtMetaKeyword
            await news.save()

            if(request.file('flImage') && request.file('flImage') !== ''){
                const flImage = request.file('flImage', {
                    types: ['image'],
                    size: '2mb'
                })
                await flImage.move(Helpers.publicPath('/images/news/'))

                const lastId = await News.last()
                const news = await News.findBy('id', lastId.id)
                news.news_image = flImage._fileName
                await news.save()
            }

            response.redirect('/administrator/news')
        }
    }
    async news_edit({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = params.id
      const data_edit = await News.query().where('id', id).first()

      return view.render('back.news.news_edit',{
         news_cat: 'active',
         title: language_ad.a_m_news_edit,
         heading:language_ad.a_m_news_edit,
         data_edit:data_edit
       })
    }
    async news_edit_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : '* Tên tin tức không được để trống'
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          const news = await News.query().where('id', all.txtId).first()
          news.cat_id = all.sltParentId
          news.language_code = session.get('lang_ad')
          news.status = 1
          news.arrange = all.txtArrange
          news.views = all.txtViews
          news.hightlights = all.txtHightlights
          news.news_name = all.txtName
          news.small_description = all.txtSmallDescription
          news.description = all.txtDescription
          news.meta_title = all.txtMetaTitle
          news.meta_description = all.txtMetaDescription
          news.meta_keyword = all.txtMetaKeyword

          await news.save()

          if(request.file('flImage') && request.file('flImage') !== ''){
              if(news.news_image !== ''){
                  const path_old = Helpers.publicPath('/images/news/'+news.news_image)
                  fs.unlinkSync(path_old)
              }

              const flImage = request.file('flImage', {
                  types: ['image'],
                  size: '2mb'
              })

              await flImage.move(Helpers.publicPath('/images/news/'))

              news.news_image = flImage._fileName
              await news.save()
          }
          response.redirect('/administrator/news')
        }
    }
    async news_del({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
          //await request.with({ error: data_lang.a_ms_error_dell_notcheck}).flash()
          return response.redirect('back')
        }
        for (let item of all.ckb){
          const news = await News.findBy('id', item)

          if(news.news_image !== ''){
              const path_old = Helpers.publicPath('/images/news/'+news.news_image)
              fs.unlinkSync(path_old)
          }

          await news.delete()
        }
        response.redirect('/administrator/news')
    }
    //products category
    async products_categorys(request, response){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        return view.render('back.products_categorys.products_categorys',{
           products: 'active',
           btn_add: '/administrator/products_categorys/add',
           title: language_ad.a_m_product_category,
           heading:language_ad.a_m_product_category
         })
    }
    async products_categorys_add(request, response){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.products_categorys.cat_add',{
         products: 'active',
         title: language_ad.a_m_product_category_add,
         heading:language_ad.a_m_product_category_add
       })
    }
    async products_categorys_add_post(request, response){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const postData = request.only('txtName')
        const rules = {
          txtName: 'required'
        }
        const validation = await Validator.validate(postData, rules)
        if (validation.fails()) {
            await request.with({ error: data_lang.a_ms_error}).flash()
            response.redirect('back').with(postData)
            return
        }else{
            const productsCategorys = new ProductsCategorys()
            productsCategorys.parent_id = request.input('sltParentId')
            productsCategorys.language_code = ad_lang_active.language_code
            productsCategorys.status = 1
            productsCategorys.arrange = request.input('txtArrange')
            productsCategorys.views = request.input('txtViews')
            productsCategorys.hightlights = request.input('txtHightlights')
            productsCategorys.cat_name = request.input('txtName')
            productsCategorys.small_description = request.input('txtSmallDescription')
            productsCategorys.description = request.input('txtDescription')
            productsCategorys.meta_title = request.input('txtMetaTitle')
            productsCategorys.meta_description = request.input('txtMetaDescription')
            productsCategorys.meta_keyword = request.input('txtMetaKeyword')
            await productsCategorys.save()
            response.redirect('/administrator/products_categorys')
        }
    }
    async products_categorys_edit(request, response){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = request.param('id')
      const data_edit = await ProductsCategorys.query().where('id', id).first()

      return view.render('back.products_categorys.cat_edit',{
         products: 'active',
         title: language_ad.a_m_product_category_edit,
         heading:language_ad.a_m_product_category_edit,
         data_edit:data_edit
       })
    }
    async products_categorys_edit_post(request, response){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const id = request.input('txtId')
        const productsCategorys = await ProductsCategorys.findBy('id', id)
        const postData = request.only('txtName')
        const rules = {
          txtName: 'required'
        }
        const validation = await Validator.validate(postData, rules)
        if (validation.fails()) {
            await request.with({ error: data_lang.a_ms_error}).flash()
            response.redirect('back').with(postData)
            return
        }else{
          productsCategorys.fill({
            parent_id:request.input('sltParentId'),
            language_code: ad_lang_active.language_code,
            status: request.input('sltStatus'),
            arrange:request.input('txtArrange'),
            views:request.input('txtViews'),
            hightlights: request.input('txtHightlights'),
            cat_name: request.input('txtName'),
            small_description: request.input('txtSmallDescription'),
            description: request.input('txtDescription'),
            meta_title: request.input('txtMetaTitle'),
            meta_description: request.input('txtMetaDescription'),
            meta_keyword: request.input('txtMetaKeyword')
          })
          await productsCategorys.save()
          response.redirect('/administrator/products_categorys')
        }
    }
    async products_categorys_del(request, response){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const cbk =  request.input('ckb')
        if(cbk === null){
          await request.with({ error: language_ad.a_ms_error_dell_notcheck}).flash()
          response.redirect('/administrator/products_categorys')
        }
        for (let item of cbk){
          const productsCategorys = await ProductsCategorys.findBy('id', item)
          await productsCategorys.delete()
        }
        response.redirect('/administrator/products_categorys')
    }
    //products
    async products(request, response){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        return view.render('back.products.back_prducts',{
           products: 'active',
           btn_add: '/administrator/products/add',
           title: language_ad.a_m_product_list,
           heading:language_ad.a_m_product_list
         })
    }
    async products_add(request, response){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.products.products_add',{
         products: 'active',
         title: language_ad.a_m_product_add,
         heading:language_ad.a_m_product_add
       })
    }
    async products_add_post(request, response){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const postData = request.only('txtName')
        const rules = {
          txtName: 'required'
        }
        const validation = await Validator.validate(postData, rules)
        if (validation.fails()) {
            await request.with({ error: data_lang.a_ms_error}).flash()
            response.redirect('back').with(postData)
            return
        }else{
            const products = new Products()
            products.cat_id = request.input('sltParentId')
            products.language_code = ad_lang_active.language_code
            products.status = 1
            products.arrange = request.input('txtArrange')
            products.views = request.input('txtViews')
            products.hightlights = request.input('txtHightlights')
            products.product_name = request.input('txtName')
            products.small_description = request.input('txtSmallDescription')
            products.description = request.input('txtDescription')
            products.meta_title = request.input('txtMetaTitle')
            products.meta_description = request.input('txtMetaDescription')
            products.meta_keyword = request.input('txtMetaKeyword')
            await products.save()

            if(request.file('flImage') && request.file('flImage').clientName() !== ''){
                const flImage = request.file('flImage', {
                    maxSize: '2mb',
                    allowedExtensions: ['jpg', 'png', 'jpeg']
                })
                const fileName = flImage.clientName()
                await flImage.move(Helpers.publicPath('/images/products/'), fileName)

                const lastId = await Products.last()
                const products = await Products.findBy('id', lastId.id)
                products.fill({
                  product_image: flImage.clientName()
                })
                await products.save()
            }

            response.redirect('/administrator/products')
        }
    }
    async products_edit(request, response){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = request.param('id')
      const data_edit = await Products.query().where('id', id).first()

      return view.render('back.products.products_edit',{
         products: 'active',
         title: language_ad.a_m_news_edit,
         heading:language_ad.a_m_news_edit,
         data_edit:data_edit
       })
    }
    async products_edit_post(request, response){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const id = request.input('txtId')
        const products = await Products.findBy('id', id)
        const postData = request.only('txtName')
        const rules = {
          txtName: 'required'
        }
        const validation = await Validator.validate(postData, rules)
        if (validation.fails()) {
            await request.with({ error: data_lang.a_ms_error}).flash()
            response.redirect('back').with(postData)
            return
        }else{
          products.fill({
            cat_id:request.input('sltParentId'),
            language_code: ad_lang_active.language_code,
            status: request.input('sltStatus'),
            arrange:request.input('txtArrange'),
            views:request.input('txtViews'),
            hightlights: request.input('txtHightlights'),
            product_name: request.input('txtName'),
            small_description: request.input('txtSmallDescription'),
            description: request.input('txtDescription'),
            meta_title: request.input('txtMetaTitle'),
            meta_description: request.input('txtMetaDescription'),
            meta_keyword: request.input('txtMetaKeyword')
          })
          await products.save()

          if(request.file('flImage') && request.file('flImage').clientName() !== ''){
              if(products.product_image !== ''){
                  const path_old = Helpers.publicPath('/images/products/'+products.product_image)
                  fs.unlinkSync(path_old)
              }
              const flImage = request.file('flImage', {
                  maxSize: '2mb',
                  allowedExtensions: ['jpg', 'png', 'jpeg']
              })
              const fileName = flImage.clientName()
              await flImage.move(Helpers.publicPath('/images/products/'), fileName)
              products.fill({
                product_image: flImage.clientName()
              })
              await products.save()
          }

          response.redirect('/administrator/products')
        }
    }
    async products_del(request, response){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const cbk =  request.input('ckb')
        if(cbk === null){
          await request.with({ error: language_ad.a_ms_error_dell_notcheck}).flash()
          response.redirect('/administrator/products')
        }
        for (let item of cbk){
          const products = await Products.findBy('id', item)
          await products.delete()
        }
        response.redirect('/administrator/products')
    }
}

module.exports = BackController
