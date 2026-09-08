const JsonDB = require('../config/jsonDb');

const careerPathDb = new JsonDB('careerPaths.json');

const CareerPath = {
  create: (data) => careerPathDb.create(data),
  
  findOne: (query) => careerPathDb.findOne(query),
  
  findById: (id) => careerPathDb.findById(id),
  
  findAll: () => careerPathDb.findAll(),
  
  updateById: (id, updates) => careerPathDb.updateById(id, updates),
  
  deleteById: (id) => careerPathDb.deleteById(id)
};

module.exports = CareerPath;