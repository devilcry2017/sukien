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

//menu
const Menu = use('App/Models/Back/Menu')

//mocule
const Banner = use('App/Models/Back/Banner')

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

    async postLang ({session, response, view}) {
        const all = request.all()
        const language_code = all.language_code
        session.put('lang_ad', language_code)
        response.redirect('/administrator/home')
    }
    //filde upload--------------------------------------------------------------
    async files({session, request, response, view}){
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

    async upload_token ({request, response, next}) {
       const upload_token = request.get('csrfToken')
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

    //menu----------------------------------------------------------------------
    async menu({session,request, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        return view.render('back.menu.list',{
           menu: 'active',
           title: language_ad.menu_config,
           heading:language_ad.menu_config,
           btn_add: '/administrator/menu/add'
         })
    }
    async menu_add({session,request,response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.menu.add',{
         menu: 'active',
         title: language_ad.menu_config_add,
         heading:language_ad.menu_config_add
       })
    }
    async menu_add_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const all = request.all()
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.error_menu_name
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          const menu = new Menu()
          menu.alias = all.txtAlias
          menu.parent_id = all.sltParentId
          menu.language_code = session.get('lang_ad')
          menu.status = 1
          menu.arrange = all.txtArrange
          menu.group = all.sltGroup
          menu.cat_name = all.txtName
          menu.small_description = all.txtSmallDescription
          menu.description = all.txtDescription
          menu.meta_title = all.txtMetaTitle
          menu.meta_description = all.txtMetaDescription
          menu.meta_keyword = all.txtMetaKeyword
          await menu.save()
          session.flash({ finish_ms: language_ad.a_ms_finish })
          response.redirect('/administrator/menu')
        }
    }
    async menu_edit({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = params.id
      const data_edit = await Menu.query().where('id', id).first()

      return view.render('back.menu.edit',{
         menu: 'active',
         title: language_ad.menu_config_edit,
         heading:language_ad.menu_config_edit,
         data_edit:data_edit
       })
    }
    async menu_edit_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const all = request.all()
        const menu = await Menu.findBy('id', all.txtId)
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.error_menu_name
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          menu.alias = all.txtAlias
          menu.parent_id = all.sltParentId
          menu.language_code = session.get('lang_ad')
          menu.status = all.sltStatus
          menu.arrange = all.txtArrange
          menu.group = all.sltGroup
          menu.cat_name = all.txtName
          menu.small_description = all.txtSmallDescription
          menu.description = all.txtDescription
          menu.meta_title = all.txtMetaTitle
          menu.meta_description = all.txtMetaDescription
          menu.meta_keyword = all.txtMetaKeyword
          await menu.save()

          session.flash({ finish_ms: language_ad.a_ms_finish })
          response.redirect('/administrator/menu')
        }
    }
    async menu_del({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
          session.flash({ error_del_ms: language_ad.a_ms_error_dell_notcheck })
          return response.redirect('back')
        }
        for (let item of all.ckb){
          const menu = await Menu.findBy('id', item)
          await menu.delete()
        }
        session.flash({ finish_ms: language_ad.a_ms_finish })
        response.redirect('/administrator/menu')
    }
    //menu----------------------------------------------------------------------

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
        const all = request.all()

        const rules = {
          txtName: 'required',
          txtPrice: 'required',
          txtEvContact: 'required',
          txtEvContactPhone: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.er_news_name_blank,
          'txtPrice.required' : language_ad.er_price_blank,
          'txtEvContact.required' : language_ad.er_contact_blank,
          'txtEvContactPhone.required' : language_ad.er_contact_phone_blank
        }
        const validation = await validate(request.all(), rules, messages)

        if(all.txtPriceSale > 0 && (all.txtPriceSale >= all.txtPrice)){
            session.flash({ error_ms_price_sale: language_ad.a_ev_price_error })
            return response.redirect('back')
        }

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
            const evNews = new EvNews()
            evNews.news_code = all.txtCode
            evNews.language_code = session.get('lang_ad')
            evNews.news_group = all.sltGroup
            evNews.news_status = 1
            evNews.news_sort = all.txtArrange

            evNews.news_price = all.txtPrice
            evNews.news_price_new = all.txtPriceSale
            evNews.news_people = all.txtEvContact
            evNews.news_phone = all.txtEvContactPhone

            evNews.news_views = all.txtViews
            evNews.news_hightlights = all.txtHightlights
            evNews.news_name = all.txtName
            evNews.ev_alias = all.txtAlias
            evNews.news_small_content = all.txtSmallDescription
            evNews.news_content = all.txtDescription
            evNews.news_title = all.txtMetaTitle
            evNews.news_description = all.txtMetaDescription
            evNews.news_keyword = all.txtMetaKeyword
            await evNews.save()

            //avatar
            const flImage = request.file('flImage', {
              types: ['image'],
              size: '2mb'
            })
            if(flImage) {
              const fileName = Math.floor(Math.random()*900000000) + 100000000+'-'+`${flImage._clientName}`
              await flImage.move(use('Helpers').publicPath('/images/evnews/'), { name: fileName })
              evNews.news_image = flImage._fileName
              await evNews.save()
            }

            //images detail
            const flImageDetail = request.file('flImageDetail', {
              types: ['image'],
              size: '2mb'
            })

            if(flImageDetail) {
                await flImageDetail.moveAll(use('Helpers').publicPath('/images/evnews/details/'), file => {
                   const fileName = Math.floor(Math.random()*900000000) + 100000000+'-'+`${file._clientName}`
                  return { name: fileName }
                })

                for(let val of flImageDetail.movedList()) {
                    const evNewsImages =  new EvNewsImages()
                    evNewsImages.ev_news_id = evNews.id
                    evNewsImages.ev_imgaes_name = val.fileName
                    evNewsImages.ev_imgaes_description = val.fileName
                    evNewsImages.ev_imgaes_sort = 1
                    await evNewsImages.save()
                }
            }

            session.flash({ finish_ms: language_ad.a_ms_finish })
            response.redirect('/administrator/evNews')
        }
    }
    async evNews_edit({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = params.id
      const event_edit = await EvNews.query().where('language_code',session.get('lang_ad'))
                           .where('id', id)
                           .with('groups')                           
                           .first()

      return view.render('back.evNews.evNews_edit',{
         evNews: 'active',
         event_edit: event_edit,
         title: language_ad.ev_news_edit,
         heading:language_ad.ev_news_edit
       })
    }
    async evNews_edit_post({session,request, params, response, view}){
          var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
          const all = request.all()

          const rules = {
            txtName: 'required',
            txtPrice: 'required',
            txtEvContact: 'required',
            txtEvContactPhone: 'required'
          }
          const messages = {
            'txtName.required' : language_ad.er_news_name_blank,
            'txtPrice.required' : language_ad.er_price_blank,
            'txtEvContact.required' : language_ad.er_contact_blank,
            'txtEvContactPhone.required' : language_ad.er_contact_phone_blank
          }
          const validation = await validate(request.all(), rules, messages)

          if(all.txtPriceSale > 0 && (all.txtPriceSale >= all.txtPrice)){
              session.flash({ error_ms_price_sale: language_ad.a_ev_price_error })
              return response.redirect('back')
          }

          if (validation.fails()) {
            session.withErrors(validation.messages()).flashExcept()
            return response.redirect('back')
          }else{
              const evNews = await EvNews.findBy('id', all.id)
              evNews.news_code = all.txtCode
              evNews.language_code = session.get('lang_ad')
              evNews.news_group = all.sltGroup
              evNews.news_status = all.sltStatus
              evNews.news_sort = all.txtArrange

              evNews.news_price = all.txtPrice
              evNews.news_price_new = all.txtPriceSale
              evNews.news_people = all.txtEvContact
              evNews.news_phone = all.txtEvContactPhone

              evNews.news_views = all.txtViews
              evNews.news_hightlights = all.txtHightlights
              evNews.news_name = all.txtName
              evNews.ev_alias = all.txtAlias
              evNews.news_small_content = all.txtSmallDescription
              evNews.news_content = all.txtDescription
              evNews.news_title = all.txtMetaTitle
              evNews.news_description = all.txtMetaDescription
              evNews.news_keyword = all.txtMetaKeyword
              await evNews.save()

              //avatar
              const flImage = request.file('flImage', {
                types: ['image'],
                size: '2mb'
              })
              if(flImage && flImage._clientName !== '') {
                //delete image
                if(evNews.news_image != ''){
                    var url_avatar = Helpers.publicPath('images/evnews/') + evNews.news_image
                    if(fs.existsSync(url_avatar)){
                        fs.unlinkSync(url_avatar)
                    }
                }
                const fileName = Math.floor(Math.random()*900000000) + 100000000+'-'+`${flImage._clientName}`
                await flImage.move(use('Helpers').publicPath('/images/evnews/'), { name: fileName })

                evNews.news_image = flImage._fileName
                await evNews.save()
              }

              session.flash({ finish_ms: language_ad.a_ms_finish })
              response.redirect('/administrator/evNews')
         }
    }
    async evNews_add_images({session,request, params, response, view}){
        const all = request.all()
        //avatar
        const flImage = request.file('fileUp', {
          types: ['image'],
          size: '2mb'
        })
        if(flImage) {
          const fileName = Math.floor(Math.random()*900000000) + 100000000+'-'+`${flImage._clientName}`
          await flImage.move(use('Helpers').publicPath('/images/evnews/details/'), { name: fileName })

          const evNewsImages = new EvNewsImages()
          evNewsImages.ev_news_id = all.id
          evNewsImages.ev_imgaes_name = flImage._fileName
          evNewsImages.ev_imgaes_description = all.txtTitle
          evNewsImages.ev_imgaes_sort = all.txtNumber
          await evNewsImages.save()
        }
    }
    async evNews_edit_images({session,request, params, response, view}){
          const all = request.all()
          const evNewsImages = await EvNewsImages.findBy('id', all.id)
          evNewsImages.ev_imgaes_description = all.ev_imgaes_description
          evNewsImages.ev_imgaes_sort = all.ev_imgaes_sort
          await evNewsImages.save()
    }
    async evNews_delete_images({session,request, params, response, view}){
        const all = request.all()
        const ev2 = await EvNewsImages.findBy('id', all.id)
        var url_del = Helpers.publicPath('images/evnews/details/') + ev2.ev_imgaes_name
        if(fs.existsSync(url_del)){
            fs.unlinkSync(url_del)
        }
        await ev2.delete()
    }
    async evNews_del({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
            session.flash({ error_del_ms: language_ad.a_ms_error_dell_notcheck })
            return response.redirect('back')
        }
        for (let item of all.ckb){
            const evNews = await EvNews.findBy('id', item)
            if(evNews.news_image !== ''){
                var url_avatar = Helpers.publicPath('images/evnews/') + evNews.news_image
                if(fs.existsSync(url_avatar)){
                    fs.unlinkSync(url_avatar)
                }
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
        session.flash({ finish_ms: language_ad.a_ms_finish })
        response.redirect('/administrator/evNews')
    }

    //evgroups
    async evNewsGroup({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        return view.render('back.evNews.group.back_evNewsGroup',{
          evNews: 'active',
          btn_add: '/administrator/evNews/add',
          title: language_ad.ev_news_group,
          heading: language_ad.ev_news_group
        })
    }
    async evNewsGroupAdd({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const all = request.all()
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.ev_type_error
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
            const evNews_Groups = new EvNews_Groups()
            evNews_Groups.language_code = session.get('lang_ad')
            evNews_Groups.group_type = all.sltType
            evNews_Groups.group_status = 1
            evNews_Groups.group_sort = 1
            evNews_Groups.group_description = all.txtName
            evNews_Groups.alias = all.txtName
            await evNews_Groups.save()
            session.flash({ finish_ms: language_ad.a_ms_finish })
            response.redirect('/administrator/evNewsGroup')
        }
    }
    async evNewsGroupEdit({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = params.id
      const data_edit = await EvNews_Groups.query().where('id', id).first()

      return view.render('back.evNews.group.group_edit',{
         evNews: 'active',
         title: language_ad.ev_group_edit,
         heading:language_ad.ev_group_edit,
         data_edit:data_edit
       })
    }
    async evNewsGroupEdit_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const all = request.all()
        const evNews_Groups = await EvNews_Groups.findBy('id', all.txtId)
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.ev_type_error
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          evNews_Groups.group_type = all.sltGroup
          evNews_Groups.group_status = all.sltStatus
          evNews_Groups.group_sort = all.txtArrange
          evNews_Groups.group_description = all.txtName
          evNews_Groups.alias = all.txtAlias
          await evNews_Groups.save()

          session.flash({ finish_ms: language_ad.a_ms_finish })
          response.redirect('/administrator/evNewsGroup')
        }
    }
    async evNewsGroupDel({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
          session.flash({ error_del_ms: language_ad.a_ms_error_dell_notcheck })
          return response.redirect('back')
        }
        for (let item of all.ckb){
          const evNews_Groups = await EvNews_Groups.findBy('id', item)
          await evNews_Groups.delete()
        }
        session.flash({ finish_ms: language_ad.a_ms_finish })
        response.redirect('/administrator/evNewsGroup')
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
    async systemPost({session,request, response, params, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const all = request.all()
      //logo
      const flLogo = request.file('flLogo', {
        types: ['image'],
        size: '2mb'
      })
      if(flLogo && flLogo._clientName !== '') {
        const logo = await Systems.findBy('systems_key', 'systems_logo');
        if(logo.systems_description !== ''){
            const path_logo = Helpers.publicPath('/images/logo/'+logo.systems_description)
            fs.unlink(path_logo)
        }
        const flLogo = request.file('flLogo', {
            types: ['image'],
            size: '2mb'
        })
        await flLogo.move(Helpers.publicPath('/images/logo/'))
        logo.systems_description = flLogo._fileName;
        await logo.save();
      }

      //favicon
      const flFavicon = request.file('flFavicon', {
        types: ['image'],
        size: '2mb'
      })
      if(flFavicon && flFavicon._clientName !== '') {
        const fav = await Systems.findBy('systems_key', 'systems_favicon');
        if(fav.systems_description !== ''){
            const path_fav = Helpers.publicPath('/images/fav/'+fav.systems_description)
            fs.unlink(path_fav)
        }
        const flFavicon = request.file('flFavicon', {
            types: ['image'],
            size: '2mb'
        })
        await flFavicon.move(Helpers.publicPath('/images/fav/'))

        fav.systems_description = flFavicon._fileName;
        await fav.save();
      }

      //website
      const website = await Systems.findBy('systems_key', 'systems_website');
      website.systems_description = all.txtWebsite;
      await website.save();
      //google map
      const googlemap = await Systems.findBy('systems_key', 'systems_google_map');
      googlemap.systems_description = all.txtGoogleMap;
      await googlemap.save();
      //google analytic
      const googleanalytic = await Systems.findBy('systems_key', 'systems_google_analytic');
      googleanalytic.systems_description = all.txtGoogleAnalytic;
      await googleanalytic.save();
      //currency
      const currencys = await Currencys.findBy('currency_default', 0);
      currencys.currency_value = all.txtCurrency;
      await currencys.save();

      const language_list = await Language.query().where('status', 1).orderBy('arrange', 'asc').get()
      if(language_list){
        for (let item of language_list){
          //company name
          const name = await Systems.findBy({systems_key:'systems_company_name', language_code:item.language_code})
          name.systems_description = all.txtCompanyStore[item.language_code]
          await name.save()
          //address
          const address = await Systems.findBy({systems_key:'systems_company_address', language_code:item.language_code})
          address.systems_description = all.txtAddress[item.language_code]
          await address.save()
          //email
          const email = await Systems.findBy({systems_key:'systems_company_email', language_code:item.language_code})
          email.systems_description = all.txtEmail[item.language_code]
          await email.save()
          //phone
          const phone = await Systems.findBy({systems_key:'systems_company_phone', language_code:item.language_code})
          phone.systems_description = all.txtPhone[item.language_code]
          await phone.save()
          //hotline
          const hotline = await Systems.findBy({systems_key:'systems_company_hotline', language_code:item.language_code})
          hotline.systems_description = all.txtHotline[item.language_code]
          await hotline.save()
          //taxcode
          const taxcode = await Systems.findBy({systems_key:'systems_company_taxcode', language_code:item.language_code})
          taxcode.systems_description = all.txtTaxcode[item.language_code]
          await taxcode.save()
          //copyright
          const copyright = await Systems.findBy({systems_key:'systems_copyright', language_code:item.language_code})
          copyright.systems_description = all.txtCopyright[item.language_code]
          await copyright.save()
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

    //news category-------------------------------------------------------------
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
          'txtName.required' : language_ad.error_cat
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
          newsCategorys.cat_alias = all.txtAlias
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
          'txtName.required' : language_ad.error_cat
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          newsCategorys.parent_id = all.sltParentId
          newsCategorys.language_code = session.get('lang_ad')
          newsCategorys.status = all.sltStatus
          newsCategorys.arrange = all.txtArrange
          newsCategorys.views = all.txtViews
          newsCategorys.hightlights = all.txtHightlights
          newsCategorys.cat_name = all.txtName
          newsCategorys.cat_alias = all.txtAlias
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
    //news category-------------------------------------------------------------

    //news----------------------------------------------------------------------
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
          'txtName.required' : language_ad.error_news_name
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
            news.news_alias = all.txtAlias
            news.small_description = all.txtSmallDescription
            news.description = all.txtDescription
            news.meta_title = all.txtMetaTitle
            news.meta_description = all.txtMetaDescription
            news.meta_keyword = all.txtMetaKeyword
            await news.save()

            const flImage = request.file('flImage', {
              types: ['image'],
              size: '2mb'
            })

            if(flImage) {
              const fileName = Math.floor(Math.random()*900000000) + 100000000+'-'+`${flImage._clientName}`
              await flImage.move(use('Helpers').publicPath('/images/news/'), { name: fileName })

              news.news_image = flImage._fileName
              await news.save()
            }

            session.flash({ finish_ms: language_ad.a_ms_finish })
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
          'txtName.required' : language_ad.error_news_name
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
          news.news_alias = all.txtAlias
          news.small_description = all.txtSmallDescription
          news.description = all.txtDescription
          news.meta_title = all.txtMetaTitle
          news.meta_description = all.txtMetaDescription
          news.meta_keyword = all.txtMetaKeyword

          await news.save()

          const flImage = request.file('flImage', {
            types: ['image'],
            size: '2mb'
          })

          if(flImage && flImage._clientName !== '') {
            if(news.news_image !== ''){
                const path_old = Helpers.publicPath('/images/news/'+news.news_image)
                fs.unlinkSync(path_old)
                //await Helpers.promisify(fs.unlink(path_old))
            }
            const fileName = Math.floor(Math.random()*900000000) + 100000000+'-'+`${flImage._clientName}`
            await flImage.move(use('Helpers').publicPath('/images/news/'), { name: fileName })

            news.news_image = flImage._fileName
            await news.save()
          }

          session.flash({ finish_ms: language_ad.a_ms_finish })
          response.redirect('/administrator/news')
        }
    }
    async news_del({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
          session.flash({ error_del_ms: language_ad.a_ms_error_dell_notcheck })
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
        session.flash({ finish_ms: language_ad.a_ms_finish })
        response.redirect('/administrator/news')
    }
    //news----------------------------------------------------------------------


    //banner--------------------------------------------------------------------
    async banner({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        return view.render('back.extension.banner.list',{
           module: 'active',
           btn_add: '/administrator/banner/add',
           title: language_ad.banner,
           heading:language_ad.banner
         })
    }
    async banner_add({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.extension.banner.add',{
         banner: 'active',
         title: language_ad.banner_add,
         heading:language_ad.banner_add
       })
    }
    async banner_add_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.banner_error
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
            const banner = new Banner()
            banner.banner_group = all.sltGroup
            banner.language_code = session.get('lang_ad')
            banner.banner_status = 1
            banner.banner_sort = all.txtArrange
            banner.banner_name = all.txtName
            banner.banner_alias = all.txtAlias
            banner.banner_description = all.txtSmallDescription
            await banner.save()

            const flImage = request.file('flImage', {
              types: ['image'],
              size: '2mb'
            })

            if(flImage) {
              const fileName = Math.floor(Math.random()*900000000) + 100000000+'-'+`${flImage._clientName}`
              await flImage.move(use('Helpers').publicPath('/images/banner/'), { name: fileName })

              banner.banner_image = flImage._fileName
              await banner.save()
            }

            session.flash({ finish_ms: language_ad.a_ms_finish })
            response.redirect('/administrator/banner')
        }
    }
    async banner_edit({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = params.id
      const data_edit = await Banner.query().where('id', id).first()

      return view.render('back.extension.banner.edit',{
         news_cat: 'active',
         title: language_ad.banner_edit,
         heading:language_ad.banner_edit,
         data_edit:data_edit
       })
    }
    async banner_edit_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.error_news_name
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          const banner = await Banner.query().where('id', all.txtId).first()
          banner.banner_group = all.sltGroup
          banner.language_code = session.get('lang_ad')
          banner.banner_status = all.sltStatus
          banner.banner_sort = all.txtArrange
          banner.banner_name = all.txtName
          banner.banner_alias = all.txtAlias
          banner.banner_description = all.txtSmallDescription
          await banner.save()

          const flImage = request.file('flImage', {
            types: ['image'],
            size: '2mb'
          })

          if(flImage && flImage._clientName !== '') {
            if(banner.banner_image !== ''){
                const path_old = Helpers.publicPath('/images/banner/'+banner.banner_image)
                fs.unlinkSync(path_old)
            }
            const fileName = Math.floor(Math.random()*900000000) + 100000000+'-'+`${flImage._clientName}`
            await flImage.move(use('Helpers').publicPath('/images/banner/'), { name: fileName })

            banner.banner_image = flImage._fileName
            await banner.save()
          }

          session.flash({ finish_ms: language_ad.a_ms_finish })
          response.redirect('/administrator/banner')
        }
    }
    async banner_del({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
          session.flash({ error_del_ms: language_ad.a_ms_error_dell_notcheck })
          return response.redirect('back')
        }
        for (let item of all.ckb){
          const banner = await Banner.findBy('id', item)

          if(banner.banner_image !== ''){
              const path_old = Helpers.publicPath('/images/banner/'+banner.banner_image)
              fs.unlinkSync(path_old)
          }

          await banner.delete()
        }
        session.flash({ finish_ms: language_ad.a_ms_finish })
        response.redirect('/administrator/banner')
    }
    //banner--------------------------------------------------------------------

    //products category--------------------------------------------------------
    async products_categorys({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        return view.render('back.products_categorys.products_categorys',{
           products: 'active',
           btn_add: '/administrator/products_categorys/add',
           title: language_ad.a_m_product_category,
           heading:language_ad.a_m_product_category
         })
    }
    async products_categorys_add({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.products_categorys.cat_add',{
         products: 'active',
         title: language_ad.a_m_product_category_add,
         heading:language_ad.a_m_product_category_add
       })
    }
    async products_categorys_add_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const all = request.all()
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.error_cat
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
            session.withErrors(validation.messages()).flashExcept()
            return response.redirect('back')
        }else{
            const productsCategorys = new ProductsCategorys()
            productsCategorys.parent_id = all.sltParentId
            productsCategorys.language_code = session.get('lang_ad')
            productsCategorys.status = 1
            productsCategorys.arrange = all.txtArrange
            productsCategorys.views = all.txtViews
            productsCategorys.hightlights = all.txtHightlights
            productsCategorys.cat_name = all.txtName
            productsCategorys.small_description = all.txtSmallDescription
            productsCategorys.description = all.txtDescription
            productsCategorys.meta_title = all.txtMetaTitle
            productsCategorys.meta_description = all.txtMetaDescription
            productsCategorys.meta_keyword = all.txtMetaKeyword
            await productsCategorys.save()

            session.flash({ finish_ms: language_ad.a_ms_finish })
            response.redirect('/administrator/products_categorys')
        }
    }
    async products_categorys_edit({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = params.id
      const data_edit = await ProductsCategorys.query().where('id', id).first()

      return view.render('back.products_categorys.cat_edit',{
         products: 'active',
         title: language_ad.a_m_product_category_edit,
         heading:language_ad.a_m_product_category_edit,
         data_edit:data_edit
       })
    }
    async products_categorys_edit_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        const productsCategorys = await ProductsCategorys.findBy('id', all.txtId)
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.error_cat
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
            productsCategorys.parent_id = all.sltParentId
            productsCategorys.language_code = session.get('lang_ad')
            productsCategorys.status = all.sltStatus
            productsCategorys.arrange = all.txtArrange
            productsCategorys.views = all.txtViews
            productsCategorys.hightlights = all.txtHightlights
            productsCategorys.cat_name = all.txtName
            productsCategorys.small_description = all.txtSmallDescription
            productsCategorys.description = all.txtDescription
            productsCategorys.meta_title = all.txtMetaTitle
            productsCategorys.meta_description = all.txtMetaDescription
            productsCategorys.meta_keyword = all.txtMetaKeyword
            await productsCategorys.save()

            session.flash({ finish_ms: language_ad.a_ms_finish })
            response.redirect('/administrator/products_categorys')
        }
    }
    async products_categorys_del({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
          session.flash({ error_del_ms: language_ad.a_ms_error_dell_notcheck })
          return response.redirect('back')
        }
        for (let item of all.ckb){
          const productsCategorys = await ProductsCategorys.findBy('id', item)
          await productsCategorys.delete()
        }
        session.flash({ finish_ms: language_ad.a_ms_finish })
        response.redirect('/administrator/products_categorys')
    }
    //products category--------------------------------------------------------

    //products
    async products({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        return view.render('back.products.back_prducts',{
           products: 'active',
           btn_add: '/administrator/products/add',
           title: language_ad.a_m_product_list,
           heading:language_ad.a_m_product_list
         })
    }
    async products_add({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      return view.render('back.products.products_add',{
         products: 'active',
         title: language_ad.a_m_product_add,
         heading:language_ad.a_m_product_add
       })
    }

    async products_add_post({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

        const all = request.all()
        const rules = {
          txtName: 'required'
        }
        const messages = {
          'txtName.required' : language_ad.error_product_name
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
            session.withErrors(validation.messages()).flashExcept()
            return response.redirect('back')
        }else{
            const products = new Products()
            products.cat_id = all.sltParentId
            products.language_code = session.get('lang_ad')
            products.status = 1
            products.arrange = all.txtArrange
            products.views = all.txtViews
            products.hightlights = all.txtHightlights
            products.product_name = all.txtName
            products.small_description = all.txtSmallDescription
            products.description = all.txtDescription
            products.meta_title = all.txtMetaTitle
            products.meta_description = all.txtMetaDescription
            products.meta_keyword = all.txtMetaKeyword
            await products.save()

            if(request.file('flImage') && request.file('flImage') !== ''){
                const flImage = request.file('flImage', {
                    types: ['image'],
                    size: '2mb'
                })
                await flImage.move(Helpers.publicPath('/images/products/'))
                products.product_image = flImage._fileName
                await products.save()
            }

            session.flash({ finish_ms: language_ad.a_ms_finish })
            response.redirect('/administrator/products')
        }
    }
    async products_edit({session,request, params, response, view}){
      var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));

      const id = params.id
      const data_edit = await Products.query().where('id', id).first()

      return view.render('back.products.products_edit',{
         products: 'active',
         title: language_ad.a_m_news_edit,
         heading:language_ad.a_m_news_edit,
         data_edit:data_edit
       })
    }
    async products_edit_post({session,request, params, response, view}){
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

    async products_del({session,request, params, response, view}){
        var language_ad = JSON.parse(fs.readFileSync('public/language/'+session.get('lang_ad')+'/back.json', 'utf8'));
        const all = request.all()

        if(all.ckb == null){
          session.flash({ error_del_ms: language_ad.a_ms_error_dell_notcheck })
          return response.redirect('back')
        }
        for (let item of all.ckb){
          const products = await Products.findBy('id', item)
          if(products.product_image !== ''){
              const path_old = Helpers.publicPath('/images/products/'+product_image.news_image)
              fs.unlinkSync(path_old)
          }
          await products.delete()
        }
        session.flash({ finish_ms: language_ad.a_ms_finish })
        response.redirect('/administrator/products')
    }
}

module.exports = BackController
