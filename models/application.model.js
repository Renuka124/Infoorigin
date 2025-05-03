const db = require('../db');

const Application = {
  getAll: (callback) => {
    const query = 'SELECT * FROM applications';
    db.query(query, callback);
  },

  create: (applicationData, callback) => {
    const query = 'INSERT INTO applications SET ?';
    db.query(query, applicationData, callback);
  },

  update: (id, applicationData, callback) => {
    const query = 'UPDATE applications SET ? WHERE id = ?';
    db.query(query, [applicationData, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM applications WHERE id = ?';
    db.query(query, id, callback);
  }
};

module.exports = Application;
