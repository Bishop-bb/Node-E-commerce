module.exports = (req, res, next)=>{
    if(req.session.user){
         username = req.session.user.name
    }
    else if(!req.session.user){
         username = '' 
    }
    next()
}