import axios from "axios";
import { ORDERS_BASE_URL } from "../../config/env.js";

export const forwardToOrdersService = async (req, res) => {
  try {
    console.log({
      method: req.method,
      url: `${ORDERS_BASE_URL}${req.originalUrl}`,
      headers: { ...req.headers, host: undefined },
    });
    const response = await axios({
      method: req.method,
      url: `${ORDERS_BASE_URL}${req.originalUrl}`,
      headers: { ...req.headers, host: undefined },
      validateStatus: () => true,
    });
    console.log(response.data);

    return res.status(response.status).json(response.data);
  } catch (e) {
    console.error({ message: e?.message });

    if (e.response) {
      return res.status(e.response.status).json(e.response.data);
    }

    return res.status(503).json({ message: "Bad Gateway" });
  }
};
