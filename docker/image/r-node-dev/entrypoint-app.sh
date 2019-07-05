#!/bin/sh
set -e

if [ "$APP_D_ENTRYPOINT_MODE" == 'init' ]; then

    npm install
    echo "NPM INSTALL DONE"

    echo "1. Waiting for DB will be ready..."
    until ts-node -r tsconfig-paths/register ./node_modules/.bin/typeorm query "SELECT 1"; do
        sleep 7;
    done
    echo "2. DB is ready"

    echo "3. Run migration..."
    ts-node -r tsconfig-paths/register ./node_modules/.bin/typeorm migration:run || exit 1;
    echo "4. Migration was applied"

    echo "5. Making a little pause..."
    sleep 3
    echo "6. Start APP"

fi

exec "$@"
