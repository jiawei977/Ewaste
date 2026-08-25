-- Run this once only if you are upgrading an existing database instead of re-importing ewaste_db.sql.
CREATE TABLE `user_profiles` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(120) DEFAULT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `gender` enum('female','male','non_binary','prefer_not_to_say') DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postcode` varchar(20) DEFAULT NULL,
  `location_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `preferred_language` varchar(10) NOT NULL DEFAULT 'en',
  `theme` enum('system','light','dark') NOT NULL DEFAULT 'light',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
