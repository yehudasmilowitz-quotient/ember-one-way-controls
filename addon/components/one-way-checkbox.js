import Component from '@ember/component';
import { set, get } from '@ember/object';
import { invokeAction } from 'ember-invoke-action';
import DynamicAttributeBindings from '../-private/dynamic-attribute-bindings';

const OneWayCheckboxComponent = Component.extend(DynamicAttributeBindings, {
  tagName: 'input',
  type: 'checkbox',

  NON_ATTRIBUTE_BOUND_PROPS: ['update'],

  attributeBindings: [
    'isChecked:checked',
    'type',
    'value'
  ],

  didInsertElement() {
    this._super(...arguments);
    this.element.addEventListener('click', (e) => this._click(e));
  },

  didReceiveAttrs() {
    this._super(...arguments);

    let value = this.paramChecked;
    if (value === undefined) {
      value = this.checked;
    }

    set(this, 'isChecked', value);
  },

  _click(event) {
    invokeAction(this, 'update', this.readDOMAttr('checked'), event);
  },
});

OneWayCheckboxComponent.reopenClass({
  positionalParams: ['paramChecked']
});

export default OneWayCheckboxComponent;
