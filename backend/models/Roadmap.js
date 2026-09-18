const JsonDB = require('../config/jsonDb');

const roadmapDb = new JsonDB('roadmaps.json');

const Roadmap = {
  create: (data) => roadmapDb.create(data),
  
  findOne: (query) => roadmapDb.findOne(query),
  
  findById: (id) => roadmapDb.findById(id),
  
  findAll: () => roadmapDb.findAll(),
  
  find: (query) => {
    const items = roadmapDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => roadmapDb.updateById(id, updates),
  
  deleteById: (id) => roadmapDb.deleteById(id)
};

module.exports = Roadmap;
