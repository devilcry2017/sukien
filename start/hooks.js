const { hooks } = require('@adonisjs/ignitor')

const Env = use('Env')

hooks.after.providersBooted(() => {
  const View = use('View')
  View.global('url_host', Env.get('HOST_DOMAIN'))
  View.global('xxxx','yyyyyyy')

})
