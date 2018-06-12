-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 12, 2018 at 05:13 AM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ppms`
--

-- --------------------------------------------------------

--
-- Table structure for table `client_reservations`
--

CREATE TABLE `client_reservations` (
  `client_reservation_id` int(10) UNSIGNED NOT NULL,
  `clientId` int(10) UNSIGNED DEFAULT NULL,
  `purpose` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departmentId` int(10) UNSIGNED DEFAULT NULL,
  `venueId` int(10) UNSIGNED DEFAULT NULL,
  `statusId` int(10) UNSIGNED DEFAULT NULL,
  `start_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_date` date NOT NULL,
  `end_time` time NOT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `client_reservations`
--

INSERT INTO `client_reservations` (`client_reservation_id`, `clientId`, `purpose`, `departmentId`, `venueId`, `statusId`, `start_date`, `start_time`, `end_date`, `end_time`, `date_created`) VALUES
(1, 1, 'Practical Exam', 1, 8, 2, '2018-06-15', '13:00:00', '2018-06-15', '14:00:00', '2019-02-28'),
(2, 2, 'Seminar', 1, 1, 1, '2018-06-20', '08:00:00', '2018-06-20', '11:00:00', '2019-06-01'),
(3, 3, 'Meeting', 1, 2, 1, '2018-06-22', '14:00:00', '2018-06-22', '15:00:00', '2019-06-01'),
(4, 4, 'PTA Meeting', 2, 8, 1, '2018-06-15', '14:00:00', '2018-06-15', '14:30:00', '2019-02-28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `client_reservations`
--
ALTER TABLE `client_reservations`
  ADD PRIMARY KEY (`client_reservation_id`),
  ADD KEY `client_reservations_clientid_foreign` (`clientId`),
  ADD KEY `client_reservations_departmentid_foreign` (`departmentId`),
  ADD KEY `client_reservations_venueid_foreign` (`venueId`),
  ADD KEY `statusId` (`statusId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client_reservations`
--
ALTER TABLE `client_reservations`
  MODIFY `client_reservation_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `client_reservations`
--
ALTER TABLE `client_reservations`
  ADD CONSTRAINT `client_reservations_clientid_foreign` FOREIGN KEY (`clientId`) REFERENCES `clients` (`client_id`),
  ADD CONSTRAINT `client_reservations_departmentid_foreign` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `client_reservations_statusid_foreign` FOREIGN KEY (`statusId`) REFERENCES `statuses` (`status_id`),
  ADD CONSTRAINT `client_reservations_venueid_foreign` FOREIGN KEY (`venueId`) REFERENCES `venues` (`venue_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
