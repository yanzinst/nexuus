CREATE TABLE `system_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`phoneNumberId` int,
	`alertType` enum('high_volume','ip_repeated','inactive_48h','apn_changed','restriction_detected','block_predicted','tier_downgrade') NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`suggestion` text,
	`isResolved` boolean NOT NULL DEFAULT false,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `system_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `events` MODIFY COLUMN `eventType` enum('block','unblock','restriction','unrestriction','status_change','volume_record','warning','note','activation','ip_change','restart','user_change') NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` MODIFY COLUMN `type` enum('restriction_return','block_alert','status_change','system','ip_repeated','inactive_48h','high_volume','risk_alert') NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `metadata` text;--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `deviceType` varchar(50);--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `location` varchar(100);--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `region` varchar(50);--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `lastIp` varchar(45);--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `ipChangeFrequency` int;--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `owner` varchar(100);--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `purchaseBatch` varchar(50);--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `activationDate` timestamp;--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `riskScore` int DEFAULT 50;--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `tier` enum('S','A','B','C','D') DEFAULT 'B';--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `totalMessages` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `totalBlocks` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `totalRestrictions` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `avgRecoveryHours` int;--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `lastBlockDate` timestamp;--> statement-breakpoint
ALTER TABLE `phone_numbers` ADD `lastRestrictionDate` timestamp;