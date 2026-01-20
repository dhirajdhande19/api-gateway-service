import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "products.json")),
);

export const getAllProdcuts = async (req, res) => {
  return res.json(products);
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id == id);

  if (!product) {
    return res.json({
      message: `No product is associated with the id: ${id}`,
    });
  }

  return res.json(product);
};
