# NEXUS Chip Manager - TODO

## Estrutura de Dados
- [x] Schema de banco de dados para números/chips
- [x] Schema de banco de dados para eventos/histórico
- [x] Schema de banco de dados para tags/categorias
- [x] Schema de banco de dados para alarmes de restrição
- [x] Migrations e seed data inicial

## Backend - APIs e Lógica
- [x] API para CRUD de números (criar, listar, atualizar, deletar)
- [x] API para registro de eventos diários
- [x] API para análise de histórico (bloqueios, recuperação, padrões)
- [x] API para cálculo de capacidade e volume máximo
- [x] API para alertas preditivos baseados em padrões
- [x] API para relatórios e métricas agregadas
- [x] API para filtros e busca avançada
- [x] API para gerenciamento de tags/categorias
- [x] API para alarmes de restrição

## Inteligência Analítica
- [x] Cálculo de quantas vezes cada chip caiu
- [x] Cálculo de tempo médio de recuperação
- [x] Detecção de padrões de bloqueio
- [x] Cálculo de volume máximo suportado
- [x] Sistema de alertas preditivos
- [x] Análise de estabilidade por número

## Frontend - Dashboard
- [x] Dashboard principal com visualização em tempo real
- [x] Lista completa de todos os números cadastrados
- [x] Cards organizados por status (ativo, aquecendo, bloqueado, análise, off)
- [x] Filtros por operadora, status, período, aparelho
- [x] Busca avançada de números
- [x] Visualização de métricas gerais

## Frontend - Gestão de Números
- [x] Formulário para adicionar novo número
- [x] Formulário para editar número existente
- [x] Página de detalhes do número (perfil)
- [x] Timeline completa de eventos do número
- [x] Sistema de tags/categorias personalizadas

## Frontend - Perfil do Número
- [x] Página de perfil detalhado para cada número
- [x] Especificações completas do número
- [x] Gráficos de evolução temporal
- [x] Histórico de status ao longo do tempo
- [x] Volume de mensagens por dia
- [x] Padrões de bloqueio visualizados

## Frontend - Registro de Eventos
- [x] Formulário para adicionar evento diário
- [x] Tipos de eventos (bloqueio, restrição, mudança de status, volume, observação)
- [x] Histórico de eventos por número
- [x] Edição e exclusão de eventos

## Frontend - Análise e Relatórios
- [x] Página de análise inteligente de histórico
- [x] Visualização de padrões de bloqueio
- [x] Gráficos de tempo de recuperação
- [x] Relatórios automáticos com métricas
- [x] Taxa de bloqueio por número/operadora
- [x] Números mais estáveis vs problemáticos
- [x] Alertas preditivos visíveis

## Sistema de Alarme de Restrição
- [x] Configurar horário que o número caiu em restrição
- [x] Configurar horário desejado para ser avisado
- [x] Popup de notificação quando número voltar da restrição
- [x] Som de notificação ao alertar
- [x] Monitoramento automático de status em background
- [x] Lista de alarmes ativos

## Autenticação
- [x] Login com Email/Senha (via OAuth)
- [x] Login com Google OAuth
- [x] Registro de novos usuários
- [ ] Recuperação de senha

## Perfil de Usuário
- [ ] Upload de foto de perfil (S3)
- [ ] Configurações de usuário (tema, preferências)
- [x] Toggle de tema claro/escuro

## Sistema Multi-Operações
- [x] Schema de banco para operações/projetos
- [x] Relacionamento entre números e operações
- [x] API para CRUD de operações
- [x] Seletor de operação ativa no header
- [x] Dashboard filtrado por operação selecionada

## Testes
- [x] Testes de API para números
- [x] Testes de API para eventos
- [x] Testes de lógica analítica
- [x] Testes de cálculos preditivos

## Atualização em Tempo Real
- [x] Auto-refresh automático no dashboard
- [x] Auto-refresh na página de detalhes do número
- [x] Indicador visual de atualização em andamento
- [x] Controle para pausar/retomar atualizações


## Novas Funcionalidades Solicitadas
- [x] Página de perfil do usuário funcional
- [x] Página de gerenciamento de operações (criar, editar, excluir)
- [x] Modal para criar nova operação
- [x] Botão para excluir operação


## Funcionalidades NEXUS v2.0

### Essenciais
- [ ] Corrigir erro do popup de notificação
- [ ] Cadastro inteligente com campos: operadora, tipo dispositivo, localização, IP, dono/responsável
- [ ] Timeline completa do número (ativação, bloqueio, troca IP, reinício, restrição, eventos)
- [ ] Filtros avançados: operadora, tipo dispositivo, data ativação, status, região, lote
- [ ] Exportar CSV/XLSX

### Avançadas
- [ ] Score de risco (verde/amarelo/vermelho) baseado em volume, grupos, spam, denúncias
- [ ] Central de alertas automáticos (mensagens demais, IP repetido, inativo 48h, restrição)
- [ ] Mapa visual de operadoras (gráfico de chips por operadora, saúde, bloqueios)

### Premium
- [ ] Sistema de RANK (Tier S/A/B/C/D) automático
- [ ] Gráfico histórico de performance (dias ativos, picos, quedas, horários seguros/arriscados)
- [ ] Multi-usuário com níveis de acesso (Admin, Operacional, Suporte, Visualização)
