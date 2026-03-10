const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

// Rota para importar escalas
app.post('/api/escalas/importar', (req, res) => {
  try {
    const { escalas } = req.body;
    console.log('Escalas recebidas:', escalas);
    res.json({ 
      success: true, 
      message: `${escalas?.length || 0} escalas recebidas`,
      resultados: escalas 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar escalas
app.get('/api/escalas/listar', (req, res) => {
  res.json([]); // Retorna array vazio por enquanto
});

// Rota para gerar QR Code
app.get('/api/qr/gerar/:staffId/:setor', (req, res) => {
  const { staffId, setor } = req.params;
  res.json({ 
    payload: JSON.stringify({ 
      staff_id: staffId, 
      setor, 
      token: Math.floor(100000 + Math.random() * 900000).toString() 
    })
  });
});

// Rota para bater ponto
app.post('/api/bater-ponto', (req, res) => {
  const { aluno_matricula, staff_id, setor } = req.body;
  res.json({ 
    message: 'Ponto registrado com sucesso!', 
    tipo: 'ENTRADA',
    aluno_matricula,
    staff_id,
    setor
  });
});

// Rota 404 - use app.use para capturar todas as rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada', path: req.path });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Rotas disponíveis:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/escalas/importar`);
  console.log(`   - GET  /api/escalas/listar`);
  console.log(`   - GET  /api/qr/gerar/:staffId/:setor`);
  console.log(`   - POST /api/bater-ponto`);
});
// GET /api/setores/listar
app.get('/api/setores/listar', async (req, res) => {
  try {
    // Se usa Firebase
    const setores = await db.collection('Setores').get();
    const lista = setores.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(lista);
    
    // Se usa Prisma (comente a de cima e use esta)
    // const setores = await prisma.setor.findMany();
    // res.json(setores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar setores' });
  }
});

// POST /api/setores (para criar novos setores)
app.post('/api/setores', async (req, res) => {
  try {
    const { nome, hospital, cnes } = req.body;
    // Salvar no banco
    res.json({ success: true, message: 'Setor criado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar setor' });
  }
});
// GET /api/alunos/listar
app.get('/api/alunos/listar', async (req, res) => {
  // Buscar alunos do banco
});

// POST /api/alunos (cadastrar)
app.post('/api/alunos', async (req, res) => {
  const { nome, matricula, turma } = req.body;
  // Salvar no banco
});
// GET /api/staff/listar
app.get('/api/staff/listar', async (req, res) => {
  // Buscar staff do banco
});

// POST /api/staff (cadastrar)
app.post('/api/staff', async (req, res) => {
  const { nome, email, senha } = req.body;
  // Salvar no banco
});
// GET /api/relatorios?aluno=joao&setor=UTI
app.get('/api/relatorios', async (req, res) => {
  const { aluno, setor, dataInicio, dataFim } = req.query;
  
  // Buscar pontos com filtros
  let query = db.collection('Pontos');
  
  if (aluno) {
    query = query.where('aluno_nome', '>=', aluno)
                 .where('aluno_nome', '<=', aluno + '\uf8ff');
  }
  if (setor) {
    query = query.where('setor', '==', setor);
  }
  
  const pontos = await query.get();
  res.json(pontos.docs.map(d => d.data()));
});