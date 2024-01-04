import { find } from 'ember-native-dom-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{one-way-textarea}}', function(hooks) {
  setupRenderingTest(hooks);

  test('It renders a textarea', async function(assert) {
    await render(hbs`{{one-way-textarea}}`);
    assert.ok(find('textarea'), 'a textarea was rendered');
  });

  test('I can add a class attribute', async function(assert) {
    await render(hbs`{{one-way-textarea class="testing"}}`);
    assert.ok(find('textarea').classList.contains('testing'));
  });
});
