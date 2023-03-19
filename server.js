const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
var path = require("path")
const db = require('./database')
require("dotenv").config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

var currentKey = ""
var payload = ""
var username = ""

app.get('/', (req,res) => {
    res.redirect("./identify")
});

app.post('/identify' , (req,res) => {
    
    const {userID} = req.body
    const {password} = req.body
    
    
    db.get('SELECT password FROM users WHERE userID = ?', [userID], async (err, row) => 
    {
        if (err) 
        {
            console.error(err.message);
        } 
        else if (!row) 
        {
            console.error('User not found');
            res.render("fail.ejs")
        }
        else if (row.password != password)
        {
            console.log(row.password)
            res.render("fail.ejs")
        }
        else 
        {
            //store them in global vars
            username = userID
            payload = {"username": userID, "password": password};
            currentKey = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)

            res.redirect("./granted")
        } 
    });
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

app.get('/identify',(req,res) => {
    res.render("identify.ejs")
});

app.get('/granted', authenticateToken,(req,res)=>{
    if (username == "id1")
    {res.redirect("./student1")}

    else if(username == "id2") 
    {res.redirect("./student2")}
    
    else if(username == "id3")
    {res.redirect("./teacher")}
    
    else if(username == "admin")
    {res.redirect("./admin")}
});

app.get('/student1', authenticateToken, (req,res) => {
    res.render("student1.ejs")
});

app.get('/student2', authenticateToken, (req,res) => {
    res.render("student2.ejs")
});

app.get('/teacher', authenticateToken, (req,res) => {
    res.render("teacher.ejs")
});

app.get('/admin', authenticateToken, (req,res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          console.error(err.message);
          res.render('fail.ejs', { message: 'An error occurred while fetching user data' });
        } else {
          res.render('admin.ejs', { users: rows });
        }
    });
});

app.listen(5000, function(){
    console.log("Listening on port 5000")
});