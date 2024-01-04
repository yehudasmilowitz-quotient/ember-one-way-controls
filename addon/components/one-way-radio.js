import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';
import DynamicAttributeBindings from '../-private/dynamic-attribute-bindings';

const OneWayRadioComponent = Component.extend(DynamicAttributeBindings, {
  tagName: 'input',
  type: 'radio',

  NON_ATTRIBUTE_BOUND_PROPS: [
    'update',
    'option',
    'value'
  ],

  attributeBindings: [
    'checked',
    'option:value',
    'type'
  ],

  checked: computed('_value', 'option', function() {
    return this._value === this.option;
  }),

  click() {
    invokeAction(this, 'update', this.option);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    let value = this.paramValue;
    if (value === undefined) {
      value = this.value;
    }

    set(this, '_value', value);
  }
});

OneWayRadioComponent.reopenClass({
  positionalParams: ['paramValue']
});

export default OneWayRadioComponent;
