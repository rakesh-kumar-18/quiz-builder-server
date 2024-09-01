const express = require('express');
const { verifyToken } = require('../middleware/verifyToken');
const {
  createQuize,
  getAllquizes,
  getAllquizeData,
  updateQuize,
  getQuizebyid,
  deleteQuize,
  getQuizeDetailbyid,
  setImpressins,
  getTrendingQuize,
  setAnalytics,
} = require('../controller/quize');
const quizeRouter = express.Router();

quizeRouter.post('/createQuiz', verifyToken, createQuize);
quizeRouter.get('/getAllquize', verifyToken, getAllquizes);
quizeRouter.get('/getAllquizeData', verifyToken, getAllquizeData);
quizeRouter.patch('/updateQuize/:id', verifyToken, updateQuize);
quizeRouter.get('/getQuizebyid/:id', verifyToken, getQuizebyid);
quizeRouter.delete('/deleteQuize/:id', verifyToken, deleteQuize);
quizeRouter.get('/getQuizeDetailbyid/:id', getQuizeDetailbyid);
quizeRouter.patch('/setImpressins/:id', setImpressins);
quizeRouter.get('/getTrendingQuize', verifyToken, getTrendingQuize);
quizeRouter.put('/setAnalytics/:id', setAnalytics);
module.exports = quizeRouter;
