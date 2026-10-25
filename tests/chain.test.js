import test from 'node:test';
import assert from 'node:assert/strict';
import {createChain} from '../server/chain.js';
import {hash} from '../server/analysis.js';
test('EVM stores fingerprints, rejects duplicates and unauthorized signers',async()=>{
 const {contract,provider,transport}=await createChain();
 try{
 const dataset=hash('dataset'),report=hash('report');
 await (await contract.anchor(dataset,report)).wait();
 const stored=await contract.receipts(dataset);assert.equal(stored.reportHash,report);assert.ok(stored.timestamp>0n);
 await assert.rejects(async()=>{await (await contract.anchor(dataset,report)).wait();});
 const other=await provider.getSigner(1);await assert.rejects(async()=>{await (await contract.connect(other).anchor(hash('other'),report)).wait();});
 assert.equal((await contract.receipts(hash('tampered'))).timestamp,0n);
 }finally{await transport.disconnect();}
});
