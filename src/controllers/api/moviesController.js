const db = require('../../database/models');
const getBaseURL = require('../../utils/getBaseURL');
const getURL = require('../../utils/getURL');
const moment = require('moment');

const throwError = require('../../utils/throwError');
const errorNaN = require('../../utils/errorNaN')

module.exports = {
    list: async (req, res) => {

        try {
            let movies = await db.Movie.findAll({
                include : ['genre']
            });

            movies.forEach(movie => {
                movie.setDataValue("link", getURL(req) + '/' + movie.id)
            });

            console.log(movies)
            return res.status(200).json({
                meta : {
                    status :200,
                    link : getURL(req),
                },
                data : {
                    movies,
                }
            })
          
        } catch (error) {
            return throwError(res, error)
        }
    },
    detail: async (req, res) => {
     
        try {
            errorNaN(req.params.id)

            const movie = await db.Movie.findByPk(req.params.id,
                {
                    include : ['genre']
                })
                if(movie){
                    return res.status(200).json({
                        meta : {
                            status : 200,
                            link : getURL(req),
                        },
                        data : {
                            movie
                        }
                    })
                }else{
                    const error = new Error('Película inexistente');
                    error.status = 404;
                    throw error
                }
           
        } catch (error) {
            return throwError(res,error)
        }
    },
    create: async (req,res) => {
        try {
            req.body.title ? req.body.title = req.body.title.trim() : null;
            req.body.release_date ? req.body.release_date = moment(req.body.release_date).format('YYYY-DD-MM') : null
            const movie = await db.Movie.create({
                ...req.body
            })
            movie.setDataValue("link", getURL(req) + '/' + movie.id)
            return res.status(201).json({
                meta :{
                    status : 201,
                    link : getBaseURL(req,`movies/${movie.id}`),
                    message : 'Película agregada con éxito'
                },
                data : {
                    movie
                }
            })
    
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message : error.errors.map(error => error.message),
            })
        }
    },
     update : async (req,res) => {
        try {

            errorNaN(req.params.id)


            let result = await db.Movie.update(
                {
                    ...req.body
                },
                {
                    where : {
                        id : req.params.id
                    }
                }
            )
            let response;

            if(result[0] === 1){
                response = {
                    meta : {
                        status : 201,
                        msg : "Pelicula actualizada con éxito"
                    },
                }
            }else{
                response = {
                    meta : {
                        status : 201,
                        msg : "No hubo modificaciones en la película"
                    },
                }
            }
           
            return res.status(201).json(response)

        } catch (error) {
            console.log(error)
            return res.status(400).json({ 
                meta : {
                    status : 400
                },
                data : error.errors.map(error => error.message)
            })
        }
    },
     destroy : async (req,res) => {
        try {

            errorNaN(req.params.id)

            let result = await db.Movie.destroy({where : {id : req.params.id},force : true})


                let response = {
                    meta : {
                        status : 201,
                        msg : "Pelicula eliminada con éxito"
                    },
                }
                return res.status(201).json(response)

        

        } catch (error) {
            console.log(error)
            let response = {
                meta : {
                    status : 204,
                    msg : "No se borró ninguna película"
                },
                data : error.original.sqlMessage
            }
            console.log(response)

            return res.status(204).json(response.data)
        }
    },
}