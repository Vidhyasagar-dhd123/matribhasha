import mongoose from "mongoose";
import "@/modules/user/models/user.model";
import "@/modules/user/models/ReadingProgress.model";
import "@/modules/books/models/Book.model";
import "@/modules/books/models/Chapter.model";
import "@/modules/books/models/Pages.model";
import "@/modules/books/models/PageVersion.model";
import "@/modules/books/models/Review.model";
import "@/modules/vivar/models/VivarPost.model";

export type AdminFieldType = "text" | "number" | "boolean" | "date" | "json" | "relation";

export interface AdminModelField {
  name: string;
  label: string;
  type: AdminFieldType;
  relation?: string;
  filterable?: boolean;
  editable?: boolean;
  sensitive?: boolean;
  writeOnly?: boolean;
}

export interface AdminModelDefinition {
  name: string;
  label: string;
  description: string;
  fields: AdminModelField[];
}

export type AdminRecord = Record<string, unknown>;

export function getPayload(body: AdminRecord, fields: AdminModelField[]): AdminRecord {
  const payload: AdminRecord = {};
  for (const schemaField of fields) {
    if (!schemaField.editable || !(schemaField.name in body)) continue;
    const value = body[schemaField.name];
    if (schemaField.type === "json" && typeof value === "string") {
      try {
        payload[schemaField.name] = JSON.parse(value);
      } catch {
        throw new Error(`Invalid JSON for ${schemaField.label}`);
      }
    } else {
      payload[schemaField.name] = value;
    }
  }
  return payload;
}

const field = (
  name: string,
  label: string,
  type: AdminFieldType,
  options: Omit<AdminModelField, "name" | "label" | "type"> = {}
): AdminModelField => ({ name, label, type, filterable: true, editable: true, ...options });

export const ADMIN_MODEL_DEFINITIONS: AdminModelDefinition[] = [
  {
    name: "Book",
    label: "Books",
    description: "Original books and their catalog metadata.",
    fields: [
      field("title", "Title", "text"),
      field("uuid", "UUID", "text"),
      field("author", "Author", "text"),
      field("originalLanguage", "Original language", "text"),
      field("totalPages", "Total pages", "number"),
      field("description", "Description", "text"),
      field("genre", "Genre", "text"),
      field("isbn13", "ISBN-13", "text"),
      field("uploaded", "Uploaded", "boolean"),
      field("translatedLanguages", "Translated languages", "json"),
      field("isTranslated", "Has translations", "boolean"),
      field("uploadURI", "Upload URI", "text"),
      field("coverURI", "Cover URI", "text"),
      field("chapters", "Chapters", "relation", { relation: "Chapter", editable: false }),
      field("pages", "Original pages", "relation", { relation: "Page", editable: false }),
    ],
  },
  {
    name: "User",
    label: "Users",
    description: "Accounts, roles, language preferences, and moderation state.",
    fields: [
      field("name", "Name", "text"),
      field("username", "Username", "text"),
      field("email", "Email", "text"),
      field("password", "Password (write-only)", "text", { sensitive: true, writeOnly: true }),
      field("role", "Role", "text"),
      field("languages", "Languages", "json"),
      field("bio", "Bio", "text"),
      field("isBlocked", "Blocked", "boolean"),
    ],
  },
  {
    name: "Page",
    label: "Original pages",
    description: "The original page records that belong to a book.",
    fields: [
      field("bookId", "Book", "relation", { relation: "Book", editable: false }),
      field("bookUUID", "Book UUID", "text"),
      field("pageNumber", "Page number", "number"),
      field("originalLanguage", "Original language", "text"),
    ],
  },
  {
    name: "PageVersion",
    label: "Page versions",
    description: "Translations and authored versions of original pages.",
    fields: [
      field("language", "Language", "text"),
      field("content", "Content", "text"),
      field("pageId", "Original page", "relation", { relation: "Page", editable: false }),
      field("authorId", "Author", "relation", { relation: "User", editable: false }),
    ],
  },
  {
    name: "Chapter",
    label: "Chapters",
    description: "Chapter boundaries for books.",
    fields: [
      field("pageStart", "Start page", "number"),
      field("pageEnd", "End page", "number"),
      field("title", "Title", "text"),
      field("language", "Language", "text"),
      field("bookUUID", "Book UUID", "text"),
    ],
  },
  {
    name: "Review",
    label: "Reviews",
    description: "Book reviews and moderation content.",
    fields: [
      field("bookUUID", "Book UUID", "text"),
      field("userId", "Reviewer", "relation", { relation: "User", editable: false }),
      field("rating", "Rating", "number"),
      field("title", "Title", "text"),
      field("comment", "Comment", "text"),
      field("language", "Language", "text"),
      field("likes", "Likes", "relation", { relation: "User", editable: false }),
    ],
  },
  {
    name: "ReadingProgress",
    label: "Reading progress",
    description: "Per-user reading and translation progress.",
    fields: [
      field("userId", "User", "relation", { relation: "User", editable: false }),
      field("bookUUID", "Book UUID", "text"),
      field("pageNumber", "Page number", "number"),
      field("language", "Language", "text"),
      field("role", "Role", "text"),
    ],
  },
  {
    name: "VivarPost",
    label: "Vivar posts",
    description: "Community reel posts and their source relationships.",
    fields: [
      field("selectedText", "Selected text", "text"),
      field("caption", "Caption", "text"),
      field("bookUUID", "Book UUID", "text"),
      field("bookTitle", "Book title", "text"),
      field("pageNumber", "Page number", "number"),
      field("language", "Language", "text"),
      field("sourceVersionId", "Source version", "relation", { relation: "PageVersion", editable: false }),
      field("authorId", "Author", "relation", { relation: "User", editable: false }),
      field("likes", "Likes", "relation", { relation: "User", editable: false }),
    ],
  },
];

export function getAdminModelDefinition(name: string): AdminModelDefinition | undefined {
  return ADMIN_MODEL_DEFINITIONS.find((definition) => definition.name === name);
}

export function getAdminModel(name: string): mongoose.Model<AdminRecord> | undefined {
  getAdminModelDefinition(name);
  return mongoose.models[name] as mongoose.Model<AdminRecord> | undefined;
}

export function serializeAdminRecord(record: AdminRecord): AdminRecord {
  const serialized: AdminRecord = {};
  for (const [key, value] of Object.entries(record)) {
    if (key === "password") continue;
    serialized[key] = serializeAdminValue(value);
  }
  return serialized;
}

function serializeAdminValue(value: unknown): unknown {
  if (value instanceof mongoose.Types.ObjectId) return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serializeAdminValue);
  if (value && typeof value === "object") {
    const objectValue = value as AdminRecord;
    return Object.fromEntries(
      Object.entries(objectValue)
        .filter(([key]) => key !== "password")
        .map(([key, nestedValue]) => [key, serializeAdminValue(nestedValue)])
    );
  }
  return value;
}
