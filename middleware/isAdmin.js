module.exports = (req, res, next)=>{
    if(req.session.user.role != 'admin'){
        return res.redirect('/')
    }
    next()

//    if(req.session.user.role =="admin"){
//         return res.redirect('/adminHome')
//     }
    // else if(req.session.user.role == "admin"){
    //     return res.redirect('/adminHome')
      
    // }
    // else if(req.session.user.role != "admin"){
    //     return res.redirect('/')
    // }

    // next()

}