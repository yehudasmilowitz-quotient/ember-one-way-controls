import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({
  committed: null,
  textCurrentValue: 'foo',
  numberCurrentValue: 0,

  actions: {
    commit(value) {
      set(this, 'committed', value);
    },

    maskedUpdate(value) {
      set(this, 'masked', value.replace(/[a-zA-Z]/g, ''));
    }
  }
});
