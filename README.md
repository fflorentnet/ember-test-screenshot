ember-test-screenshot
==============================================================================

Experimental firefox based plugin.
Takes screenshot during your acceptance tests!

Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-test-screenshot
```


Usage
------------------------------------------------------------------------------

```javascript
import { expect } from 'chai';
import { screenshot } from 'ember-test-screenshot/test-support';
import { describe, it } from 'mocha';
import { setupApplicationTest } from 'ember-mocha';
import {
  visit, click, fillIn, find
} from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

describe('Acceptance - Something', () => {
  const hooks = setupApplicationTest();
  setupMirage(hooks);

  it('should open the modal', async () => {
    await visit('/imports/1/carte');
    await screenshot(null, { filename: 'page.png' });
    await click('.btn-thing');
    await screenshot('.modal', { filename: 'modal.png' });
    await fillIn('textarea', 'textarea');
    await click('.btn-apply');
    expect(find('.something-changed')).to.exist;
    });
});
```

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
