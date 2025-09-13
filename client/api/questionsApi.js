import axios from 'axios';

const BASE_URL = 'http://192.168.1.78:5050/api';

export const fetchQuestions = async () => {
  const res = await axios.get(`${BASE_URL}/quiz`);
  console.log('🚀 Response from /quiz:', res.data);  // ✅ log it
  return res.data;
};



export const submitAnswers = async (answers) => {
  const response = await axios.post(`${BASE_URL}/submit`, { answers });
  return response.data;
};
