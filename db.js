const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = "crud_mongodb";
const url = '';
const mongoOptions = {
    useNewUrlParser : true,
    useUnifiedTopology: true
};

const state = {

    db:null
};

const connect =(cb,url)=>{
        if(state.db)
        
    cb();
    else{        
        MongoClient.connect(process.env.MONGO_URL,mongoOptions,url,(err,client)=>{
            if(err)
             cb(err);
            else{
                state.db = client.db(dbname);
                cb();
            }
        });
    }
}
    const getPrimaryKey = (_id) =>{

        return ObjectID(_id);
    }

    const getDB = () =>{
        return state.db;
    }

    module.exports = {getDB,connect,getPrimaryKey};