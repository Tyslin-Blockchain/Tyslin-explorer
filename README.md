# TyslinChain Explorer - Tyslinscan

[![Join the chat at https://gitter.im/tyslinchain/tyslinscan](https://badges.gitter.im/tyslinchain/tyslinscan.svg)](https://gitter.im/tyslinchain/tyslinscan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Tyslinscan is a BlockExplorer for **TyslinChain**, built with VueJS, Nuxt and MongoDB. Tyslinscan allows you to explore and search the **TyslinChain** for transactions, addresses, tokens, prices and other activities taking place on **TyslinChain**.

A demo instance connected to the **TyslinChain testnet** is available at [scan.testnet.tyslinchain.com](https://scan.testnet.tyslinchain.com/).

## Current Features
- Browse blocks, transactions, accounts and contracts
- View pending transactions
- Upload & verify contract sources
- Display the current state of verified contracts
- Responsive layout

Missing a feature? Please request it by creating a new [Issue](https://github.com/tyslinchain/tyslinscan/issues).

## Usage notes

The explorer is still under heavy development, if you find any problems please create [an issue](https://github.com/tyslinchain/tyslinscan/issues) or prepare [a pull request](https://github.com/tyslinchain/tyslinscan/pulls).

## Getting started

### Requirements
- [NodeJS](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

### Setup

Copy and modify your config
```bash
cp client/.env.example client/.env
cp server/config/default.json server/config/local.json
```

Install library
```bash
cd client/ && npm install
```

```bash
cd server/ && npm install
```

### Run
After modify your config & install library. Your environment is ready to start

- Run client to view in browser
```bash
cd client/ && npm run dev
```

- Run API server for client
```bash
cd server/ && npm run server-dev
```

- Run crawl data for API server
```bash
cd server/ && npm run crawl-dev
```

- Get transaction pending
```bash
cd server/ && npm run subscribe-pending-tx-dev
```
