import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const getDecodedToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log("⚠️ No token found in storage");
      return null;
    }

    const res = await axios.get("http://192.168.8.120:5050/api/decode", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      return res.data.decoded; // { username, specialization, skill, level, ... }
    } else {
      console.log("⚠️ Decode failed:", res.data.error);
      return null;
    }
  } catch (err) {
    console.error("API Error in getDecodedToken:", err.message);
    return null;
  }
};
