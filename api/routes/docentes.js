var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res,next) => {
  console.log("Esto es un mensaje para ver en consola");
  models.docente.findAll({
    attributes: ["id","nombre", "apellido", "id_Materia"],
      /////////se agrega la asociacion 
      include:[{as:'Materia_Relacionada', model:models.materia, attributes: ["id","nombre"]}]
      ////////////////////////////////
    })
    .then(docentes => res.send(docentes))
    .catch(error => { return next(error)});
});

router.post("/", (req, res) => {
  models.docente
    .create({ nombre: req.body.nombre, apellido: req.body.apellido, id_carrera: req.body.id_Materia })
    .then(docente => res.status(201).send({ id: docente.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro docente con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findDocente = (id, { onSuccess, onNotFound, onError }) => {
  models.docente
    .findOne({
      attributes: ["id", "nombre", "apellido", "id_Materia"],
      include:[{as:'Materia_Relacionada', model:models.materia, attributes: ["id","nombre"]}],
      where: { id }
    })
    .then(docente => (docente ? onSuccess(docente) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
    findDocente(req.params.id, {
    onSuccess: docente => res.send(docente),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = docente =>
  docente
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro docente con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
      findDocente(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = docente =>
  docente
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
    findDocente(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
