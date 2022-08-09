module.exports = (res, error) => {
    return res.status(error.status).json({
        status : error.status || 500,
        message : error.message
    }) 
}