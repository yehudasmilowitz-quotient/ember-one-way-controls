import Component from '@ember/component';
import { or, not, empty, alias } from '@ember/object/computed';
import { isArray, A as emberArray } from '@ember/array';
import { isPresent, isNone } from '@ember/utils';
import EmberObject, { set, get, computed } from '@ember/object';
import { w } from '@ember/string';
import layout from '../templates/components/one-way-select.hbs';
import DynamicAttributeBindings from '../-private/dynamic-attribute-bindings';

import { invokeAction } from 'ember-invoke-action';

const OneWaySelectComponent = Component.extend(DynamicAttributeBindings, {
  layout,
  tagName: 'select',

  NON_ATTRIBUTE_BOUND_PROPS: [
    'value',
    'update',
    'options',
    'paramValue',
    'prompt',
    'promptIsSelectable',
    'includeBlank',
    'optionValuePath',
    'optionLabelPath',
    'optionComponent',
    'groupLabelPath'
  ],

  attributeBindings: [
    'multiple'
  ],

  didReceiveAttrs() {
    this._super(...arguments);

    let value = this.paramValue;
    if (value === undefined) {
      value = this.value;
    }

    set(this, 'selectedValue', value);

    let options = this.options;
    if (typeof options === 'string') {
      options = w(options);
    }

    let firstOption = get(emberArray(options), 'firstObject');
    if (firstOption &&
        isPresent(get(firstOption, 'groupName')) &&
        isArray(get(firstOption, 'options'))) {
      set(this, 'optionsArePreGrouped', true);
    }

    set(this, '_options', emberArray(options));
  },

  nothingSelected: empty('selectedValue'),
  promptIsDisabled: not('promptIsSelectable'),
  hasGrouping: or('optionsArePreGrouped', 'groupLabelPath'),
  computedOptionValuePath: or('optionValuePath', 'optionTargetPath'),

  optionGroups: computed('_options.[]', function() {
    let groupLabelPath = this.groupLabelPath;
    let options = this._options;
    let groups = emberArray();

    if (!groupLabelPath) {
      return options;
    }

    options.forEach((item) => {
      let label = get(item, groupLabelPath);

      if (label) {
        let group = groups.findBy('groupName', label);

        if (group == null) {
          group = EmberObject.create({
            groupName: label,
            options:   emberArray()
          });

          groups.pushObject(group);
        }

        get(group, 'options').pushObject(item);
      } else {
        groups.pushObject(item);
      }
    });

    return groups;
  }),

  change() {
    let value;

    if (this.multiple === true) {
      value = this._selectedMultiple();
    } else {
      value = this._selectedSingle();
    }

    invokeAction(this, 'update', value);
  },

  prompt: alias('includeBlank'),

  _selectedMultiple() {
    let options = this.element.options;
    let selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    return selectedValues.map((selectedValue) => {
      return this._findOption(selectedValue);
    });
  },

  _selectedSingle() {
    let selectedValue = this.element.value;
    return this._findOption(selectedValue);
  },

  _findOption(value) {
    let options = this._options;
    let optionValuePath = this.computedOptionValuePath;
    let optionTargetPath = this.optionTargetPath;
    let optionsArePreGrouped = this.optionsArePreGrouped;

    let findOption = (item) => {
      if (optionValuePath) {
        return `${get(item, optionValuePath)}` === value;
      } else {
        return `${item}` === value;
      }
    };

    let foundOption;
    if (optionsArePreGrouped) {
      foundOption = options.reduce((found, group) => {
        return found || get(group, 'options').find(findOption);
      }, undefined);
    } else {
      foundOption = options.find(findOption);
    }

    if (optionTargetPath && !isNone(foundOption)) {
      return get(foundOption, optionTargetPath);
    } else {
      return foundOption;
    }
  }
});

OneWaySelectComponent.reopenClass({
  positionalParams: ['paramValue']
});

export default OneWaySelectComponent;
