const addUser = require('./addUserValidation')
const updateUser = require('./updateUserValidation')
const auth = require('./authValidation')
const book = require('./bookValidation') // book api validation
const updateBook = require('./updateBookValidation') // update book api validation

module.exports = {
  addUser,
  updateUser,
  auth,
  book,
  updateBook
}
