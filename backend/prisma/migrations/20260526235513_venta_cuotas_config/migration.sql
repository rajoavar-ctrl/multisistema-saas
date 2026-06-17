-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "frecuenciaPago" TEXT NOT NULL DEFAULT 'mensual',
ADD COLUMN     "numeroCuotas" INTEGER NOT NULL DEFAULT 12;

-- CreateTable
CREATE TABLE "Cuota" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fechaPago" TIMESTAMP(3) NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cuota_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cuota" ADD CONSTRAINT "Cuota_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
