const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
var path = require("path")
require("dotenv").config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

var currentKey = ""
var currentPass = ""

app.get('/', (req,res) => {
    res.redirect("./identify")
});

app.post('/identify' , (req,res) => {
    //auth
    const username = req.body.password
    const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
    currentKey = token
    currentPass = username
    res.redirect("./granted")
});

app.get('/identify',(req,res) => {
    res.render("identify.ejs")
});

function authenticateToken(req, res, next){
    console.log("authenticating...")
    if (currentKey == ""){
        res.redirect("./identify")
    }else if(jwt.verify(currentKey, process.env.ACCESS_TOKEN_SECRET)){
        next()
    }else{
        res.redirect("./identify")
    }
}

app.get('/granted', authenticateToken,(req,res)=>{
    res.render("start.ejs")
});

app.listen(5000, function(){
    console.log("Listening on port 5000")
});