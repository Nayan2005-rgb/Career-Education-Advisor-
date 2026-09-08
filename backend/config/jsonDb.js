const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonDB {
  constructor(filename) {
    this.filePath = path.join(DATA_DIR, filename);
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]');
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${this.filePath}:`, error);
    }
  }

  findAll() {
    return this.read();
  }

  findById(id) {
    const items = this.read();
    return items.find(item => item.id === id);
  }

  findOne(query) {
    const items = this.read();
    return items.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  create(data) {
    const items = this.read();
    const newItem = {
      id: this.generateId(),
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  updateById(id, updates) {
    const items = this.read();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      id, // Preserve original ID
      updatedAt: new Date().toISOString()
    };
    this.write(items);
    return items[index];
  }

  deleteById(id) {
    const items = this.read();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    items.splice(index, 1);
    this.write(items);
    return true;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = JsonDB;