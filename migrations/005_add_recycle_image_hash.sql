-- Adds perceptual image fingerprints for duplicate recycling protection.
ALTER TABLE `recycle_history`
  ADD COLUMN `image_hash` varchar(64) DEFAULT NULL AFTER `points`,
  ADD KEY `idx_recycle_history_image_hash` (`image_hash`);
