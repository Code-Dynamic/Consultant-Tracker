-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 19, 2018 at 09:07 AM
-- Server version: 5.6.26-log
-- PHP Version: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `testingdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `assigned_task`
--

CREATE TABLE IF NOT EXISTS `assigned_task` (
  `ASSIGNED_TASK_ID` int(11) NOT NULL,
  `ASSIGNED_HOURS` double DEFAULT NULL,
  `DATE_ASSIGNED` date DEFAULT NULL,
  `DUE_DATE` date DEFAULT NULL,
  `HOURS_WORKED` double DEFAULT NULL,
  `LAST_UPDATE` date DEFAULT NULL,
  `TASK_COMPLETED` tinyint(1) DEFAULT '0',
  `CONSULTANT_CONSULTANT_ID` int(11) DEFAULT NULL,
  `TASK_TASK_ID` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assigned_task`
--

INSERT INTO `assigned_task` (`ASSIGNED_TASK_ID`, `ASSIGNED_HOURS`, `DATE_ASSIGNED`, `DUE_DATE`, `HOURS_WORKED`, `LAST_UPDATE`, `TASK_COMPLETED`, `CONSULTANT_CONSULTANT_ID`, `TASK_TASK_ID`) VALUES
(1, 30, '2018-07-05', '2018-07-12', 29, '2018-07-04', 0, 1, 1),
(2, 10, '2018-07-04', '2018-07-06', 25, '2018-07-04', 0, 1, 2),
(4, 6, '2018-07-16', '2018-07-31', 5, '2018-07-16', 0, 2, 6),
(3, 30, '2018-07-17', '2018-07-31', 18.25, '2018-07-16', 0, 5, 1),
(5, 10, '2018-07-17', '2018-07-31', 0, '2018-07-17', 0, 5, 5),
(6, 10, '2018-07-18', '2018-07-18', 14.25, '2018-07-18', 0, 3, 2),
(7, 30, '2018-07-18', '2018-07-31', 0, '2018-07-18', 0, 3, 6);

-- --------------------------------------------------------

--
-- Table structure for table `assignment`
--

