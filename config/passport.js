const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' })
        }
        // 用bcrypt比較使用者輸入的密碼與資料庫密碼
        bcrypt.compare(password, user.password, (err, isMach) => {
          if (err) throw err
          if (isMach) {
            return done(null, user)
          } else {
            return done(null, false, {
              message: 'Email or Password incorrect'
            })
          }
        })
      })
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .exec((err, user) => {
        done(err, user)
      })
  })
}
