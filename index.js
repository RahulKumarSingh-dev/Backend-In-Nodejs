const app = require('./app');
const connectWithDb = require('./config/db');
require('dotenv').config();

// connect with db
connectWithDb();

app.listen(process.env.PORT, () => {
  console.log(`server is running ${process.env.PORT}`);
});