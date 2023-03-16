const {validationResult} = require('express-validator')
const bcrypt =require('bcrypt');
const session = require('express-session');
const User = require('../../models/user')
const crypto = require('crypto');
const nodemailer = require('nodemailer');



exports.AuthRegister =(req, res)=>{
    const {name, email, password} = req.body
    let errors = validationResult(req)
    
    
    if(!errors.isEmpty()){
        const previousInput ={
            name: name,
            email: email,
            password: password
        }
        
        req.flash('previousInput', previousInput)
        req.flash('errors', errors.array())
        return req.session.save(()=>{
             res.redirect('/addUser')
         })
    }  

    User.findOne({
        where:{
            email:email
        }
    }).then(user=>{
        if(user){
            req.flash('dbError', "email is already in use")
            req.session.save(()=>{
                      res.redirect('/addUser') 
                })
        }

       bcrypt.hash(password, 12).then(hashedPassword=>{
        User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: 'user'
        }).then(user=>{
             res.redirect('/login');
            const email = {
              to: [user.email, 'iyiolablessing98@gmail.com'],
              from: {
                name: 'Bishop',
                email: 'bishop@gmail.com',

              },
              subject: 'Welcome aboard',
              html: `
                <h3>Welcome ${user.name}</h3>
              `
            }

            var transport = nodemailer.createTransport({
              host: "sandbox.smtp.mailtrap.io",
              port: 2525,
              auth: {
                user: "19ddea13b08cea",
                pass: "140f5fe464fb55"
              }
            });

            transport.sendMail(email).then((response)=>{
              return res.redirect('/login');
          
            
            }).catch(err=> console.log(err))
        }).catch(err=>{
            console.log(err)
        })
    })
      
    })
}



exports.Login =(req, res)=>{
    
    
    const {email, password} = req.body
    let errors = validationResult(req)
if(!errors.isEmpty()){

    const previousInput ={
        email: email,
    }
    req.flash('previousInput', previousInput)
    req.flash('loginError', errors.array())

    return req.session.save(()=>{
        res.redirect('/login')
      })
}
User.findOne({where:{
    email: email
}
}).then(user=>{
    if(!user){
        req.flash('userErr', 'User does not exist')
   return  req.session.save(()=>{
      res.redirect('/login')  
    })
    }

    bcrypt.compare(password, user.password)
.then(match =>{
  console.log(user.role)
  if( ! match){
    req.flash('userErr', 'Inavid email or password')
   return req.session.save(()=>{
        res.redirect('/login')
    })
  }
 
  req.session.user = user
  req.session.isLoggedIn=true;
  
      return req.session.save(()=>{
        
        if(req.session.user.role == "admin"){
          return req.session.save(()=>{
            res.redirect('/adminHome')
            
      
        })
        }
      return  res.redirect('/')

    })
   
}).then(user=>{
  
  
  
  console.log(user)
  

  
  
  
 
})


}).catch(err=>{
    console.log(err)
})




}


exports.Logout = (req, res) => {
    
  return req.session.destroy(()=>{
    res.redirect('/login')
  })
    
  };






  exports.postForgotPassword = (req, res)=>{
  const {email} = req.body  
  const errors = validationResult(req)
  if(! errors.isEmpty()){
    req.flash('error', errors.array())
    return  req.session.save(()=>{
      return  res.redirect('/forgotPassword')
    })
  }

  crypto.randomBytes(32, (err, buffer)=>{
    if(err){
      req.flash('userError', 'Unable to perform this function at this moment');
      return req.session.save(()=>{
        res.redirect('/forgotPassword')
      })
    }
    let token = buffer.toString('hex');

    User.findOne({
      where:{
        email: email
      }
    }).then(user=>{
      if(! user){
        req.flash('userError', 'User does not exist');
       return  req.session.save(()=>{
          res.redirect('/forgotPassword')
        })
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 90000000
     return user.save()
    }).then(user=>{
console.log(user)
      let email = {
        to: user.email,
        from:{
          name:'Bishop',
          email: 'bb@gmail.com'
        },
        subject: 'Retrive password',
        html: `
         <h2>You requested to retrive your password</h2>
         <p><a href="http:/localhost:9500/retrive-password/${token}">Click here </a> to retrive your password</p>
         <p>This link will expire in the next 24 hours.<br>
         Kindly ignore if you don't send this request
         </p>
        `
      }
      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "19ddea13b08cea",
          pass: "140f5fe464fb55"
        }
      });

      transport.sendMail(email).then((response)=>{
        return res.redirect('/login');
    
      
      }).catch(err=> console.log(err))
    })

  })

  }

exports.passwordReset=(req, res)=>{
  
  return res.render('auth/forgotPasswordReset', {
    title: 'Retrieve Password',
    retrivePassword: req.flash('dbErr'),
    errors: req.flash('valErr')
    
});

}

  exports.retrivePassword = (req, res) => {
    const {password} = req.body
    const errors = validationResult(req);
  
          
    
    if (!errors.isEmpty()) {
      
      
      req.flash('valErr', errors.array());
      console.log('wee')
      
      return res.render('auth/forgotPasswordReset', {
        title: 'Retrieve Password',
        retrivePassword: req.flash('dbErr'),
        errors: req.flash('valErr')
        
    });
   
          
    }

    
   

   bcrypt.hash(password, 7).then(hashedPassword=>{
    User.findOne({
      where:{
        resetToken: req.session.token
      }
    }).then(user=>{
      if (!user || user.resetTokenExpiration < Date.now()) {
        req.flash('tokenError', 'Invalid token');
        return req.session.save(() => {
            res.redirect('/login');
        });
    }

      user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;
        user.save();
console.log(hashedPassword)
        req.flash('success', 'Password Reset Successful');

    return res.redirect('/login')
        // return res.render('auth/forgotPasswordReset', {
        //   title: 'Retrieve Password',
        //   retrivePassword: req.flash('dbErr'),
        //   errors: req.flash('valErr'),
        //   success: req.flash('success')
          
      // });


    })
  })
   
  };
   

 
   
  exports.reset = (req, res) => {
    const { email, password } = req.body;
  
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      req.flash('error', errors.array());
       res.render('auth/password', {
        error: req.flash('error'),
        userErr: req.flash('error'),
      });
    }
   
    User.findOne({
      where: {
        email: email
        
      }
    }).then(user => {
      
          console.log('here now')
      bcrypt.compare(password, user.password).then(result=>{
        if(result){
          req.session.email = email;
      
          return req.session.save(()=>{
               res.redirect('/password')
           })
        }
      })
     
      
    }).catch(err=>{
      console.log(err)
    })
  };
  

  exports.passwordpage=(req, res)=>{
    res.render('auth/ResetPassword', {
      errors: req.flash('error')
    } )
  }

  exports.password=(req, res)=>{
    const {password} = req.body
    const errors = validationResult(req)
    console.log(req.session.email)
  if(! errors.isEmpty()){
    req.flash('error', errors.array())
    return  req.session.save(()=>{
      return  res.redirect('/password')
    })
  }
  bcrypt.hash(password, 12).then(hashedPassword=>{
    User.findOne({
      where:{
        email: req.session.email
      }
    }).then(user=>{
      
      user.password = hashedPassword
       user.save()
          return res.redirect('/login')
    })
    .catch(err=>{
      console.log(err)
    })
  })
  
  }

  
  