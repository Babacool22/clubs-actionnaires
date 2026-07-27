CREATE TABLE "NewsletterIssue" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "sendDate" DATETIME NOT NULL,
  "title" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "previewText" TEXT NOT NULL,
  "html" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "beehiivPostId" TEXT,
  "segment" TEXT,
  "scheduledAt" DATETIME,
  "validatedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "NewsletterIssue_sendDate_key" ON "NewsletterIssue"("sendDate");
CREATE INDEX "NewsletterIssue_status_sendDate_idx" ON "NewsletterIssue"("status", "sendDate");
