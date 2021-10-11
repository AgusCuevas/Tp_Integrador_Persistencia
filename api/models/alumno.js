'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define('alumno', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    id_Carrera: DataTypes.INTEGER
  }, {});
  alumno.associate = function(models) {
    //asociacion a carrera (pertenece a:)
  	alumno.belongsTo(models.carrera// modelo al que pertenece
      ,{
        as : 'Carrera_Cursada',  // nombre de mi relacion
        foreignKey: 'id_carrera'     // campo con el que voy a igualar
      })
      /////////////////////
  };
  return alumno;
};