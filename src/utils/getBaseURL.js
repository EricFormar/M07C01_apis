module.exports = (req,route) => `${req.protocol}://${req.get('host')}/api/${route}` ;