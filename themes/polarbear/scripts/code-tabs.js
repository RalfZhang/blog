/* global hexo */
'use strict';

// {% codetabs %} ... {% endcodetabs %} groups the code blocks inside it into one block with a tab per
// language. The tabs are built in the browser (Theme.codeTabs in source/js/src/theme.js), so feed readers
// and visitors without JavaScript just see the code blocks one after another.
hexo.extend.tag.register('codetabs', (args, content) => `<div class="code-tabs">${content}</div>`, { ends: true });
