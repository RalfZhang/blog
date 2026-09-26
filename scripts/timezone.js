/* global hexo */
'use strict';

// Hexo formats permalink dates (:year/:month/:day) in the build machine's local time zone rather than
// the `timezone` in _config.yml, so building outside Asia/Shanghai shifts some post URLs (and the Disqus
// thread ids derived from them) by a day. Pin the process time zone to the configured one.
if (hexo.config.timezone) process.env.TZ = hexo.config.timezone;
