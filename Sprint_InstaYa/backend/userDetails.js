const mongoose = require('mongoose');

// Creando Schema para la BD  - Registro
const userDetailsSchema = new mongoose.Schema(
    {
        fname: String,
        lname: String,
        email: {type: String, unique: true},
        password: String,
    },
    {
        collection: "UserInfo",
    });

// Llamar el modelo
mongoose.model("UserInfo",userDetailsSchema);