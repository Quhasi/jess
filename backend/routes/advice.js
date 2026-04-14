const express = require('express');
const router = express.Router();
const Advice = require('../models/Advice');

const defaultAdvice = [
  {
    category: 'Nutrition',
    title: 'Nutrition Advice',
    items: [
      'Eat a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.',
      'Stay hydrated by drinking plenty of water throughout the day.',
      'Avoid foods high in sugar, salt, and unhealthy fats.',
      'Take a prenatal vitamin with folic acid to support fetal development.',
      'Include iron-rich foods like lean meats, spinach, and fortified cereals in your diet.',
      'Consume calcium-rich foods like dairy, leafy greens, and fortified plant-based milk.',
      'Include omega-3 rich foods like fatty fish, flaxseeds, and walnuts in your diet.'
    ]
  },
  {
    category: 'Exercise',
    title: 'Exercise Recommendations',
    items: [
      'Engage in moderate-intensity exercise, such as brisk walking, cycling, or swimming, for at least 30 minutes a day.',
      'Avoid high-impact exercises that may put a strain on your joints or pose a risk to your pregnancy.',
      'Consider prenatal yoga or Pilates to help with flexibility and relaxation.',
      'If you experience any discomfort, pain, or vaginal bleeding, stop exercising and consult your healthcare provider.'
    ]
  },
  {
    category: 'Health',
    title: 'Health Tips',
    items: [
      'Get plenty of rest and prioritize sleep to help your body and baby grow.',
      'Maintain good posture to avoid back pain and discomfort.',
      'Focus on whole foods, fruits, vegetables, whole grains, lean proteins, and healthy fats.',
      'Drink plenty of water throughout the day.',
      'Engage in moderate physical activity, like walking or prenatal yoga, with your healthcare provider\'s approval.',
      'Have a 7-9 hours of sleep per night.',
      'Manage stress through relaxation techniques, such as deep breathing, meditation, or yoga.',
      'Attend regular prenatal check-ups with your healthcare provider to monitor your health and baby\'s development.'
    ]
  },
  {
    category: 'Safety Precautions',
    title: 'Safety Precautions',
    items: [
      'Wear comfortable shoes that provide good support and stability.',
      'Limit caffeine: Consume caffeine in moderation (less than 200mg per day).',
      'Avoid harmful substances: Don\'t smoke, drink alcohol, or use illicit drugs during pregnancy.',
      'Don\'t be afraid to ask for help when you need it, especially if you\'re feeling tired or uncomfortable.',
      'Avoid reaching for high objects, as this can cause strain on your back and joints.',
      'Avoid lifting heavy objects or weights that can strain your back and joints.'
    ]
  }
];

router.get('/categories', async (req, res) => {
  try {
    let advice = await Advice.find();
    
    if (advice.length === 0) {
      await Advice.insertMany(defaultAdvice);
      advice = await Advice.find();
    }
    
    res.json(advice.map(a => ({ category: a.category, title: a.title })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    let advice = await Advice.findOne({ category });
    
    if (!advice) {
      const defaultCategory = defaultAdvice.find(a => a.category === category);
      if (defaultCategory) {
        advice = await Advice.create(defaultCategory);
      } else {
        return res.status(404).json({ message: 'Category not found' });
      }
    }
    
    res.json(advice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/seed', async (req, res) => {
  try {
    await Advice.deleteMany({});
    await Advice.insertMany(defaultAdvice);
    res.json({ message: 'Advice seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;