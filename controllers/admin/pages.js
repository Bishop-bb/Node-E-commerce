const User = require('../../models/user')
const Products = require('../../models/product')
const bcrypt =require('bcrypt');




exports.AdminUserHome= (req, res)=>{
    console.log(req.session)
        User.findAll()
    .then(result=>{
        res.render('adminUser/user', {users: result, title: 'AdminUserPage'} )

    }).catch(err=>{
        console.log(err)
    })
    

   
}



exports.AdminProductHome= (req, res)=>{

    // if (!req.session.user) {
    //     return req.session.save(() => {
    //       res.redirect("/login");
    //     });
    //   }
    // let role = req.session.user.role
    // console.log(role)
 
    // if(role !== 'admin'){
    //  res.redirect('/')
    // }

        Products.findAll()
    .then(results=>{
        res.render('adminProduct/product', {products:results, title: 'AdminProductPage'})
    }).catch(err=>{
        console.log(err)
    })
    
}

exports.Adminhome=(req, res)=>{
  
    
  
   Promise.all([User.findAll(), Products.findAll({ limit: 5 })])
   .then(([user, product]) => {
     res.render('adminHome', { user: user, product: product, title: 'Admin-Home', name: req.session.user.name });
   })
   .catch((error) => {
     console.error(error);
   });


    
    
    
 }




exports.Update = (req, res)=>{
  //   if (!req.session.user) {
  //       return req.session.save(() => {
  //         res.redirect("/login");
  //       });
  //     }
  //    let role = req.session.user.role
  //    const id = req.params.id
  //  console.log(role)

  //  if(role !== 'admin'){
  //   res.redirect('/')
  //  }
  //  else{

    User.findByPk(id).then(result=>{
        res.render('adminUser/update', {user:result, title: 'AdminUpdatePage'})
    }).catch(err=>{
        console.log(err)
    })
   }
    



exports.Updateuser  =(req, res)=>{
    // console.log(req.body)
    const {id, name, email, password} = req.body
    bcrypt.hash(password, 7).then(hashedPassword=>{

       User.findByPk(id)
        .then(user=>{
            user.name = name
           user.email = email
           user.password = hashedPassword
    
            return user.save()
        }).then(user=>{
            res.redirect('/adminHome')
        }).catch(err=>{
            console.log(err)
        })

    })
    
}



exports.Delete= (req, res)=>{
    const {id} = req.body
    User.findByPk(id)
    .then(user=>{
        return user.destroy()
    }).then(user=>{
        res.redirect('/adminHome')
    }).catch(err=>{
        console.log(err)
    })
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
  

  
  exports.forgotPasssword= (req, res)=>{
    res.render('auth/forgotPassword', {
      title: 'Forgot-Password',
      error: req.flash('error'),
      userErr: req.flash('userError'),


    })
  }