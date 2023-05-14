docker compose -f docker-compose.prod.yml up --build -d
sleep 10
docker image prune --all -f #remove all unsed and dangling images