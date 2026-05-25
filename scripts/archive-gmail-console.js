/*
 * Gmail Archive Console Script
 * Version: 1.0.0
 *
 * Manual Safari console automation for selecting visible Gmail messages
 * and clicking the archive button in a loop.
 *
 * Stop at any time with:
 *   GmailArchiveConsole.stop()
 */
(function () {
  'use strict';

  var CONFIG = {
    delays: {
      afterMissingCheckbox: 3000,
      afterSelectAll: 2500,
      afterMissingArchiveButton: 3000,
      afterArchive: 7000,
      afterError: 5000
    },
    maxIterations: null,
    selectors: {
      checkbox: 'span[role="checkbox"]',
      archiveButton: '[aria-label]'
    },
    labels: {
      archive: ['Arquivar', 'Archive']
    },
    clickOffset: {
      x: 5,
      y: 5
    },
    logPrefix: '[GmailArchiveConsole]'
  };

  var state = {
    running: false,
    stopRequested: false,
    iterations: 0,
    selectedBatches: 0,
    archivedBatches: 0,
    lastError: null,
    startedAt: null,
    stoppedAt: null
  };

  function mergeConfig(baseConfig, overrideConfig) {
    if (!overrideConfig || typeof overrideConfig !== 'object') {
      return baseConfig;
    }

    Object.keys(overrideConfig).forEach(function (key) {
      var value = overrideConfig[key];

      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        baseConfig[key] &&
        typeof baseConfig[key] === 'object' &&
        !Array.isArray(baseConfig[key])
      ) {
        mergeConfig(baseConfig[key], value);
        return;
      }

      baseConfig[key] = value;
    });

    return baseConfig;
  }

  function logInfo(message, details) {
    if (details === undefined) {
      console.log(CONFIG.logPrefix + ' ' + message);
      return;
    }

    console.log(CONFIG.logPrefix + ' ' + message, details);
  }

  function logWarn(message, details) {
    if (details === undefined) {
      console.warn(CONFIG.logPrefix + ' ' + message);
      return;
    }

    console.warn(CONFIG.logPrefix + ' ' + message, details);
  }

  function logError(message, error) {
    console.error(CONFIG.logPrefix + ' ' + message, error);
  }

  function wait(milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(resolve, milliseconds);
    });
  }

  function isVisible(element) {
    return Boolean(element && element.offsetParent !== null);
  }

  function dispatchMouseEvent(element, eventName, point) {
    element.dispatchEvent(new MouseEvent(eventName, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: point.x,
      clientY: point.y
    }));
  }

  function clickLikeUser(element) {
    if (!element || typeof element.getBoundingClientRect !== 'function') {
      throw new Error('Elemento invalido para clique.');
    }

    var rect = element.getBoundingClientRect();
    var point = {
      x: rect.left + CONFIG.clickOffset.x,
      y: rect.top + CONFIG.clickOffset.y
    };

    ['mousemove', 'mousedown', 'mouseup', 'click'].forEach(function (eventName) {
      dispatchMouseEvent(element, eventName, point);
    });
  }

  function findVisibleSelectAllCheckbox() {
    return Array.prototype.slice
      .call(document.querySelectorAll(CONFIG.selectors.checkbox))
      .find(function (element) {
        return element.className.indexOf('T-Jo') !== -1 && isVisible(element);
      }) || null;
  }

  function isArchiveButton(element) {
    var label = element.getAttribute('aria-label') || '';

    return CONFIG.labels.archive.some(function (archiveLabel) {
      return label.indexOf(archiveLabel) !== -1;
    });
  }

  function findArchiveButton() {
    return Array.prototype.slice
      .call(document.querySelectorAll(CONFIG.selectors.archiveButton))
      .find(function (element) {
        return isVisible(element) && isArchiveButton(element);
      }) || null;
  }

  function requestStop() {
    state.stopRequested = true;
    logInfo('Parada solicitada. O loop sera encerrado apos a etapa atual.');
  }

  function getStatus() {
    return {
      running: state.running,
      stopRequested: state.stopRequested,
      iterations: state.iterations,
      selectedBatches: state.selectedBatches,
      archivedBatches: state.archivedBatches,
      lastError: state.lastError,
      startedAt: state.startedAt,
      stoppedAt: state.stoppedAt,
      config: CONFIG
    };
  }

  async function runArchiveLoop() {
    if (state.running) {
      logWarn('O script ja esta em execucao. Use GmailArchiveConsole.stop() antes de iniciar novamente.');
      return;
    }

    state.running = true;
    state.stopRequested = false;
    state.iterations = 0;
    state.selectedBatches = 0;
    state.archivedBatches = 0;
    state.lastError = null;
    state.startedAt = new Date().toISOString();
    state.stoppedAt = null;

    logInfo('Loop iniciado. Para parar, execute GmailArchiveConsole.stop().');

    while (!state.stopRequested) {
      if (CONFIG.maxIterations !== null && state.iterations >= CONFIG.maxIterations) {
        logInfo('Limite de iteracoes atingido.', CONFIG.maxIterations);
        break;
      }

      state.iterations += 1;

      try {
        var checkbox = findVisibleSelectAllCheckbox();

        if (!checkbox) {
          logWarn('Checkbox de selecionar todos nao encontrado. Aguardando Gmail atualizar a tela.');
          await wait(CONFIG.delays.afterMissingCheckbox);
          continue;
        }

        clickLikeUser(checkbox);
        state.selectedBatches += 1;
        logInfo('Mensagens visiveis selecionadas.', {
          iteration: state.iterations,
          selectedBatches: state.selectedBatches
        });

        await wait(CONFIG.delays.afterSelectAll);

        var archiveButton = findArchiveButton();

        if (!archiveButton) {
          logWarn('Botao de arquivar nao encontrado. Aguardando nova tentativa.');
          await wait(CONFIG.delays.afterMissingArchiveButton);
          continue;
        }

        clickLikeUser(archiveButton);
        state.archivedBatches += 1;
        logInfo('Lote arquivado.', {
          iteration: state.iterations,
          archivedBatches: state.archivedBatches
        });

        await wait(CONFIG.delays.afterArchive);
      } catch (error) {
        state.lastError = {
          message: error && error.message ? error.message : String(error),
          at: new Date().toISOString()
        };
        logError('Erro durante a automacao. O script tentara continuar apos o delay configurado.', error);
        await wait(CONFIG.delays.afterError);
      }
    }

    state.running = false;
    state.stoppedAt = new Date().toISOString();
    logInfo('Loop encerrado.', getStatus());
  }

  mergeConfig(CONFIG, window.GMAIL_ARCHIVE_CONSOLE_CONFIG);

  window.GmailArchiveConsole = {
    start: runArchiveLoop,
    stop: requestStop,
    status: getStatus,
    config: CONFIG
  };

  runArchiveLoop();
}());
