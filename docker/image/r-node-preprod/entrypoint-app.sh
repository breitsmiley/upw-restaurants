#!/bin/sh
set -e

    echo "1. Waiting for DB will be ready..."
    until typeorm query "SELECT 1"; do
        sleep 7;
    done
    echo "2. DB is ready"

    echo "3. Run migration..."
    typeorm migration:run || exit 1;
    echo "4. Migration was applied"

    echo "5. Making a little pause..."
    sleep 10
    echo "6. Start APP"

exec "$@"
