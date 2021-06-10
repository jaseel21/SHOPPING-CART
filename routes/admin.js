var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[{
    name:"Nokia 1",
    category:"Mobile",
    image:"https://i.gadgets360cdn.com/products/large/1519573784_635_nokia_1.jpg",
    description:"This is good mobile"
  },
  {
    name:"OPPO A12",
    category:"Mobile",
    image:"https://www.gizmochina.com/wp-content/uploads/2020/04/Oppo-A12-500x500.jpg",
    description:"This is good mobile",
  },
  {
    name:"Narzo 10",
    category:"Mobile",
    image:"https://static.digit.in/default/73dee2c358c030aa8a34c69a7e36fc65967b65c8.jpeg?tr=w-1200",
    description:"This is good mobile",
  },
  {
    name:"Honner 8pro",
    category:"Mobile",
    image:"https://i.gadgets360cdn.com/large/honor_8_pro_screen_small_1497260751475.jpg?downsize=278:209&output-quality=80",
    description:"This is good mobile",
  }
]
  res.render('admin/view-products',{admin:true,products})
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  
  productHelpers.addProduct(req.body,(id)=>{
    let image = req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.render('admin/add-product')
      } else{
        console.log(err);
      }
    })
  })
  
})

module.exports = router;
