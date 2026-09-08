const JsonDB = require('../config/jsonDb');

const assessmentDb = new JsonDB('assessments.json');

const Assessment = {
  create: (data) => assessmentDb.create(data),
  
  findOne: (query) => assessmentDb.findOne(query),
  
  findById: (id) => assessmentDb.findById(id),
  
  findAll: () => assessmentDb.findAll(),
  
  find: (query) => {
    const items = assessmentDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => assessmentDb.updateById(id, updates),
  
  deleteById: (id) => assessmentDb.deleteById(id)
};

module.exports = Assessment;