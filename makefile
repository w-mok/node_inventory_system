prod:
	docker-compose build
	docker-compose up -d psql
	docker-compose up -d api
	docker exec api knex migrate:latest --env development
	docker exec api knex seed:run --env development

test: 
	docker-compose build
	docker-compose up -d psql
	docker-compose up -d api
	docker exec api knex migrate:latest --env test
	docker exec api knex seed:run --env test

dev:
	docker-compose up -d psql
	docker-compose up -d api
	
	docker exec api knex migrate:latest --env development
	docker exec api knex migrate:latest --env test
	docker exec api knex seed:run --env development
	docker exec api knex seed:run --env test

clean:
	docker-compose down -v