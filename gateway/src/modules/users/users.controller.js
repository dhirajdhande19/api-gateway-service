import axios from "axios";
import { USERS_BASE_URL } from "../../config/env.js";

export const forwardToUserService = async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${USERS_BASE_URL}${req.originalUrl}`,
      headers: { ...req.headers, host: undefined },
      validateStatus: () => true,
    });

    return res.status(response.status).json(response.data);
  } catch (e) {
    console.error({ message: e.message });
    console.log(
      "Bad Gateway or the service you are trying to access is currently offline (asleep)",
    );
    return res.status(503).json({
      message:
        "Bad Gateway or the service you are trying to access is currently offline (asleep)",
    });
  }
};
