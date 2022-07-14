const express = require('express')
const router = express.Router()

const userController = require('../../controllers/common/bookController')
const Validator = require('../../utils/validateRequest')
const auth = require('../../middleware/jwtAuth')

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post(
  '/',
  auth,
  Validator('book'),
  use(userController.addBook)
)

router.get('/:id', auth, use(userController.getBook))

router.get('/', auth, use(userController.getAllBooks))

router.put(
  '/:id',
  auth,
  Validator('updateBook'),
  use(userController.updateBook)
)

router.delete('/:id', auth, use(userController.deleteBook))

module.exports = router
