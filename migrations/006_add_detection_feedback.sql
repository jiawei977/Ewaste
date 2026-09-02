-- Stores user corrections for evaluating and improving the detection model.
CREATE TABLE `detection_feedback` (
  `feedback_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `predicted_category` varchar(100) NOT NULL,
  `corrected_category` varchar(100) DEFAULT NULL,
  `confidence` decimal(6,5) NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `model_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`feedback_id`),
  KEY `idx_detection_feedback_user` (`user_id`),
  KEY `idx_detection_feedback_created_at` (`created_at`),
  CONSTRAINT `detection_feedback_ibfk_1`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
