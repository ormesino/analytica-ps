const router = require('express').Router();

const { differenceInYears } = require('date-fns');

router.post('/age', (req, res) => {
  try {
    const { name, birthdate, date } = req.body;

    if (!name || !birthdate || !date) {
      throw new Error('Por favor, preencha todos os campos obrigatórios!');
    } else if (new Date(date) < new Date()) {
      throw new Error('A data informada já passou, por favor informe uma data no futuro.');
    }

    const X = differenceInYears(new Date(), new Date(birthdate));
    const Y = differenceInYears(new Date(date), new Date(birthdate));
    const formatedDate = new Date(date).toLocaleDateString('pt-BR');

    return res.status(200).json({
      quote: `Olá ${name}! Você tem ${X} anos e em ${formatedDate} você terá ${Y} anos.`,
      ageNow: X,
      ageThen: Y
    })

  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;