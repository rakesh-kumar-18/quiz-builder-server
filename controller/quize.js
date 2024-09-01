const Quize = require('../models/quiz');

const createQuize = async (req, res) => {
  const { slides, quizeName, quizeType, timer, quizAnalytic } = req.body;
  const userId = req.userId;
  console.log(quizAnalytic);
  if (
    !quizeName ||
    !quizeType ||
    !slides ||
    !userId ||
    !timer ||
    !quizAnalytic
  ) {
    return res.status(400).send({
      message: 'Allfields Are required',
    });
  }
  try {
    const newQuize = new Quize({
      quizeName,
      quizeType,
      slides,
      userId,
      timer,
      analytics: quizAnalytic,
    });
    const docData = await newQuize.save();

    res.send({
      status: 1,
      documentId: docData._id,
      message: 'Quize created Successfully',
    });
  } catch (error) {
    res.status(400).send({
      status: 0,
      message: 'Error in Quize creation',
    });
    console.log('creationQuize', error);
  }
};
//getting all the required quize data for dashboard
const getAllquizes = async (req, res) => {
  const userId = req.userId;

  try {
    const allQuizes = await Quize.find(
      { userId },
      { quizeName: 1, dateCreated: 1, impressionCount: 1 },
    );
    if (!allQuizes) {
      return res.send({
        message: 'no quizes available',
        status: 0,
      });
    }
    res.send({
      status: 1,
      quizes: allQuizes,
    });
  } catch (error) {
    res.status(400).send({
      message: 'error in allQuize Access',
    });
  }
};

//getting the datas of quizes for dashboard
const getAllquizeData = async (req, res) => {
  const userId = req.userId;

  try {
    const allQuizes = await Quize.find({ userId });
    let totalQustions = 0;
    let totalImpression = 0;
    if (!allQuizes) {
      return res.send({
        message: 'no quizes available',
        status: 0,
      });
    }
    const toalQuizeno = allQuizes.length;
    for (let i = 0; i < allQuizes.length; i++) {
      totalQustions += allQuizes[i].slides.length;
      totalImpression += allQuizes[i].impressionCount;
    }
    res.send({
      status: 'success',
      toalQuizeno,
      totalQustions,
      totalImpression,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'error in getAllquizeData',
    });
  }
};

//this specific controller only use for updation
const getQuizebyid = async (req, res) => {
  const { id } = req.params;
  try {
    const quizSlide = await Quize.findById(id).select('slides timer quizeType');
    if (!quizSlide) {
      return res.status(400).json({ message: 'quiz not found' });
    }
    res.send({
      quizSlide,
      message: 'successfull',
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: 'failed',
      message: 'error in get story by id ed',
    });
  }
};

const updateQuize = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { slides, timer } = req.body;
  try {
    const quiz = await Quize.findById(id);
    if (!quiz) {
      res.status(400).json({ message: 'quiz not found' });
    }
    quiz.slides = slides;
    quiz.timer = timer;
    await quiz.save();
    res.send({
      message: 'quiz edited successFully',
    });
  } catch (error) {
    res.status(400).json({ message: 'error in quize edit' });
  }
};
const deleteQuize = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const quiz = await Quize.find({ _id: id, userId });
    console.log(quiz);
    if (!quiz) {
      return res.status(400).send({
        status: 'failed',
        message: 'Quiz not found for deletion',
      });
    }

    await Quize.findByIdAndDelete(id);

    res.send({
      status: 1,
      message: 'Quiz Deleted',
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: 'failed',
      message: 'error in story deletion',
    });
  }
};
//this is use for getting the id
const getQuizeDetailbyid = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quize.findById(id);
    if (!quiz) {
      return res.status(400).json({ message: 'quiz not found' });
    }
    res.send({
      quiz,
      message: 'successfull',
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: 'failed',
      message: 'error in get story by id ed',
    });
  }
};
//this is a patch request for impression count
const setImpressins = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quize.findById(id);
    if (!quiz) {
      return res.status(400).json({ message: 'quiz not found' });
    }
    quiz.impressionCount += 1;
    await quiz.save();
    res.send({
      message: 'quiz impression couted successfully',
    });
  } catch (error) {
    res.status(400).send({
      status: 'failed',
      message: 'error in impression count ',
    });
  }
};

//get the trending quizes quizname,impressions,created
const getTrendingQuize = async (req, res) => {
  const userId = req.userId;
  try {
    // Find quizzes for the user and project only the fields needed
    const quizes = await Quize.find(
      { userId },
      { quizeName: 1, impressionCount: 1, dateCreated: 1 },
    );

    if (!quizes || quizes.length === 0) {
      return res.status(400).json({ message: 'quiz not found' });
    }

    // Filter quizzes with impressions greater than 0
    const trendQuiz = quizes.filter((quiz) => quiz.impressionCount > 0);

    // Sort the quizzes by impressionCount in descending order
    trendQuiz.sort((a, b) => b.impressionCount - a.impressionCount);

    // Send the sorted trending quizzes
    res.send({ trendQuiz });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};

//setting up the analytics
const setAnalytics = async (req, res) => {
  const { id } = req.params;
  const { cur, optionIdx } = req.body;
  if (cur === undefined || optionIdx === undefined) {
    return res.status(400).json({ message: 'all fields are required' });
  }
  try {
    const quiz = await Quize.findById(id);
    let query;
    if (!quiz) {
      return res.status(400).json({ message: 'quiz not found' });
    }
    if (quiz?.quizeType === 'Q&A') {
      if (optionIdx !== null) {
        query = {
          $inc: {
            [`analytics.${cur}.attempts`]: 1,
            [`analytics.${cur}.correctAnswer`]:
              quiz.slides[cur].answer === optionIdx ? 1 : 0,
          },
        };
      }
    } else {
      if (optionIdx !== null) {
        query = {
          $inc: {
            [`analytics.${cur}.options.${optionIdx}.count`]: 1,
          },
        };
      }
    }
    await Quize.findByIdAndUpdate(id, query);
    res.send({
      message: 'updated analytics',
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: 'failed',
      message: 'error in set quize Analytics ',
    });
  }
};

module.exports = {
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
};
