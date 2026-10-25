import ganache from 'ganache';
import solc from 'solc';
import { readFileSync } from 'node:fs';
import { BrowserProvider, ContractFactory } from 'ethers';

export async function createChain() {
  const transport = ganache.provider({logging:{quiet:true},chain:{chainId:1337},wallet:{totalAccounts:2}});
  const provider = new BrowserProvider(transport);
  const signer = await provider.getSigner();
  const input = {language:'Solidity',sources:{'EvidenceRegistry.sol':{content:readFileSync(new URL('../contracts/EvidenceRegistry.sol',import.meta.url),'utf8')}},settings:{evmVersion:'shanghai',outputSelection:{'*':{'*':['abi','evm.bytecode']}}}};
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = output.errors?.filter(e=>e.severity==='error');
  if(errors?.length) throw new Error(errors.map(e=>e.formattedMessage).join('\n'));
  const artifact = output.contracts['EvidenceRegistry.sol'].EvidenceRegistry;
  const contract = await new ContractFactory(artifact.abi,artifact.evm.bytecode.object,signer).deploy();
  await contract.waitForDeployment();
  return {provider,contract,transport};
}
