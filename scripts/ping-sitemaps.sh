#!/bin/bash
# ping-sitemaps.sh
# Notifica a Google y Bing que los sitemaps han sido actualizados.
# Sin API key — usa el endpoint publico de ping.
# Uso: bash scripts/ping-sitemaps.sh

BASE="https://concertride.me"

SITEMAPS=(
  "sitemap.xml"
  "sitemap-static.xml"
  "sitemap-festivales.xml"
  "sitemap-artistas.xml"
  "sitemap-recintos.xml"
  "sitemap-ciudades.xml"
  "sitemap-rutas.xml"
  "sitemap-blog.xml"
  "sitemap-como-llegar.xml"
)

echo "=== Ping de sitemaps — ConcertRide ==="
echo "Fecha: $(date)"
echo ""

for SITEMAP in "${SITEMAPS[@]}"; do
  URL="${BASE}/${SITEMAP}"

  GOOGLE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "https://www.google.com/ping?sitemap=${URL}")
  echo "Google [${GOOGLE_STATUS}]: ${URL}"

  BING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "https://www.bing.com/ping?sitemap=${URL}")
  echo "Bing   [${BING_STATUS}]: ${URL}"

  sleep 1
done

echo ""
echo "Ping completado"
