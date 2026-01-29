import axios from "axios";
import { PRODUCTS_BASE_URL } from "../../config/env.js";

export const forwardToProductService = async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${PRODUCTS_BASE_URL}${req.originalUrl}`,
      headers: { ...req.headers, host: undefined },
      validateStatus: () => true,
    });

    return res.status(response.status).json(response.data);
  } catch (e) {
    console.error({ message: e.message });

    if (e.response) {
      return res.status(e.response.status).json(e.response.data);
    }

    return res.status(502).json({ message: "Bad Gateway" });
  }
};
