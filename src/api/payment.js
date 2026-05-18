import axios from "axios";

const API = axios.create({
  baseURL: "https://payment-assignment.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export const initiatePayment = async (
  payload,
  hash
) => {
  try {
    const response = await API.post(
      "/initiate-payment",
      JSON.stringify(payload),
      {
        headers: {
          Hash: hash,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Payment API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};