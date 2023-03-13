const {validationResult} = require('express-validator')
const bcrypt =require('bcrypt');
const session = require('express-session');
const User = require('../../models/user')





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
        }).then(result=>{
            return res.redirect('/login')
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
  if( ! match){
    req.flash('userErr', 'Inavid email or password')
   return req.session.save(()=>{
        res.redirect('/login')
    })
  }
console.log(user.role)

  req.session.isLoggedIn=true;
  req.session.user = user
  if(req.session.user.role == "admin"){
    res.redirect('/adminHome')
  }
  else{
    res.redirect('/')
  }
    
 
})


}).catch(err=>{
    console.log(err)
})




}

 