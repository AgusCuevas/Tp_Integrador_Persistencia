'use strict';
module.exports = (sequelize, DataTypes) => {
  const docente = sequelize.define('docente', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    id_Materia: DataTypes.STRING
  }, {});
  docente.associate = function(models) {
      //asociacion a carrera (pertenece a:)
      docente.belongsTo(models.materia// modelo al que pertenece
        ,{
          as : 'Materia_Relacionada',  // nombre de mi relacion
          foreignKey: 'id_Materia'     // campo con el que voy a igualar
        })
        /////////////////////
  };
  return docente;
};