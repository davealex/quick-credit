exports.interest = (rate, amount) => (((rate / 100) * amount).toFixed(2));

exports.balance = (amount, rate) => (Number(amount) + ((rate / 100) * amount)).toFixed(2);

exports.installment = (amount, interest, tenor) => (((amount + interest) / tenor).toFixed(2));
