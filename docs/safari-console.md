# Console do Safari

Este projeto foi feito para uso manual no console do Safari. Ele nao instala extensoes, nao executa servidor local e nao automatiza navegador por fora.

## Ativar o menu Desenvolvedor

1. Abra o Safari.
2. Va em `Safari > Ajustes`.
3. Abra a aba `Avancado`.
4. Marque `Mostrar recursos para desenvolvedores web`.

## Abrir o console

1. Abra o Gmail no Safari.
2. Entre na conta correta.
3. Abra a caixa ou busca que deseja arquivar.
4. Va em `Desenvolvedor > Mostrar Console JavaScript`.
5. Cole o conteudo de `scripts/archive-gmail-console.js`.
6. Pressione `Enter`.

## Parar o loop

Execute no console:

```js
GmailArchiveConsole.stop();
```

O script para depois da etapa atual terminar.

## Ver status

Execute:

```js
GmailArchiveConsole.status();
```

## Reiniciar

Depois de parado, execute:

```js
GmailArchiveConsole.start();
```
