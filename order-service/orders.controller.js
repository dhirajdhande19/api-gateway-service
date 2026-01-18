import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const orders = JSON.parse(fs.readFileSync(path.join(__dirname, "orders.json")));

export const getAllOrders = async (req, res) => {
  return res.json(orders);
};

export const getOrder = async (req, res) => {
  const { id } = req.params;
  const order = orders.find((o) => o.order_id == id);
  if (!order) {
    return res.json({
      message: `No order is associated with the order_id: ${id}`,
    });
  }
  return res.json(order);
};
