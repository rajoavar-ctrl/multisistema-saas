# 🚀 MultiSistema SaaS

Sistema administrativo multiempresa desarrollado para la gestión de inventario, ventas, clientes y créditos.

---

## 📋 Descripción

MultiSistema SaaS es una plataforma web diseñada para pequeñas y medianas empresas que necesitan controlar:

* Inventario
* Productos
* Clientes
* Ventas
* Créditos y cuotas
* Movimientos de inventario
* Usuarios y roles

El sistema está construido bajo una arquitectura moderna basada en React, Node.js, Express, Prisma ORM y PostgreSQL.

---

# 🏗 Arquitectura

```text
Frontend (React + Vite)
            │
            ▼
Backend (Node.js + Express)
            │
            ▼
Prisma ORM
            │
            ▼
PostgreSQL
```

---

# ⚙️ Tecnologías Utilizadas

## Frontend

* React
* Vite
* JavaScript (ES6+)
* Tailwind CSS
* SweetAlert2

## Backend

* Node.js
* Express
* Prisma ORM
* JWT Authentication
* bcrypt

## Base de Datos

* PostgreSQL

## Control de Versiones

* Git
* GitHub

---

# 🔐 Seguridad

El sistema implementa:

* Autenticación JWT
* Control de acceso por roles
* Protección de rutas
* Validación de permisos
* Multiempresa mediante empresaId

---

# 👥 Roles Implementados

## SuperAdmin

Control total de la plataforma.

## Administrador

Gestión operativa completa de su empresa.

## Vendedor

Registro de clientes, ventas y operaciones comerciales.

## Cobrador

Gestión de cuotas y recaudos (en desarrollo).

---

# 📦 Módulos Implementados

## ✅ Autenticación

* Login JWT
* Protección de rutas
* Control de sesión

---

## ✅ Usuarios

* Crear usuarios
* Gestión por roles
* Administración por empresa

---

## ✅ Clientes

* Registro de clientes
* Documento/NIT
* Teléfono
* Correo electrónico
* Dirección
* Búsqueda y administración

---

## ✅ Productos

* Creación de productos
* Precio
* Stock
* Activación / Descontinuación

---

## ✅ Inventario

* Entradas
* Salidas
* Ajustes
* Historial de movimientos
* Control de stock
* Trazabilidad por usuario

---

## ✅ Ventas

* Selección de cliente
* Múltiples productos por venta
* Validación de stock
* Cálculo automático de totales

---

## ✅ Créditos

* Cuota inicial
* Número de cuotas
* Frecuencia de pago
* Generación automática de cuotas

---

## ✅ Cuotas

Generación automática de:

* Fecha de vencimiento
* Valor de cuota
* Saldo pendiente
* Estado de pago

---

# 📊 Flujo de Negocio

```text
Cliente
   │
   ▼
Venta
   │
   ▼
DetalleVenta
   │
   ▼
Descuento de Inventario
   │
   ▼
Movimiento Inventario
   │
   ▼
Generación de Cuotas
   │
   ▼
Cartera
```

---

# 🗄 Modelo Principal de Datos

* Empresa
* Usuario
* Cliente
* Producto
* MovimientoInventario
* Venta
* DetalleVenta
* Cuota
* Pago

---

# 🎯 Próximos Módulos

## 🔥 Cartera y Cobranza

* Registro de pagos
* Abonos parciales
* Estado de cartera
* Cuotas vencidas

## 📈 Dashboard Financiero

* Ventas por período
* Productos más vendidos
* Cartera pendiente
* Indicadores de negocio

## 📄 Reportes

* PDF
* Excel
* Exportaciones

## ☁️ SaaS Multiempresa Avanzado

* Administración global
* Gestión de empresas
* Facturación por suscripción

---

# 📸 Estado Actual

Versión funcional con flujo completo:

```text
Clientes
↓
Ventas
↓
Inventario
↓
Cuotas
↓
Crédito
```

---

# 👨‍💻 Autor

**Rafael Avila**

Desarrollador de Software

Barranquilla - Colombia 🇨🇴

---

# ⭐ Repositorio

Si este proyecto te parece interesante, considera darle una estrella al repositorio.
