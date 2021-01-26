# Price Bot
This is a simple example of a price bot. 

## Requirements
- Node 10.x

## Installation
```
# create a .env file
cp .env.example .env

# Fill in the blanks
nano .env

# Install dependencies
npm i

```

## Web3 with UniswapV1 and Kyber

Run the command below to use web3 to connect to uniswapV1 and Kyber to get prices. 
Note that uniswapv1 is no longer under active development, but that doesn't mean there aren't arb opps.

```
node index.js
```

## Ethers with UniswapV2 and Kyber

Run the command below to use ethers to connect to uniswapV2 and Kyber to get prices.

```
node index2.js
```