import axios from "axios";
import { ORDERS_BASE_URL } from "../../config/env.js";

export const forwardToOrdersService = async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${ORDERS_BASE_URL}${req.originalUrl}`,
      headers: req.headers,
    });
    return res.status(response.status).send(response.data);
  } catch (e) {
    return res.status(503).send({ message: "Bad Gateway" });
  }
};
