import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  password: varchar("password", { length: 255 }), // Para login com email/senha
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  profilePhoto: text("profilePhoto"), // URL da foto de perfil no S3
  theme: mysqlEnum("theme", ["light", "dark"]).default("dark").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Operations / Projects table
 * Each user can have multiple operations (e.g., different campaigns, clients)
 */
export const operations = mysqlTable("operations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Operation = typeof operations.$inferSelect;
export type InsertOperation = typeof operations.$inferInsert;

/**
 * Phone numbers / chips table - with intelligent metadata
 */
export const phoneNumbers = mysqlTable("phone_numbers", {
  id: int("id").autoincrement().primaryKey(),
  number: varchar("number", { length: 20 }).notNull(),
  operator: varchar("operator", { length: 50 }), // TIM, Vivo, Claro, Oi, etc.
  deviceType: varchar("deviceType", { length: 50 }), // celular, modem_4g, roteador_industrial, tablet
  device: varchar("device", { length: 100 }), // iPhone XR, Samsung Galaxy, Modem Huawei, etc.
  status: mysqlEnum("status", [
    "active",
    "warming",
    "blocked",
    "analysis",
    "off",
    "restricted",
    "unknown"
  ]).default("unknown").notNull(),
  accountType: varchar("accountType", { length: 50 }), // personal, business, API
  purpose: text("purpose"), // main, support, backup, test
  notes: text("notes"),
  
  // Novos campos para cadastro inteligente
  location: varchar("location", { length: 100 }), // Cidade / Torre
  region: varchar("region", { length: 50 }), // Sul, Sudeste, Norte, etc.
  lastIp: varchar("lastIp", { length: 45 }), // IPv4 ou IPv6
  ipChangeFrequency: int("ipChangeFrequency"), // frequência de troca de IP em horas
  owner: varchar("owner", { length: 100 }), // Dono/responsável pelo chip
  purchaseBatch: varchar("purchaseBatch", { length: 50 }), // Lote de compra
  activationDate: timestamp("activationDate"), // Data de ativação
  
  // Score e ranking
  riskScore: int("riskScore").default(50), // 0-100 (0=seguro, 100=alto risco)
  tier: mysqlEnum("tier", ["S", "A", "B", "C", "D"]).default("B"), // Ranking do número
  
  // Estatísticas
  totalMessages: int("totalMessages").default(0),
  totalBlocks: int("totalBlocks").default(0),
  totalRestrictions: int("totalRestrictions").default(0),
  avgRecoveryHours: int("avgRecoveryHours"), // Tempo médio de recuperação
  lastBlockDate: timestamp("lastBlockDate"),
  lastRestrictionDate: timestamp("lastRestrictionDate"),
  
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  userId: int("userId").notNull(), // owner of this number
  operationId: int("operationId").notNull(), // which operation this number belongs to
});

export type PhoneNumber = typeof phoneNumbers.$inferSelect;
export type InsertPhoneNumber = typeof phoneNumbers.$inferInsert;

/**
 * Events / history table - tracks everything that happens to a number
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  phoneNumberId: int("phoneNumberId").notNull(),
  eventType: mysqlEnum("eventType", [
    "block",           // número foi bloqueado
    "unblock",         // número voltou de bloqueio
    "restriction",     // restrição aplicada
    "unrestriction",   // número voltou de restrição
    "status_change",   // mudança de status
    "volume_record",   // registro de volume diário
    "warning",         // aviso de qualidade
    "note",            // observação geral
    "activation",      // ativação do número
    "ip_change",       // troca de IP
    "restart",         // reinício do dispositivo
    "user_change"      // mudança de usuário/responsável
  ]).notNull(),
  previousStatus: varchar("previousStatus", { length: 50 }),
  newStatus: varchar("newStatus", { length: 50 }),
  messageVolume: int("messageVolume"), // quantidade de mensagens enviadas
  description: text("description"),
  metadata: text("metadata"), // JSON com dados extras (IP antigo, IP novo, etc.)
  eventDate: timestamp("eventDate").notNull(), // quando o evento ocorreu
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Tags / categories for organizing numbers
 */
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  color: varchar("color", { length: 7 }), // hex color code
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

/**
 * Junction table for many-to-many relationship between numbers and tags
 */
export const phoneNumberTags = mysqlTable("phone_number_tags", {
  id: int("id").autoincrement().primaryKey(),
  phoneNumberId: int("phoneNumberId").notNull(),
  tagId: int("tagId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PhoneNumberTag = typeof phoneNumberTags.$inferSelect;
export type InsertPhoneNumberTag = typeof phoneNumberTags.$inferInsert;

/**
 * Restriction alarms - alerts for when numbers should be checked
 */
export const restrictionAlarms = mysqlTable("restriction_alarms", {
  id: int("id").autoincrement().primaryKey(),
  phoneNumberId: int("phoneNumberId").notNull(),
  userId: int("userId").notNull(),
  restrictionStartTime: timestamp("restrictionStartTime").notNull(), // quando entrou em restrição
  expectedReturnTime: timestamp("expectedReturnTime").notNull(), // quando espera voltar
  notifyAt: timestamp("notifyAt").notNull(), // quando deseja ser notificado
  isActive: boolean("isActive").default(true).notNull(),
  wasNotified: boolean("wasNotified").default(false).notNull(),
  notifiedAt: timestamp("notifiedAt"), // quando foi notificado
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RestrictionAlarm = typeof restrictionAlarms.$inferSelect;
export type InsertRestrictionAlarm = typeof restrictionAlarms.$inferInsert;

/**
 * Notifications - stores all notifications sent to users
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  phoneNumberId: int("phoneNumberId"),
  alarmId: int("alarmId"),
  type: mysqlEnum("type", [
    "restriction_return",  // número voltou de restrição
    "block_alert",         // número bloqueado
    "status_change",       // mudança de status
    "system",              // notificação do sistema
    "ip_repeated",         // IP repetido detectado
    "inactive_48h",        // linha inativa há 48h
    "high_volume",         // volume alto de mensagens
    "risk_alert"           // alerta de risco
  ]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  playSound: boolean("playSound").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * System alerts - automatic alerts generated by the system
 */
export const systemAlerts = mysqlTable("system_alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  phoneNumberId: int("phoneNumberId"),
  alertType: mysqlEnum("alertType", [
    "high_volume",         // mensagens demais
    "ip_repeated",         // IP repetido
    "inactive_48h",        // inativo há 48h
    "apn_changed",         // APN alterado
    "restriction_detected", // restrição detectada
    "block_predicted",     // previsão de bloqueio
    "tier_downgrade"       // queda de tier
  ]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  suggestion: text("suggestion"), // Sugestão de ação
  isResolved: boolean("isResolved").default(false).notNull(),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SystemAlert = typeof systemAlerts.$inferSelect;
export type InsertSystemAlert = typeof systemAlerts.$inferInsert;
