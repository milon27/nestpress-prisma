# * coution this will remove all database content and all container and rebuild all images and run again

# docker rm -f $(docker ps -a -q)
docker volume rm $(docker volume ls -q)
docker compose -f docker-compose.dev.yml up --build -d