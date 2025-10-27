const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fetch = globalThis.fetch || require('node-fetch');
const { userAuth } = require('../middlewares/auth');
const Transaction = require('../models/transaction');
const { validateTransactionData } = require('../utils/validation');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
    }
  }
});

router.post('/extract-receipt', userAuth, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  // Remove file log for privacy

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
      fs.unlinkSync(filePath);
      return res.status(501).json({
        message: 'PDF processing not yet implemented. Please upload an image file.',
        amount: null,
        date: null,
        merchant: null,
        category: null,
        items: []
      });
    }

    const base64Image = fs.readFileSync(filePath).toString('base64');
    
    try {
      const extractedData = await extractWithGemini(base64Image, mimeType);
      
      if (extractedData.amount && extractedData.merchant) {
        const transactionData = {
          type: 'expense',
          amount: extractedData.amount,
          category: extractedData.category || 'other',
          date: extractedData.date || new Date().toISOString().split('T')[0],
          description: extractedData.merchant,
          paymentMethod: 'other',
          items: extractedData.items || []
        };

        try {
          validateTransactionData(transactionData);
          const transaction = new Transaction({
            ...transactionData,
            userId: req.user._id
          });

          const savedTransaction = await transaction.save();
          // Do not log ObjectId
          
          fs.unlinkSync(filePath);
          // Only return non-sensitive transactionId
          return res.json({
            amount: extractedData.amount,
            date: extractedData.date,
            merchant: extractedData.merchant,
            category: extractedData.category,
            items: extractedData.items,
            transactionId: savedTransaction._id,
            message: 'Receipt extracted and transaction saved successfully'
          });
        } catch (saveError) {
          console.error('Error saving transaction:', saveError);
          fs.unlinkSync(filePath);
          return res.json({
            ...extractedData,
            message: 'Receipt extracted but failed to save transaction',
            saveError: saveError.message
          });
        }
      } else {
        fs.unlinkSync(filePath);
        return res.json({
          ...extractedData,
          message: 'Receipt extracted but missing required data for transaction'
        });
      }
    } catch (error) {
      if (error.message.includes('Gemini API key not configured')) {
        fs.unlinkSync(filePath);
        return res.status(503).json({
          message: 'Receipt extraction service not configured',
          error: 'Please add your Gemini API key to the .env file to enable receipt extraction.',
          demo: {
            amount: 150.00,
            date: new Date().toISOString().split('T')[0],
            merchant: 'Demo Store',
            category: 'other',
            items: ['Demo Item 1', 'Demo Item 2']
          }
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Receipt extraction error:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      message: 'Failed to extract receipt data',
      error: error.message || 'Unknown server error'
    });
  }
});

async function extractWithGemini(base64Image, mimeType = 'image/jpeg') {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  console.log('GEMINI_API_KEY loaded:', !!GEMINI_API_KEY);
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Please add your Gemini API key to the .env file.');
  }

  const prompt = `Analyze this receipt image and extract the following information in JSON format:
  {
    "amount": "total amount in numbers only",
    "date": "transaction date in YYYY-MM-DD format",
    "merchant": "store/business name",
    "category": "one of: food, transport, utilities, entertainment, healthcare, education, rent, other",
    "items": ["list of purchased items"]
  }
  Focus on:
  - Total amount (look for TOTAL, GRAND TOTAL, AMOUNT)
  - Date (look for date patterns)
  - Store name (usually at top or bottom)
  - Items purchased (individual line items with prices)
  - Categorize based on store type or items
  Return only valid JSON, no other text.`;

  const requestBody = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: mimeType,
            data: base64Image
          }
        }
      ]
    }]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const extractedText = data.candidates[0].content.parts[0].text;
    console.log('Extracted text:', extractedText);

    const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini API response');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError, 'Raw text:', extractedText);
      throw new Error('Failed to parse JSON from Gemini API response');
    }

    return {
      amount: parsedData.amount ? parseFloat(parsedData.amount) : null,
      date: parsedData.date || null,
      merchant: parsedData.merchant || null,
      category: parsedData.category || 'other',
      items: Array.isArray(parsedData.items) ? parsedData.items : []
    };
  } catch (error) {
    console.error('Gemini API processing error:', error);
    throw error;
  }
}

module.exports = router;