CREATE TABLE IF NOT EXISTS `assignment` (
  `ASSIGNMENT_ID` int(11) NOT NULL,
  `CONSULTANT_CONSULTANT_ID` int(11) DEFAULT NULL,
  `PROJECT_PROJECT_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assignment`
--

INSERT INTO `assignment` (`ASSIGNMENT_ID`, `CONSULTANT_CONSULTANT_ID`, `PROJECT_PROJECT_ID`) VALUES
(2, 2, 1),
(3, 1007, 1),
(4, 1051, 1),
(9, 1007, 1010),
(10, 3, 3),
(11, 1051, 3),
(13, 2, 1008),
(14, 3, 1010),
(15, 2, 3),
(16, 3, 1008),
(20, 1201, 1013),
(21, 1201, 1013),
(22, 1051, 1013),
(23, 1051, 3),
(26, 1053, 1),
(30, 1, 1),
(31, 1, 3),
(32, 1, 1008),
(33, 1, 1010),
(34, 1, 1011),
(53, 2, 1021),
(54, 3, 1021),
(55, 2, 1022),
(56, 3, 1022),
(57, 1053, 1010),
(58, 5, 1),
(59, 5, 3),
(60, 5, 1008),
(61, 5, 1009),
(62, 5, 1010),
(63, 5, 1021);

-- --------------------------------------------------------

--
-- Table structure for table `attachment`
--

CREATE TABLE IF NOT EXISTS `attachment` (
  `attachment_ID` int(11) NOT NULL,
  `attachment_Name` varchar(60) DEFAULT NULL,
  `attachment_Type` varchar(45) DEFAULT NULL,
  `attachment_Size` double DEFAULT NULL,
  `attachment_Path` varchar(100) DEFAULT NULL,
  `attachment_Upload_Date` date DEFAULT NULL,
  `attachment_Project_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `attachment`
--

INSERT INTO `attachment` (`attachment_ID`, `attachment_Name`, `attachment_Type`, `attachment_Size`, `attachment_Path`, `attachment_Upload_Date`, `attachment_Project_ID`) VALUES
(10, 'Survey.jpg', 'image/jpeg', 282043, 'C:\\Users\\steph\\Desktop\\Survey.jpg', '2018-02-10', 1),
(11, 'Filled Surbey.jpg', 'image/jpeg', 242544, 'C:\\Users\\steph\\Desktop\\Filled Surbey.jpg', '2018-02-10', 1);

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE IF NOT EXISTS `client` (
  `CLIENT_ID` int(11) NOT NULL,
  `CLIENT_ADDRESS` varchar(255) DEFAULT NULL,
  `CLIENT_EMAIL` varchar(255) DEFAULT NULL,
  `CLIENT_NAME` varchar(255) DEFAULT NULL,
  `CLIENT_PHONENUM` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1102 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`CLIENT_ID`, `CLIENT_ADDRESS`, `CLIENT_EMAIL`, `CLIENT_NAME`, `CLIENT_PHONENUM`) VALUES
(1, 'awdad', 'awdad', 'aawdawd', 'awdawdaw'),
(2, '52 RAndom Street', 'Client@gmail.com', 'Client', '0756325454'),
(1101, '52 RAndom Street', 'Client@gmail.com', 'Client', '0756325454');

-- --------------------------------------------------------

--
-- Table structure for table `consultant`
--

CREATE TABLE IF NOT EXISTS `consultant` (
  `CONSULTANT_ID` int(11) NOT NULL,
  `CONSULTANT_ADMIN` int(11) DEFAULT NULL,
  `CONSULTANT_CELL` varchar(255) DEFAULT NULL,
  `CONSULTANT_NAME` varchar(255) DEFAULT NULL,
  `CONSULTANT_SURNAME` varchar(255) DEFAULT NULL,
  `CONSULTANT_EMAIL` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1054 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `consultant`
--

INSERT INTO `consultant` (`CONSULTANT_ID`, `CONSULTANT_ADMIN`, `CONSULTANT_CELL`, `CONSULTANT_NAME`, `CONSULTANT_SURNAME`, `CONSULTANT_EMAIL`) VALUES
(1, 0, '0835631245', 'James', 'Peters', 'JP@CodeDynamic.com'),
(2, 0, '0648547845', 'Bob', 'Van Wyk', 'Bob@CodeDynamic.com'),
(3, 0, '0795486352', 'Dylan', 'Fredrickson', 'dylan@blah.co.za'),
(4, 1, '0760000000', 'Stephen ', 'Munro', 'steve@blah.co.za'),
(5, 1, '123', 'Muju', 'M', 'n@m.com'),
(51, 0, '064168', 'Ngoni', 'Mujuru', 'ngonitatenda@gmail.com'),
(52, 0, '121', 'Test', 'sdfds', 'sds'),
(53, 0, '123', 'Sibekezelo', 'Mamba', 's@m'),
(54, 0, '028308233', 'Refresh', 'This', 'n@was'),
(1007, 1, '0769493806', 'Fred', 'Douglas', 'Fred@CodeDynamic.com'),
(1051, 0, '07694953687', 'Doug', 'Less', 'Doug@CodeDynamic.com'),
(1052, 1, '07694953687', 'Hulisani', 'Mudimeli', 'Huli@blah.co.za'),
(1053, NULL, '07694953143', 'Tatenda', 'Mafunga', 'tate@blah.co.za');

-- --------------------------------------------------------

--
-- Table structure for table `daily_times`
--

CREATE TABLE IF NOT EXISTS `daily_times` (
  `ENTRY_ID` int(11) NOT NULL,
  `DATE` date DEFAULT NULL,
  `GENERAL_TIME` double DEFAULT NULL,
  `TOTAL_ASSIGNED_TASKS_TIME` double DEFAULT NULL,
  `CONSULTANT_CONSULTANT_ID` int(11) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `daily_times`
--

INSERT INTO `daily_times` (`ENTRY_ID`, `DATE`, `GENERAL_TIME`, `TOTAL_ASSIGNED_TASKS_TIME`, `CONSULTANT_CONSULTANT_ID`) VALUES
(1, '2018-07-05', 3, 6, 1),
(2, '2018-07-05', 0, 0, 1),
(3, '2018-07-05', 2, 8, 1),
(4, '2018-07-05', 1, 5, 1),
(5, '2018-07-09', 0, 0, 1),
(6, '2018-07-12', 3, 5, 1),
(7, '2018-07-16', 1, 8, 1),
(8, '2018-07-16', 2, 10, 2),
(9, '2018-07-17', 4, 3, 3),
(10, '2018-07-17', 4, 5, 5),
(11, '2018-07-18', 2, 7, 5),
(12, '2018-07-18', 5.5, 6, 3),
(13, '2018-07-19', 2.75, 12.5, 3),
(14, '2018-07-19', 2, 12.5, 5),
(15, '2018-07-19', 11, 0, 1052);

-- --------------------------------------------------------

--
-- Table structure for table `entity1`
--

CREATE TABLE IF NOT EXISTS `entity1` (
  `ID` bigint(20) NOT NULL,
  `ENTITY2_ID` bigint(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `entity2`
--

CREATE TABLE IF NOT EXISTS `entity2` (
  `ID` bigint(20) NOT NULL,
  `NAME` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE IF NOT EXISTS `feedback` (
  `FEEDBACK_ID` int(11) NOT NULL,
  `DATE` date DEFAULT NULL,
  `MESSAGE` varchar(255) DEFAULT NULL,
  `CONSULTANT_CONSULTANT_ID` int(11) DEFAULT NULL,
  `PROJECT_PROJECT_ID` int(11) DEFAULT NULL,
  `TASK_TASK_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`FEEDBACK_ID`, `DATE`, `MESSAGE`, `CONSULTANT_CONSULTANT_ID`, `PROJECT_PROJECT_ID`, `TASK_TASK_ID`) VALUES
(1, '2018-02-02', 'The scope needs to be clerified with the client regarding some ambiguity we have encountered.', 2, 1, 1),
(2, '2018-02-02', 'Rough plans are complete, however we need to find a solution to a minor difficulty', 2, 1, 1),
(10, '2018-05-10', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 2, 1, 1),
(11, '2018-06-26', 'How does this work', 2, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE IF NOT EXISTS `project` (
  `PROJECT_ID` int(11) NOT NULL,
  `PROJECT_DEADLINE` date DEFAULT NULL,
  `PROJECT_STARTDATE` date DEFAULT NULL,
  `PROJECT_DELETED` tinyint(1) DEFAULT '0',
  `PROJECT_DESCRIPTION` varchar(255) DEFAULT NULL,
  `PROJECT_NAME` varchar(255) DEFAULT NULL,
  `PROJECT_ONSITE` tinyint(1) DEFAULT '0',
  `CLIENT_ID` int(11) DEFAULT NULL,
  `PROJECT_COMPLETED` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1029 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`PROJECT_ID`, `PROJECT_DEADLINE`, `PROJECT_STARTDATE`, `PROJECT_DELETED`, `PROJECT_DESCRIPTION`, `PROJECT_NAME`, `PROJECT_ONSITE`, `CLIENT_ID`, `PROJECT_COMPLETED`) VALUES
(1, '2018-05-14', NULL, 0, 'Building an online store for Dougs Store', 'Dougs Online Store', 0, 1, 1),
(3, '2018-09-26', NULL, 0, 'An software system that is able to monitor financial data and report on suspicious activity.', 'Fraud Detector', 0, 2, 1),
(1008, '2018-05-22', NULL, 0, 'Random project for bob', 'Bobs Project', 1, 2, 0),
(1009, '2018-05-16', NULL, 1, 'awdaw', 'awda', 1, 2, 0),
(1010, '2018-05-16', NULL, 0, 'Keep track of stock levels of products for the business.', 'Tatenda''s StockTracker', 1, 2, 0),
(1011, '2018-06-29', NULL, 0, 'Testing if I now understand how SAP works.', 'Sap Knowledge Project', 1, 2, 0),
(1013, '2018-06-29', NULL, 0, 'Improvement of IT system', 'Evolution Systems', 1, 2, 0),
(1021, '2018-07-31', NULL, 0, 'Testing the things', 'Ratings 1', 1, 2, 1),
(1022, '2018-07-31', NULL, 0, 'Testing the things.....again, again!', 'Ratings 2', 1, 2, 1),
(1023, '2018-07-31', NULL, 0, 'Startdate stuff', 'Startdate', 1, 2, 0),
(1024, '2018-07-31', NULL, 0, 'sdsdsds', ' Startdate again', 1, 2, 0),
(1025, '2018-07-31', NULL, 0, 'sdsds', 'Project Startdate', 1, 2, 0),
(1026, '2018-07-31', '2018-07-19', 0, 'date to start', 'Final startdate', 1, 2, 0),
(1027, '2018-07-31', '2018-07-25', 0, 'sdsds', 'Refresh Test', 1, 2, 0),
(1028, '2018-07-31', '2018-07-25', 0, 'sdsd', 'Project refresh test', 1, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE IF NOT EXISTS `ratings` (
  `RATE_ID` int(11) NOT NULL,
  `NUM_VOTES` int(11) DEFAULT NULL,
  `RATING` double DEFAULT NULL,
  `YEAR` int(11) DEFAULT NULL,
  `CONSULTANT_CONSULTANT_ID` int(11) DEFAULT NULL,
  `PROJECT_PROJECT_ID` int(11) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`RATE_ID`, `NUM_VOTES`, `RATING`, `YEAR`, `CONSULTANT_CONSULTANT_ID`, `PROJECT_PROJECT_ID`) VALUES
(15, 0, 0, 2018, 5, 1),
(14, 0, 0, 2018, 1053, 1010),
(13, 1, 40, 2018, 3, 1022),
(12, 1, 20, 2018, 2, 1022),
(11, 1, 100, 2018, 3, 1021),
(10, 2, 80, 2018, 2, 1021),
(16, 1, 100, 2018, 5, 3),
(17, 0, 0, 2018, 5, 1008),
(18, 0, 0, 2018, 5, 1009),
(19, 0, 0, 2018, 5, 1010);

-- --------------------------------------------------------

--
-- Table structure for table `ratings_entry`
--

CREATE TABLE IF NOT EXISTS `ratings_entry` (
  `RATE_ENTRY_ID` int(11) NOT NULL,
  `CONSULTANT_CONSULTANT_ID` int(11) DEFAULT NULL,
  `PROJECT_PROJECT_ID` int(11) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ratings_entry`
--

INSERT INTO `ratings_entry` (`RATE_ENTRY_ID`, `CONSULTANT_CONSULTANT_ID`, `PROJECT_PROJECT_ID`) VALUES
(8, 5, 1),
(7, 1, 1),
(6, 1, 1022),
(5, 1, 1021),
(9, 5, 1),
(10, 5, 3),
(11, 3, 1021),
(12, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `sequence`
--

CREATE TABLE IF NOT EXISTS `sequence` (
  `SEQ_NAME` varchar(50) NOT NULL,
  `SEQ_COUNT` decimal(38,0) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sequence`
--

INSERT INTO `sequence` (`SEQ_NAME`, `SEQ_COUNT`) VALUES
('SEQ_GEN', '100');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `TASK_ID` int(11) NOT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `DUE_DATE` date DEFAULT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  `PROJECT_PROJECT_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`TASK_ID`, `DESCRIPTION`, `DUE_DATE`, `NAME`, `PROJECT_PROJECT_ID`) VALUES
(1, 'jhguh', '2018-05-06', 'Project Planning', 1),
(2, 'do the things', '2018-05-17', 'Build Conceptual Design', 1),
(3, NULL, '2018-06-24', 'Plan Project', 3),
(4, NULL, '2018-06-30', 'Build Prototype', 3),
(5, 'Testing task times', '2018-07-23', 'Testing task 1', 1008),
(6, 'sdfs', '2018-07-30', 'Testing task 2', 1010);

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE IF NOT EXISTS `team` (
  `TEAM_ID` int(11) NOT NULL,
  `TEAM_DESCRIPTION` varchar(255) DEFAULT NULL,
  `CONSULTANT_CONSULTANT_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `email` varchar(20) NOT NULL DEFAULT '',
  `password` varchar(20) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `password`) VALUES
('Bob@CodeDynamic.com', 'bob'),
('dylan@blah.co.za', 'dylan'),
('huli@blah.co.za', 'huli'),
('n@m.com', 'n'),
('steve@blah.co.za', 'steve'),
('tate@blah.co.za', 'tate');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigned_task`
--
ALTER TABLE `assigned_task`
  ADD PRIMARY KEY (`ASSIGNED_TASK_ID`);

--
-- Indexes for table `assignment`
--
ALTER TABLE `assignment`
  ADD PRIMARY KEY (`ASSIGNMENT_ID`),
  ADD KEY `FK_ASSIGNMENT_PROJECT_PROJECT_ID` (`PROJECT_PROJECT_ID`),
  ADD KEY `FK_ASSIGNMENT_CONSULTANT_CONSULTANT_ID` (`CONSULTANT_CONSULTANT_ID`);

--
-- Indexes for table `attachment`
--
ALTER TABLE `attachment`
  ADD PRIMARY KEY (`attachment_ID`),
  ADD KEY `attachment_Project_ID_idx` (`attachment_Project_ID`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`CLIENT_ID`);

--
-- Indexes for table `consultant`
--
ALTER TABLE `consultant`
  ADD PRIMARY KEY (`CONSULTANT_ID`,`CONSULTANT_EMAIL`),
  ADD KEY `_idx` (`CONSULTANT_EMAIL`);

--
-- Indexes for table `daily_times`
--
ALTER TABLE `daily_times`
  ADD PRIMARY KEY (`ENTRY_ID`);

--
-- Indexes for table `entity1`
--
ALTER TABLE `entity1`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_ENTITY1_ENTITY2_ID` (`ENTITY2_ID`);

--
-- Indexes for table `entity2`
--
ALTER TABLE `entity2`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`FEEDBACK_ID`),
  ADD KEY `FK_FEEDBACK_CONSULTANT_CONSULTANT_ID` (`CONSULTANT_CONSULTANT_ID`),
  ADD KEY `FK_FEEDBACK_PROJECT_PROJECT_ID` (`PROJECT_PROJECT_ID`),
  ADD KEY `FK_FEEDBACK_TASK_TASK_ID` (`TASK_TASK_ID`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`PROJECT_ID`),
  ADD KEY `CLIENT_CLIENT_ID_idx` (`CLIENT_ID`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`RATE_ID`);

--
-- Indexes for table `ratings_entry`
--
ALTER TABLE `ratings_entry`
  ADD PRIMARY KEY (`RATE_ENTRY_ID`),
  ADD KEY `FK_RATINGS_ENTRY_CONSULTANT_CONSULTANT_ID` (`CONSULTANT_CONSULTANT_ID`),
  ADD KEY `FK_RATINGS_ENTRY_PROJECT_PROJECT_ID` (`PROJECT_PROJECT_ID`);

--
-- Indexes for table `sequence`
--
ALTER TABLE `sequence`
  ADD PRIMARY KEY (`SEQ_NAME`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`TASK_ID`),
  ADD KEY `PROJECT_ID_idx` (`PROJECT_PROJECT_ID`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`TEAM_ID`),
  ADD KEY `FK_TEAM_CONSULTANT_CONSULTANT_ID` (`CONSULTANT_CONSULTANT_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignment`
--
ALTER TABLE `assignment`
  MODIFY `ASSIGNMENT_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=64;
--
-- AUTO_INCREMENT for table `attachment`
--
ALTER TABLE `attachment`
  MODIFY `attachment_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `CLIENT_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1102;
--
-- AUTO_INCREMENT for table `consultant`
--
ALTER TABLE `consultant`
  MODIFY `CONSULTANT_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1054;
--
-- AUTO_INCREMENT for table `daily_times`
--
ALTER TABLE `daily_times`
  MODIFY `ENTRY_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `FEEDBACK_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `PROJECT_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1029;
--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `RATE_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `ratings_entry`
--
ALTER TABLE `ratings_entry`
  MODIFY `RATE_ENTRY_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `TASK_ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignment`
--
ALTER TABLE `assignment`
  ADD CONSTRAINT `FK_ASSIGNMENT_CONSULTANT_CONSULTANT_ID` FOREIGN KEY (`CONSULTANT_CONSULTANT_ID`) REFERENCES `consultant` (`CONSULTANT_ID`),
  ADD CONSTRAINT `FK_ASSIGNMENT_PROJECT_PROJECT_ID` FOREIGN KEY (`PROJECT_PROJECT_ID`) REFERENCES `project` (`PROJECT_ID`);

--
-- Constraints for table `attachment`
--
ALTER TABLE `attachment`
  ADD CONSTRAINT `attachment_Project_ID` FOREIGN KEY (`attachment_Project_ID`) REFERENCES `project` (`PROJECT_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `FK_FEEDBACK_CONSULTANT_CONSULTANT_ID` FOREIGN KEY (`CONSULTANT_CONSULTANT_ID`) REFERENCES `consultant` (`CONSULTANT_ID`),
  ADD CONSTRAINT `FK_FEEDBACK_PROJECT_PROJECT_ID` FOREIGN KEY (`PROJECT_PROJECT_ID`) REFERENCES `project` (`PROJECT_ID`),
  ADD CONSTRAINT `FK_FEEDBACK_TASK_TASK_ID` FOREIGN KEY (`TASK_TASK_ID`) REFERENCES `task` (`TASK_ID`);

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `Client_ID` FOREIGN KEY (`CLIENT_ID`) REFERENCES `client` (`CLIENT_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `PROJECT_ID` FOREIGN KEY (`PROJECT_PROJECT_ID`) REFERENCES `project` (`PROJECT_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `team`
--
ALTER TABLE `team`
  ADD CONSTRAINT `FK_TEAM_CONSULTANT_CONSULTANT_ID` FOREIGN KEY (`CONSULTANT_CONSULTANT_ID`) REFERENCES `consultant` (`CONSULTANT_ID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `Link_To_Consultant` FOREIGN KEY (`email`) REFERENCES `consultant` (`CONSULTANT_EMAIL`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
