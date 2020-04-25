const express = require ('express');
const bodyParser = require ("body-parser");
const path = require ('path');
const Joi = require ('joi');


const db = require("./db");
const collection = "todo";
const app = express();
require('dotenv').config();



const schema =  Joi.object().keys({
    todo : Joi.string().required()
});

app.use(bodyParser.json());


//get 
app.get('/',(req,res) =>{
   res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getTodos',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
if(err)
        console.log(err);
    else{
        
        res.json(documents);
    }
    });

});

//update 
app.put('/:id',(req,res)=>{
const todoID = req.params.id;
const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(todoID)},{$set : {todo : userInput.todo}},{returnOriginal : false},(err,result)=>{
    if(err)
     console.log(err);
     else{
     res.json(result);
    }
});

});


//post
app.post('/', (req,res,next)=>{

    const userInput = req.body;
    
    Joi.validate(userInput,schema,(err,result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }
        else{
             
            db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
                if(err){
                    const error = new Error("Failed to insert new review");
                    error.status = 400;
                    next(error);
                }
                  else 
                          res.json({result : result, document : result.ops[0], msg:"Successfully inserted a new review", error : null});
                     });
        }
    })

});

//delete
app.delete('/:id',(req,res)=>{

    const todoID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(todoID)},(err,result)=>{
        if(err)
            console.log(err);

            else 
                res.json(result);

    });
});
//middler error handler
app.use((err,req,res,next)=>{
    res.status(err.status).json({
        error:{
            message : err.message
        }
    });
})


app.post('/',(req,res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
        if(err)
        console.log(err);
        else 
        res.json({result : result, document : result.ops[0]});
    });

});
 
db.connect((err)=>{
    if(err){
        console.log('unable to connect to the database');
        process.exit(1);
    }
    else{
        app.listen(process.env.PORT || 3000,()=>{ 
            console.log('connected to database, app listening on port 3000');
        });
    }

})