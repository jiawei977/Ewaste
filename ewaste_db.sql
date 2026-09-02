-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 02, 2026 at 07:31 PM
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
-- Table structure for table `detection_feedback`
--

CREATE TABLE `detection_feedback` (
  `feedback_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `predicted_category` varchar(100) NOT NULL,
  `corrected_category` varchar(100) DEFAULT NULL,
  `confidence` decimal(6,5) NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `model_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detection_feedback`
--

INSERT INTO `detection_feedback` (`feedback_id`, `user_id`, `predicted_category`, `corrected_category`, `confidence`, `is_correct`, `model_name`, `created_at`) VALUES
(1, 2, 'Player', NULL, 0.58518, 1, 'best.pt', '2026-09-02 16:33:04'),
(2, 2, 'Player', 'Other: smartwatch', 0.68252, 0, 'best.pt', '2026-09-02 16:33:34');

-- --------------------------------------------------------

--
-- Table structure for table `recycle_history`
--

CREATE TABLE `recycle_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `item_type` varchar(255) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `image_hash` varchar(64) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recycle_history`
--

INSERT INTO `recycle_history` (`id`, `user_id`, `item_type`, `points`, `image_hash`, `timestamp`) VALUES
(1, 1, 'battery', 15, NULL, '2026-04-17 15:27:07'),
(2, 1, 'pcb', 30, NULL, '2026-04-17 15:29:10'),
(3, 2, 'battery', 15, NULL, '2026-04-17 15:30:44'),
(4, 2, 'Mobile', 20, NULL, '2026-04-17 15:43:44'),
(5, 2, 'Mobile', 20, NULL, '2026-04-17 15:54:02'),
(6, 2, 'battery', 15, NULL, '2026-04-17 15:56:47'),
(7, 2, 'Mobile', 20, NULL, '2026-04-17 15:57:24'),
(8, 2, 'Mobile', 20, NULL, '2026-04-18 15:05:28'),
(9, 2, 'Mouse', 10, NULL, '2026-04-18 15:49:43'),
(10, 2, 'Mouse', 10, NULL, '2026-04-18 16:16:22'),
(11, 2, 'battery', 15, NULL, '2026-04-18 16:34:46'),
(12, 1, 'battery', 15, NULL, '2026-04-19 09:06:35'),
(13, 1, 'battery', 15, NULL, '2026-04-19 09:23:26'),
(14, 1, 'battery', 15, NULL, '2026-04-19 09:35:07'),
(15, 1, 'battery', 15, NULL, '2026-04-19 14:49:45'),
(16, 1, 'Player', 15, NULL, '2026-04-21 07:02:56'),
(17, 1, 'battery', 15, NULL, '2026-05-04 07:32:17'),
(18, 1, 'battery', 15, NULL, '2026-05-04 08:32:11'),
(19, 1, 'Mouse', 10, NULL, '2026-05-04 08:32:40'),
(20, 6, 'battery', 15, NULL, '2026-05-04 14:40:33'),
(21, 1, 'Keyboard', 10, NULL, '2026-05-04 14:45:19'),
(22, 1, 'Printer', 20, NULL, '2026-05-04 14:45:19'),
(23, 2, 'pcb', 30, NULL, '2026-05-04 14:45:19'),
(24, 2, 'Television', 25, NULL, '2026-05-04 14:45:19'),
(25, 4, 'Mouse', 10, NULL, '2026-05-04 14:45:19'),
(26, 4, 'battery', 15, NULL, '2026-05-04 14:45:19'),
(27, 5, 'Mobile', 20, NULL, '2026-05-04 14:45:19'),
(28, 5, 'Keyboard', 10, NULL, '2026-05-04 14:45:19'),
(29, 6, 'Printer', 20, NULL, '2026-05-04 14:45:19'),
(30, 6, 'pcb', 30, NULL, '2026-05-04 14:45:19'),
(31, 7, 'Mouse', 10, NULL, '2026-05-04 14:45:19'),
(32, 7, 'battery', 15, NULL, '2026-05-04 14:45:19'),
(33, 8, 'Mobile', 20, NULL, '2026-05-04 14:45:19'),
(34, 8, 'Television', 25, NULL, '2026-05-04 14:45:19'),
(35, 9, 'Keyboard', 10, NULL, '2026-05-04 14:45:19'),
(36, 9, 'pcb', 30, NULL, '2026-05-04 14:45:19'),
(37, 10, 'battery', 15, NULL, '2026-05-04 14:45:19'),
(38, 10, 'Mouse', 10, NULL, '2026-05-04 14:45:19'),
(39, 11, 'Printer', 20, NULL, '2026-05-04 14:45:19'),
(40, 11, 'Mobile', 20, NULL, '2026-05-04 14:45:19'),
(41, 11, 'battery', 15, NULL, '2026-08-24 06:12:07'),
(42, 11, 'Mouse', 10, NULL, '2026-08-24 06:12:18'),
(43, 11, 'Microwave', 25, NULL, '2026-08-24 06:12:43'),
(44, 11, 'Mobile', 20, NULL, '2026-08-24 06:13:29'),
(45, 5, 'battery', 15, NULL, '2026-08-24 07:50:37'),
(46, 5, 'battery', 15, NULL, '2026-08-24 08:10:04'),
(47, 5, 'battery', 15, NULL, '2026-08-24 08:39:33'),
(48, 2, 'battery', 15, NULL, '2026-08-24 15:06:34'),
(49, 2, 'Television', 25, 'af4ac88dd03c873d', '2026-08-25 15:54:28'),
(50, 5, 'Television', 25, 'af4ac88dd03c873d', '2026-08-25 16:27:27'),
(51, 1, 'Keyboard', 10, 'a1e89e599f50915d', '2026-08-25 16:31:30'),
(52, 1, 'Keyboard', 10, 'ffff8100b62189b2', '2026-08-25 16:31:35'),
(53, 1, 'Microwave', 25, 'ebe1c085ac97bb14', '2026-08-25 16:31:41'),
(54, 1, 'Washing_Machine', 40, '85a52ac2db9b3f50', '2026-08-25 16:31:54'),
(55, 1, 'battery', 15, 'e90e962b8ab2b8b3', '2026-08-26 03:51:31'),
(56, 2, 'battery', 15, 'fa8390788f742ac7', '2026-08-26 04:01:25'),
(57, 2, 'Player', 15, 'da1b3d9c61b4264b', '2026-09-02 16:28:50');

-- --------------------------------------------------------

--
-- Table structure for table `recycling_centres`
--

CREATE TABLE `recycling_centres` (
  `centre_id` int(11) NOT NULL,
  `name` varchar(180) NOT NULL,
  `address` varchar(500) NOT NULL,
  `state` varchar(100) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `coordinate_quality` enum('address','postcode') DEFAULT NULL,
  `source_name` varchar(255) NOT NULL,
  `source_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recycling_centres`
--

INSERT INTO `recycling_centres` (`centre_id`, `name`, `address`, `state`, `latitude`, `longitude`, `coordinate_quality`, `source_name`, `source_date`) VALUES
(1, 'Trashforcash (M) Sdn Bhd', 'Lot 1821, Batu 8 Mukim Tajar, Jalan Dato Kumbar, 06500 Alor Setar, Kedah, KEDAH, Malaysia', 'Kedah', 6.11949170, 100.42860480, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(2, 'Green Resource Recovery Sdn Bhd', 'Plot 19, Darul Aman Industrial Estate, Bandar Darul Aman, 06000 Jitra Kedah, KEDAH, Malaysia', 'Kedah', 6.25729900, 100.41225850, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(3, 'Senheng Alor Setar', '2&2A, 3&3A, Pekan Simpang Kuala Off Lebuh Raya Sultan Abdul Halim 05400 Alor Setar, Kedah, KEDAH, Malaysia', 'Kedah', 6.08704870, 100.36598540, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(4, 'Senheng Jitra', '34, Pekan Jitra 3, 06000 Jitra, Kedah, KEDAH, Malaysia', 'Kedah', 6.26114660, 100.41878170, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(5, 'Senheng Sungai Petani', '207 & 208 207 & 208, Jalan Legenda 7 Legenda Heights, 08000 Sungai Petani, Kedah, KEDAH, Malaysia', 'Kedah', 5.62964580, 100.51227700, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(6, 'Fasiliti Inovasi Kitar Semula (FIKS) Presint 5 (Cawangan AFES)', 'No. 1, Fasiliti Inovasi Kitar Semula (FIKS), Jalan P5B, Presint 5, 62200 Putrajaya, PUTRAJAYA, Malaysia', 'Putrajaya', 2.89711100, 101.66776050, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(7, 'Pusat Kitar Semula Presint 8 (Cawangan AFES)', 'Berdekatan Pusat Kejiranan Presint 8, PUTRAJAYA, Malaysia', 'Putrajaya', NULL, NULL, NULL, 'Government e-waste collection centres PDF', '2021-02-05'),
(8, 'Pusat Kitar Semula Presint 9 (Cawangan AFES)', 'Pusat Kitar Semula Komuniti, Jalan P9B, 62250 Wilayah Persekutuan Putrajaya, PUTRAJAYA, Malaysia', 'Putrajaya', 2.93249380, 101.67691210, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(9, 'Pusat Kitar Semula Presint 11 (Cawangan AFES)', 'Berdekatan Pusat Kejiranan Presint 11, PUTRAJAYA, Malaysia', 'Putrajaya', NULL, NULL, NULL, 'Government e-waste collection centres PDF', '2021-02-05'),
(10, 'Pusat Kitar Semula Presint 14 (Cawangan AFES)', 'Park & Ride Presint 14, PUTRAJAYA, Malaysia', 'Putrajaya', NULL, NULL, NULL, 'Government e-waste collection centres PDF', '2021-02-05'),
(11, 'Pusat Kitar Semula Presint 16 (Cawangan AFES)', 'Bersebelahan Pasar Awam Presint 16, PUTRAJAYA, Malaysia', 'Putrajaya', NULL, NULL, NULL, 'Government e-waste collection centres PDF', '2021-02-05'),
(12, 'Pusat Kitar Semula Presint 18 (Cawangan AFES)', 'Opposite Futsal 1 Malaysia, Presint 18, Putrajaya, Malaysia', 'Putrajaya', NULL, NULL, NULL, 'Government e-waste collection centres PDF', '2021-02-05'),
(13, 'SenQ Alamanda Shopping Centre', 'Lot G29-31, Ground Floor Alamanda Putrajaya Jalan Alamanda, Presint 1 6200 Putrajaya, PUTRAJAYA, Malaysia', 'Putrajaya', NULL, NULL, NULL, 'Government e-waste collection centres PDF', '2021-02-05'),
(14, 'Cyberjaya Recycling Centre (Cawangan AFES)', 'Cyberjaya Recycling Centre, 63000 Cyberjaya, Selangor, SELANGOR, Malaysia', 'Selangor', 2.92216840, 101.64902290, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(15, 'ERTH', 'G-3A, Ground Floor, Kanvas Retail & Prima 15 Jalan Teknokrat 6 63000 Cyberjaya, SELANGOR, Malaysia', 'Selangor', 2.92216840, 101.64902290, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(16, 'Bumi Waste Management (M) Sdn Bhd', 'No. 5, Jalan 6, Hi-Tech 5, Industrial Park Sungai Lalang, 43500 Semenyih, Selangor, SELANGOR, Malaysia', 'Selangor', 2.93231880, 101.85888390, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(17, 'T-Pot Electrical & Electronics Sdn Bhd', 'No 2, Jalan Termostat 34/7, Bukit Kemuning Light Industrial Park, Seksyen 34, 40470 Shah Alam Selangor, SELANGOR, Malaysia', 'Selangor', 3.02167370, 101.51281050, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(18, 'Tan Boon Ming Sdn Bhd', 'No. 37 & 39, Jalan Mewah 25/63, Taman Sri Muda, 40400 Shah Alam, Selangor, SELANGOR, Malaysia', 'Selangor', 3.03116400, 101.53557390, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(19, 'Tan Boon Ming Sdn Bhd Dpulze Shopping Centre', 'LG-23, Dpulze Shopping Centre, Lingkaran Cyber Point Timur, Cyber12, 63000 Cyberjaya, Selangor, SELANGOR, Malaysia', 'Selangor', 2.92216840, 101.64902290, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(20, 'Tan Boon Ming Sdn Bhd', 'Lot 33, Jalan Delima, Subang Hi-Tech Industrial Park, 40000 Shah Alam, Selangor, SELANGOR, Malaysia', 'Selangor', 3.07224120, 101.50226450, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(21, 'Tan Boon Ming 3 Damansara', 'No 3, Jln SS20/27, Lot L1-3A, 1st floor, Damansara Utama, 47400 Petaling Jaya, SELANGOR, Malaysia', 'Selangor', 3.13197520, 101.62132570, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(22, 'Tan Boon Ming Central i- City Shopping Centre', 'LG-03, Level Lower Ground Sentral i-City, Plot 1, Jln Multimedia, Seksyen 7, 40000 Shah Alam, SELANGOR, Malaysia', 'Selangor', 3.07224120, 101.50226450, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(23, 'Grand Senheng Shah Alam 105', 'No. 105, Jalan Pelabur B 23/B, Section 23, 40300 Shah Alam, Selangor, SELANGOR, Malaysia', 'Selangor', 3.04500790, 101.52592260, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(24, 'Senheng USJ Taipan', '21, Jalan USJ 10/1F Taman Uep 47620 Subang Jaya, Selangor, SELANGOR, Malaysia', 'Selangor', 3.04963000, 101.57508970, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(25, 'Senheng Sungai Buloh', 'No. 39-G, 39-I, 40-G & 40-I, Jalan Nautika U20/A, Sekyen U20, Pusat Komersil TSB, 40160 Shah Alam, Selangor, SELANGOR, Malaysia', 'Selangor', 3.18371970, 101.51905790, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(26, 'Senheng Kompleks PKNS', 'G-60F, Tingkat Bawah, Kompleks PKNS Shah Alam, Persiaran Tasik, Seksyen 14, 40000 Shah Alam Selangor, SELANGOR, Malaysia', 'Selangor', 3.07224120, 101.50226450, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(27, 'Grand Senheng Rawang', 'No. 53, 55 & 57, Jalan Bandar Rawang 2 48000 Rawang Selangor Darul Ehsan, SELANGOR, Malaysia', 'Selangor', 3.31571380, 101.55889220, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(28, 'Grand Senheng Kajang', 'No 62-64, Jalan Raja Haroun, Bandar Kajang, 43000 Kajang, Selangor Darul Ehsan, SELANGOR, Malaysia', 'Selangor', 2.99065690, 101.78279390, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(29, 'Senheng Pusat Bandar Baru Bangi', '35 & 36G, Jalan Medan PB4 Seksyen 9, Pusat Bandar Baru Bangi 43650 Selangor, SELANGOR, Malaysia', 'Selangor', 2.95046940, 101.77875840, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(30, 'Senheng Kelana Jaya', 'F14 & F15 Giant Hypermarket Jalan SS6/12, Kelana Jaya 47301 Petaling Jaya., SELANGOR, Malaysia', 'Selangor', 3.11231180, 101.59475330, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(31, 'SenQ IOI Mall', 'Lot F23-23A, IOI Mall Batu 9, Jalan Puchong Bandar Puchong Jaya 47100 Selangor, SELANGOR, Malaysia', 'Selangor', 2.99260650, 101.62567040, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(32, 'Senheng Cheras Balakong', 'No.13A-G,13A-1,13A- 2,15G,15-1 & 15-2 Jalan C 180/1, Dataran C180 Jalan Balakong, Batu 11 43200 Cheras, Selangor, SELANGOR, Malaysia', 'Selangor', 2.99183650, 101.72067700, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(33, 'Senheng Bandar Puteri Puchong', 'No 34 (GF & 3F) and 36 (GF), Jalan Puteri 2/5 Bandar Puteri, 47100 Puchong, Selangor, SELANGOR, Malaysia', 'Selangor', 2.99260650, 101.62567040, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(34, 'Senheng SS2, PJ', 'No.23-G, 25-G, 25-1 & 25-2 Jalan SS2/75 47300 Petaling Jaya, Selangor, SELANGOR, Malaysia', 'Selangor', 3.10143920, 101.61803080, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(35, 'Senheng Kuala Selangor', 'PT1616 – NO 9 – NO 13, Jalan Medan Niaga 2 Medan Niaga Kuala Selangor 45000 Kuala Selangor, Selangor, SELANGOR, Malaysia', 'Selangor', 3.31659100, 101.27831420, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(36, 'Grand Senheng Semenyih', '2G, 2A-G Jalan TPS 1/2 Taman Pelangi Semenyih 43500 Semenyih, Selangor, SELANGOR, Malaysia', 'Selangor', 2.93231880, 101.85888390, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(37, 'Grand Senheng Pendamaran 89-91-93', '89, 91 & 93, Jln. Batu Unjur Taman Chi Liung, Pandamaran 42000 Port Klang, Selangor, SELANGOR, Malaysia', 'Selangor', 3.01880120, 101.41268120, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(38, 'Senheng Bangi', '15,17 & 19, Jalan 4/12, Seksyen 4 43650 Bandar Baru Bangi, Selangor, SELANGOR, Malaysia', 'Selangor', 2.95046940, 101.77875840, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(39, 'Senheng Klang Bukit Tinggi', 'NO. 43, 45, 47, Jalan Batu Nilam 5 Bandar Bukit Tinggi 41200 Klang, Selangor, SELANGOR, Malaysia', 'Selangor', 3.00291080, 101.44059960, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(40, 'Senheng Sri Gombak', 'No. 1, Jalan Sg. 1/9 Taman Sri Gombak 68100 Batu Caves, Selangor, SELANGOR, Malaysia', 'Selangor', 3.23466560, 101.67593780, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(41, 'Grand Senheng Setia Alam', 'LOT 6-1, 6-2, 7, 7-1,7-2, 8, 8- 1 No. 1 Jalan Setia Prima WU13/W Seksyen U13, Setia Alam 40170 Shah Alam, Selangor, SELANGOR, Malaysia', 'Selangor', 3.11722480, 101.46912110, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(42, 'Grand Senheng Selayang Utama', '3A,4A,5A,6A,7A,8A,9A,7,8,9 Jalan SU12 Taman Selayang Utama 68100, Selangor, SELANGOR, Malaysia', 'Selangor', 3.23466560, 101.67593780, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(43, 'SenQ The Mines', 'Lot L2-01B (1.01B, First Floor) MINES Shopping Fair Jalan Dulang, MINES Resort City 43300 Seri Kembangan, Selangor, SELANGOR, Malaysia', 'Selangor', 3.02336590, 101.70183400, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(44, 'SenQ 1 Utama', 'LG102, 1 Utama Shopping Centre, Lebuh Bandar Utama, 47800 Petaling Jaya, Selangor, Malaysia', 'Selangor', 3.15152210, 101.61032050, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(45, 'E Plus Resources', 'Lot 10480 B1 & B2, Jalan Kebun Nenas, 41200 Klang, Selangor, SELANGOR, Malaysia', 'Selangor', 3.33145580, 101.25130580, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(46, 'ICYCLE Malaysia Sdn Bhd Sungai Chua Warehouse', 'No. 12, Jalan SC 2, Pusat Perindustrian Sungai Chua, 43000 Kajang, Selangor, SELANGOR, Malaysia', 'Selangor', 2.99065690, 101.78279390, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(47, 'Shan Poornam Metals Sdn Bhd (Selangor)', 'No 6, Jalan Wawasan 2B/KU 7, Sungai Kapar Indah Industrial Park, 42200 Klang, Selangor, SELANGOR, Malaysia', 'Selangor', 3.10663400, 101.38687670, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(48, 'Pusat Kitar Semula Jalan Bonus, KL (Cawangan Alam Flora Environmental Solution)', 'Jalan Bonus 6, KL @ Berhampiran Semua House Jalan TAR, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', NULL, NULL, NULL, 'Government e-waste collection centres PDF', '2021-02-05'),
(49, 'Tan Boon Ming Sdn Bhd', 'PS-4,5,6,7 & 8, Taman Evergreen, Batu 4, Jln Klang Lama, 58100 Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.09740350, 101.68382000, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(50, 'Tan Boon Ming Sdn Bhd Bangsar Village', 'Unit No. LG-6, Lower Ground Floor, Jalan Telawi Satu, Bangsar Baru, 59100 Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.12889130, 101.66823090, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(51, 'Tan Boon Ming Sdn Bhd, Cheras Sentral', 'Cheras Sentral Shopping Mall, KM10, 56000 Cheras, Kuala Lumpur, Malaysia', 'Kuala Lumpur', 3.10030890, 101.73287050, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(52, 'Yayasan Taiwan Buddhist Tzu Chi', 'KL Jing Si Hall, 359 Jalan Kepong, 52000 Kuala Lumpur, Malaysia', 'Kuala Lumpur', 3.20716960, 101.65931570, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(53, 'Recircle Sdn Bhd', 'No. 560 A-1, Jalan E3/5, Taman Ehsan Kepong, 52100 Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.20989290, 101.64020880, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(54, 'Ecocytion Trading', 'No 145, Jalan 14, Perindustrian Ehsan Jaya, Kepong, 52100 KL, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.20989290, 101.64020880, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(55, 'SenQ Leisure Mall Cheras', 'L1 34, Level 1, Cheras Leisure Mall Jalan Manis 6, Taman Segar Cheras 56100 Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.10580770, 101.74142020, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(56, 'SenQ Melawati Mall', 'LOT LG – 17 & 18, UP2-01, Melawati Mall 355, Jalan Bandar Melawati, Pusat Bandar Melawati 53100 Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.15332640, 101.69273790, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(57, 'Senheng Kepong 40-42', '40 & 40-1, 42&42-1, Block C Vista Magna, Batu 7, Jalan Kepong 52100 Kepong, Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.20989290, 101.64020880, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(58, 'Grand Senheng 42-44', '42 & 44, Jalan Pandan 3/2 Pandan Jaya 55100 Cheras, Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.14572090, 101.71482660, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(59, 'Senheng Taman Connaught 171/3', '171 & 173, Jalan Sarjana Taman Connaught Off Jalan Cheras, 56000 Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.06983750, 101.74030110, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(60, 'Senheng Gombak', 'No. 15 & 17, Diamond Square, Jalan 2/50, Jalan Gombak, 53000 Setapak, Kuala Lumpur, Malaysia', 'Kuala Lumpur', 3.18971270, 101.70551550, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(61, 'Senheng Sri Rampai', '61-63, Jalan 46A/26 Rampai Town Centre 53300 Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.20178740, 101.72617620, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(62, 'Senheng Permaisuri', 'No. 69 & 71, Dataran Dwitasik Jalan Dwitasik 1 Bandar Seri Permaisuri 56000 Cheras, Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.06983750, 101.74030110, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(63, 'Senheng Sri Petaling 95-97-99', '95-99, Jalan 1/149D, 57000 Sri Petaling, Kuala Lumpur, Malaysia', 'Kuala Lumpur', 3.06480440, 101.70071860, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(64, 'Alif Marketing', 'No 44, Jalan 10/152, Taman Perindustrian OUG Jalan Puchong Bt. 6 58200 Kuala Lumpur, KUALA LUMPUR, Malaysia', 'Kuala Lumpur', 3.07987470, 101.67242400, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(65, 'AEON Bandaraya Melaka (Cawangan Meriahtek)', '2, Jalan Lagenda, Taman 1 Lagenda, 75400 Melaka, MELAKA, Malaysia', 'Melaka', 2.21314900, 102.24593110, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(66, 'TESCO Cheng (Cawangan Meriahtek)', 'No. 1, Jalan Inang 3, Taman Paya Rumput, 75460 Melaka, MELAKA, Malaysia', 'Melaka', 2.28076370, 102.21671670, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(67, 'Senheng Melaka 16-18', '16-18, Jalan Seri Mangga 1/2 Taman Seri Mangga 75250 Melaka, MELAKA, Malaysia', 'Melaka', 2.23337650, 102.22455040, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(68, 'Grand Senheng 1 Lagenda', 'Lot No. 2, Jalan Lagenda 3 Taman 1 Lagenda 75400 Melaka, MELAKA, Malaysia', 'Melaka', 2.21479370, 102.24958230, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(69, 'Senheng Bandar Utama Cheng M', 'No.75 & 75-1, Jalan Inang 4 Taman Paya Rumput Utama 76450 Melaka, MELAKA, Malaysia', 'Melaka', 2.28876870, 102.21073210, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(70, 'Shan Poornam Metals (Johor) Sdn Bhd', 'No 39, Jalan Murni 4, Taman Perindustrian Murni Senai, 81400 Senai Johor, JOHOR, Malaysia', 'Johor', 1.61549780, 103.66940310, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(71, 'MEP Enviro Technology Sdn Bhd', '111, Jalan Murni 5, Taman Perindustrian Murni Senai, 81400 Senai Johor, JOHOR, Malaysia', 'Johor', 1.61749520, 103.66991430, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(72, 'SenQ Sutera Mall', 'L2-036 Sutera Mall No. 1 Jalan Sutera Tanjung 8/4 Taman Sutera Utama 81300 Skudai, Johor Bahru., JOHOR, Malaysia', 'Johor', 1.56199020, 103.61959600, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(73, 'Grand Senheng Kluang', 'No. 15 Ground Floor & First Floor, Jalan Ciku, 86000 Kluang, Johor, JOHOR, Malaysia', 'Johor', 2.03430040, 103.32730650, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(74, 'Grand Senheng Taman Setia Indah', 'No. 16, 16A, 18,18A, 20, 20A Jalan Setia 7/18, Taman Setia Indah 81100 Johor Bahru, JOHOR, Malaysia', 'Johor', 1.54524590, 103.75846380, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(75, 'Senheng Bandar Utama, Segamat', 'No. 12 (Ground Floor) & No. 13 (Ground & First Floor), Jalan Susur 2/1, Taman Utama Bandar Baru, 85000 Segamat, Johor, JOHOR, Malaysia', 'Johor', 2.50416120, 102.83904920, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(76, 'SenQ Batu Pahat Mall', 'Lot No. 1.61, First Floor, 303B Jalan Kluang 83000 Batu Pahat, Johor, JOHOR, Malaysia', 'Johor', 1.84612300, 102.95067410, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(77, 'Senheng Kulai Jaya', 'No.229, Jalan Kenanga 29/2 Indahpura, 80100, Kulai Jaya, Johor., JOHOR, Malaysia', 'Johor', 1.46883890, 103.74459670, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(78, 'Senheng Bakri Muar', 'No. 82-46_No. 82-49 Jalan Bakri 2 Taman Kampung Kenanga Tun Dr. Ismail 84000 Muar, Johor, JOHOR, Malaysia', 'Johor', 2.04393380, 102.58738250, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(79, 'Grand Senheng Tun Aminah, Skudai', 'No. 47, 47A, 47B, Jalan Pendekar 15 Taman Ungku Tun Aminah 81300 Skudai, Johor, JOHOR, Malaysia', 'Johor', 1.56199020, 103.61959600, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(80, 'Grand Senheng Muar', '31-3G & 31-4G, Jalan Ali 84000 Muar, Johor, JOHOR, Malaysia', 'Johor', 2.04667110, 102.56902320, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(81, 'SenQ AEON Bukit Indah', 'Lot S01, Second Floor AEON Bukit Indah Shopping Center No 8, Jalan Indah 15/2, Bukit Indah 81200 Johor Bahru, Johor, JOHOR, Malaysia', 'Johor', 1.50483440, 103.71574980, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(82, 'SenQ AEON Tebrau City', 'LOT S67,2nd Floor,JUSCO Shopping Centre NO 1, Jalan Desa Tebrau Taman Desa Tebrau, 81100 Johor Bahru, JOHOR, Malaysia', 'Johor', 1.54524590, 103.75846380, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(83, 'SenQ AEON Kempas', 'Lot F25, First Floor,PTD 156356 Jalan Dato Onn Utama, AEON Mall Kempas 81100 Bandar Dato Onn,Johor Bahru, Johor., JOHOR, Malaysia', 'Johor', 1.54524590, 103.75846380, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(84, 'SenQ Paradigm Mall JB', '3F-01, Paradigm Mall Johor Bahru Jalan Skudai, 81200 Johor Bahru, Johor., JOHOR, Malaysia', 'Johor', 1.50483440, 103.71574980, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(85, 'ICYCLE Malaysia Sdn Bhd', 'Level 11, Tower B, Medina 9, Sentral 12, Iskandar Puteri, 79259 Nusajaya Johor, JOHOR, Malaysia', 'Johor', 2.15488390, 102.72797250, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(86, '3R Quest Sdn Bhd', 'Lot 1620, Jalan Perusahaan 2/1, Kawasan Perindustrian Chembong, 71300 Rembau Negeri Sembilan, NEGERI SEMBILAN, Malaysia', 'Negeri Sembilan', 2.58612350, 102.09042240, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(87, 'SenQ AEON Seremban 2', 'First Floor, AEON Seremban 2, 112 Persiaran S2 B1, 70200 Seremban, Negeri Sembilan, Malaysia', 'Negeri Sembilan', 2.72771920, 101.92810400, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(88, 'SenQ Nilai', 'F20 & F21, 1st Floor, Aeon Mall Nilai Persiaran Pusat Bandar, Putra Point 71800 Bandar Baru Nilai, NEGERI SEMBILAN, Malaysia', 'Negeri Sembilan', 2.82856790, 101.78918870, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(89, 'Senheng Bandar Baru Nilai', '9895 & 9896, Jalan BBN 1/3J Putra Point, Fasa 1, Bandar Baru Nilai 71800 Nilai, Negeri Sembilan, NEGERI SEMBILAN, Malaysia', 'Negeri Sembilan', 2.82856790, 101.78918870, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(90, 'Grand Senheng Senawang', 'No.93,94,95 (Ground/1st Floor) Jalan BPS 5, Bandar Prima Senawang 70450 Seremban, Negeri Sembilan, NEGERI SEMBILAN, Malaysia', 'Negeri Sembilan', 2.69719310, 101.99480530, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(91, 'Grand Senheng Temerloh', 'No 90, 91 & 92, Jalan Tengku Ismail 28000 Temerloh, Pahang, PAHANG, Malaysia', 'Pahang', 3.46531190, 102.40163850, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(92, 'Grand Senheng Kuantan', 'B104, B106, B108, B110 & B112, Jalan Tun Ismail, Sri Dagangan Kuantan 25000 Kuantan, Pahang., PAHANG, Malaysia', 'Pahang', 3.81250830, 103.32870760, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(93, 'Senheng Kuantan Bukit Ubi', 'Ground Floor E897, 899, 901 Jalan Bukit Ubi 25000 Kuantan, Pahang, PAHANG, Malaysia', 'Pahang', 3.81250830, 103.32870760, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(94, 'Senheng Bentong', 'P10 & P11, Jalan MGI, Pusat Perniagaan Mutiara Gemilang, 28700 Bentong, Pahang, Malaysia', 'Pahang', 3.50677020, 101.92217160, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(95, 'Grand Senheng Kemaman', 'PT 11268 (G, 1st)- PT 11269 (G, 1st), PT11270 (1st) Taman Cukai Utama Jalan Kubang Kurus 24000 Kemaman, Terengganu, TERENGGANU, Malaysia', 'Terengganu', 5.32964610, 103.13832650, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(96, 'Senheng Dungun', 'Lot 11777 & 11778 GM8428 Jalan Pak Sabah Mukim, Kuala Dungun 23000 Dungun, Terengganu, TERENGGANU, Malaysia', 'Terengganu', 5.32964610, 103.13832650, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(97, 'Senheng Kuala Terengganu', '1049-1, G/ Floor, Wisma Ladang, Jalan Sultan Sulaiman, 20000 Kuala Terengganu, TERENGGANU, Malaysia', 'Terengganu', 5.33480960, 103.14203250, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(98, 'SenQ KTCC Mall', 'Lot 1-25, First Floor, KTCC Mall, Muara Selatan, 20000 Kuala Terengganu, TERENGGANU, Malaysia', 'Terengganu', 5.33480960, 103.14203250, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(99, 'Senheng Tanah Merah', 'Lot 243, Jalan Hospital 17500 Tanah Merah, Kelantan, KELANTAN, Malaysia', 'Kelantan', 5.82314060, 102.09809870, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(100, 'Senheng Kubang Kerian', 'PT1607 & PT 1608 (Ground Floor) Jalan KK 6, Bandar Baru Kubang Kerian 16150 Kota Bharu, Kelantan, KELANTAN, Malaysia', 'Kelantan', 6.06371290, 102.28349070, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(101, 'SenQ KB Mall', 'Lot 3.1 & 3.1A, 3rd Floor KB Mall Jalan Hamzah 15050 Kota Bharu, Kelantan, KELANTAN, Malaysia', 'Kelantan', 6.11541300, 102.23642780, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(102, 'SenQ AEON Mall Kota Bharu', 'F19 AEON Mall Kota Bharu Lembah Sireh, 15050 Kota Bharu,Kelantan, KELANTAN, Malaysia', 'Kelantan', 6.11541300, 102.23642780, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(103, 'Senheng Kota Bharu', '4064A & B, Jalan Sultan Yahya Petra 15150 Kota Bharu, Kelantan, KELANTAN, Malaysia', 'Kelantan', 6.10132570, 102.24290700, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(104, 'ICT Digital Mall @ KOMTAR', 'Level 3, KOMTAR, 10000 Georgetown, Pulau Pinang, Malaysia', 'Pulau Pinang', 5.41663760, 100.33037810, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(105, 'Pusat Sumber Alam Sekitar Taman Sri Rambai FASA 4', 'No. 7, Tingkat Binjai 20, Taman Sri Rambai, 14000 Bukit Mertajam, Pulau Pinang, PULAU PINANG, Malaysia', 'Pulau Pinang', 5.33970870, 100.47866800, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(106, 'Senheng Farlim', '288 B-1-10 & 11 Ground Floor (Fortune Court), Jalan Thean Teik, Farlim, 11500 Pulau Pinang, PULAU PINANG, Malaysia', 'Pulau Pinang', 5.39783050, 100.28738310, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(107, 'SenQ Gurney Plaza', '170-07-08, Plaza Gurney, Persiaran Gurney, 10250 Pulau Pinang., PULAU PINANG, Malaysia', 'Pulau Pinang', 5.43416510, 100.31276480, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(108, 'SenQ Queensbay Mall', 'Queensbay Mall 2F-07, 2nd Floor, Queensbay Mall 100, Persiaran Bayan Indah, Sungai Nibong, 11900 Bayan Lepas, Pulau Pinang, PULAU PINANG, Malaysia', 'Pulau Pinang', 5.32861050, 100.26869360, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(109, 'Senheng TESCO Tg Pinang', 'Lot No. F4, F5 & F6, 1st Floor, Kawasan Tebusguna Bandar Tg Pinang, Jalan Tg Tokong, Jalan Seri Tg Pinang, Daerah Timur Laut, 10470 Pulau Pinang, PULAU PINANG, Malaysia', 'Pulau Pinang', 5.45144180, 100.30658610, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(110, 'Grand Senheng The Golden Triangle', 'Lot 29-1-23, 29-1-23A & 29-1-25. (Ground & 1st floor) The Golden Triangle, Jalan Paya Terubong, Relau 11900 Bayan Lepas, Pulau Pinang, PULAU PINANG, Malaysia', 'Pulau Pinang', 5.32861050, 100.26869360, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(111, 'Senheng Raja Uda', '45,47 & 49, Jalan Raja Uda , 12300 Butterworth, Pulau Pinang, PULAU PINANG, Malaysia', 'Pulau Pinang', 5.42577870, 100.38308570, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(112, 'Senheng Bukit Mertajam', '11, 12 & 12A, Precint 1 @ Sunway Wellesley, Jalan Muthu Palaniapan, 14000 Bukit Mertajam, Pulau Pinang, PULAU PINANG, Malaysia', 'Pulau Pinang', 5.33970870, 100.47866800, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(113, 'SenQ Sunway Carnival Mall', 'S23 Second Floor, Sunway Carnival Mall 3068, Jalan Todak, Pusat Bandar Seberang Jaya 13700 Seberang Jaya, Pulau Pinang, PULAU PINANG, Malaysia', 'Pulau Pinang', 5.38990360, 100.40181580, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(114, 'Triple-C Recycle Sdn Bhd', 'S/L6, Lot 1625, Batu 10 Light Industrial Park, Lorong Jalan Kuap, 93250 Kuching, Sarawak, SARAWAK, Malaysia', 'Sarawak', 1.49352200, 110.32088250, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(115, 'Green Earth Metal Industrial Sdn Bhd', 'Lot 2501, Block 226, 5th Mile, Jalan Kong Ping, 93350 Kuching Sarawak, SARAWAK, Malaysia', 'Sarawak', 1.51460430, 110.36531850, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(116, 'Iyan Trading Sdn Bhd', 'Lot 5, Kawasan Perindustrian Mukim Jejawi, 02600 Arau, Perlis., PERLIS, Malaysia', 'Perlis', 6.44743050, 100.24472190, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(117, 'Senheng Kangar', 'No. 1A, Persiaran Jubli Emas, 01000 Kangar, Perlis., PERLIS, Malaysia', 'Perlis', 6.44217180, 100.20079210, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(118, 'Senheng Ipoh Station 18', 'No. 9-13A, Jalan Pengkalan Utama 1, Taman Pengkalan Utama, 31650 Ipoh, Perak, Malaysia', 'Perak', 4.56861710, 101.08272110, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(119, 'Senheng Silibin Ipoh', '431 & 432, Jalan Silibin Taman Seri Tahan, 30100 Ipoh, Perak, PERAK, Malaysia', 'Perak', 4.60550110, 101.06431350, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(120, 'Grand Senheng Pasir Puteh', 'No. 505 – 507, Jalan Pasir Puteh, Pasir Puteh, 31650 Ipoh, Perak, PERAK, Malaysia', 'Perak', 4.55913380, 101.07605380, 'address', 'Government e-waste collection centres PDF', '2021-02-05'),
(121, 'Senheng Ipoh 40-42', '40 – 42, Lebuh Medan Ipoh, Bandar Baru Medan Ipoh 31400 Ipoh, Perak, PERAK, Malaysia', 'Perak', 4.61300780, 101.11796760, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(122, 'Senheng Taiping', 'No. 1-3, Jalan Medan Taiping Medan Taiping 34000 Perak, PERAK, Malaysia', 'Perak', 4.85136670, 100.74066150, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(123, 'Senheng Parit Buntar', 'No. 11A, 15, Jalan Keli, Taman Damai, 34200 Parit Buntar, Perak, PERAK, Malaysia', 'Perak', 5.11883740, 100.47856490, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(124, 'Senheng Teluk Intan', 'Lot 1 & 2, Komplex Menara Condong Jalan Bandar 36000, Teluk Intan, Perak, PERAK, Malaysia', 'Perak', 4.01201980, 101.01843660, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(125, 'Grand Senheng Sitiawan', '1D, Ground Floor Taman Sitiawan Maju II Jalan Lumut, 32000 Sitiwan, Perak, PERAK, Malaysia', 'Perak', 4.21526590, 100.70218390, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(126, 'Senheng Meru Bestari', '49,51 & 53, Ground Floor Jalan Meru Bestari A2, Meru Medan Bestari, 30200 Ipoh, Perak, PERAK, Malaysia', 'Perak', 4.59068640, 101.07050580, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05'),
(127, 'SenQ Ipoh Parade', 'S22F, S23F, S23 & S24 Second Floor Ipoh Parade 105, Jln Sultan Abdul Jalil, Greentown 30450 Ipoh, Perak, PERAK, Malaysia', 'Perak', 4.60127640, 101.09298860, 'postcode', 'Government e-waste collection centres PDF', '2021-02-05');

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
  `theme` enum('system','light','dark') NOT NULL DEFAULT 'light',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`user_id`, `full_name`, `bio`, `gender`, `address`, `city`, `state`, `postcode`, `location_enabled`, `preferred_language`, `theme`, `updated_at`) VALUES
(2, NULL, 'I love recycle !', NULL, NULL, NULL, NULL, NULL, 1, 'en', 'light', '2026-09-02 14:30:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detection_feedback`
--
ALTER TABLE `detection_feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `idx_detection_feedback_user` (`user_id`),
  ADD KEY `idx_detection_feedback_created_at` (`created_at`);

--
-- Indexes for table `recycle_history`
--
ALTER TABLE `recycle_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_recycle_history_image_hash` (`image_hash`);

--
-- Indexes for table `recycling_centres`
--
ALTER TABLE `recycling_centres`
  ADD PRIMARY KEY (`centre_id`),
  ADD KEY `idx_recycling_centres_coordinates` (`latitude`,`longitude`),
  ADD KEY `idx_recycling_centres_state` (`state`);

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
-- AUTO_INCREMENT for table `detection_feedback`
--
ALTER TABLE `detection_feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `recycle_history`
--
ALTER TABLE `recycle_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `recycling_centres`
--
ALTER TABLE `recycling_centres`
  MODIFY `centre_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

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
-- Constraints for table `detection_feedback`
--
ALTER TABLE `detection_feedback`
  ADD CONSTRAINT `detection_feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

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
