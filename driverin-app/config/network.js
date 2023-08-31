'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const { buildCCPOrg1, buildWallet } = require('../../ca/appUtil');

const walletPath = path.join(__dirname, '../wallet');
const org1UserId = process.env.ORG_USER_ID || 'javascriptAppUser';

async function connectToNetwork(channelName = 'mychannel') {
    try {
        const ccp = buildCCPOrg1();
        const wallet = await buildWallet(Wallets, walletPath);
        const gateway = new Gateway();

        await gateway.connect(ccp, {
            wallet,
            identity: org1UserId,
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork(channelName);
        return { gateway, network };
    } catch (error) {
        throw error;
    }
}

module.exports = { connectToNetwork };
