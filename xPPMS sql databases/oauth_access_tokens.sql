-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 12, 2018 at 05:14 AM
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
-- Table structure for table `oauth_access_tokens`
--

CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `client_id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_access_tokens`
--

INSERT INTO `oauth_access_tokens` (`id`, `user_id`, `client_id`, `name`, `scopes`, `revoked`, `created_at`, `updated_at`, `expires_at`) VALUES
('1cf2fb1a9864d2c5814ef791ef0d9b440f273db531fd9420628082e32da99c7dcce3d09f513fcc53', 6, 1, 'MyApp', '[]', 0, '2018-06-09 17:39:34', '2018-06-09 17:39:34', '2019-06-10 01:39:34'),
('32890c7c96fa001fb9e5112f18a9ca41d76f3f7b4a9a83b665b8c94a779ed3a00055f9b6848d1e99', 7, 1, 'MyApp', '[]', 0, '2018-06-09 21:02:09', '2018-06-09 21:02:09', '2019-06-10 05:02:09'),
('3c39225e2b7f6d09fb14f43103d32da4fb010d0e3a92f684aaef4e91db231741a7efcb347eca53e7', 7, 1, 'MyApp', '[]', 0, '2018-06-09 06:15:00', '2018-06-09 06:15:00', '2019-06-09 14:15:00'),
('581b498bbcef369e12cf417ecb406f68a46f5a387146b31bb07371f9a59f2e0c86db5618296742e3', 6, 1, 'MyApp', '[]', 0, '2018-06-09 19:53:46', '2018-06-09 19:53:46', '2019-06-10 03:53:46'),
('5bb6553a549dba6d776d815d38659af2dbd640456980f7f223c946c6a8b7349a1a084aa598bcd438', 6, 1, 'MyApp', '[]', 0, '2018-06-11 18:36:39', '2018-06-11 18:36:39', '2019-06-12 02:36:39'),
('5ea79516bb2346f9ea79d83555d4e3ba7c71dd13811e43edc63d922cd86f8e9f0a08c110fede8b51', 6, 1, 'MyApp', '[]', 0, '2018-06-11 18:42:24', '2018-06-11 18:42:24', '2019-06-12 02:42:24'),
('678eb2ab5616d67e788f14763ff3013c3940135b48616cde94e84f04e3a737fdebff4c89ceab4956', 7, 1, 'MyApp', '[]', 0, '2018-06-09 06:09:30', '2018-06-09 06:09:30', '2019-06-09 14:09:30'),
('73ddfcdca50f98a115ad8cf41df4287bca528161aafa4671e85c94de44874a438761b85d222af50d', 6, 1, 'MyApp', '[]', 0, '2018-06-10 21:01:42', '2018-06-10 21:01:42', '2019-06-11 05:01:42'),
('7723268cad552bb103db35aa1f9993d65279613e7ef61d068b74beacbc0e6e8cab6a8847806a2cbc', 6, 1, 'MyApp', '[]', 0, '2018-06-09 21:17:55', '2018-06-09 21:17:55', '2019-06-10 05:17:55'),
('95dcfab0420cf38d8018e4bc8aba3b515f5cba26159a455f7bc9f1d7cc72b4d5f4af6db4ecc11043', 6, 1, 'MyApp', '[]', 0, '2018-06-09 06:10:47', '2018-06-09 06:10:47', '2019-06-09 14:10:47'),
('9a5713dcf873e229b4c30571d4fe8b19785c65d3e705e2800378ddee3964d04831794e7c91d812bb', 6, 1, 'MyApp', '[]', 0, '2018-06-10 19:33:56', '2018-06-10 19:33:56', '2019-06-11 03:33:56'),
('a8d5961935addd4706aca824eb0cf7ce142afee20957cb26bdaa18182b672c22fc8293eb1fe0eb7a', 6, 1, 'MyApp', '[]', 0, '2018-06-11 05:50:57', '2018-06-11 05:50:57', '2019-06-11 13:50:57'),
('a9a93835be4314206545df401ad02d91c1f8e7cfd10c7989e79b6e1980d4456d3da37df72466a586', 6, 1, 'MyApp', '[]', 0, '2018-06-10 20:09:10', '2018-06-10 20:09:10', '2019-06-11 04:09:10'),
('c350fe7fe7d67f67a57198be2f8855c669496c289702239b522988222febe35cc96496b4a73e8b2e', 8, 1, 'MyApp', '[]', 0, '2018-06-09 06:11:31', '2018-06-09 06:11:31', '2019-06-09 14:11:31'),
('c3a3b2f1c7521185c91930c1b42e082ea815dbd5303c6e0c4fd1ee0fd93e02c6959e720fd2e47963', 6, 1, 'MyApp', '[]', 0, '2018-06-11 18:32:04', '2018-06-11 18:32:04', '2019-06-12 02:32:04'),
('df0aa5caab54677ac821a8a01bc8ff75050ee10065f87a477ecb24b3cffd2f50957741053cbcc22a', 6, 1, 'MyApp', '[]', 0, '2018-06-11 18:52:52', '2018-06-11 18:52:52', '2019-06-12 02:52:52'),
('e89ac78353a067d3f1a862bcc6705c49358f50122cbb9df3929386b6d6efa90ed7bfcc8748348623', 6, 1, 'MyApp', '[]', 0, '2018-06-11 04:38:41', '2018-06-11 04:38:41', '2019-06-11 12:38:41'),
('eb6ddae9ef2380dc8ed93b2b4e5a2d7a262966c9ff5b59e67864b3e870121dd77d84216fa729be2c', 6, 1, 'MyApp', '[]', 0, '2018-06-09 06:07:14', '2018-06-09 06:07:14', '2019-06-09 14:07:14'),
('effdebe94edb37c810cc54c1b9a49433ca771e9ada8ffa53a54c8dd68de20bb16b6a6382efc46458', 7, 1, 'MyApp', '[]', 0, '2018-06-11 18:44:21', '2018-06-11 18:44:21', '2019-06-12 02:44:21'),
('f9aac3423d48211b93df07e3790b7c24b50d7bf728e0d7454a4d5827491b5c958eb24a27bde231db', 7, 1, 'MyApp', '[]', 0, '2018-06-09 21:26:16', '2018-06-09 21:26:16', '2019-06-10 05:26:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `oauth_access_tokens`
--
ALTER TABLE `oauth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_access_tokens_user_id_index` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
