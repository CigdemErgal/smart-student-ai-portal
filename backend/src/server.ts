//-------------------DAY 1------------//
import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

//app listen ile server'ı başlat
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
