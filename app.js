const bodyParser = require("body-parser");
const { request } = require("express");
const fileUpload = require('express-fileupload')
let express = require("express");
const app = express();
const mongoose = require("mongoose");
const sha256 = require("sha256");
const nodemailer = require('nodemailer');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(fileUpload());
require("dotenv").config();
// import credntials from .env;

let products = [{
    name : "Trendy Sweater",
    price : 55,
    image : "https://image.uniqlo.com/UQ/ST3/ph/imagesgoods/445580/item/phgoods_31_445580.jpg?width=1008&impolicy=quality_75",
    count : 0
},
{
    name: "Casual Blazer",
    price: 75,
    image: "https://i.pinimg.com/originals/59/17/8d/59178d79aae9aa45ff6fc97abedf15d5.jpg",
    count : 0
}
];

var cart = [{
    productId: 1,
    name:"Kipsta Checked Shirt",
    price: 80.00,
    image: "https://contents.mediadecathlon.com/p1830216/a5c3c27c1a1dab5cb7b295dbc369031a/p1830216.jpg",
    count:0
  },
  {
    productId: 2,
    name:'US Polo Casual Shirt',
    price: 40.00,
    image:'https://assetscdn1.paytm.com/images/catalog/product/A/AP/APPUS-PEPPER-NEASHA322624B7835732/1563042168624_0..png',
    count:0
  },
  {
    productId: 3,
    name: 'Jeans Shorts',
    price: 50.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnGjMMGhOjT52VhcnCr98zGDwYVLmQYegzMw&usqp=CAU',
    count:0
  },
  {
    productId: 4,
    name: 'Jockey Shorts',
    price: 45.00,
    image:'https://cdn.shopify.com/s/files/1/0266/6276/4597/files/Banner_15.jpg?v=1667645802',
    count:0
  },
  {
    productId: 5,
    name:'Ripped Jeans',
    price: 47.50,
    image: 'https://cdn.shopify.com/s/files/1/0266/6276/4597/products/300903250DKBLUE_2_1024x1024.jpg?v=1658427365',
    count:0
  },
  {
    productId: 6,
    name: 'Navy Trousers',
    price: 99.99,
    image:'https://m.media-amazon.com/images/I/61WIS7hjQ8S._UX569_.jpg',
    count:0
  },
  {
    productId: 7,
    name:'Casual Blue Suit',
    price: 60.00,
    image: 'https://www.bagteshfashion.com/public/storage/uploads/images/product/product_image/MSU276.jpg',
    count:0
  },
  {
    productId: 8,
    name:'Zipper Hoodie',
    price: 100.00,
    image: "https://img1.exportersindia.com/product_images/bc-full/2022/8/10667111/mens-zipper-sweatshirt-1661245819-6503920.jpeg",
    count:0
  }
  ];

var allProducts = cart.concat(products)

cart.join()

let purchase = [];

var loggedIn = false;
var name;
var email;

mongoose.connect("mongodb://127.0.0.1:27017/userDB");
// mongoose.connect("mongodb+srv://root:mflix@mflix.24lpt.mongodb.net/?retryWrites=true&w=majority/userDB",{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fname: String,
    lname: String,
    email: String,
    pnumber: Number
});

const User = new mongoose.model("users", userSchema);

// () => {
//   console.log('Connected to MongoDB');
// }   );





// Main page
app.get("/",(req,res)=>{
    if(loggedIn===true){
        res.render("index1",{fname:name,totalProducts:purchase.length,cart:cart});
    }
    else{
        res.render("index");
    }  
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/logout",(req,res)=>{
    loggedIn = false;
    res.redirect("/");
})

app.get("/about",(req,res)=>{
    res.render("about",{loggedIn:loggedIn});
})

// Add Product Page
app.get("/addProduct",(req,res)=>{
    res.render("addProduct",{fname:name, total:products.length, totalProducts:purchase.length});
})

// New Arrivals
app.get("/newArrivals",(req,res)=>{
    res.render("newArrivals",{products : products, fname:name, total:products.length, totalProducts:purchase.length})
})

app.get("/success",(req,res)=>{
    res.render("success",{fname:name,totalProducts:purchase.length})
})

//Cart page
app.get("/cart",(req,res)=>{
    let totalPrice = 0;
    purchase.forEach(item => {
        totalPrice+=item.price*item.count;
    });
    // console.log(purchase[0].name)
    res.render("cart",{purchase:purchase,fname:name,totalProducts:purchase.length, totalPrice:totalPrice});
})

