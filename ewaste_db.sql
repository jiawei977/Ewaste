-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 25, 2026 at 08:59 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ewaste_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `recycle_history`
--

CREATE TABLE `recycle_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `item_type` varchar(255) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recycle_history`
--

INSERT INTO `recycle_history` (`id`, `user_id`, `item_type`, `points`, `timestamp`) VALUES
(1, 1, 'battery', 15, '2026-04-17 15:27:07'),
(2, 1, 'pcb', 30, '2026-04-17 15:29:10'),
(3, 2, 'battery', 15, '2026-04-17 15:30:44'),
(4, 2, 'Mobile', 20, '2026-04-17 15:43:44'),
(5, 2, 'Mobile', 20, '2026-04-17 15:54:02'),
(6, 2, 'battery', 15, '2026-04-17 15:56:47'),
(7, 2, 'Mobile', 20, '2026-04-17 15:57:24'),
(8, 2, 'Mobile', 20, '2026-04-18 15:05:28'),
(9, 2, 'Mouse', 10, '2026-04-18 15:49:43'),
(10, 2, 'Mouse', 10, '2026-04-18 16:16:22'),
(11, 2, 'battery', 15, '2026-04-18 16:34:46'),
(12, 1, 'battery', 15, '2026-04-19 09:06:35'),
(13, 1, 'battery', 15, '2026-04-19 09:23:26'),
(14, 1, 'battery', 15, '2026-04-19 09:35:07'),
(15, 1, 'battery', 15, '2026-04-19 14:49:45'),
(16, 1, 'Player', 15, '2026-04-21 07:02:56'),
(17, 1, 'battery', 15, '2026-05-04 07:32:17'),
(18, 1, 'battery', 15, '2026-05-04 08:32:11'),
(19, 1, 'Mouse', 10, '2026-05-04 08:32:40'),
(20, 6, 'battery', 15, '2026-05-04 14:40:33'),
(21, 1, 'Keyboard', 10, '2026-05-04 14:45:19'),
(22, 1, 'Printer', 20, '2026-05-04 14:45:19'),
(23, 2, 'pcb', 30, '2026-05-04 14:45:19'),
(24, 2, 'Television', 25, '2026-05-04 14:45:19'),
(25, 4, 'Mouse', 10, '2026-05-04 14:45:19'),
(26, 4, 'battery', 15, '2026-05-04 14:45:19'),
(27, 5, 'Mobile', 20, '2026-05-04 14:45:19'),
(28, 5, 'Keyboard', 10, '2026-05-04 14:45:19'),
(29, 6, 'Printer', 20, '2026-05-04 14:45:19'),
(30, 6, 'pcb', 30, '2026-05-04 14:45:19'),
(31, 7, 'Mouse', 10, '2026-05-04 14:45:19'),
(32, 7, 'battery', 15, '2026-05-04 14:45:19'),
(33, 8, 'Mobile', 20, '2026-05-04 14:45:19'),
(34, 8, 'Television', 25, '2026-05-04 14:45:19'),
(35, 9, 'Keyboard', 10, '2026-05-04 14:45:19'),
(36, 9, 'pcb', 30, '2026-05-04 14:45:19'),
(37, 10, 'battery', 15, '2026-05-04 14:45:19'),
(38, 10, 'Mouse', 10, '2026-05-04 14:45:19'),
(39, 11, 'Printer', 20, '2026-05-04 14:45:19'),
(40, 11, 'Mobile', 20, '2026-05-04 14:45:19'),
(41, 11, 'battery', 15, '2026-08-24 06:12:07'),
(42, 11, 'Mouse', 10, '2026-08-24 06:12:18'),
(43, 11, 'Microwave', 25, '2026-08-24 06:12:43'),
(44, 11, 'Mobile', 20, '2026-08-24 06:13:29'),
(45, 5, 'battery', 15, '2026-08-24 07:50:37'),
(46, 5, 'battery', 15, '2026-08-24 08:10:04'),
(47, 5, 'battery', 15, '2026-08-24 08:39:33'),
(48, 2, 'battery', 15, '2026-08-24 15:06:34');

-- --------------------------------------------------------

--
-- Table structure for table `recycling_guidelines`
--

