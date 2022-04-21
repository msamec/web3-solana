const web3 = require('@solana/web3.js');
const bip39 = require('bip39');
const ed25519 = require('ed25519-hd-key')

const mnemonic = process.argv[2]
const seed = bip39.mnemonicToSeedSync(mnemonic)//.slice(0, 32)
const derivedSeed = ed25519.derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key
const keypair = web3.Keypair.fromSeed(derivedSeed)
console.log(keypair.publicKey.toString())

/*
* node mnemonic-to-keypair.js {mnemonic string}
*/
