import { getDb } from "./db";
import { 
  users, operations, phoneNumbers, events, tags, phoneNumberTags, 
  restrictionAlarms, notifications,
  type InsertOperation, type InsertPhoneNumber, type InsertEvent, 
  type InsertTag, type InsertRestrictionAlarm, type InsertNotification,
  type PhoneNumber
} from "../drizzle/schema";
import { eq, and, desc, sql, like, or, gte, lte, inArray } from "drizzle-orm";

// ============ USERS ============
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] || null;
}

export async function updateUserProfile(userId: number, data: {
  name?: string;
  profilePhoto?: string;
  theme?: "light" | "dark";
}) {
  const db = await getDb();
  if (!db) return null;
  await db.update(users).set(data).where(eq(users.id, userId));
  return getUserById(userId);
}

// ============ OPERATIONS ============
export async function getOperationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(operations).where(eq(operations.userId, userId)).orderBy(desc(operations.createdAt));
}

export async function getOperationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(operations).where(eq(operations.id, id));
  return result[0] || null;
}

export async function createOperation(data: InsertOperation) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(operations).values(data);
  return getOperationById(Number(result[0].insertId));
}

export async function updateOperation(id: number, data: Partial<InsertOperation>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(operations).set(data).where(eq(operations.id, id));
  return getOperationById(id);
}

export async function deleteOperation(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.delete(operations).where(eq(operations.id, id));
  return { success: true };
}

// ============ PHONE NUMBERS ============
export async function getPhoneNumbersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(phoneNumbers).where(eq(phoneNumbers.userId, userId)).orderBy(desc(phoneNumbers.addedAt));
}

export async function getPhoneNumbersByOperationId(operationId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(phoneNumbers).where(eq(phoneNumbers.operationId, operationId)).orderBy(desc(phoneNumbers.addedAt));
}

export async function getPhoneNumberById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(phoneNumbers).where(eq(phoneNumbers.id, id));
  return result[0] || null;
}

export async function createPhoneNumber(data: InsertPhoneNumber) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(phoneNumbers).values(data);
  return getPhoneNumberById(Number(result[0].insertId));
}

export async function updatePhoneNumber(id: number, data: Partial<InsertPhoneNumber>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(phoneNumbers).set(data).where(eq(phoneNumbers.id, id));
  return getPhoneNumberById(id);
}

export async function deletePhoneNumber(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  // Delete related events first
  await db.delete(events).where(eq(events.phoneNumberId, id));
  // Delete related tags
  await db.delete(phoneNumberTags).where(eq(phoneNumberTags.phoneNumberId, id));
  // Delete related alarms
  await db.delete(restrictionAlarms).where(eq(restrictionAlarms.phoneNumberId, id));
  // Delete the phone number
  await db.delete(phoneNumbers).where(eq(phoneNumbers.id, id));
  return { success: true };
}

export async function searchPhoneNumbers(userId: number, params: {
  query?: string;
  operator?: string;
  status?: string;
  device?: string;
  operationId?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let conditions = [eq(phoneNumbers.userId, userId)];
  
  if (params.operationId) {
    conditions.push(eq(phoneNumbers.operationId, params.operationId));
  }
  
  if (params.operator) {
    conditions.push(eq(phoneNumbers.operator, params.operator));
  }
  
  if (params.status) {
    conditions.push(eq(phoneNumbers.status, params.status as any));
  }
  
  if (params.device) {
    conditions.push(like(phoneNumbers.device, `%${params.device}%`));
  }
  
  if (params.query) {
    conditions.push(
      or(
        like(phoneNumbers.number, `%${params.query}%`),
        like(phoneNumbers.device, `%${params.query}%`),
        like(phoneNumbers.notes, `%${params.query}%`)
      )!
    );
  }
  
  return await db.select().from(phoneNumbers).where(and(...conditions)).orderBy(desc(phoneNumbers.addedAt));
}

// ============ EVENTS ============
export async function getEventsByPhoneNumberId(phoneNumberId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(events).where(eq(events.phoneNumberId, phoneNumberId)).orderBy(desc(events.eventDate));
}

export async function getRecentEvents(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(events).orderBy(desc(events.eventDate)).limit(limit);
}

export async function createEvent(data: InsertEvent) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(events).values(data);
  const eventResult = await db.select().from(events).where(eq(events.id, Number(result[0].insertId)));
  return eventResult[0];
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.delete(events).where(eq(events.id, id));
  return { success: true };
}

