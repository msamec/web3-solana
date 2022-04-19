const bip39 = require('bip39');
const web3 = require('@solana/web3.js');

const generatedMnemonic = bip39.generateMnemonic()
const seed = bip39.mnemonicToSeedSync(generatedMnemonic).slice(0, 32)
const newAccount = web3.Keypair.fromSeed(seed)
console.log(newAccount.publicKey.toString())
