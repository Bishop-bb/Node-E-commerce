// importing libraries
const express = require('express')
const path = require('path')
const session = require('express-session');
const flash = require('connect-flash');

// importing controllers


// importing routes
const userRoute = require('./routes/user')
const adminRoute = require('./routes/admin')
const userAuth = require('./routes/auth')
const productRoute = require('./routes/product')



// importing database
const sequelize = require('./database/connect')

const SequelizeStore = require("connect-session-sequelize")(session.Store);
// importing models
// const Admin = require('./models/admin')
// const Product = require('./models/produt')
const User = require('./models/user')
const Session = require('./models/session')


const app = express()

// setting up view ejs
app.set('view engine', 'ejs')


app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
      }),
    cookie:{}
}))

app.use(flash())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next)=>{
    res.locals.isLoggedIn = req.session.isLoggedIn
    res.locals.user = req.session.user
    next()
})

app.use(userRoute)
app.use(adminRoute)
app.use(userAuth)
app.use(productRoute)
// User.sync({alter:true})

sequelize.sync().then(()=>{
    app.listen(9500, ()=>{
        console.log('connected to port 9500')
    })
})