app.get("/checkout",(req,res)=>{
    let totalPrice = 0;
    purchase.forEach(item => {
        totalPrice+=item.price;
    });
    let tax = totalPrice*0.18;
    totalPrice *= 1.18;
    res.render("checkout",{purchase:purchase,totalPrice:totalPrice.toFixed(2),totalProducts:purchase.length,tax:tax.toFixed(2)})
})

app.get("/allProducts",(req,res)=>{
    if(loggedIn === false){
        res.render("allProducts",{allProducts:allProducts});
    }
    else{
        res.render("allproducts1",{fname:name,totalProducts:purchase.length,allProducts:allProducts})
    }
})

//Register
app.post("/register", function (req, res) { 
    const newUser = new User ({
        username: req.body.username,
        password: (req.body.password),
        fname: req.body.Firstname,
        lname: req.body.Lastname,
        email: req.body.email,
        pnumber: req.body.phoneNo
    })

    newUser.save(function (err) { 
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
     });
 })

 //Login Request
app.post("/login", function (req, res) { 
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, function (err, foundUser) { 
        if(err){
            console.log(err);
        }
        else {
            if(foundUser) {
                if(foundUser.password === password){
                    name = foundUser.fname;
                    email = foundUser.email;
                    loggedIn = true;
                    res.redirect("/");                                 
                }
            }
        }
     });
 })

 app.post("/logout",(req,res)=>{
    loggedIn = false;
    res.redirect("/");
 })

 app.post("/contact",(req,res)=>{
    let userEmail = req.body.email;
    let title = req.body.topic;
    let message = req.body.message;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.user,
          pass: process.env.pass
        }
      });
      
      var mailOptions = {
        from: process.env.user,
        to: userEmail,
        subject: title,
        text: 'Your grievance was received. We will get back to you shortly! ;)'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("Error: "+ error);
        } else {
            res.redirect("/");
            console.log('Mail sent');
        }
      });
 })

//Add product to website
app.post("/addProduct", (req,res)=>{
    const {image} = req.files;
    if(!image) return res.sendStatus(400);
    console.log(image);
    image.mv('D:/iwp/Project/IWP-Project/public/assets/uploads/' + image.name);
    let newProduct = {
        name : req.body.product,
        price : req.body.price,
        image : '/assets/uploads/' + image.name,
        count: 0
    }
    products.push(newProduct);
    allProducts.push(newProduct);
    res.redirect("/");
})

//Add to cart
app.post("/",(req,res)=>{
    
    for (let i = 0; i < cart.length; i++) {
        
        if (cart[i].name == req.body.item) {
            cart[i].count++;
            
            if(purchase.includes(cart[i])){
                let j = purchase.indexOf(cart[i]);   
                console.log(purchase[0].count);
            }
            else{
                purchase.push(cart[i]);
                console.log(purchase.indexOf(cart[i]))
            }
        }    
    }

});

app.post("/allProducts1",(req,res)=>{
    for (let i = 0; i < allProducts.length; i++) {
        
        if (allProducts[i].name == req.body.item) {
            allProducts[i].count++;
            console.log(allProducts[i].name)
            if(purchase.includes(allProducts[i])){
                let j = purchase.indexOf(allProducts[i]);
                console.log(purchase[0].price);
            }
            else{
                purchase.push(allProducts[i]);
                console.log(purchase.indexOf(allProducts[i]))
            }
        }    
    }
})

//Open cart from home page
app.post("/cartpage",(req,res)=>{
    res.redirect('/cart');
});

// Checkout, continue shopping and clear cart
app.post("/cart",(req,res)=>{
    if(req.body.cart_input === 'home'){
        res.redirect("/");
    }
    else if(req.body.cart_input === 'checkout'){
        res.redirect("/checkout");
    }
    else{
        purchase=[];
        allProducts.forEach(item=>{
            item.count = 0;
        });
        cart.forEach(item=>{
            item.count = 0;
        });
        res.redirect("/cart");
    }
})

// Send mail
app.post("/checkout",(req,res)=>{
    let message = "";
    for (let i = 0; i < purchase.length; i++) {
        message += "Item " + (i+1) + ": " + purchase[i].name + "\n";
    }
    message += "\nExpected Delivery by " + (new Date().getDate() + 3) + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.user,
          pass: process.env.pass
        }
      });
      
      var mailOptions = {
        from: process.env.user,
        to: email,
        subject: 'Your order is confirmed!',
        text: 'Order Summary: ' + message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("Error: "+ error);
        } else {
          console.log('Email sent: ' + info.response);
          purchase = [];
          res.redirect("/success");
        }
      });
})

app.listen(5000,()=>{
    console.log('Listening on port 5000');
})





