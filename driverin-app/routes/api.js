require('dotenv').config();
const router = require('express').Router();
const { connectToNetwork } = require('../config/network');
const prettyJSONString = require('../lib/perttyJson.lib');

// var
const chaincodeName = process.env.CHAINCODE_NAME
const channelName = process.env.CHANNEL_NAME

// get
router.get('/', async (req, res) => {
    try {
        const { network } = await connectToNetwork(channelName)
        const contract = network.getContract(chaincodeName);

        const results = await contract.evaluateTransaction('GetAllAssets');

        return res.status(200).json({
            status: true,
            message: 'success',
            data: JSON.parse(prettyJSONString(results))
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        })
    }
})


// single
router.get('/:vin', async (req, res) => {
    try {
        const { vin } = req.params;
        const { network } = await connectToNetwork(channelName)
        const contract = network.getContract(chaincodeName);

        const results = await contract.evaluateTransaction('ReadAsset', vin.toString());

        return res.status(200).json({
            status: true,
            message: 'success',
            data: JSON.parse(prettyJSONString(results))
        })

    } catch (error) {
        return res.status(404).json({
            status: false,
            message: error.message,
            data: null
        })
    }
})

router.post('/', async (req, res) => {
    try {

        const { vin, year, rentalFee, model, make, status } = req.body;

        // store
        const { network } = await connectToNetwork(channelName)
        const contract = network.getContract(chaincodeName);

        await contract.submitTransaction('createAsset', vin, make, model, Number(year), status, Number(rentalFee));

        return res.redirect('/');

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error,
            data: null
        })
    }
})



module.exports = router;