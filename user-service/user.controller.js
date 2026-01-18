import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = JSON.parse(fs.readFileSync(path.join(__dirname, "users.json")));

export const getAllUsers = async (req, res) => {
  return res.json(users);
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id == id);
  if (!user) {
    return res.json({
      message: `No user is associated with the user_id: ${id}`,
    });
  }
  return res.json(user);
};
