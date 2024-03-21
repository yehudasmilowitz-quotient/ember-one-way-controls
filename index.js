/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-one-way-controls',

  included(app) {
    this.addonDependencies = this.addonDependencies || [];
    this.addonDependencies.push({ name: 'ember-cli-htmlbars' });
  }
};
