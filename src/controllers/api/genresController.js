const db = require('../../database/models');
const getBaseURL = require('../../utils/getBaseURL');
const getURL = require('../../utils/getURL');

const throwError = require('../../utils/throwError')

module.exports = {
     list : async (req, res) => {

        try {
            let genres = await db.Genre.findAll();

            genres.forEach(genre => {
                genre.setDataValue("link", getURL(req) + '/' + genre.id)
            });

            return res.status(200).json({
                status : 200,
                meta : {
                    link : getURL(req),
                    total : genres.length
                },
                data : {
                    genres
                }
            })
        } catch (error) {
            console.log(error)
            return throwError(res,error)
        }
    },
    detail : async (req, res) => {
       
        try {
            if(isNaN(req.params.id)){  
                const error = new Error('ID incorrecto');
                error.status = 422;
                throw error
            }
            let genre = await db.Genre.findByPk(req.params.id,{
                include : ['movies']
            })
            if(genre) {
                res.status(200).json({
                    status : 200,
                    meta : {
                        link : getBaseURL(req,`genres/${genre.id}`),
                    },
                    data : {
                        genre
                    }
                })
            }else{
                const error = new Error('Género inexistente');
                    error.status = 404;
                    throw error
            }

        } catch (error) {
            return throwError(res,error)
        }
    },
    create : async (req,res) => {
        
        try {

            req.body.name ? req.body.name = req.body.name.trim() : null

            const genre = await db.Genre.create({
                ...req.body
            })
            return res.status(201).json({
                meta : {
                    status : 201,
                    link : getBaseURL(req,`genres/${genre.id}`),
                },
                message : 'Género agregado con éxito'
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
            if(isNaN(req.params.id)){  
                const error = new Error('ID incorrecto');
                error.status = 422;
                throw error
            }

            const result = await db.Genre.update(
                {
                    ...req.body
                },
                {
                    where : {
                        id : req.params.id
                    }
                }
            )
            if (result[0]) {
                return res.status(201).json({
                    meta : {
                        status : 201,
                        link : getBaseURL(req,`genres/${genre.id}`),
                    },
                    message : 'Género actualizado con éxito'
                })
            } else {
                return res.status(200).json({
                    msg: "No se hicieron cambios"
                })
            }

        } catch (error) {
             return res.status(400).json({
                status: 400,
                message : error.errors.map(error => error.message),
            })
        }
    }

}