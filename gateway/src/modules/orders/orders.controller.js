import axios from "axios";
import { ORDERS_BASE_URL } from "../../config/env.js";

export const forwardToOrdersService = async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${ORDERS_BASE_URL}${req.originalUrl}`,
      headers: req.headers,
    });

    return res.status(response.status).json(response.data);
  } catch (e) {
    console.error({ message: e.message });
    return res.status(503).json({ message: "Bad Gateway" });
  }
};
