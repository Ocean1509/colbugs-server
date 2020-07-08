const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    unique: true,
    require: true
  },
  info: {
    type: String,
  },
  uuid: {
    type: String,
    require: true 
  }
});


module.exports = mongoose.model('Project', ProjectSchema);
