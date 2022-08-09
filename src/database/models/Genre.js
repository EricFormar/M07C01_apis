// const { TINYINT, INTEGER } = require("sequelize/types");

module.exports = (sequelize, dataTypes) => {
    let alias = 'Genre';
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING(100),
            allowNull: false,
            validate :{
                notNull :{
                    msg : "El campo 'name' no debe ser nulo"
                },
                notEmpty : {
                    msg : "Debe ingresar el nombre del género"
                }
            }
        },
        ranking: {
            type: dataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            validate :{
                notNull :{
                    msg : "El campo 'ranking' no debe ser nulo"
                },
                isInt : {
                    msg : "El ranking debe ser un número entero"
                }
            }
        },
        active: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            validate :{
                notNull :{
                    msg : "El campo 'active' no debe ser nulo"
                },
                isIn : {
                    args : [[true,false]],
                    msg : "El campo active debe ser booleano"
                },
                   
            }
        }
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        tableName : 'genres'
    }
    const Genre = sequelize.define(alias, cols, config);

    Genre.associate = function(models) {
        Genre.hasMany(models.Movie, { // models.Movies -> Movie es el valor de alias en movie.js
            as: "movies", // El nombre del modelo pero en plural
            foreignKey: "genre_id"
        })
    }

    return Genre
};