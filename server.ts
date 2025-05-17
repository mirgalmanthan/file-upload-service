import express from 'express';
import * as dotenv from 'dotenv';
import authRouter from './src/routers/auth';

dotenv.config();
const app = express();
app.use(express.json())

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send({ 
    message: "Hello Files API",
  });
});

app.use('/auth', authRouter);



const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


function shutdown() {
  console.log('Received shutdown signal. Closing server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0); 
  });

  // Force shutdown if it takes too long
  setTimeout(() => {
    console.error('Forcefully shutting down...');
    process.exit(1);
  }, 10000); 
}

// Listen for termination signals
process.on('SIGINT', shutdown);  // Ctrl+C
process.on('SIGTERM', shutdown); // `kill` command or container stop
