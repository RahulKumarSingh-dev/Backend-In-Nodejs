const mongoose = require('mongoose');

const connectWithDb = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`DB Connected Successfully`))
    .catch((error) => {
      console.log(`DB connections failed`);
      console.log(error);
    });
};

module.exports = connectWithDb;
