/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');

exports.createBar = async function (req, res, next) {
    var OrderId             = req.body.orderId;
    var TotalKgs   	        = req.body.totalKgs;
    var DwrReceiptId  	    = req.body.dwrReceiptId;
    var UserId  	        = req.body.userId;
    
    var args = [OrderId,TotalKgs,DwrReceiptId,UserId];

    Invoke("CreateBar", args, res);
}
exports.queryBar = async function (req, res, next) {
    var OrderID = req.query.orderId;
    var args = [OrderID];
    Query("QueryBar", args, res);
}
exports.getBarList = async function (req, res, next) {
    QueryAll("GetBarList",agrs,res);
}
exports.getBar = async function (req, res, next) {
    var OrderID = req.query.orderId;
    var args = [OrderID];

    Query("GetBar",args,res)
} 
async function Invoke(funcName,args,res){
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('user1');
        if (!identity) {
            console.log(`An identity for the user user1 does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('dsg');
        if(args.length == 11 ){
       
        await contract.submitTransaction(funcName,args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10]);
    }else if(args.length == 10){
     
        await contract.submitTransaction(funcName,args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9]);   
    } else if(args.length == 5){
     
        await contract.submitTransaction(funcName,args[0],args[1],args[2],args[3],args[4]);   
    }else if(args.length == 4){
     
        await contract.submitTransaction(funcName,args[0],args[1],args[2],args[3]);   
    }else if(args.length == 3){
     
        await contract.submitTransaction(funcName,args[0],args[1],args[2]);   
    }else if(args.length == 2){
     
        await contract.submitTransaction(funcName,args[0],args[1]);   
    }else if(args.length == 1){
     
        await contract.submitTransaction(funcName,args[0]);   
    }   
        console.log({message:'Success'});
        res.send({message:'Success'});

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`failure: ${error}`);
        res.send(`failure: ${error}`);

    }
}
async function QueryAll(funcName,res){
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('user1');
        if (!identity) {
            console.log(`An identity for the user user1does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('dsg');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    
        const result = await contract.evaluateTransaction(funcName);
let p = JSON.parse(result)
        console.log({Result:p});
        res.send({Result:p});

    } catch (error) {
        console.error(`failure: ${error}`);
        res.send(`failure: ${error}`);

    }
}
async function Query(funcName,args,res){
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('user1');
        if (!identity) {
            console.log(`An identity for the user user1does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('dsg');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        if(args.length == 1 ){
       
        const result = await contract.evaluateTransaction(funcName,args[0]);
        let p = JSON.parse(result)
        console.log({Result:p});
        res.send({Result:p});
        }else if(args.length == 6 ){
       
            const result = await contract.evaluateTransaction(funcName,args[0],args[1],args[2],args[3],args[4],args[5]);
            let p = JSON.parse(result)
            console.log({Result:p});
            res.send({Result:p});
        }else if(args.length == 4 ){
       
            const result = await contract.evaluateTransaction(funcName,args[0],args[1],args[2],args[3]);
            let p = JSON.parse(result)
            console.log({Result:p});
            res.send({Result:p});
        }else if(args.length == 5 ){
       
            const result = await contract.evaluateTransaction(funcName,args[0],args[1],args[2],args[3],args[4]);
            let p = JSON.parse(result)
            console.log({Result:p});
            res.send({Result:p});
        }else if(args.length == 3 ){
       
            const result = await contract.evaluateTransaction(funcName,args[0],args[1],args[2]);
            let p = JSON.parse(result)
            console.log({Result:p});
            res.send({Result:p});
        }else if(args.length == 2 ){
       
            const result = await contract.evaluateTransaction(funcName,args[0],args[1]);
            let p = JSON.parse(result)
            console.log({Result:p});
            res.send({Result:p});
        }
    } catch (error) {
        console.error(`failure: ${error}`);
        res.send(`failure: ${error}`);

    }
}