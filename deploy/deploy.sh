#!/usr/bin/env bash
# Runs on the VPS, started by .github/workflows/deploy-vps.yml. Each deploy builds in its own folder under
# releases/ and only then points `current` at it, so a failed build never touches the live site. If the new
# version doesn't answer after the restart, `current` goes back to the previous release.
#
# /var/www/30_new_zintraz_page/
#   deploy.sh                         a copy of this file
#   shared/.env.production.local       the server's settings, linked into every release
#   releases/<timestamp>/              one checkout + build per deploy
#   current -> releases/<timestamp>    what the zintraz service runs
set -euo pipefail

ROOT=/var/www/30_new_zintraz_page
REPO=https://github.com/sanuxx/ZINTRAZ.git
PORT=3030
KEEP=3

# Two pushes close together: the second waits for the first instead of building alongside it.
exec 9>"$ROOT/deploy.lock"
flock 9

REL=$(mktemp -d "$ROOT/releases/$(date +%Y%m%d%H%M%S)-XXXX")
PREV=$(readlink "$ROOT/current" || true)
ok=""
trap '[ -n "$ok" ] || rm -rf "$REL"' EXIT

point_current_at() {
  ln -sfn "$1" "$ROOT/current.tmp"
  mv -T "$ROOT/current.tmp" "$ROOT/current"
  sudo /usr/bin/systemctl restart zintraz
}

git clone --quiet --depth 1 --branch main "$REPO" "$REL"
ln -s "$ROOT/shared/.env.production.local" "$REL/.env.production.local"
cd "$REL"
npm ci --no-audit --no-fund
npm run build

point_current_at "$REL"

for _ in $(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/"; then
    ok=1
    ls -1d "$ROOT"/releases/* | sort -r | tail -n +$((KEEP + 1)) | xargs -r rm -rf
    echo "Deployed $(git rev-parse --short HEAD) to $REL"
    exit 0
  fi
  sleep 1
done

echo "The new version did not start." >&2
if [ -n "$PREV" ]; then
  point_current_at "$PREV"
  echo "Rolled back to $PREV." >&2
fi
exit 1
