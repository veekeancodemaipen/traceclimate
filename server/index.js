import express from 'express';
import { analyze } from './analysis.js';
import { createChain } from './chain.js';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../',import.meta.url));
const app = express();
app.use(express.json({limit:'1100kb'}));
const {contract} = await createChain();
const receipts = [];
app.get('/api/status',async(req,res)=>res.json({network:'Local Ethereum demo',chainId:1337,contract:await contract.getAddress(),receipts}));
app.post('/api/analyze',(req,res)=>{try{res.json(analyze(req.body.csv));}catch(e){res.status(400).json({error:e.message});}});
app.post('/api/anchor',async(req,res)=>{
  try {
    const result = analyze(req.body.csv);
    const existing = await contract.receipts(result.datasetHash);
    if(existing.timestamp>0n) return res.status(409).json({error:'This dataset is already anchored in this session.'});
    const tx = await contract.anchor(result.datasetHash,result.reportHash);
    const mined = await tx.wait();
    const receipt = {datasetHash:result.datasetHash,reportHash:result.reportHash,transactionHash:tx.hash,blockNumber:mined.blockNumber,contract:await contract.getAddress(),chainId:1337,network:'Local Ethereum demo',anchoredAt:new Date().toISOString(),report:result.report};
    receipts.unshift(receipt);
    res.json(receipt);
  } catch(e) {res.status(400).json({error:e.shortMessage || e.message});}
});
app.post('/api/verify',async(req,res)=>{
  try {
    const result = analyze(req.body.csv);
    const stored = await contract.receipts(result.datasetHash);
    res.json({datasetHash:result.datasetHash,found:stored.timestamp>0n,reportMatches:stored.timestamp>0n && stored.reportHash===result.reportHash});
  }catch(e){res.status(400).json({error:e.message});}
});
if(existsSync(path.join(root,'dist/index.html'))){app.use(express.static(path.join(root,'dist')));app.get('/{*path}',(req,res)=>res.sendFile(path.join(root,'dist/index.html')));}
else {const {createServer}=await import('vite');const vite=await createServer({server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);}
app.use((err,req,res,next)=>res.status(400).json({error:'Request could not be processed. Check the file size and JSON format.'}));
app.listen(4173,'127.0.0.1',()=>console.log('TraceClimate ready at http://127.0.0.1:4173 — ephemeral local Ethereum chain'));