// ============ TAGS ============
export async function getTagsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tags).where(eq(tags.userId, userId)).orderBy(tags.name);
}

export async function createTag(data: InsertTag) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(tags).values(data);
  const tagResult = await db.select().from(tags).where(eq(tags.id, Number(result[0].insertId)));
  return tagResult[0];
}

export async function deleteTag(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.delete(phoneNumberTags).where(eq(phoneNumberTags.tagId, id));
  await db.delete(tags).where(eq(tags.id, id));
  return { success: true };
}

export async function addTagToPhoneNumber(phoneNumberId: number, tagId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.insert(phoneNumberTags).values({ phoneNumberId, tagId });
  return { success: true };
}

export async function removeTagFromPhoneNumber(phoneNumberId: number, tagId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.delete(phoneNumberTags).where(
    and(eq(phoneNumberTags.phoneNumberId, phoneNumberId), eq(phoneNumberTags.tagId, tagId))
  );
  return { success: true };
}

export async function getTagsForPhoneNumber(phoneNumberId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    tag: tags
  }).from(phoneNumberTags)
    .innerJoin(tags, eq(phoneNumberTags.tagId, tags.id))
    .where(eq(phoneNumberTags.phoneNumberId, phoneNumberId));
  return result.map(r => r.tag);
}

// ============ ANALYTICS ============
export async function getBlockCountByPhoneNumber(phoneNumberId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(events)
    .where(and(eq(events.phoneNumberId, phoneNumberId), eq(events.eventType, "block")));
  return result[0]?.count || 0;
}

export async function getAverageRecoveryTime(phoneNumberId: number) {
  const db = await getDb();
  if (!db) return null;
  // Get all block and unblock events
  const blockEvents = await db.select()
    .from(events)
    .where(and(eq(events.phoneNumberId, phoneNumberId), inArray(events.eventType, ["block", "unblock"])))
    .orderBy(events.eventDate);
  
  let totalRecoveryTime = 0;
  let recoveryCount = 0;
  let lastBlockTime: Date | null = null;
  
  for (const event of blockEvents) {
    if (event.eventType === "block") {
      lastBlockTime = event.eventDate;
    } else if (event.eventType === "unblock" && lastBlockTime) {
      const recoveryTime = event.eventDate.getTime() - lastBlockTime.getTime();
      totalRecoveryTime += recoveryTime;
      recoveryCount++;
      lastBlockTime = null;
    }
  }
  
  if (recoveryCount === 0) return null;
  return Math.round(totalRecoveryTime / recoveryCount / (1000 * 60 * 60)); // Return in hours
}

export async function getMaxDailyVolume(phoneNumberId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ maxVolume: sql<number>`MAX(messageVolume)` })
    .from(events)
    .where(and(eq(events.phoneNumberId, phoneNumberId), eq(events.eventType, "volume_record")));
  return result[0]?.maxVolume || 0;
}

export async function getPhoneNumberStats(phoneNumberId: number) {
  const db = await getDb();
  if (!db) return { blockCount: 0, restrictionCount: 0, avgRecoveryTimeHours: null, maxDailyVolume: 0, totalEvents: 0 };
  
  const blockCount = await getBlockCountByPhoneNumber(phoneNumberId);
  const avgRecoveryTime = await getAverageRecoveryTime(phoneNumberId);
  const maxVolume = await getMaxDailyVolume(phoneNumberId);
  
  // Get restriction count
  const restrictionResult = await db.select({ count: sql<number>`count(*)` })
    .from(events)
    .where(and(eq(events.phoneNumberId, phoneNumberId), eq(events.eventType, "restriction")));
  const restrictionCount = restrictionResult[0]?.count || 0;
  
  // Get total events count
  const totalEventsResult = await db.select({ count: sql<number>`count(*)` })
    .from(events)
    .where(eq(events.phoneNumberId, phoneNumberId));
  const totalEvents = totalEventsResult[0]?.count || 0;
  
  return {
    blockCount,
    restrictionCount,
    avgRecoveryTimeHours: avgRecoveryTime,
    maxDailyVolume: maxVolume,
    totalEvents,
  };
}

