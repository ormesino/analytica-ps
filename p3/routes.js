const router = require('express').Router();
const axios = require('axios');

const { differenceInYears } = require('date-fns');

router.post('/age', async (req, res) => {
  try {
    let { name, birthdate, date } = req.body;

    date = date.replace(/-/g, '/');
    birthdate = birthdate.replace(/-/g, '/');

    if (!name || !birthdate || !date) {
      throw new Error('Por favor, preencha todos os campos obrigatórios!');
    } else if (new Date(date) < new Date()) {
      throw new Error('A data informada já passou, por favor informe uma data no futuro.');
    }

    const X = differenceInYears(new Date(), new Date(birthdate));
    const Y = differenceInYears(new Date(date), new Date(birthdate));
    const formatedDate = new Date(date).toLocaleDateString('pt-BR');

    return res.status(200).json({
      quote: `Olá, ${name}! Você tem ${X} anos e em ${formatedDate} você terá ${Y} anos.`,
      ageNow: X,
      ageThen: Y
    })

  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

router.get('/municipio-bairros', async (req, res) => {
  try {
    const entry = req.query.municipio;
    if (!entry) {
      throw new Error('Por favor, informe o município!');
    }

    const formatedEntry = entry.replace(/-/g, ' ').toLowerCase();

    const municipio = await axios.get('http://servicodados.ibge.gov.br/api/v1/localidades/municipios')
      .then(response => response.data)
      .then(data => {
        const municipioData = data.find(m => m.nome.toLowerCase() === formatedEntry);
        return municipioData;
      });

    const bairros = await axios.get(`http://servicodados.ibge.gov.br/api/v1/localidades/municipios/${municipio.id}/distritos`)
      .then(response => response.data)
      .then(data => {
        const bairrosData = data.map(b => b.nome);
        return bairrosData;
      });

    return res.status(200).json({
      municipio: municipio.nome,
      bairros: bairros
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;