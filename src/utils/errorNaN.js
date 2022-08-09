module.exports = id => {
    if(isNaN(id)){
        let error = new Error('ID incorrecto');
        error.status = 422;
        throw error
    }
}
