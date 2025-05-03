const db = require('../db');

const Job = {
  getAll: (callback) => {
    const query = 'SELECT * FROM jobs';
    db.query(query, callback);
  },

  create: (jobData, callback) => {
    const query = 'INSERT INTO jobs SET ?';
    db.query(query, jobData, callback);
  },

  update: (id, jobData, callback) => {
    const query = 'UPDATE jobs SET ? WHERE id = ?';
    db.query(query, [jobData, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM jobs WHERE id = ?';
    db.query(query, id, callback);
  }
};

module.exports = Job;
