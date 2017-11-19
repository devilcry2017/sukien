'use strict'

const Route = use('Route')

Route.get('/', 'FrontController.home')
Route.get('/about', 'FrontController.about')

//login
Route.get('login', 'UsersController.login')
Route.post('login', 'UsersController.postLogin')
Route.get('resetPassword', 'UsersController.resetPassword')
Route.post('resetPassword', 'UsersController.resetPasswordPost')

//api
Route.group(() => {
    //system
    Route.get('system', 'ApiController.system')
    Route.get('language', 'ApiController.language')

    //menu
    Route.get('menu', 'ApiController.menu')
    Route.get('menu_header', 'ApiController.menu_header')
    Route.get('menu_footer', 'ApiController.menu_footer')

    //news
    Route.get('banner', 'ApiController.banner')
    Route.get('banner_top', 'ApiController.banner_top')
    Route.get('banner_right', 'ApiController.banner_right')


    //evNews
    Route.get('evNews', 'ApiController.evNews')
    Route.get('evNewsHightlightLimit/:limit', 'ApiController.evNewsHightlightLimit')
    Route.get('evNewsViewtLimit/:limit', 'ApiController.evNewsViewtLimit')
    Route.get('evLastestNewsLimit/:limit', 'ApiController.evLastestNewsLimit')
    Route.get('evNews/events', 'ApiController.evNewsEvents')
    Route.get('evNews/group', 'ApiController.evNewsGroup')
    Route.get('evNews/cat', 'ApiController.evNewsCat')
    Route.get('evNews/edit/cat/:id', 'ApiController.evNewsEditCat')
    Route.get('evNews/edit/images/:id', 'ApiController.evNewsEditImages')    

    //product cat
    Route.get('productsCat', 'ApiController.productsCat')

    //products
    Route.get('products', 'ApiController.products')

    //news cat
    Route.get('newsCat', 'ApiController.newsCat')

    //news
    Route.get('news', 'ApiController.news')
    Route.get('newsLastestLimit/:limit', 'ApiController.newsLastestLimit')


}).prefix('api/v1.0')

