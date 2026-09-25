#!/usr/bin/env bash
# Requests the job's OIDC token for audience $1; prints four decoded claims, never the token.
set -euo pipefail
token=$(curl -sSf -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
  "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=$1" | jq -r .value)
echo "::add-mask::$token"
payload=$(cut -d. -f2 <<< "$token" | tr '_-' '/+')
while (( ${#payload} % 4 )); do payload+="="; done
base64 -d <<< "$payload" | jq -c '{sub, aud, repository, ref}'
