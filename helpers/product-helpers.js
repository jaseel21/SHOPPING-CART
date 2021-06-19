var db = require('../config/connection')
var collection=require('../config/collections')
var ObjectID=require('mongodb').ObjectID
module.exports={
    addProduct:(product,callback)=>{
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.ops[0]._id)
        })
    },
    getAllProducts:()=>{
        return new Promise((resolve,reject)=>{
            let products=db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            console.log(products)
            resolve(products)
        })
    },
    deleteProduct:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:ObjectID(productId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDetails:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(productId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,updateDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectID(proId)},{

                $set:{
                    Name:updateDetails.Name,
                    Description:updateDetails.Description,
                    Category:updateDetails.Category,
                    Price:updateDetails.Price
                }
            }).then((response)=>{
                resolve()
            })
        })
        
    },
}