const express = require('express');
const router = express.Router();

const pregnancyResponses = {
  nutrition: [
    'Eat a balanced diet with plenty of fruits, vegetables, and lean proteins.',
    'Stay hydrated - aim for 8-10 glasses of water daily.',
    'Take your prenatal vitamins with folic acid every day.',
    'Include iron-rich foods like spinach, lean meats, and fortified cereals.',
    'Avoid raw fish, unpasteurized dairy, and excess caffeine.'
  ],
  exercise: [
    'Aim for 30 minutes of moderate exercise daily, like walking or swimming.',
    'Avoid high-impact activities and exercises that risk falling.',
    'Prenatal yoga and Pilates are great for flexibility and relaxation.',
    'Stop immediately if you experience pain, dizziness, or bleeding.'
  ],
  health: [
    'Get 7-9 hours of sleep each night.',
    'Attend all your prenatal appointments.',
    'Manage stress through meditation, deep breathing, or gentle yoga.',
    'Contact your healthcare provider immediately with any concerns.'
  ],
  'safety': [
    'Avoid alcohol, smoking, and illicit drugs completely.',
    'Limit caffeine to less than 200mg per day.',
    'Wear comfortable, supportive shoes.',
    'Avoid lifting heavy objects.',
    'Don\'t take any medications without consulting your doctor.'
  ],
  default: [
    'I recommend consulting your healthcare provider for personalized advice.',
    'Every pregnancy is different, so it\'s best to discuss with your doctor.',
    'Stay healthy by eating well, exercising moderately, and getting plenty of rest.',
    'Don\'t hesitate to reach out to your healthcare provider with any questions.'
  ]
};

const keywords = {
  nutrition: ['nutrition', 'food', 'eat', 'diet', 'vitamin', 'folic', 'iron', 'calcium', 'protein', 'healthy'],
  exercise: ['exercise', 'workout', 'walk', 'swim', 'yoga', 'pilates', 'active', 'activity'],
  health: ['sleep', 'rest', 'stress', 'doctor', 'checkup', 'appointment', 'health'],
  safety: ['safety', 'caffeine', 'alcohol', 'smoke', 'drugs', 'medication', 'safe', 'avoid']
};

function getResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMessage.includes(word))) {
      const responses = pregnancyResponses[category];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  const defaultResponses = pregnancyResponses.default;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const response = getResponse(message);

    res.json({
      response,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;