const express = require('express');

const server = express();
const routes = require('./routes');

server.use(express.json());
server.use(routes);

server.get('/', (req, res) => {
  res.send('Servidor funcionando! ✅');
})

server.listen(3000, () => {
  console.log('Servidor iniciado! Acesse-o em http://localhost:3000 ✅')
});
