const JsonDB = require('../config/jsonDb');

const skillGapDb = new JsonDB('skillGaps.json');

const SkillGap = {
  create: (data) => skillGapDb.create(data),
  
  findOne: (query) => skillGapDb.findOne(query),
  
  findById: (id) => skillGapDb.findById(id),
  
  findAll: () => skillGapDb.findAll(),
  
  find: (query) => {
    const items = skillGapDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  updateById: (id, updates) => skillGapDb.updateById(id, updates),
  
  deleteById: (id) => skillGapDb.deleteById(id)
};

module.exports = SkillGap;
