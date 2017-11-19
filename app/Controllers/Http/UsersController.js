'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')
const fs = require('fs')
const Env = use('Env')

const { validate } = use('Validator')

class UsersController {
    async login ({ session, view }) {
      const View = use('View')
      View.global('lang',session.get('lang'))

      var lang_trans = JSON.parse(fs.readFileSync('public/language/'+session.get('lang')+'/front.json', 'utf8'));
      View.global('lang_trans', lang_trans)

      return view.render('auth.login',{
        title: lang_trans.title_login_page,
        heading:lang_trans.title_login_page
      });
    }

    async postLogin ({ request, auth, session, response , params, view }) {
      //const user = await User.where('email', uid).orWhere('phone', uid).first()
      //if (!user) {
      //  throw new LoginFailedException('User not found')
      //}
      //const isValid = await Hash.verify(password, user.password)
      //if (!isValid) {
      //  throw new LoginFailedException('Invalid password')
      //}
      //await auth.login(user)

        const View = use('View')
        View.global('lang',session.get('lang'))

        var lang_trans = JSON.parse(fs.readFileSync('public/language/'+session.get('lang')+'/front.json', 'utf8'));
        View.global('lang_trans', lang_trans)

        const rules = {
          username: 'required',
          password: 'required'
        }
        const messages = {
          'username.required' : '* Tài khoản không được để trống.',
          'password.required'    : '* Mật khẩu không được để trống.'
        }
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          try {
                const { username, password } = request.all()
                await auth.attempt(username, password)
                return response.redirect('/administrator')
          } catch(ex) {
              session.withErrors([{ field: 'username', message: '* Tài khoản hoặc mật khẩu không chính xác.' }]).flashAll()
              return response.redirect('back')
          }
        }
    }

    async resetPassword ({ session, view }) {
      const View = use('View')
      View.global('lang',session.get('lang'))

      var lang_trans = JSON.parse(fs.readFileSync('public/language/'+session.get('lang')+'/front.json', 'utf8'));
      View.global('lang_trans', lang_trans)

      return view.render('auth.reset_password',{
        title: lang_trans.password_recovery,
        heading:lang_trans.password_recovery
      });
    }
    async resetPasswordPost ({ request, session, response , view }) {
        var lang_trans = JSON.parse(fs.readFileSync('public/language/'+session.get('lang')+'/front.json', 'utf8'));

        const rules = {
          username: 'required',
          email: 'required|email'
        }
        const messages = {
          'username.required' : '* Tài khoản không được để trống.',
          'email.required'    : '* Email không được để trống.',
          'email.email'    : '* Định dạng email không đúng.'
        }

        const validation = await validate(request.all(), rules,messages)

        if (validation.fails()) {
          session.withErrors(validation.messages()).flashExcept()
          return response.redirect('back')
        }else{
          response.send('ok');
        }
    }

    async logout({request, response, auth}) {
        await auth.logout()
        return response.redirect('/')
    }
}
module.exports = UsersController
