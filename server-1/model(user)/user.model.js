import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  stream: String,
  goal: String,
  knowledge: Number,
});

export default mongoose.model('User', userSchema);
