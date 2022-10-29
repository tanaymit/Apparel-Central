const bodyParser = require("body-parser");
const { request } = require("express");
let express = require("express");
const app = express();
const mongoose = require("mongoose");
const sha256 = require("sha256");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

let products = [{
    productName : "Clavin Klein CK-5327A",
    price : 55,
    image : "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//c/a/calvin-klein-ck5327a-018-size-52-eyeglasses_m_7808.jpg"
},
{
    productName: "Lance Air",
    price: 75,
    image: "https://c3.iggcdn.com/indiegogo-media-prod-cld/image/upload/c_fit,w_auto,g_center,q_auto:best,dpr_2.6,f_auto/ibxjrxzsjcuxlavkzkge"
}
];

var cart = [{
    name:"Prada Rectangle Grey",
    price: 80.00,
    image: "https://cdn11.bigcommerce.com/s-28d61/products/9138/images/114235/eyewear-brands-prada-rectangle-grey-ufj1o1-metal-semi-rimless-mens-eyewear-0ps-55fv__12099.1653080532.1280.1280.jpg?c=2"
  
  },
  {
    name:'Oakley Sportswear',
    price: 40.00,
    image:'https://m.media-amazon.com/images/I/719pG5fEsrL._UX679_.jpg'
  },
  {
    name: 'Ray Ban Classics',
    price: 50.00,
    image: 'https://ph-test-11.slatic.net/p/39920b97783448ff127dcbb4d546722a.jpg'
  },
  {
    name: 'Ray Ban Sunglasses',
    price: 45.00,
    image:'https://images.ray-ban.com/is/image/RayBan/805289114567__001.png?impolicy=RB_Product_front&width=720&bgc=%23f2f2f2'
  },
  {
    name:'Oakley Sunglasses',
    price: 47.50,
    image: 'https://5.imimg.com/data5/AX/HL/MY-8321312/men-s-oakley-sunglasses-500x500.jpg',
  },
  {
    name: 'Diesel Womens Stylish',
    price: 99.99,
    image:'https://m.media-amazon.com/images/I/71oO71TTMGL._UL1500_.jpg'
  },
  {
    name:'Diesel Rimless',
    price: 60.00,
    image: 'https://cdn1.titaneyeplus.com/tep_m2_prod/media/catalog/product/cache/614e2406485059d8c03655e235f03687/f/s/fsl761060515252_3_lar.jpg'
  },
  {
    name:'Gucci Photochromic Sunglasses',
    price: 100.00,
    image: "https://cz.shadestation.com/media/thumbs/920x575/media/product_images/Gucci-sunglasses-GG0062S-019-57fw920fh575.jpg"
  }
  ];

const purchase = [];

var loggedIn = false;
var name;

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fname: String,
    lname: String,
    email: String,
    pnumber: Number
});

const User = new mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
    if(loggedIn===true){
        res.render("index1",{fname:name,totalProducts:purchase.length});
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

app.get("/addProduct",(req,res)=>{
    res.render("addProduct",{fname:name});
})

app.get("/newArrivals",(req,res)=>{
    res.render("newArrivals",{products : products, fname:name, length:products.length})
})

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
                    loggedIn = true;
                    res.redirect("/");                                 
                }
            }
        }
     });
 })

app.post("/addProduct", (req,res)=>{
    console.log(req.body.image);
    let newProduct = {
        productName : req.body.product,
        price : req.body.price,
        image : req.body.image
    }
    products.push(newProduct);
    res.redirect("/");
})

app.listen(5000,()=>{
    console.log('Listening on port 5000');
})

//Add to cart
app.post("/",(req,res)=>{
    console.log(req.body.item);
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name == req.body.item) {
            purchase.push(cart[i]);
            console.log(purchase.length);
        }    
    }

});



app.get("/cart",(req,res)=>{
    res.render("cart",{purchase:purchase,fname:name});
})