// ============ RESTRICTION ALARMS ============
export async function getAlarmsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(restrictionAlarms)
    .where(eq(restrictionAlarms.userId, userId))
    .orderBy(desc(restrictionAlarms.createdAt));
}

export async function getActiveAlarms(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(restrictionAlarms)
    .where(and(
      eq(restrictionAlarms.userId, userId),
      eq(restrictionAlarms.isActive, true),
      eq(restrictionAlarms.wasNotified, false)
    ))
    .orderBy(restrictionAlarms.notifyAt);
}

export async function getAlarmById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(restrictionAlarms).where(eq(restrictionAlarms.id, id));
  return result[0] || null;
}

export async function createAlarm(data: InsertRestrictionAlarm) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(restrictionAlarms).values(data);
  return getAlarmById(Number(result[0].insertId));
}

export async function updateAlarm(id: number, data: Partial<InsertRestrictionAlarm>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(restrictionAlarms).set(data).where(eq(restrictionAlarms.id, id));
  return getAlarmById(id);
}

export async function deleteAlarm(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.delete(restrictionAlarms).where(eq(restrictionAlarms.id, id));
  return { success: true };
}

export async function markAlarmAsNotified(id: number) {
  const db = await getDb();
  if (!db) return null;
  await db.update(restrictionAlarms).set({
    wasNotified: true,
    notifiedAt: new Date(),
    isActive: false
  }).where(eq(restrictionAlarms.id, id));
  return getAlarmById(id);
}

export async function getAlarmsToNotify() {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  return await db.select().from(restrictionAlarms)
    .where(and(
      eq(restrictionAlarms.isActive, true),
      eq(restrictionAlarms.wasNotified, false),
      lte(restrictionAlarms.notifyAt, now)
    ));
}

export async function getAlarmWithPhoneNumber(alarmId: number) {
  const alarm = await getAlarmById(alarmId);
  if (!alarm) return null;
  const phone = await getPhoneNumberById(alarm.phoneNumberId);
  return { alarm, phoneNumber: phone };
}

// ============ NOTIFICATIONS ============
export async function getNotificationsByUserId(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
    .orderBy(desc(notifications.createdAt));
}

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(notifications).values(data);
  const notifResult = await db.select().from(notifications).where(eq(notifications.id, Number(result[0].insertId)));
  return notifResult[0];
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  return { success: true };
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  return { success: true };
}

export async function deleteNotification(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.delete(notifications).where(eq(notifications.id, id));
  return { success: true };
}

// ============ DASHBOARD STATS ============
export async function getDashboardStats(userId: number, operationId?: number) {
  let numbers: PhoneNumber[];
  if (operationId) {
    numbers = await getPhoneNumbersByOperationId(operationId);
  } else {
    numbers = await getPhoneNumbersByUserId(userId);
  }
  
  const byStatus = {
    active: numbers.filter((n) => n.status === 'active'),
    warming: numbers.filter((n) => n.status === 'warming'),
    blocked: numbers.filter((n) => n.status === 'blocked'),
    analysis: numbers.filter((n) => n.status === 'analysis'),
    off: numbers.filter((n) => n.status === 'off'),
    restricted: numbers.filter((n) => n.status === 'restricted'),
    unknown: numbers.filter((n) => n.status === 'unknown'),
  };
  
  return {
    total: numbers.length,
    byStatus,
    numbers,
  };
}

// ============ VOLUME HISTORY ============
export async function getVolumeHistory(phoneNumberId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await db.select()
    .from(events)
    .where(and(
      eq(events.phoneNumberId, phoneNumberId),
      eq(events.eventType, "volume_record"),
      gte(events.eventDate, startDate)
    ))
    .orderBy(events.eventDate);
}

// ============ STATUS HISTORY ============
export async function getStatusHistory(phoneNumberId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(events)
    .where(and(
      eq(events.phoneNumberId, phoneNumberId),
      eq(events.eventType, "status_change")
    ))
    .orderBy(events.eventDate);
}
