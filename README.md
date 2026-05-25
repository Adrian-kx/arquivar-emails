# Arquivar emails no Gmail pelo console do Safari

Script JavaScript puro para arquivar lotes de emails visiveis no Gmail, executado manualmente no console do Safari.

Este projeto nao e uma aplicacao Node.js. Nao usa Puppeteer, Playwright, extensoes, bundlers, frameworks ou qualquer dependencia externa. O uso continua sendo: abrir o Gmail, abrir o console do Safari, colar o script e executar.

## Estrutura

```text
.
├── scripts/
│   ├── archive-gmail-console.js
│   └── archive-gmail-console.min.js
├── docs/
│   ├── configuration.md
│   ├── safari-console.md
│   ├── security.md
│   └── troubleshooting.md
├── examples/
│   ├── custom-delays.js
│   └── limited-run.js
├── CHANGELOG.md
├── LICENSE
└── README.md
```

## Script principal

Use sempre:

```text
scripts/archive-gmail-console.js
```

A versao minificada em `scripts/archive-gmail-console.min.js` e opcional, apenas para quem prefere colar menos texto no console. A versao legivel e a referencia principal do projeto.

## Como abrir o console no Safari

1. Abra o Safari.
2. Va em `Safari > Ajustes > Avancado`.
3. Ative `Mostrar recursos para desenvolvedores web`.
4. Abra o Gmail.
5. Va em `Desenvolvedor > Mostrar Console JavaScript`.
6. Cole o conteudo de `scripts/archive-gmail-console.js`.
7. Pressione `Enter`.

Veja tambem: `docs/safari-console.md`.

## Permissoes necessarias

O script precisa rodar dentro da propria aba do Gmail, com voce ja autenticado. Ele usa apenas APIs do navegador disponiveis na pagina:

- `document.querySelectorAll`
- eventos de mouse
- `setTimeout`
- `console`

Nao ha permissao externa, instalacao, login adicional, token, servidor, extensao ou acesso a arquivos locais.

## Como executar

1. Abra a caixa, marcador ou resultado de busca do Gmail que deseja processar.
2. Confirme que os emails visiveis sao os emails corretos.
3. Abra o console do Safari.
4. Cole o script principal.
5. Pressione `Enter`.

O script seleciona os emails visiveis, clica em `Arquivar`, aguarda o Gmail atualizar a tela e repete o processo.

## Como parar o loop

No console, execute:

```js
GmailArchiveConsole.stop();
```

A parada e solicitada imediatamente, mas o loop encerra somente depois da etapa ou delay atual terminar.

Para consultar o status:

```js
GmailArchiveConsole.status();
```

Para iniciar novamente depois de parado:

```js
GmailArchiveConsole.start();
```

## Configurar delays

Cole uma configuracao antes do script principal:

```js
window.GMAIL_ARCHIVE_CONSOLE_CONFIG = {
  delays: {
    afterSelectAll: 4000,
    afterArchive: 10000,
    afterError: 8000
  }
};
```

Todos os delays sao em milissegundos. Veja `examples/custom-delays.js` e `docs/configuration.md`.

## Limitar execucao

Para testar com mais seguranca, limite a quantidade de ciclos:

```js
window.GMAIL_ARCHIVE_CONSOLE_CONFIG = {
  maxIterations: 5
};
```

Depois cole o script principal. Veja `examples/limited-run.js`.

## Logs

Os logs aparecem no console com o prefixo:

```text
[GmailArchiveConsole]
```

Eles indicam inicio, selecao, arquivamento, avisos, erros e encerramento.

## Limitacoes

- O script depende da interface atual do Gmail.
- O Gmail pode mudar classes, atributos ARIA, labels e estrutura do DOM.
- O script arquiva apenas os emails selecionaveis na tela atual.
- A velocidade depende do carregamento do Gmail e da conexao.
- O script nao confirma cada lote antes de arquivar.
- A parada pode demorar alguns segundos por causa dos delays configurados.

## Riscos

Este script executa cliques em uma pagina autenticada. O maior risco e operacional: arquivar emails que nao deveriam ser arquivados.

Antes de usar:

- Confira a conta do Gmail.
- Confira a caixa, marcador ou busca aberta.
- Comece com `maxIterations`.
- Leia o codigo antes de colar.
- Nao execute scripts desconhecidos no console.

Veja `docs/security.md`.

## Compatibilidade

Projetado para:

- Safari com console JavaScript habilitado.
- Gmail aberto no navegador.
- Interface do Gmail em portugues ou ingles.

Tambem pode funcionar em outros navegadores modernos, mas o foco deste repositorio e Safari.

## Mudancas possiveis no DOM do Gmail

O Gmail pode alterar a interface sem aviso. Se isso acontecer, o script pode deixar de encontrar:

- checkbox de selecionar todos;
- botao de arquivar;
- labels `Arquivar` ou `Archive`;
- elementos visiveis esperados.

Nesses casos, consulte `docs/troubleshooting.md` e ajuste as constantes do script ou a configuracao.

## Boas praticas

- Use buscas do Gmail para limitar o conjunto de emails.
- Teste em poucos lotes antes de deixar rodar.
- Mantenha a aba visivel enquanto o script roda.
- Nao interaja manualmente com a pagina durante a execucao.
- Pare com `GmailArchiveConsole.stop()` antes de mudar de caixa ou conta.

## Licenca

MIT. Veja `LICENSE`.
