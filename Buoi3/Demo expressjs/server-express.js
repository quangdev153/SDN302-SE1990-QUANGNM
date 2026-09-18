const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
let students = [
    { id: 1, name: 'John Doe', age: 20 },
    { id: 2, name: 'Jane Smith', age: 22 }
]
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//template literal cuar js; GET /app/students
app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
    console.log(`${req.method} request to ${req.url}`);
});

//GET laays toanf bo students
app.get('/api/students', (req, res) => {
   console.log(`${req.method} request to ${req.url}`);
   res.json(students);
});


//GET lay theo id
app.get('/api/students/:id',(req,res) =>{
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);
    if(student){
       return res.json(student);
    } else{
       return res.status(404).json({
            error: "Student not found"
        })
    }
})

//POST them student moi
app.post('/api/student',(req,res) => {
    const {name,age} = req.body;
    const newStudent = {
        id: students.length + 1, 
        name:name, 
        age:age };
    students.push(newStudent);
    return res.status(200).json({
        message: "Student added successfully",
        data: newStudent
    })
})

app.put('/api/student/:id',(req,res) => {
    const studentId = parseInt(req.params.id);
    const {name,age} = req.body;
    const studentIndex = students.findIndex(s => s.id === studentId);  
    students[studentIndex] = {id: studentId, name:name, age:age};
    return res.status(200).json({
        message: "Student updated successfully",
        data: students[studentIndex]
    })
})

app.delete('/api/student/:id',(req,res) => {
    const studentId = parseInt(req.params.id);
    students = students.filter(s => s.id !== studentId);
    return res.status(200).json({
        message: "Student deleted successfully"
    })
}) 

//DELETE: splice


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})

