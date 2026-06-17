-- AlterTable
ALTER TABLE "MovimientoInventario" ADD COLUMN     "stockAnterior" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stockNuevo" INTEGER NOT NULL DEFAULT 0;
