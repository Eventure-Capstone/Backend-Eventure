import { app } from "./src/application/app.js";

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});
