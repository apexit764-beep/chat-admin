<?php
// One-shot cleanup: removes admin-build files mistakenly uploaded into qhub-client.
// Deletes ONLY the whitelisted names below, and only inside assets-v2.
// Self-deletes when finished.
header('Content-Type: text/plain; charset=utf-8');
$dir = '/var/www/apexes.click/qhub-client/assets-v2/';
$list = array(
  'ActivityLog-BKD1yj4Q.js',
  'ClientDetail-CUUDTo-F.js',
  'Clients-DCQMiEz2.js',
  'Dashboard-DW8_U0M9.js',
  'Feedback-0hiRK8Ur.js',
  'Finance-DsB50H3Q.js',
  'Industries-CfmQyehM.js',
  'Integrations-CCXhgOqK.js',
  'KnowledgeBase-Cs6y5DC4.js',
  'KnowledgeCategories-Bh-LAHfl.js',
  'LineChart-CLw-U3V4.js',
  'LiveChat-FANVZrb6.js',
  'Login-BvMJwPdI.js',
  'Notifications-DNnsU-QA.js',
  'PlanForm--COMALsJ.js',
  'PlanRequests-sENQ0R3r.js',
  'Plans-CRlAkbXj.js',
  'Profile-D5_Ox94x.js',
  'Reports-BM2UF-Sh.js',
  'Settings-lCFdl8QQ.js',
  'StatCard-Bj5ZESmX.js',
  'Subscriptions-C99izp0T.js',
  'Team-CCK7Og4Q.js',
  'WidgetSettings-CkXnlsrk.js',
  'arrow-left-right-D-LdCRbx.js',
  'bilingual-input-Ck_yDmM-.js',
  'briefcase-lDWBKUO-.js',
  'circle-alert-OLTC8rXq.js',
  'circle-play-PRiQczHJ.js',
  'clipboard-list-8O7nJ0JA.js',
  'clock-DkC7Bjs-.js',
  'copy-L-RtBAgm.js',
  'date-range-picker-GQu8LHoz.js',
  'dollar-sign-Cx917gPs.js',
  'download-tI8TyqRh.js',
  'earth-DowsQa9F.js',
  'ellipsis-BSHdCjNy.js',
  'empty-state-D1KrzItd.js',
  'external-link-BnMGNjzD.js',
  'eye-kyq7wN3o.js',
  'eye-off-5MRYLDy5.js',
  'file-text-B2WjXuAR.js',
  'filter-BnIJGg37.js',
  'folder-open-BmOOQg6G.js',
  'globe-DTzz37cq.js',
  'grip-vertical-Ctu386Zf.js',
  'hash-o2-af5cG.js',
  'inbox-CvRmyGGj.js',
  'index-BZgUEzeh.css',
  'index-oMQdhlZH.js',
  'infinity-OeOntRYr.js',
  'link-2-Dy9yu__x.js',
  'lock-DtOihSzA.js',
  'mail-D0jJAk3Y.js',
  'message-square-DEdlDnl-.js',
  'money-Co42kA9V.js',
  'paperclip-BLc5Npv7.js',
  'pen-LVZpE36z.js',
  'pencil-BVdx57ah.js',
  'phone-BRLqehQG.js',
  'plus-Cp8T9w1G.js',
  'send-DrtYOE0C.js',
  'shield-C3xmAGxv.js',
  'star-Dogj_h8O.js',
  'tag-D17wqayH.js',
  'trash-2-CsYelvM7.js',
  'trending-down-Cx3A5ZHi.js',
  'trending-up-BMoZ8Bjw.js',
  'upload-BZ8me56x.js',
  'useSettingsStore-CTraCKDA.js',
  'user-check-C5Wj4t7t.js',
  'user-plus-DA9UwEPx.js',
);
$deleted = 0; $skipped = 0; $missing = 0;
foreach ($list as $name) {
  if (basename($name) !== $name) { $skipped++; continue; }
  $p = $dir . $name;
  if (!is_file($p)) { $missing++; continue; }
  $isAdminBundle = ($name === 'index-oMQdhlZH.js' || $name === 'index-BZgUEzeh.css');
  $body = @file_get_contents($p);
  $isAdminChunk = ($body !== false && strpos($body, 'index-oMQdhlZH') !== false);
  if (!$isAdminBundle && !$isAdminChunk) { echo "SKIP (not admin build): $name\n"; $skipped++; continue; }
  if (@unlink($p)) { $deleted++; } else { echo "FAIL: $name\n"; $skipped++; }
}
echo "deleted=$deleted skipped=$skipped missing=$missing\n";
@unlink(__FILE__);
echo "cleanup script removed itself\n";
