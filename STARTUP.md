# development (infra only)
docker compose --profile dev up -d

# production (infra + backend)
docker compose --profile prod up -d --build

# stop
docker compose --profile dev down
docker compose --profile prod down
