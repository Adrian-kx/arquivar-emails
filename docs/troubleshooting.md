# Troubleshooting

## O console bloqueia a colagem

O Safari pode pedir confirmacao antes de permitir colar codigo no console. Leia o aviso e confirme apenas se voce entende o script.

## Checkbox nao encontrado

Possiveis causas:

- A tela do Gmail ainda esta carregando.
- Voce nao esta em uma lista de emails.
- O layout do Gmail mudou.
- O seletor interno do Gmail mudou.

Tente recarregar o Gmail, abrir a caixa desejada e executar novamente.

## Botao arquivar nao encontrado

Possiveis causas:

- Nenhum email foi selecionado.
- A barra de acoes ainda nao apareceu.
- O idioma do Gmail usa outro texto para o botao.
- O DOM do Gmail mudou.

Se o idioma for diferente, ajuste `labels.archive` conforme `docs/configuration.md`.

## O loop nao para imediatamente

`GmailArchiveConsole.stop()` solicita parada. O script encerra depois que o delay ou etapa atual terminar.

## Gmail mudou o DOM

Este script depende de seletores e atributos do Gmail. O Gmail pode alterar classes, papeis ARIA, labels e estrutura visual sem aviso. Quando isso acontecer, pode ser necessario atualizar:

- `selectors.checkbox`
- `selectors.archiveButton`
- `labels.archive`
- a validacao de visibilidade

## Arquivou mensagens erradas

Verifique `Todos os e-mails` no Gmail e mova as mensagens de volta para a caixa desejada. Para reduzir risco, use buscas/filtros antes de executar e teste com `maxIterations`.
