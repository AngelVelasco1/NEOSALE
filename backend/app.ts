import express from 'express';
import { initRoutes } from './routes/router.js';
import { BACK_CONFIG } from './config/credentials.js';
import cors from 'cors';


const app = express();

app.use(cors({
  origin: `http://${BACK_CONFIG.host}:${BACK_CONFIG.front_port}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.use('/api', initRoutes());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(BACK_CONFIG.port, () => {
  console.log(`Servidor corriendo en http://${BACK_CONFIG.host}:${BACK_CONFIG.port}`);
});


