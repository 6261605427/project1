import  express  from "express";
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";

const salt = 10;



const app = express();    //yha express method ko call kr rhe h
app.use(express.json());
app.use(cors());
app.use(cookieParser());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"

})

app.post('/register', (req, res) =>{
    const sql = "insert into login2 values (?,?,?,?)"
    console.log(   req.body.id)
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) =>{
        if(err) return res.json({error: "error for hassing password"})

        const values = [
            req.body.id,
            req.body.name,
            req.body.email,
    

            hash
        ]
        db.query(sql, values, (err, result)=>{
            if(err) return res.json(err,"inserting data error in server")
            return res.json({status: "success"})
        console.log()
        })
    })
   
})


app.post('/login', (req,res) => {
  const sql ="SELECT * FROM login2 WHERE email = ?";
  db.query(sql,[req.body.email], (err,data) => {
      if(err)  return res.json({Error: "Login error in server"});
      if(data.length > 0){
          bcrypt.compare(req.body.password.toString(), data[0].password, (err,response)=>{
              if(err) return res.json({Error: "Password compare error"});
              if(response){
                  const name = data[0].name;
                  const token = jwt.sign({name}, "jwt-secret-key",{expiresIn: '1d'});
                  res.cookie('token',token);
                  return res.json({Status : "Success"});
              }else{
                  return res.json({Error: "Password not matched"})
              }
   })
      }else{
          return res.json({Error: "No email existed"});
      }
  })
})


// app.get('/getallemployee', async (req, res) => {
//     try {
//         const sqlQuery = `SELECT * FROM login2`
//         await db.query(sqlQuery, (err, result) => {
//             if (err) {
//                 return res.status(404).json({ message: "Not Found" })
//             }
//             res.status(200).json({
//                 success: true,
//                 result
//             })
//         })
//     } catch (error) {
//         res.send({ status: 500, Error: error.message })
//     }
// })


app.listen(4001, ()=>{
    console.log("running")
})                    //server strt kr rhe h