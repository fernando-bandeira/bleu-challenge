# Project Setup
## Install dependencies
```sh
pnpm install
```
## Environment setup
Create '.env.local' file inside apps/web:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:42069/
NEXT_PUBLIC_ANVIL_ENDPOINT=http://127.0.0.1:8545
```
Create .env inside apps:
```
CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
ANVIL_ENDPOINT=http://127.0.0.1:8545
```
## Run the project
Start all services in development mode:
```
pnpm dev
```
## Development Commands
Start individual services:
```
pnpm dev:web # Start frontend
pnpm dev:indexer # Start indexer
pnpm dev:anvil # Start local blockchain
```