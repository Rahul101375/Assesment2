const express=require('express')
const dotenv=require('dotenv')
const mysql=require('mysql');

var mysqlConnection=mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"",
    database:'employeedb'
})

mysqlConnection.connect((err)=>{
    if(!err){
        console.log("DB Connected")
    }
    else{
        console.log("DB Connection failed")
    }
})

const cors = require('cors');
dotenv.config()
const app=express();
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
  let getQuery='select * from `user`';
  mysqlConnection.query(getQuery,(err,result)=>{
    if(err) throw err
    res.status(201).json({success:true,data:result,message:'Data Store'})
  })
})
app.get('/:id',(req,res)=>{
    let id=req.params.id;
    let getQuery='select * from `user` where `id`=?';
    let query=mysql.format(getQuery,[id]);
    mysqlConnection.query(query,(err,result)=>{
        if(err) throw err;
        let stringType=JSON.stringify(result);
        let json=JSON.parse(stringType);
        res.status(200).json({success:true,message:'get By Id Api call',data:json}) 
        
    })
  })

app.post('/',(req,res,err)=>{
    name=req.body.userName;
    email=req.body.email;
    contact=req.body.contact;
    status=req.body.status
    let insertQuery='insert into `user` (`name`,`email`,`contact`,`status`) VALUE(?,?,?,?)'
    let query=mysql.format(insertQuery,[name,email,contact,status]);
    mysqlConnection.query(query,(err,responses)=>{
        if(err){
         throw err;
        }
        res.status(200).json({success:true,message:'Data Store'})

    })
})

app.put('/:id',(req,res)=>{
    const data=[req.body.userName,req.body.email,req.body.contact,req.body.status,req.params.id];
    mysqlConnection.query('UPDATE `user` SET `name`=?,`email`=?,`contact`=?,`status`=? where `id`=?',data,(err,result)=>{
        if(err) throw err;
        res.status(200).json({success:true,message:'Data Updated',data:result})
    })
})
app.post("/:id",(req,res)=>{
    console.log(req.body)
    let id=req.params.id;;
    name=req.body.name;
    email=req.body.email;
    contact=req.body.contact;
    status=req.body.status;
    let updateQuery='UPDATE `user` SET `name`=?,`email`=?`contact`=?`status`=? where `id`=?';
    let query=mysql.format(updateQuery,[name,email,contact,status,id]);
    mysqlConnection.query(query,(err,result)=>{
        if(err) throw err;
        res.status(200).json({success:true,message:'Data Updated',data:result}) 
    })
})

app.delete('/:id',(req,res)=>{
    let id=req.params.id;
    let deleteQuery='delete  from `user` where `id`=?';
    let query=mysql.format(deleteQuery,[id]);
    mysqlConnection.query(query,(err)=>{
        if(err) throw err;
        res.status(200).json({success:true,message:'delete successfully'}) 
        
    })
  })


// Connection with server
const Port= process.env.PORT|| 5000
app.listen(Port,()=>{console.log(`connected port:${Port}`)})