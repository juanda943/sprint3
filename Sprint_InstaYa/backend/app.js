// Importo las librerias que necesito
const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

// Agregando cors
const cors = require("cors");
app.use(cors());

// Agregando bcrypt
const bcrypt = require("bcryptjs");

// Colocar el engine - Usara template de JS en Node
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// Añadiendo JsonWebToken
const jwt = require("jsonwebtoken");

// Añadiendo Nodemailer
var nodemailer = require("nodemailer");

// ------------------------------------------------------------------------------

// Añadiendo caracteres para desencriptado
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// Codigo de MongoDb Atlas
const mongoUrl =
  "mongodb+srv://test:123@ciclo4prueba.mokyyhr.mongodb.net/?retryWrites=true&w=majority";

// Realizar conexión a la Base de datos
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Conectado a la Base de datos");
  })
  .catch((err) => console.log(err));

// !important!
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv

// Llamar a UserDetails
require("./userDetails");

const User = mongoose.model("UserInfo");

// Página de registro
app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  // Constante para encriptar la contraseña
  const encryptedPassword = await bcrypt.hash(password, 10);

  // Usando try catch para creación de usuario
  try {
    // Encontrar si ya hay un usuario:
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      res.send({ error: "Usuario ya existe!!" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// Página de login
app.post("/login-user", async (req, res) => {
  // Request body - Email y contraseña
  const { email, password } = req.body;

  // Verificar si existe
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "Usuario no encontrado" });
  }

  // Verificar clave desencriptada
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    // Si es válido el email con ese usuario - Status HTTP 201: Created - Solicitud con exito
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "Error, vuelva a intertarlo!!" });
    }
  }
  res.json({ status: "error", error: "Contraseña incorrecta!!" });
});

// Página del Usuario
app.post("/userData", async (req, res) => {
  const { token } = req.body;

  // Verificar si el token es el correcto
  try {
    const user = jwt.verify(token, JWT_SECRET);
    console.log(user);

    const userEmail = user.email;
    // Aplicando una promesa
    User.findOne({ email: userEmail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

// Página para olvidar contraseña
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log(email);
  //Try-catch - Verificar que el email exista
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "El usuario no existe!!" });
    }

    // Genera secret - Para crear el token - Proveer link a ser enviado al usuario
    // Tener correo y id - Expira en 5 min
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });

    // Link a enviar - Donde esta alojado el servidor de node.js
    // Cambiar cuando se vaya a colocar en sitio http://localhost:5000
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;

    // Aqui coloco el nodemailer -- https://www.w3schools.com/nodejs/nodejs_email.asp
    var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ferfajrod@gmail.com",
        pass: "tlleothhteubbnao",
      },
    });

    var mailOptions = {
      from: "ferfajrod@gmail.com",
      to: email,
      subject: "InstaYa - Reestablecer contraseña",
    //   text: link,
      html:`<div> 
            <p>Buen día:</p> 
            <p>Este es el enlace para realizar la recuperación de la contraseña: </p> 
            <p>${link}</p>
            <p>Recuerda que este enlace solo es válido por 5 minutos, Gracias</p> 
            <p>El equipo de InstaYa</p>
            </div> `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    console.log(link);
  } catch (error) {}
});

// Recuperar password - Middleware - Deber ser con ID y token en la direccion
app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  // Verificar que el ID exista
  const oldUser = await User.findOne({ _id: id });

  if (!oldUser) {
    return res.json({ status: "El usuario no existe!!" });
  }

  // Verificar que el Token sea el correcto
  const secret = JWT_SECRET + oldUser.password;

  try {
    const verify = jwt.verify(token, secret);

    // Renderizando a vista ejs
    res.render("index", { email: verify.email, status: "Not Verified" });
    // res.send("Email verificado")
  } catch (error) {
    console.log(error);
    res.send("No se verifico");
  }
});

// Recuperar password - Con Post
app.post("/reset-password/:id/:token", async (req, res) => {
  // Verifico que ID y token sean corrrectos
  const { id, token } = req.params;
  const { password } = req.body;
  // Verificar que el ID y token sean verdaderos
  const oldUser = await User.findOne({ _id: id });

  if (!oldUser) {
    return res.json({ status: "El usuario no existe!!" });
  }

  const secret = JWT_SECRET + oldUser.password;

  try {
    // Verificar token y secret - Con el password a cambiar
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    // Actualizar la contrseña una vez - Y cambiarla
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    // res.json({status: "Contraseña actualizada"});

    // Renderizando a vista ejs
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "No se pudo realizar!!" });
  }
});

// Conexíon al servidor
app.listen(5000, () => {
  console.log("> Server is up and running on port : 5000");
});
