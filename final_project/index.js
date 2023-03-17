const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// const app = express();
var bodyParser = require(`body-parser`);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    
    if (req.session.authorization){
        session_token = req.session.authorization['accessToken']
        jwt.verify(session_token, "access", (err, user) => {
            if(!err){
                req.user = user;
                next();
            } else {
                return res.status(403).json({message: "User Not Authorized"})
            }
        })
    } else {
        return res.status(403).json({message: "User Not Logged In"})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
