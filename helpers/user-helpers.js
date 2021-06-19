var db = require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('express')
var ObjectID=require('mongodb').ObjectID

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            })
        })
    },
    doLogin:(userData)=>{
        let response={}
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log('login success');
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login filed');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login filed');
                resolve({status:false})
            }
        })
    },
    addToCart:(proId,userId)=>{
        let proObj={
            item:ObjectID(proId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectID(userId)})
            if(userCart){
                let proExist= userCart.products.findIndex(product=> product.item==proId)
                console.log(proExist);
                if(proExist!=-1){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({_id:ObjectID(userId),'products.item':ObjectID(proId)},
                    {
                        $inc:{'products.$.quantity':1}
                    }
                    ).then(()=>{
                        resolve()
                    })
                }else{
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:ObjectID(userId)},
                    {
                        $push:{products:proObj}
                    
                    }
                    ).then((response)=>{
                        resolve()
                    })
                }
                
            }else{
                let cartObj={
                    user:ObjectID(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {                                                                                       
                    $match:{user:ObjectID(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }
                // {
                //     $lookup:{
                //         from:collection.PRODUCT_COLLECTION,
                //         let:{proList:'$products'},
                //         pipeline:[
                //             {
                //                 $match:{
                //                     $expr:{
                //                         $in:['$_id','$$proList']
                //                     }
                //                 }
                //             }
                //         ],
                //         as:'cartItems'
                //     }
                // }
            ]).toArray()
            resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
           let count=0
           let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectID(userId)})
           if(cart){
               count=cart.products.length
           }
           resolve(count)
        })
    },
    chengeProductQuantity:(details)=>{
        details.count=parseInt(details.count)
        details.quantity=parseInt(details.quantity)

        return new Promise((resolve,reject)=>{
            if (details.count==-1 && details.quantity==1){  
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({_id:ObjectID(details.cart)},
                        {
                            $pull:{products:{item:ObjectID(details.product)}}
                        }
                    ).then((response)=>{
                        resolve({removeProduct:true})
                    })
            }else{
            db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:ObjectID(details.cart), 'products.item':ObjectID(details.product)},
                {
                    $inc:{'products.$.quantity':details.count}
                }
                ).then((responese)=>{
                    resolve(true)
                })
            }
        })
    }
}