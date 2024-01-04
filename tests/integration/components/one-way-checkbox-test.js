import { set } from '@ember/object';
import { find, click } from 'ember-native-dom-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | {{one-way-checkbox}}', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('It renders a checkbox', async function(assert) {
    await render(hbs`{{one-way-checkbox}}`);
    assert.ok(find('input[type="checkbox"]'), 'Checkbox is rendered');
  });

  test('It sets the checked value', async function(assert) {
    await render(hbs`{{one-way-checkbox}}`);
    assert.notOk(find('input').checked, 'Checkbox is not checked');

    await render(hbs`{{one-way-checkbox checked=true}}`);
    assert.ok(find('input').checked, 'Checkbox is checked');

    await render(hbs`{{one-way-checkbox checked=false}}`);
    assert.notOk(find('input').checked, 'Checkbox is not checked');
  });

  test('The first positional param is checked', async function(assert) {
    await render(hbs`{{one-way-checkbox true}}`);
    assert.ok(find('input:checked'), 'Checkbox is checked');
  });

  test('Setting the value property', async function(assert) {
    await render(hbs`{{one-way-checkbox value="Affirmative"}}`);
    assert.equal(find('input').value, 'Affirmative', 'Checkbox value is set');
  });

  test('Clicking the checkbox triggers the update action', async function(assert) {
    await render(hbs`{{one-way-checkbox update=(action (mut value))}}`);
    await click('input');
    assert.equal(this.value, true);

    await click('input');
    assert.equal(this.value, false);
  });

  test('It can accept an outside toggle of checked', async function(assert) {
    await render(hbs`{{one-way-checkbox checked=checked update=(action (mut checked))}}`);

    await click('input');
    this.set('checked', false);
    await click('input');

    assert.strictEqual(this.checked, true);
  });

  test('It can accept an outside toggle of checked - using positional param', async function(assert) {
    await render(hbs`{{one-way-checkbox checked update=(action (mut checked))}}`);

    await click('input');
    this.set('checked', false);
    await click('input');

    assert.strictEqual(this.checked, true);
  });

  test('I can add a class attribute', async function(assert) {
    await render(hbs`{{one-way-checkbox class="testing"}}`);
    assert.equal(true, find('input').classList.contains('testing'));
  });

  test('Outside value of null', async function(assert) {
    this.set('checked', true);
    await render(hbs`{{one-way-checkbox checked}}`);
    this.set('checked', null);
    assert.notOk(find('input').checked, 'Checkbox is not checked');
  });

  test('Outside value of undefined', async function(assert) {
    this.set('checked', true);
    await render(hbs`{{one-way-checkbox checked}}`);
    this.set('checked', undefined);
    assert.notOk(find('input').checked, 'Checkbox is not checked');
  });

  test('classNames is not passed as an html attribute', async function(assert) {
    await render(hbs`{{one-way-checkbox classNames="testing"}}`);
    assert.equal(find('input').getAttribute('classnames'), undefined);
  });

  test('the click event can be intercepted in the action', async function(assert) {
    assert.expect(1);

    this.actions.divClick = function() {
      assert.ok(false);
    };

    this.actions.checkboxClick = function(value, event) {
      event.stopPropagation();

      set(this, 'checked', value);
    };

    await render(hbs`
      <div {{action 'divClick'}}>
        {{one-way-checkbox checked update=(action 'checkboxClick')}}
      </div>
    `);

    await click('input');

    assert.equal(this.checked, true);
  });
});

