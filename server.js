const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const multer = require('multer');
const mimetypes = require('mime-types');
const moment = require('moment');
const cors = require('cors');
const xls = require('xlsx');
const url = require('url');  
const { dirname } = require('path');
const ejs = require('ejs');
const fs = require('fs');
const Info = require('./src/Models/Info');
const TrueVidaClient = require('./src/Models/TrueVidaClient');


app.use(cors());

app.use(express.urlencoded({
    extended: true
  }));


require('./src/database');

app.set('view engine', 'ejs');


function leerExcel(ruta){
    try {
        const libro = xls.readFile(ruta);
        const hojas = libro.SheetNames;
        const hoja = hojas[0];
        const data = xls.utils.sheet_to_json(libro.Sheets[hoja]);
        //console.log(data);
        return data;  
    } catch (error) {
        console.error(error);
        return
    }
}



const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req,file,cb){
        // cb('', file.originalname + '.' + mimetypes.extension(file.mimetype))
        // cb('', file.originalname)  
        cb('', 'Book1.xlsx')  
    }
});
  


app.get('/', async(req,res)=>{
    const info = await Info.find();
    const clients = await TrueVidaClient.find();
    res.render(__dirname + '/views/index', {info, clients});
});



const upload = multer({storage: storage});


app.get('/files', (req,res)=>{
    res.render(__dirname + '/views/files');
});


app.post('/files', upload.single('avatar') , async(req,res)=>{
    data = leerExcel(__dirname + '/uploads/Book1.xlsx');
    data.forEach(async e => {
        const info = new Info();
            info.clientid = e.ClientID
            info.nombre = e.ClientFirstName;
            info.apellido = e.ClientLastName;
            info.aua = e.AUA;
            info.fecha = moment().format("MMM Do YYYY");
        await info.save();
    });
    res.render(__dirname + '/views/tabla' , {data});
    fs.unlink(__dirname + '/uploads/Book1.xlsx', (err) =>{
        if (err){
            console.error(err);
            return
        }
    })
});



app.get('/newclient', async(req,res)=>{
    res.render(__dirname + '/views/newclient');
});



app.post('/newclient', async(req,res)=>{
    const client = new TrueVidaClient();
        client.clientid = req.body.clientid;
        client.nombre = req.body.nombre;
        client.apellido = req.body.apellido;
        client.fechaReset = req.body.fechaReset;
        client.valorReset = req.body.valorReset;
        console.log(client);
    await client.save();
    res.redirect('/');
});


app.get('/client/:id', async(req,res)=>{
    const id = req.params.id;
    const info = await Info.find({clientid: id});
    const clients = await TrueVidaClient.find();
    res.render(__dirname + '/views/client', {info, clients});
});


app.use(express.static(__dirname + '/src/public'));



app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});