import express from 'express';
import process from 'process';
import cors from 'cors'

const DuegevBackendAPI = express();
DuegevBackendAPI.use(cors());
DuegevBackendAPI.use(express.json({ type: '*/*'}));


/* ROOT and basic API definitions */
DuegevBackendAPI.get('/', function (req, res) {
  res.send('API-at-home root')
});

DuegevBackendAPI.listen('3000', 'localhost');