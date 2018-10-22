import settings from '../../../data/json/settings';
import { elementWithAutoComplete, lifeMinMax, monsterQuantMinMax } from './htmlElementInstance';
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
  Object.keys(elementWithAutoComplete.elementToGather[0].chipsData).forEach((chip) => {
    elementWithAutoComplete.elementToGather[0].deleteChip(chip);
  });
  $('#displayFightCountCheckbox').prop('checked', false);
  $('#autoRegenCheckbox').prop('checked', true);
  lifeMinMax.noUiSlider.set([
    settings.script.config.AUTO_REGEN.minLife,
    settings.script.config.AUTO_REGEN.maxLife,
  ]);
  Object.keys(elementWithAutoComplete.regenItems[0].chipsData).forEach((chip) => {
    elementWithAutoComplete.regenItems[0].deleteChip(chip);
  });
  $('#regenItemValue').val(settings.script.config.AUTO_REGEN.store);
  monsterQuantMinMax.noUiSlider.set([
    settings.script.config.MIN_MONSTERS,
    settings.script.config.MAX_MONSTERS,
  ]);
  $('#monsterMin').val(settings.script.config.MIN_MONSTERS_LEVEL);
  $('#monsterMax').val(settings.script.config.MAX_MONSTERS_LEVEL);
  Object.keys(elementWithAutoComplete.monsterForbidden[0].chipsData).forEach((chip) => {
    elementWithAutoComplete.monsterForbidden[0].deleteChip(chip);
  });
  Object.keys(elementWithAutoComplete.monsterMandatory[0].chipsData).forEach((chip) => {
    elementWithAutoComplete.monsterMandatory[0].deleteChip(chip);
  });
  $('#maxFightPerMapCheckbox').prop('checked', false);
  $('#maxFightPerMapValue').val(settings.script.config.MAX_FIGHTS_PER_MAP);
  $('#maxPods').val(settings.script.config.MAX_PODS);
  Object.keys(elementWithAutoComplete.autoDelete[0].chipsData).forEach((chip) => {
    elementWithAutoComplete.autoDelete[0].deleteChip(chip);
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
