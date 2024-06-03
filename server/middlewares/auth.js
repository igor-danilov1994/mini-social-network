const jwt  = require('jsonwebtoken')


const checkToken = (req, res, next) => {
    const header = req.headers['authorization']
    const token = header?.split(' ')[1]

    if (!token){
        return res.status(401).json({error: 'Not authorization'})
    }

    jwt.verify(token, 'user', (error, user) => {
        if (error){
            return res.status(401).json({error: 'Invalid token'})
        }

        req.user = user

    })

    next()
}


module.exports = checkToken