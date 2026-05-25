# Configuracao

O script funciona sem configuracao extra. Para ajustar delays ou limitar a execucao, cole uma configuracao antes do script principal.

## Delays

```js
window.GMAIL_ARCHIVE_CONSOLE_CONFIG = {
  delays: {
    afterMissingCheckbox: 3000,
    afterSelectAll: 2500,
    afterMissingArchiveButton: 3000,
    afterArchive: 7000,
    afterError: 5000
  }
};
```

Valores em milissegundos.

## Limitar iteracoes

```js
window.GMAIL_ARCHIVE_CONSOLE_CONFIG = {
  maxIterations: 10
};
```

Use `null` para loop continuo.

## Labels do botao Arquivar

Por padrao, o script procura botoes com `aria-label` contendo `Arquivar` ou `Archive`.

```js
window.GMAIL_ARCHIVE_CONSOLE_CONFIG = {
  labels: {
    archive: ['Arquivar', 'Archive']
  }
};
```

Isso ajuda em contas com idioma diferente.
