import axios from 'axios';

// 👇 change this if testing on physical device
const BASE_URL = 'http://localhost:5050/api';  // or your local IP address

export const fetchQuestions = async () => {
  const res = await axios.get(`${BASE_URL}/quiz`);
  return res.data;
};
