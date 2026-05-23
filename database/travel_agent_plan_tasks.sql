-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: travel_agent
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `plan_tasks`
--

DROP TABLE IF EXISTS `plan_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_tasks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `plan_id` int unsigned DEFAULT NULL,
  `task_type` enum('generate_plan','regenerate_day','optimize_route') COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_json` json NOT NULL,
  `status` enum('pending','running','success','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `progress` int NOT NULL DEFAULT '0',
  `result_version_id` int unsigned DEFAULT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`) /*!80000 INVISIBLE */,
  KEY `idx_status` (`status`) /*!80000 INVISIBLE */,
  KEY `idx_user_created` (`user_id`,`created_at`),
  KEY `fk_tasks_plan` (`plan_id`),
  KEY `fk_tasks_result_version` (`result_version_id`),
  CONSTRAINT `fk_tasks_plan` FOREIGN KEY (`plan_id`) REFERENCES `trip_plans` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_result_version` FOREIGN KEY (`result_version_id`) REFERENCES `trip_plan_versions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `chk_progress` CHECK (((`progress` >= 0) and (`progress` <= 100)))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_tasks`
--

LOCK TABLES `plan_tasks` WRITE;
/*!40000 ALTER TABLE `plan_tasks` DISABLE KEYS */;
INSERT INTO `plan_tasks` VALUES (1,1,NULL,'generate_plan','{\"city\": \"成都\", \"days\": 7}','success',100,NULL,NULL,'2026-05-22 15:08:43','2026-05-22 15:08:43'),(2,2,2,'optimize_route','{\"optimize\": true}','running',80,NULL,NULL,'2026-05-22 15:08:43','2026-05-22 15:36:02'),(3,1,NULL,'regenerate_day','{\"day\": 3}','failed',30,NULL,'LLM timeout','2026-05-22 15:08:43','2026-05-22 15:08:43');
/*!40000 ALTER TABLE `plan_tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-22 17:55:44


