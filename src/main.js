import express from 'express';
import process from 'process';
import cors from 'cors'

const DuegevBackendAPI = express();
DuegevBackendAPI.use(cors());
DuegevBackendAPI.use(express.json({ type: '*/*' }));


/* ROOT and basic API definitions */
DuegevBackendAPI.get('/', function (req, res) {
  res.send('Welcome To Duegev Wiki Backend');
});

DuegevBackendAPI.listen(
  String(process.env.DUEGEVBACKEND_PORT),
  process.env.DUEGEVBACKEND_IP
);