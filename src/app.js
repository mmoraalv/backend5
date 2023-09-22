import 'dotenv/config' //Permite utilizar variables de entorno
import express from 'express';
import multer from 'multer'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import messageModel from './models/messages.models.js';
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import messageRouter from './routes/messages.routes.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
//import cartModel from './models/carts.models.js';


const PORT = 8080;
const app = express();

//Conexión con bd Mongo
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("BDD conectada"))
    //await cartModel.create({})
    .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))


//Server
const server = app.listen(PORT,()=>{
    console.log(`Server on port: ${PORT}`);
})

const io = new Server(server)


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //URL extensas
app.use(cookieParser(process.env.SIGNED_COOKIE))


//Handlebars
app.engine('handlebars', engine()) //Defino que voy a trabajar con Handlebars
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))


//Conexion de Socket.io

const mensajes = []

io.on('connection', socket => {
	console.log('Conexión con Socket.io');

    socket.on('mensaje', async info => {
        console.log(info);
        mensajes.push(info);
        io.emit('mensajes', mensajes);

        // Guardar el mensaje en la base de datos utilizando el modelo
        try {
            await messageModel.create({
                user: info.user,
                mensaje: info.mensaje
            });
        } catch (error) {
            console.error("Error al guardar el mensaje en la base de datos:", error);
        }
    });
});

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))

app.get('/static', (req, res) => {
	res.render('index', {
		rutaCSS: 'index',
		rutaJS: 'index',
	});
});

app.get('/static/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'realTimeProducts',
	});
});

app.get('/static/chat', (req, res) => {
	res.render('chat', {
		rutaCSS: 'chat',
		rutaJS: 'chat',
	});
});

app.use('/api/carts', cartRouter)
app.use('/api/products', productRouter)
app.use('/api/messages', messageRouter)

//Cookies
app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es el valor de una cookie').send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.cookies) //Consultar solo las cookies firmadas
    //res.send(req.cookies) Consultar TODAS las cookies
})

//Multer

//Config Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb => callback
        cb(null, 'src/public/img') //el null hace referencia a que no envie errores
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`) //concateno la fecha actual en ms con el nombre del archivo
        //1232312414heladera-samsung-sv
    }
})

const upload = multer({ storage: storage })

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
})
