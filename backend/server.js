import express, { json, urlencoded } from 'express';
import { photoRoutes } from './routes/photos.route.js';
import { albumRoutes } from './routes/albums.route.js';
import { personRoutes } from './routes/people.route.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("backend/uploads"))
app.use("/photos", photoRoutes)
app.use("/albums", albumRoutes)
app.use("/people", personRoutes)
app.use(errorHandler)

function startServer() {
  const server = app.listen(3000, () => {
    console.log(`Server running on port ${3000}`);
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
  });
}

if (!process.env.TEST_ENV) startServer()