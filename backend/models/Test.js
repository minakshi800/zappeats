import mongoose from 'mongoose'

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Connection Test'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const Test = mongoose.model('Test', testSchema)

export default Test

