const express=require("express");
 
const app=express();

const port=8000;
app.get('/login',(req,res)=>{
    
})
app.listen(port,()=> console.log('sever started at ${port}'))

