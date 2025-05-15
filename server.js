// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function isValidCardNumber(cardNumber) {
  // Basic Luhn check and length validation (simplified)
  const sanitized = cardNumber.replace(/\D/g, '');
  if (sanitized.length < 12 || sanitized.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function isValidDOB(dob) {
  // Expecting format: YYYY-MM-DD
  return /^\d{4}-\d{2}-\d{2}$/.test(dob) && !isNaN(Date.parse(dob));
}

app.post('/mock-check', (req, res) => {
  const { cardNumber, dateOfBirth } = req.body;

  if (!cardNumber || !isValidCardNumber(cardNumber)) {
    return res.status(400).json({ success: false, message: 'Invalid card number' });
  }

  if (!dateOfBirth || !isValidDOB(dateOfBirth)) {
    return res.status(400).json({ success: false, message: 'Invalid date of birth format. Use YYYY-MM-DD.' });
  }

  const result = Math.random() < 0.5;
  res.json({ success: true, result });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
