const express = require('express');
const app = express();
const multer = require("multer");
const Tesseract = require("tesseract.js");
const { dirname } = require('path');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer({storage:storage});

app.set("view engine","ejs");
app.use(express.static("public"));

app.get('/',(req,res)=>{
    res.render('index',{title:"",converted:""});
});


app.post('/upload',upload.single('uploadedImage'),(req,res)=>{
    
    try{
        Tesseract.recognize(
            'uploads/'+req.file.filename,
            'eng',
            {logger:m => console.log(m)}
        ).then(({data:{text}})=>{
            console.log(text);
            res.render('index',{ title:"Converted text",converted:text});
        })

    }catch(error){
        console.error(error)
    }
})


app.listen(4000,()=>{
    console.log("server is up and running (localhost:4000)");
})