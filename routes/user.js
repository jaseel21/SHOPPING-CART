var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-helpers')
const varifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/',async function(req, res, next) {
  let user = req.session.user
  console.log(user);
  cartCount=null
  if(req.session.user){
     cartCount=await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',  {products,user,cartCount} );
  })
   
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login',{loginErr:req.session.loggErr})
    req.session.loggErr=false
  }
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
  
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    req.session.loggedIn=true
    req.session.user=response
  })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loggErr="invaild email or password"
      res.redirect('/login')
      
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',varifyLogin,async(req,res)=>{
  let products=await userHelpers.getCartProducts(req.session.user._id)
    res.render('user/cart',{products,user:req.session.user})
  
})
router.get('/add-to-cart/:id',(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})
router.post('/chenge-product-quantity',(req,res,next)=>{
  console.log(req.body)
  userHelpers.chengeProductQuantity(req.body).then((response)=>{
    res.json(response)
  })
})
module.exports = router;
