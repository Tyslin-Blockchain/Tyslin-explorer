const { Router } = require('express')
const axios = require('axios')
const db = require('../models')
const Web3Util = require('../helpers/web3')
const logger = require('../helpers/logger')

const SettingController = Router()
var tyslinUsd = {}

SettingController.get('/setting', async (req, res) => {
    try {
    // Get total blocks in db.
        let web3 = await Web3Util.getWeb3()
        let blk = await web3.eth.getBlock('latest')
        let totalBlock = (blk || {}).number || await db.Block.estimatedDocumentCount()
        let totalAddress = await db.Account.estimatedDocumentCount()
        let totalToken = await db.Token.estimatedDocumentCount()
        let totalSmartContract = await db.Contract.estimatedDocumentCount()
        let lastBlock = await db.Block.findOne().sort({ number: -1 })

        return res.json(
            {
                stats: { totalBlock, totalAddress, totalToken, totalSmartContract, lastBlock }
            })
    } catch (e) {
        logger.warn(e)
        return res.status(400).send()
    }
})

SettingController.get('/setting/usd', async (req, res) => {
    try {
        let { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tyslinchain&vs_currencies=usd')

        tyslinUsd = data
    } catch (e) {
        logger.warn(e)
    }
    return res.json(tyslinUsd)
})

module.exports = SettingController
