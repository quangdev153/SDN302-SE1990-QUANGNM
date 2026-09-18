//viet chuong trinh dung expressjs, fs thuc hien crud + routing,HTTP Status, data.json
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const dataPath = 'data.json';


app.use(express.json());

app.use('/api',(req,res,next) => {
    next();
    console.log(`${req.method} request to ${req.url}`)
})

const readData = ()=>{
    try{
    const data= fs.readFileSync("db.json","utf-8");
     return JSON.parse(data);
    }
    catch(err){
        console.error("loi kh lay dc du lieu");
    }
}

const writeData = (data) =>{
    try{
        const data = fs.writeFileSync("db.json",JSON.stringify(data,null,2),"utf-8")
    }
    catch(err){
        console.error("loi kh ghi du lieu");
    }
}


app.get('/api/articles',(req,res) =>{
    const data = readData();
    return res.status(200).json({
        message: "lay articles thanh cong",
        data: data.articles
    })
})

