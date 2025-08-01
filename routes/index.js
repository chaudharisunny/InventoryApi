const express=require('express')
const { allProd, newProduct, updateProduct, deleteProduct } = require('./controller/product')
const routes=express.Router()

routes.get("/inventory_list",allProd)
routes.post("/newProduct",newProduct)
routes.put("/update-product/:id",updateProduct)
routes.delete('/delete-product/:id',deleteProduct)

module.exports=routes