require('dotenv').config()

//http dependencies
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')
const axios = require('axios')

// ethereum dependencies
const ethers = require('ethers');
const { parseUnits, formatUnits } = ethers.utils;
const { legos } = require('@studydefi/money-legos');

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// ETHERS CONFIG
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// Contracts
const uniswapV2 = new ethers.Contract(
    process.env.PANCAKE_ROUTER_ADDRESS,
    [
      'function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)',
      'function WETH() external pure returns (address)'
    ],
    provider
  );


async function checkPair(args) {
  const { inputTokenSymbol, inputTokenAddress, outputTokenSymbol, outputTokenAddress, inputAmount } = args
  
  
  // calculate uniswap amount
  const path = [inputTokenAddress, outputTokenAddress];
  const amounts = await uniswapV2.getAmountsOut(inputAmount, path);
  const uniswapAmount = amounts[1];


  

  console.table([{
    'Input Token': inputTokenSymbol,
    'Output Token': outputTokenSymbol,
    'Input Amount': formatUnits(inputAmount, 18),
    'Uniswap Return': formatUnits(uniswapAmount, 18),
    'Timestamp': moment().tz('America/Chicago').format(),
  }])
}

let priceMonitor
let monitoringPrice = false

async function monitorPrice() {
  if(monitoringPrice) {
    return
  }

  console.log("Checking prices...")
  monitoringPrice = true

  try {

    // ADD YOUR CUSTOM TOKEN PAIRS HERE!!!
    
    const WETH_ADDRESS = await uniswapV2.WETH(); // Uniswap V2 uses wrapped eth
  
    await checkPair({
      inputTokenSymbol: 'BNB',
      inputTokenAddress: process.env.BNB_ADDRESS,
      outputTokenSymbol: 'BUSD',
      outputTokenAddress: process.env.BUSD_ADDRESS,
      inputAmount: parseUnits('1', 18)
    })


  } catch (error) {
    console.error(error)
    monitoringPrice = false
    clearInterval(priceMonitor)
    return
  }

  monitoringPrice = false
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 3000 // 3 Seconds
priceMonitor = setInterval(async () => { await monitorPrice() }, POLLING_INTERVAL)
