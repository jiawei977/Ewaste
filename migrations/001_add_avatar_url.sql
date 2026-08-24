-- Run this once against an existing ewaste_db database.
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `avatar_url` varchar(255) DEFAULT NULL AFTER `password`;
