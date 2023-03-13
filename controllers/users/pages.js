
const User = require('../../models/user')
const Products = require('../../models/product')
exports.Adduser = (req, res)=>{
    if(req.session.isLoggedIn !== true){
    
    res.render('adminUser/add', {
        previousInput: req.flash('previousInput'),
        dbError: req.flash('dbError'),
        errors: req.flash('errors'),
        title: 'Registration-Page'
    })
    }
    else{res.redirect('/')}
}


exports.Login=(req, res)=>{
    console.log(req.session)
    if(req.session.isLoggedIn !== true){
        res.render('login', {
            loginError: req.flash('loginError'),
            errors: req.flash('userErr'),
            previousInput: req.flash('previousInput'),
            title: 'Login'
        
        })
    }
    else{res.redirect('/')}
    
}

exports.Home =(req, res)=>{
  if (!req.session.user) {
    return req.session.save(() => {
      res.redirect("/login");
    });
  }
  const name = req.session.user.name
    if (!req.session.user) {
        return req.session.save(() => {
          res.redirect("/login");
        });
      }
    if(req.session.isLoggedIn !== true){
        res.redirect('/login')
    }
    else{
        Products.findAll()
        .then(results=>{
            res.render('index', {products:results, title: 'Home-page', name:name})
        }).catch(err=>{
            console.log(err)
        })
        
    }
}

exports.Logout = (req, res) => {
    
    req.session.destroy(err => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/login');
      }
    });
    console.log(req.session)
  };
  
