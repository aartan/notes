import express from "express";
import userRoutes from "./routes/users.js";
import noteRoutes from "./routes/notes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/notes", noteRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;