//admin
Route.group(() => {
    Route.get('/administrator', 'BackController.lang')
    Route.post('/administrator/postLang', 'BackController.postLang')
    Route.get('/administrator/lang_active', 'BackController.lang_active')
    Route.get('/logout', 'UsersController.logout')

    //images upload
    Route.get('/administrator/files', 'BackController.files')
    Route.post('/administrator/upload', 'BackController.upload')
    Route.get('/administrator/upload_token', 'BackController.upload_token')
    Route.post('/administrator/delete_file', 'BackController.delete_file')
    Route.post('/administrator/creat_folder', 'BackController.creat_folder')
    Route.post('/administrator/edit_folder', 'BackController.edit_folder')
    Route.post('/administrator/delete_folder', 'BackController.delete_folder')

    //menu
    Route.get('/administrator/menu', 'BackController.menu')
    Route.get('/administrator/menu/add', 'BackController.menu_add')
    Route.post('/administrator/menu/add', 'BackController.menu_add_post')
    Route.get('/administrator/menu/edit/:id', 'BackController.menu_edit')
    Route.post('/administrator/menu/edit', 'BackController.menu_edit_post')
    Route.post('/administrator/menu/del', 'BackController.menu_del')

    //ev news
    Route.get('/administrator/evNews', 'BackController.evNews')
    Route.get('/administrator/evNews/add', 'BackController.evNews_add')
    Route.post('/administrator/evNews/add', 'BackController.evNews_add_post')
    Route.get('/administrator/evNews/edit/:id', 'BackController.evNews_edit')
    Route.post('/administrator/evNews/edit', 'BackController.evNews_edit_post')
    Route.post('/administrator/evNews/dell', 'BackController.evNews_del')
    //ev images
    Route.post('/administrator/evNews/add/images', 'BackController.evNews_add_images')
    Route.post('/administrator/evNews/edit/images', 'BackController.evNews_edit_images')
    Route.post('/administrator/evNews/dell/images', 'BackController.evNews_delete_images')
    //ev groups
    Route.get('/administrator/evNewsGroup', 'BackController.evNewsGroup')
    Route.post('/administrator/evNewsGroup/add', 'BackController.evNewsGroupAdd')
    Route.get('/administrator/evNewsGroup/edit/:id', 'BackController.evNewsGroupEdit')
    Route.post('/administrator/evNewsGroup/edit', 'BackController.evNewsGroupEdit_post')
    Route.post('/administrator/evNewsGroup/del', 'BackController.evNewsGroupDel')

    //ev cat
    Route.get('/administrator/evNewsCat', 'BackController.evNewsCat')
    Route.post('/administrator/evNewsCat/add', 'BackController.evNewsCatAdd')
    Route.get('/administrator/evNewsCat/edit/:id', 'BackController.evNewsCatEdit')
    Route.post('/administrator/evNewsCat/edit', 'BackController.evNewsCatEdit_post')
    Route.post('/administrator/evNewsCat/del', 'BackController.evNewsCatDel')


    //control panel home
    Route.get('/administrator/home', 'BackController.home')
    //system config
    Route.get('/administrator/system', 'BackController.system')
    Route.post('/administrator/system', 'BackController.systemPost')
    //language config
    Route.get('/administrator/language', 'BackController.language')
    //login history
    Route.get('/administrator/api/loginHistorys', 'BackController.api_login_history')
    Route.get('/administrator/login_history', 'BackController.login_history')
    Route.post('/administrator/login_history', 'BackController.login_history_post')
    //news category
    Route.get('/administrator/news_categorys', 'BackController.news_categorys')
    Route.get('/administrator/news_categorys/add', 'BackController.news_categorys_add')
    Route.post('/administrator/news_categorys/add', 'BackController.news_categorys_add_post')
    Route.get('/administrator/news_categorys/edit/:id', 'BackController.news_categorys_edit')
    Route.post('/administrator/news_categorys/edit', 'BackController.news_categorys_edit_post')
    Route.post('/administrator/news_categorys/del', 'BackController.news_categorys_del')
    //news
    Route.get('/administrator/news', 'BackController.news')
    Route.get('/administrator/news/add', 'BackController.news_add')
    Route.post('/administrator/news/add', 'BackController.news_add_post')
    Route.get('/administrator/news/edit/:id', 'BackController.news_edit')
    Route.post('/administrator/news/edit', 'BackController.news_edit_post')
    Route.post('/administrator/news/del', 'BackController.news_del')

    //product category
    Route.get('/administrator/products_categorys', 'BackController.products_categorys')
    Route.get('/administrator/products_categorys/add', 'BackController.products_categorys_add')
    Route.post('/administrator/products_categorys/add', 'BackController.products_categorys_add_post')
    Route.get('/administrator/products_categorys/edit/:id', 'BackController.products_categorys_edit')
    Route.post('/administrator/products_categorys/edit', 'BackController.products_categorys_edit_post')
    Route.post('/administrator/products_categorys/del', 'BackController.products_categorys_del')


    //banner
    Route.get('/administrator/banner', 'BackController.banner')
    Route.get('/administrator/banner/add', 'BackController.banner_add')
    Route.post('/administrator/banner/add', 'BackController.banner_add_post')
    Route.get('/administrator/banner/edit/:id', 'BackController.banner_edit')
    Route.post('/administrator/banner/edit', 'BackController.banner_edit_post')
    Route.post('/administrator/banner/del', 'BackController.banner_del')

    //products
    Route.get('/administrator/products', 'BackController.products')
    Route.get('/administrator/products/add', 'BackController.products_add')
    Route.post('/administrator/products/add', 'BackController.products_add_post')
    Route.get('/administrator/products/edit/:id', 'BackController.products_edit')
    Route.post('/administrator/products/edit', 'BackController.products_edit_post')
    Route.post('/administrator/products/del', 'BackController.products_del')
    //product color
    Route.get('/administrator/products/color', 'BackController.products_color')

    //hr
    Route.get('/administrator/hr', 'BackController.hr')
}).middleware(['auth'])

Route.get('/tin-tuc', 'FrontController.news')
Route.get('/lien-he', 'FrontController.contact')
Route.get('/dang-tin-su-kien', 'FrontController.event')


//slug
Route.get('/:slug', 'FrontController.slug')
