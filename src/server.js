const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const joyasRoutes = require('./routes/joyas');

app.use(express.json());
app.use('/joyas', joyasRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
