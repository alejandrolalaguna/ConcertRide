#!/usr/bin/env bash
# =============================================================================
# setup-production-secrets.sh
# Configura todos los secrets de producción en Cloudflare Workers via Wrangler.
#
# USO: ejecutar UNA VEZ antes del primer deploy a producción.
# Requiere: wrangler instalado y autenticado (`wrangler login`).
#
# Los secrets NO se guardan en el repo ni en wrangler.jsonc.
# Se inyectan en runtime por Cloudflare.
# =============================================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   ConcertRide — Setup de secrets de producción      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── 1. JWT_SECRET ─────────────────────────────────────────────────────────────
# Firma todas las sesiones de usuario. Rotar esto invalida TODAS las sesiones
# activas (todos los usuarios tendrán que volver a hacer login).
# Generar un hex de 32 bytes:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo "▶ 1/8  JWT_SECRET (firma de sesiones — genera uno nuevo, NO uses el de dev)"
echo "       Genera con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
wrangler secret put JWT_SECRET

# ── 2. INGEST_SECRET ─────────────────────────────────────────────────────────
# Protege el endpoint POST /api/ingest/run contra llamadas no autorizadas.
# Generar otro hex de 32 bytes distinto del JWT_SECRET.
echo ""
echo "▶ 2/8  INGEST_SECRET (protege el endpoint de backfill — genera uno nuevo)"
wrangler secret put INGEST_SECRET

# ── 3. TURSO_DATABASE_URL ────────────────────────────────────────────────────
# URL de la base de datos Turso.
# Valor actual (ya usado en dev): libsql://concertride-alalaguna.aws-eu-west-1.turso.io
# Confirmar en: https://app.turso.tech → tu DB → Connect
echo ""
echo "▶ 3/8  TURSO_DATABASE_URL"
echo "       Valor: libsql://concertride-alalaguna.aws-eu-west-1.turso.io"
wrangler secret put TURSO_DATABASE_URL

# ── 4. TURSO_AUTH_TOKEN ───────────────────────────────────────────────────────
# Token de autenticación de Turso. Obtener en:
#   https://app.turso.tech → tu DB → Connect → Copy token
# O via CLI: turso db tokens create concertride
echo ""
echo "▶ 4/8  TURSO_AUTH_TOKEN (token de Turso — obtener en app.turso.tech)"
wrangler secret put TURSO_AUTH_TOKEN

# ── 5. TICKETMASTER_API_KEY ───────────────────────────────────────────────────
# API Key de Ticketmaster Discovery para la ingestión de conciertos.
# Obtener en: https://developer.ticketmaster.com → My Apps → Consumer Key
# Valor actual en dev: TUm1OiCZT8yLM19YIazz7ewDahFOywG5 (confirmar si es válido en prod)
echo ""
echo "▶ 5/8  TICKETMASTER_API_KEY (Discovery API — developer.ticketmaster.com)"
wrangler secret put TICKETMASTER_API_KEY

# ── 6. RESEND_API_KEY ─────────────────────────────────────────────────────────
# API Key de Resend para envío de emails transaccionales.
# ANTES de añadir esta key, el dominio concertride.es debe estar verificado en Resend:
#   https://resend.com/domains → Add Domain → concertride.es
#   Añadir los registros DNS (SPF + DKIM) que Resend proporciona.
# Una vez verificado, crear la key en: https://resend.com/api-keys
echo ""
echo "▶ 6/8  RESEND_API_KEY"
echo "       ⚠️  ANTES: verificar dominio concertride.es en https://resend.com/domains"
echo "       Luego crear la key en https://resend.com/api-keys"
wrangler secret put RESEND_API_KEY

# ── 7. VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY ───────────────────────────────────
# Claves ECDSA P-256 para Web Push. Ya generadas el 2026-04-23.
# ⚠️  NO ROTAR si ya hay usuarios con push subscriptions activas — sus
#    subscriptions están vinculadas a la public key y dejarían de funcionar.
# Los valores están en .dev.vars. Copiarlos exactamente.
echo ""
echo "▶ 7/8  VAPID_PUBLIC_KEY"
echo "       Valor en .dev.vars: BMVxuaS-Okq2dSixsAzMaepoNttackd-nWdSMUahQIXJZKh3iSgrr4uPEOwVqLsy5RwKBPsXuAa6HdKn8s9bfrc"
wrangler secret put VAPID_PUBLIC_KEY

echo ""
echo "▶ 8/8  VAPID_PRIVATE_KEY"
echo "       Valor en .dev.vars: yD-1qF1lCy-_sbEKLA-2RkFLXJf8hIyu7gXydaJiPso"
wrangler secret put VAPID_PRIVATE_KEY

# ── 9. ADMIN_USER_IDS (en wrangler.jsonc, no secret) ─────────────────────────
# Los IDs de admin se gestionan en wrangler.jsonc → "vars" → "ADMIN_USER_IDS"
# porque son IDs no sensibles y es más cómodo editarlos sin `wrangler secret put`.
# Formato: "u_id_principal,u_id_backup"
# Pasos:
#   1. Registrar la cuenta admin en producción → apuntar el ID (formato u_xxxxxxxx)
#   2. Registrar una segunda cuenta de backup
#   3. Editar wrangler.jsonc: "ADMIN_USER_IDS": "u_id1,u_id2"
#   4. Redesploy
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  ADMIN_USER_IDS — acción manual requerida:"
echo "    1. Registra la cuenta admin en producción"
echo "    2. Copia el user ID del response (formato u_xxxxxxxx)"
echo "    3. Edita wrangler.jsonc → vars → ADMIN_USER_IDS"
echo "    4. Añade mínimo 2 IDs separados por coma"
echo "    5. wrangler deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "✅  Secrets configurados. Siguientes pasos:"
echo ""
echo "   1. Aplicar migraciones a la DB de producción:"
echo "      npm run db:push --workspace=@concertride/api"
echo ""
echo "   2. Primer deploy:"
echo "      npm run build && npm run deploy"
echo ""
echo "   3. Verificar que la API responde:"
echo "      curl https://concertride.es/api/health"
echo ""
echo "   4. Ejecutar backfill de conciertos:"
echo "      TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npx tsx apps/api/scripts/backfill-2026.ts"
echo ""