CREATE TABLE `recycling_guidelines` (
  `id` int(11) NOT NULL,
  `class_index` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `recycling_instruction` text NOT NULL,
  `points` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recycling_guidelines`
--

INSERT INTO `recycling_guidelines` (`id`, `class_index`, `category`, `recycling_instruction`, `points`) VALUES
(1, 0, 'battery', 'Take to a battery recycling kiosk at a supermarket or hardware store. Do not bin.', 15),
(2, 1, 'Keyboard', 'Drop at an e-waste collection bin or a community recycling hub.', 10),
(3, 2, 'Microwave', 'Hand over to a scrap metal recycler or a specialized appliance recycling facility.', 25),
(4, 3, 'Mobile', 'Factory reset and drop at a dedicated mobile recycling bin or trade-in kiosk.', 20),
(5, 4, 'Mouse', 'Deposit in a small e-waste collection bin; ensure batteries are removed first.', 10),
(6, 5, 'pcb', 'Send to a precious metal recovery specialist to extract gold and copper.', 30),
(7, 6, 'Player', 'Take to a general electronics recycling point after removing any physical media.', 15),
(8, 7, 'Printer', 'Remove ink/toner cartridges and take the unit to an office equipment recycling center.', 20),
(9, 8, 'Television', 'Drop off at a designated e-waste center that handles screen components.', 25),
(10, 9, 'Washing_Machine', 'Schedule a pickup with a scrap metal merchant or a bulky e-waste recycler.', 40);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `avatar_url`, `created_at`) VALUES
(1, 'xiaomei', 'xiaomei@gmail.com', 'scrypt:32768:8:1$N3rrOjcAAWWs2VGI$ac6a9cf5d2380742d1a05dc0701c9bb3da373cc8e453c4bb4b437831cc02e024559bd77b6f7b4f887a3ac6b28ffb0153eb2ed60a777599397cae567154c1da84', NULL, '2026-04-17 15:14:23'),
(2, 'law', 'lawjiawei041229@gmail.com', 'scrypt:32768:8:1$9MWJu4JhJh39vX50$aedf74ab3125961a3c263f39d98059b7e640ac9e1e2ad7682bbea891950eec179ae0590171b9ba11b8a5d2dfcea9af681eed4b037f35ceb6ee3b4e64ff9fd00b', '/static/avatars/user_2.webp?v=c3df1ba9d67f4e97af2fcb841c59ad7b', '2026-04-17 15:29:40'),
(4, 'zentrix21', 'zentrix21@gmail.com', 'scrypt:32768:8:1$amOIUHoIqwJVFGjs$2757730b70deb953df1b5ed351b492aa53d853f5a0628d39e335e1775c145c2da82ff2c19b48918f098dec6486826fbb28bacb63b7e3778b5a066e6b15053d8a', NULL, '2026-05-04 14:37:14'),
(5, 'mika_dev', 'mika_dev@gmail.com', 'scrypt:32768:8:1$lNnHK5FvQMHkrttt$b593e159dc9d96bb2ec36a4a46c2592c65c8b9d6fabeae0ce71557a4ea57883450c220b35710ef090b7ec2ae215b0d31d1d7b465e9123f297127504811100197', '/static/avatars/user_5.webp?v=6f4d40dac2224bc48bf440cf630181dd', '2026-05-04 14:38:09'),
(6, 'alpha_nova', 'alpha_nova@gmail.com', 'scrypt:32768:8:1$sRl1rl2pfX0b2AXc$04a82be15796a81dfe571a37186f02386efb100a4a124e0f50b3b5101a3f969ca8ed5ef18e7d1d9e3833919934e8d53958f9acdfc04f5579b171425f26e43b00', NULL, '2026-05-04 14:39:10'),
(7, 'byteflow7', 'byteflow7@gmail.com', 'scrypt:32768:8:1$jOmIwYzVJIqNGStr$b5aa852f8c8c5c6ae704f62973948542a20244958a684e18545b0dafbaeffbc2df950ce6fd9f18ef5729db173364c78aafd934c72a9d9bd1535b3ecb45665361', NULL, '2026-05-04 14:41:10'),
(8, 'luna_core', 'luna_core@gmail.com', 'scrypt:32768:8:1$gstgv4gKzHzA2bCK$957397f794eca82bc1b8d164f693e2b477255aae02e1684906a58df82433dd15ff6e51263e347ba70bc162ab49e0bbdeb43d1e684c16fd8307e2f2a9a82a016c', NULL, '2026-05-04 14:41:34'),
(9, 'pixelwave', 'pixelwave@gmail.com', 'scrypt:32768:8:1$c3W3g871taEZVFDN$d1ebeb780e6b48fb50ff0568dc2ce31caac74f4f48231f968dba063a466d48264c6f914d531ce2fb75c6f842438766afd80ed5f0cc767e8b2f5e0b71d8b3d5d7', NULL, '2026-05-04 14:41:52'),
(10, 'nexo_link', 'nexo_link@gmail.com', 'scrypt:32768:8:1$UVizD1vPRKcZ2orl$c3dfc84d8ac7fa39b61fd8967ed8dfb10e101a66c2649347501d86addd343ec6e08fd39a8d501d4bad13a12fe87e6a93cb240dda297de8c2b98bd400b7ebbc31', NULL, '2026-05-04 14:42:09'),
(11, 'orbitx99', 'orbitx99@gmail.com', 'scrypt:32768:8:1$BjIkWfQxRU0Ky6n5$562c0fe72b6cd98826b2070372d0ba736089be5aa5702a9fec848ed0355df546a2b4dbed0c117f137913aa471064b31683dfd1627876064f427756a675f2744d', NULL, '2026-05-04 14:42:43'),
(12, 'JiaWei', 'lawjiawei04@gmail.com', 'scrypt:32768:8:1$7DqCetUW1n2bEOnv$f12ba038f7c2e3f403027eeb27db452af56c1b20b80217399fa6b61ef974b0230862dbe2c2c7479119c319cc243cb4e9ef3cba34c929c2b485c9d599e7a9414f', NULL, '2026-08-24 07:22:48');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

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
  `theme` enum('system','light','dark') NOT NULL DEFAULT 'system',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `recycle_history`
--
ALTER TABLE `recycle_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `recycling_guidelines`
--
ALTER TABLE `recycling_guidelines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `recycle_history`
--
ALTER TABLE `recycle_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `recycling_guidelines`
--
ALTER TABLE `recycling_guidelines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `recycle_history`
--
ALTER TABLE `recycle_history`
  ADD CONSTRAINT `recycle_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
