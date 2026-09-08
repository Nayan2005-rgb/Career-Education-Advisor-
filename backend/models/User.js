const JsonDB = require('../config/jsonDb');

const userDb = new JsonDB('users.json');

const User = {
  create: (data) => userDb.create(data),
  
  findOne: (query) => userDb.findOne(query),
  
  findById: (id) => userDb.findById(id),
  
  findAll: () => userDb.findAll(),
  
  updateById: (id, updates) => userDb.updateById(id, updates),
  
  deleteById: (id) => userDb.deleteById(id)
};

module.exports = User;