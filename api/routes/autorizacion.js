let express = require("express");
var app = express();
let router = express.Router();
const models = require("../models");
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login
router.post('/', (req, res) => {
  if(req.body.usuario == 'admin' && req.body.pass == '12345'){
    const payload = {
      check:true 
    };
    const token = jwt.sign(payload, process.env.SECRET,{
      expiresIn:'10d'
    });
    res.json({
      message: 'Autenticacion exitosa!',
      token: token
    });
  }else{
    res.json({
      message: 'Usuario y/o password incorrecta'
    });
  };
});

function verificacion (req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let clave = process.env.SECRET
    //console.log(token);
    if (!token){
        res.status(401).send({
            error: 'Es necesario un token de autenticacion'
        });
        return 
    }
    if (token.startsWith('Bearer ')){
        token = token.slice(7, token.length);
        next()
    }
    if (token){
        jwt.verify(token, clave, (error, decoded) => {
            if (error){
                return res.json({
                    message: 'El token no es valido'
                });
            } else{
                return req.decoded = decoded;
            }
        });
    }
};

router.get('/', verificacion, (req, res) => {
    res.json("INFO IMPORTANTE");
});


module.exports = router;
module.exports.verificacion = verificacion;