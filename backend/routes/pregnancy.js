const express = require('express');
const router = express.Router();
const PregnancyData = require('../models/PregnancyData');
const { protect } = require('../middleware/auth');

const getMilestones = (dueDate) => {
  const milestones = [];
  const due = new Date(dueDate);
  
  const weeks = [
    { week: 4, title: 'Baby is the size of a poppy seed', description: 'The embryo implants in the uterus' },
    { week: 8, title: 'Baby is the size of a raspberry', description: 'All major organs have begun to form' },
    { week: 12, title: 'Baby is the size of a lime', description: 'Baby can make facial expressions' },
    { week: 16, title: 'Baby is the size of an avocado', description: 'Baby may start to hear sounds' },
    { week: 20, title: 'Baby is the size of a banana', description: 'Halfway point! Can feel movements' },
    { week: 24, title: 'Baby is the size of an ear of corn', description: 'Lungs are developing' },
    { week: 28, title: 'Baby is the size of an eggplant', description: 'Eyes may open' },
    { week: 32, title: 'Baby is the size of a squash', description: 'Baby practices breathing' },
    { week: 36, title: 'Baby is the size of a melon', description: 'Baby drops into pelvis' },
    { week: 40, title: 'Baby is ready!', description: 'Full term, ready to be born' }
  ];

  weeks.forEach(m => {
    const milestoneDate = new Date(due);
    milestoneDate.setDate(due.getDate() - (40 - m.week) * 7);
    milestones.push({ ...m, date: milestoneDate });
  });

  return milestones;
};

router.get('/', protect, async (req, res) => {
  try {
    const pregnancyData = await PregnancyData.findOne({ userId: req.user._id });
    
    if (!pregnancyData) {
      return res.status(404).json({ message: 'No pregnancy data found' });
    }

    const currentWeek = Math.floor((Date.now() - new Date(pregnancyData.startDate || pregnancyData.dueDate)) / (7 * 24 * 60 * 60 * 1000)) + 1;
    
    res.json({
      ...pregnancyData._doc,
      currentWeek: Math.min(Math.max(currentWeek, 1), 40)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { dueDate, startDate, notes } = req.body;

    let pregnancyData = await PregnancyData.findOne({ userId: req.user._id });

    if (pregnancyData) {
      pregnancyData.dueDate = dueDate || pregnancyData.dueDate;
      pregnancyData.startDate = startDate || pregnancyData.startDate;
      pregnancyData.notes = notes || pregnancyData.notes;
      pregnancyData = await pregnancyData.save();
    } else {
      pregnancyData = await PregnancyData.create({
        userId: req.user._id,
        dueDate,
        startDate,
        notes
      });
    }

    res.json(pregnancyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/milestones', protect, async (req, res) => {
  try {
    const pregnancyData = await PregnancyData.findOne({ userId: req.user._id });
    
    if (!pregnancyData) {
      return res.status(404).json({ message: 'No pregnancy data found' });
    }

    const milestones = getMilestones(pregnancyData.dueDate);
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/weight', protect, async (req, res) => {
  try {
    const { weight, notes, date } = req.body;

    const pregnancyData = await PregnancyData.findOne({ userId: req.user._id });
    
    if (!pregnancyData) {
      return res.status(404).json({ message: 'No pregnancy data found. Create pregnancy data first.' });
    }

    pregnancyData.weightEntries.push({
      weight,
      notes,
      date: date || Date.now()
    });

    await pregnancyData.save();
    res.json(pregnancyData.weightEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/weight', protect, async (req, res) => {
  try {
    const pregnancyData = await PregnancyData.findOne({ userId: req.user._id });
    
    if (!pregnancyData) {
      return res.status(404).json({ message: 'No pregnancy data found' });
    }

    res.json(pregnancyData.weightEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;