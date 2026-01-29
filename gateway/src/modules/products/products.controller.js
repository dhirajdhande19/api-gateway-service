import axios from "axios";
import { PRODUCTS_BASE_URL } from "../../config/env.js";

export const forwardToProductService = async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      headers: req.headers,
      url: `${PRODUCTS_BASE_URL}${req.originalUrl}`,
    });

    return res.status(response.status).json(response.data);
  } catch (e) {
    console.error({ message: e.message });
    return res.status(502).json({ message: "Bad Gateway" });
  }
};
