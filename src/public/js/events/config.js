import settings from '../../../data/json/settings';
import { autoDelete, elementToGather, lifeMinMax, monsterForbidden, monsterMandatory, monsterQuantMinMax, regenItems } from './htmlElementInstance';
import { putGetItem } from '../scripts/loadPath';

$('#addPutItem').on('click', () => {
  putGetItem('put');
});

$('#addGetItem').on('click', () => {
  putGetItem('get');
});

$('#ConfigBtnDefault').on('click', () => {
  $('#displayGatherCountCheckbox').prop('checked', false);
  $('#openBagsCheckbox').prop('checked', false);
  Object.keys(elementToGather.chipsData).forEach((chip) => {
    elementToGather.deleteChip(chip);
  });
  $('#displayFightCountCheckbox').prop('checked', false);
  $('#autoRegenCheckbox').prop('checked', true);
  lifeMinMax.noUiSlider.set([settings.script.config.AUTO_REGEN.minLife, settings.script.config.AUTO_REGEN.maxLife]);
  Object.keys(regenItems.chipsData).forEach((chip) => {
    regenItems.deleteChip(chip);
  });
  $('#regenItemValue').val(settings.script.config.AUTO_REGEN.store);
  monsterQuantMinMax.noUiSlider.set([settings.script.config.MIN_MONSTERS, settings.script.config.MAX_MONSTERS]);
  $('#monsterMin').val(settings.script.config.MIN_MONSTERS_LEVEL);
  $('#monsterMax').val(settings.script.config.MAX_MONSTERS_LEVEL);
  Object.keys(monsterForbidden.chipsData).forEach((chip) => {
    monsterForbidden.deleteChip(chip);
  });
  Object.keys(monsterMandatory.chipsData).forEach((chip) => {
    monsterMandatory.deleteChip(chip);
  });
  $('#maxFightPerMapCheckbox').prop('checked', false);
  $('#maxFightPerMapValue').val(settings.script.config.MAX_FIGHTS_PER_MAP);
  $('#maxPods').val(settings.script.config.MAX_PODS);
  Object.keys(autoDelete.chipsData).forEach((chip) => {
    autoDelete.deleteChip(chip);
  });
  $('#putKamasCheckbox').prop('checked', false);
  $('#putKamasValue').val(settings.script.config.BANK_PUT_KAMAS);
  $('#getKamasCheckbox').prop('checked', false);
  $('#getKamasValue').val(settings.script.config.BANK_GET_KAMAS);
  $('#putItemTable').html('');
  $('#getItemTable').html('');
  $('#scriptAuthor').val('');
  $('#scriptName').val('');
  $('#scriptType').val('');
  $('#scriptArea').val('');
  $('#scriptJob').val('');
});

