import express, { json, urlencoded } from 'express';
import { photoRoutes } from './routes/photos.js';

const app = express();

app.use(express.json());
app.use("/photos", photoRoutes)

const server = app.listen(3000, () => {
  console.log(`Server running on port ${3000}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});