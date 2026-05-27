import express from "express";
import userRoutes from "./routes/users.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/users", userRoutes);

app.get("/api/hello", (req, res) => {
    res.status(200).json({ message: "Hello World" });
});

app.post("/api/sum", (req, res) => {
    const { a, b } = req.body;
    res.json({ result: a + b });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;