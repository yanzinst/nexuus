CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumberId` int NOT NULL,
	`eventType` enum('block','unblock','restriction','unrestriction','status_change','volume_record','warning','note') NOT NULL,
	`previousStatus` varchar(50),
	`newStatus` varchar(50),
	`messageVolume` int,
	`description` text,
	`eventDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`phoneNumberId` int,
	`alarmId` int,
	`type` enum('restriction_return','block_alert','status_change','system') NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`playSound` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `phone_number_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumberId` int NOT NULL,
	`tagId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `phone_number_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `phone_numbers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`number` varchar(20) NOT NULL,
	`operator` varchar(50),
	`device` varchar(100),
	`status` enum('active','warming','blocked','analysis','off','restricted','unknown') NOT NULL DEFAULT 'unknown',
	`accountType` varchar(50),
	`purpose` text,
	`notes` text,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`userId` int NOT NULL,
	`operationId` int NOT NULL,
	CONSTRAINT `phone_numbers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `restriction_alarms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumberId` int NOT NULL,
	`userId` int NOT NULL,
	`restrictionStartTime` timestamp NOT NULL,
	`expectedReturnTime` timestamp NOT NULL,
	`notifyAt` timestamp NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`wasNotified` boolean NOT NULL DEFAULT false,
	`notifiedAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `restriction_alarms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`color` varchar(7),
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `profilePhoto` text;--> statement-breakpoint
ALTER TABLE `users` ADD `theme` enum('light','dark') DEFAULT 'dark' NOT NULL;