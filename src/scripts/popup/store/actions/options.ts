import { chromeService } from '../../services/chrome';

export const OptionsActions = {
  SAVE_OPTIONS: 'save_options'
};

function saveOptions(options) {
  return {
    type: OptionsActions.SAVE_OPTIONS,
    value: options
  };
}

export function loadOptions() {
  return async (dispatch) => {
    const options = await chromeService.getSyncItem();
    dispatch(saveOptions(options));
  };
}
