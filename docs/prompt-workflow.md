# Prompt Workflow Guide

1. **Contexto Sempre Presente**

   - Relembrar stack (React + Vite + MUI) e metas minimalistas a cada prompt.
   - Referenciar este documento e o Overview antes de responder.

2. **Estrutura dos Prompts**

   - **Entrada do Usuário:** Entender se é requisito, bug ou tarefa de design.
   - **Confirmação:** Repetir em 1 frase o entendimento antes de agir (quando aplicável).
   - **Plano:** Quebrar em subpassos (setup, UI, dados, testes) e validar se dependem de info extra.
   - **Execução:** Trabalhar por camadas (infra → layout → lógica → polish).
   - **Validação:** Sugerir testes/checagens rápidas.

3. **Boas Práticas de Implementação**

   - Componentes declarativos, funções puras, hooks pequenos.
   - Evitar CSS não tipado; preferir `sx` ou styled do MUI com tokens do tema.
   - Garantir loading/error states explícitos em cada widget.
   - Reutilizar utilitários para datas, números e busca de dados.

4. **Documentação e Commit Messages**

   - Atualizar README/Docs quando fluxos novos surgirem.
   - Commits curtos (máx. 72 chars) descrevendo ação e escopo.
   - Incluir screenshots/gifs apenas quando for relevante para review.

5. **Checklist por Entrega**
   - [ ] Código lintado e formatado.
   - [ ] Não quebrou build ou testes.
   - [ ] Styles consistentes com o tema.
   - [ ] Acessibilidade básica validada (tab, aria-labels).
   - [ ] Documentação alinhada (este doc + overview).
