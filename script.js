const express = require('express');
const bodyParser = require("body-parser");
var fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



const mongoose = require('mongoose');
const dbURI = 'mongodb://127.0.0.1:27017';

mongoose.connect(dbURI, {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
 console.log(`Mongoose connected to ${dbURI}`);
});




const productsSchema={
  id:Number,
  name:String,
  price:Number,

}

const Product=mongoose.model("Product",productsSchema);

const product1=new Product({
  id:1,
  name:"Leather_Watch",
  price:2000
})


// Product.insertMany([product1])

const cartsSchema={
  id:Number,
  name:String,
  price:Number,

}

const Cart=mongoose.model("Cart",cartsSchema);

const ordersSchema={
  name:String,
  age:String,
  gender:String,
  mail:String,
  itemName:String
}

const Order=mongoose.model("Order",ordersSchema);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get("/products",function(req,res){

  Product.find({}).then(function(foundOptions){
    console.log(foundOptions);
})
})

app.get("/",function(req,res){

  Product.find({}).then(function(foundOptions){
    res.render("home",{productsList:foundOptions});
})
})

app.post("/carts",function(req,res){

    const itemName=req.body.btn;
    
    Product.find({name:itemName}).then(function(foundOptions)
    {
      foundOptions.forEach(function(option){
        Cart.insertMany([option]);
      })

    })

    res.render("cart-added");
  
});

app.post("/cart-added",function(req,res){

    const btn=req.body.btn;

    if (btn==="home-page"){
      Product.find({}).then(function(foundOptions){
        res.render("home",{productsList:foundOptions});
      })
    }
    else if (btn=="cart-page")
    {
      Cart.find({}).then(function(foundOptions){
        res.render("cart-items",{cartList:foundOptions});
      })
    }


})

app.post("/options",function(req,res){

  const option=req.body.option;

  if (option==="products"){
    res.render("products")
  }
})


app.post("/order",function(req,res){
    const itemName=req.body.btn;
    res.render("form.ejs",{itemName:itemName})
})

app.post("/ordered",function(req,res){

    const name=req.body.name;
    const age=req.body.age;
    const gender=req.body.gender;
    const mail=req.body.mail;
    const itemName=req.body.btn;


    const order1=new Order({
      name:name,
      age:age,
      gender:gender,
      mail:mail,
      itemName:itemName
    })

    Order.insertMany([order1])

    res.send("<h1>ordered successfully</h1>")
})