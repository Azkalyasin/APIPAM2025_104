/*
  Warnings:

  - You are about to drop the column `notes` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `order_status_history` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_status_history" DROP CONSTRAINT "order_status_history_changed_by_fkey";

-- DropForeignKey
ALTER TABLE "order_status_history" DROP CONSTRAINT "order_status_history_order_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "notes",
ADD COLUMN     "address" TEXT NOT NULL;

-- DropTable
DROP TABLE "order_status_history";
