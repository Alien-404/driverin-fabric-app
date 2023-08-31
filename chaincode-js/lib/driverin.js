
'use strict';

// modules
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');


// class 
class Driverin extends Contract {
    async initLedger(ctx) {
        // first init assets
        const assets = [
            {
                VIN: "1A123BC456",
                make: "Toyota",
                model: "Camry",
                year: 2022,
                status: "available",
                rentalFee: 500000
            },
            {
                VIN: "2B456CD789",
                make: "Honda",
                model: "Civic",
                year: 2021,
                status: "available",
                rentalFee: 450000
            },
            {
                VIN: "3C789DE012",
                make: "Ford",
                model: "Mustang",
                year: 2020,
                status: "available",
                rentalFee: 600000
            },
            {
                VIN: "4D012EF345",
                make: "Chevrolet",
                model: "Impala",
                year: 2023,
                status: "available",
                rentalFee: 550000
            },
            {
                VIN: "5E345FG678",
                make: "Nissan",
                model: "Altima",
                year: 2022,
                status: "maintenance",
                rentalFee: 400000
            }
        ];

        // store
        for (const asset of assets) {
            // insert for docType
            asset.docType = 'car'

            await ctx.stub.putState(asset.VIN, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, vin) {
        const assetJSON = await ctx.stub.getState(vin);
        return assetJSON && assetJSON.length > 0;
    }

    async createAsset(ctx, vin, make, model, year, status, rentalFee) {
        // check is available or not
        const isExist = await this.AssetExists(ctx, vin)

        if (isExist) {
            throw new Error(`The car ${vin} already exists`);
        }

        // insert
        const asset = {
            VIN: vin,
            make,
            model,
            year,
            status,
            rentalFee
        }

        await ctx.stub.putState(vin, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);

    }

    async ReadAsset(ctx, vin) {
        const assetJSON = await ctx.stub.getState(vin); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The car ${vid} does not exist`);
        }
        return assetJSON.toString();
    }

    async GetAllAssets(ctx) {
        const allResults = [];

        for await (const result of ctx.stub.getStateByRange('', '')) {
            const strValue = Buffer.from(result.value.toString('utf8'));
            let record;

            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }

            allResults.push(record);
        }

        return JSON.stringify(allResults);
    }

}

module.exports = Driverin;