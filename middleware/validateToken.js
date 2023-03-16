const User = require('../models/user')

module.exports = (req, res, next) => {
    let token = req.params.token;
    User.findOne({
      where: { resetToken: token }
    }).then(user => {
      console.log(user)
      console.log('warris happening')
      if (!user || user.resetTokenExpiration < Date.now()) {
        req.flash('retrivePassword', 'Invalid or expired URL');
        return req.session.save(() => {
          res.redirect('/login');
        });
      }
      
      req.session.token = token;

      
      next();
    });
  };