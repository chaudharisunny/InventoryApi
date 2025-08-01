const filepath='./products.json'
const fs=require('fs')
const readProduct=()=>{
    const data=fs.readFileSync(filepath)
    return JSON.parse(data)
}
const writeFile=(data)=>{
    fs.writeFileSync(filepath,JSON.stringify(data,null,2))
}

const allProd=async(req,res)=>{
    try {
        const allProd=readProduct()
        let filterd=[...allProd]
        const{category,minPrice,maxPrice,search,page=1,limit=5}=req.query 

        
    // Filter by category
    if (category) {
      filterd = filterd.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by min price
    if (minPrice) {
      filterd = filterd.filter((p) => p.price >= parseFloat(minPrice));
    }

    // Filter by max price
    if (maxPrice) {
      filterd = filterd.filter((p) => p.price <= parseFloat(maxPrice));
    }

    // Search by name or model
    if (search) {
      const keyword = search.toLowerCase();
      filterd = filterd.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.model.toLowerCase().includes(keyword)
      );
    }
    // Pagination
    const start = (parseInt(page) - 1) * parseInt(limit);
    const end = start + parseInt(limit);
    const paginated = filterd.slice(start, end);

    // Return filtered & paginated result
    res.status(200).json({
      total: filterd.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginated,
    },{result:filterd});
       
    } catch (error) {
        console.log(error);
        
        res.status(500).json({error:"server error"})
    }
}

const newProduct=async(req,res)=>{
    try {
        const products=readProduct()
        const{name,category,price,details,model}=req.body
        
        const newProduct={
            id:products.length ? products[products.length -1].id + 1:1,
            name,
            price,
            details,
            model,
            category
        }
        products.push(newProduct);
        writeFile(products)
        return res.status(201).json({message:"new product create"})     
    } catch (error) {
        console.log(error);
        
        res.status(500).json({error:"server error"})
    }
   
}

const updateProduct=async(req,res)=>{
    try {

        let products=readProduct();
        const Index=products.findIndex(prod=>prod.id===parseInt(req.params.id))
        if(Index===-1)return res.status(404).json({error:'id is not found'})

        products[Index]={...products[Index],...req.body}
        writeFile(products)
        res.json(products[Index])
     
    } catch (error) {
            console.log(error);
            
          res.status(500).json({error:"server error"})
    }
   
}

const deleteProduct=async(req,res)=>{
    try {
        let products=readProduct();
        const Index=products.findIndex(prod=>prod.id===parseInt(req.params.id))
        if(Index===-1)return res.status(404).json({error:'id is not found'})

            products.splice(Index,1)
            writeFile(products)
            res.status(200).json({message:'deleted successfully'})
                console.log(req.body);
    } catch (error) {
        console.log(error);
        
         res.status(500).json({error:"server error"})
    }
}

module.exports={allProd,newProduct,updateProduct,deleteProduct}