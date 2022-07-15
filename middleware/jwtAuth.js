const jwt = require('jsonwebtoken')

module.exports = (expectedRole) => (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    const error = new Error('Not authenticated.')
    error.statusCode = 401
    throw error
  }
  const token = authHeader.split(' ')[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY)
  } catch (err) {
    err.statusCode = 401
    throw err
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.')
    error.statusCode = 401
    throw error
  }

  const role = decodedToken.role

  if (expectedRole !== role) {
    const error = new Error('Not authorised.')
    error.statusCode = 401
    throw error
  }

  req.user = decodedToken
  next()
}
