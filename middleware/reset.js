module.exports= (req, res, next)=>{
    res.render('auth/password',
    {
    //   error: req.flash('error'),
      error: req.flash('error'),
      userErr: req.flash('userErr'),
      cheker: req.flash('checker'),
    })

    next()
  }