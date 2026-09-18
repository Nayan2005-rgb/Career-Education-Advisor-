const JsonDB = require('../config/jsonDb');

const learningPathDb = new JsonDB('learningPaths.json');

const LearningPath = {
  create: (data) => learningPathDb.create(data),
  
  findOne: (query) => learningPathDb.findOne(query),
  
  findById: (id) => learningPathDb.findById(id),
  
  findAll: () => learningPathDb.findAll(),
  
  find: (query) => {
    const items = learningPathDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => learningPathDb.updateById(id, updates),
  
  deleteById: (id) => learningPathDb.deleteById(id)
};

module.exports = LearningPath;