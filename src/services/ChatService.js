import axios from "axios";

const API_URL = "/chat"; // Use relative URL; frontend proxy forwards to backend

const sendMessage = async (message) => {
  try {
    const response = await axios.post(API_URL, { message });
    return response.data.reply || "Sorry, I didn't understand that.";
  } catch (error) {
    console.error("Chat API error:", error);
    throw new Error("Chat API request failed");
  }
};

export default { sendMessage };
