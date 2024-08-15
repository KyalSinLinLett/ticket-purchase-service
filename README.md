# ticket-purchase-service
Ticket Purchase Service

## local dev setup
1. clone the repository

2. install dependencies
```bash
yarn
```

3. run postgres.yaml service for DB
```bash
docker-compose -f postgres.yaml up -d

# make sure to set the env variables in the .env file
# follow the format of the .env.sample
```

4. run the service locally
```bash
yarn start
```

5. running tests
```bash
yarn test
```

6. deployment - image build
```bash
docker build . -t ticket-purchase-service:latest
```

7. view OpenAPI swagger locally at: [here]()