const validator = require("validator");

const validateSignUpdata = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }
}

const validateTransactionData = (data) => {
  const { type, amount, category, date, paymentMethod} = data;

  if (!type || !['income', 'expense'].includes(type)) {
    throw new Error('Valid transaction type is required.');
  }

  if (amount == null || isNaN(amount) || amount < 0) {
    throw new Error('Amount must be a non-negative number.');
  }

  const validCategories = [
    'salary', 'business', 'investments', 'food', 'rent', 'transport',
    'entertainment', 'utilities', 'healthcare', 'education', 'other'
  ];
  if (!category || !validCategories.includes(category)) {
    throw new Error('Invalid or missing category.');
  }

  const validPaymentMethods = [
    'cash', 'creditcard', 'debitcard', 'banktransfer', 'upi', 'other'
  ];
  if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
    throw new Error('Invalid payment method.');
  }

  if (date && isNaN(Date.parse(date))) {
    throw new Error('Invalid date format.');
  }
};

module.exports = {validateSignUpdata,validateTransactionData};