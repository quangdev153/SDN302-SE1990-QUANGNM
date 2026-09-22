const expess = require('express');
const fs = require('fs');
const path = require('path');

const router = expess.Router();
const DATA_FILE = path.join(__dirname, '..', 'data.json');

//function: doc du lieu tu file
async function readData(){
    try{
        const data = await fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    }catch(err){
        console.error('Error reading data file:', err);
        return [];
    }
}

async function writeData(data){
    try{
        await fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2), 'utf-8');
    }catch(err){
        console.error('Error writing data file:', err);
    }
}

router.get("/",async (req,res)=>{
    try{
        const data = await readData();
        res.status(200).json(data);
    } catch(err){
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.get("/:id",async (req,res)=>{
    try{
        const data = await readData();
        const { id } = req.params;
        const item = data.find(item => item.id === id);
        if(!item){
            return res.status(404).json({error: 'Item not found'});
        } 
        res.status(200).json(item);
    } catch(err){
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.post("/",async (req,res)=>{
    try{
        const data = await readData();
        const newData = [...data, req.body];
        await writeData(newData);
        res.status(201).json({message: 'Data added successfully'});
    } catch(err){
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.put("/:id",async (req,res)=>{
    try{
        const data = await readData();
        const { id } = req.params;
        const { ...updatedData } = req.body;
        const updatedList = data.map(item => item.id === id ? { ...item, ...updatedData } : item);
        await writeData(updatedList);
        res.status(200).json({message: 'Data updated successfully'});
    } catch(err){
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.delete("/:id",async (req,res)=>{
    try{
        const data = await readData();
        const { id } = req.params;
        const updatedList = data.filter(item => item.id !== id);
        await writeData(updatedList);
        res.status(200).json({message: 'Data deleted successfully'});
    } catch(err){
        res.status(500).json({error: 'Internal Server Error'});
    }   
})

module.exports = router;
