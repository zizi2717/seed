#!/bin/sh
set -e

docker network create seed || true

docker rm -f seed-redis

docker run --restart=always -d --log-opt max-size=10m --log-opt max-file=3 \
    --name seed-redis \
    --network seed \
    redis:7.0 redis-server

docker rm -f seed-postgres

docker run -d --restart=always --log-opt max-size=10m --log-opt max-file=3 \
    --name seed-postgres \
    --network seed \
    -e POSTGRES_DB=seed \
    -e POSTGRES_USER=seed \
    -e POSTGRES_PASSWORD=seed \
    -e POSTGRES_INITDB_ARGS=--encoding=UTF-8 \
    -p 5432:5432 \
    postgres:13.11

while ! docker exec seed-postgres pg_isready -h seed-postgres -U seed; do
    sleep 1
    echo "Waiting..."
done

run_psql() {
    docker exec -e PGPASSWORD=seed -i seed-postgres psql -h seed-postgres -U seed -w "$@"
}

run_psql -d "seed" -c "ALTER DATABASE \"seed\" OWNER TO \"seed\";"
run_psql -d "seed" -c "GRANT ALL PRIVILEGES ON DATABASE \"seed\" TO \"seed\";"
run_psql -d "seed" -c "CREATE SCHEMA \"main\" AUTHORIZATION \"seed\";"
run_psql -d "seed" -c "GRANT ALL ON SCHEMA \"main\" TO \"seed\" WITH GRANT OPTION;"
