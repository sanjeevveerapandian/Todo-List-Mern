//Express
const express = require('express');
const mongoose = require('mongoose');

//create an instance of express
const app=express();
app.use(express.json())
//Sample in-memory storage for todo items
//let todos = [];

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/todo-list')
.then(()=>{
  console.log('Db Connected')
})
.catch(()=>{
  console.log(err)
})

//creating schema
const todoschema = new mongoose.Schema({
  title:{
    required:true, //it checks wheather you have send the title or not
    type:String
  },
  description:String
})

//creating model
const todoModel = mongoose.model('Todo',todoschema);


//Create a new todo item
app.post('/todos',async(req,res)=>{
  const{title,description}= req.body;
  // const newTodo = {
  //   id: todos.length +  1,
  //   title,
  //   description
  // };
  // todos.push(newTodo);
  // console.log(todos);

  try{
    const newTodo = new todoModel({title,description});
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch(error){
    console.log(error)
    res.status(500).json({message:error});
  }

  
});

//Get all items
app.get('/todos',async(req,res)=>{
  try{
   const todos= await todoModel.find();
   res.json(todos);
  }catch (error){
    console.log(error)
    res.status(500).json({message:error.message});   
  }
  res.json(todos);
})

//Start the server
const port = 3000;
app.listen(port,()=>{
  console.log("server is listening to port"+port);
})