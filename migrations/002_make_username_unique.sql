-- Run this once against an existing ewaste_db database.
-- Check and rename duplicate usernames before adding the unique index:
-- SELECT username, COUNT(*) FROM users GROUP BY username HAVING COUNT(*) > 1;

ALTER TABLE `users`
  ADD UNIQUE INDEX `username` (`username`);
