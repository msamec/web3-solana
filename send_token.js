const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

(async () => {
  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );

   // Generate a new wallet keypair and airdrop SOL
    const fromWallet = web3.Keypair.generate();
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, web3.LAMPORTS_PER_SOL);

    // Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirdropSignature);

    // Generate a new wallet to receive newly minted token
    const toWallet = web3.Keypair.generate();
    console.log('to wallet address:', toWallet.publicKey.toString());

    // Create new token mint, we won't have to do this because we are not creating tokens
    // but needed to do this here for the purpose of example
    const mint = await splToken.createMint(connection, fromWallet, fromWallet.publicKey, null, 9);

    // Get the token account of the fromWallet address, and if it does not exist, create it
    // https://solana-labs.github.io/solana-program-library/token/js/modules.html#mintTo
    const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet, // who pays fee if associated token account does not exist
        mint, // public address of token
        fromWallet.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    // https://solana-labs.github.io/solana-program-library/token/js/modules.html#getOrCreateAssociatedTokenAccount
    const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection, 
    fromWallet, // who pays fee if associated token account does not exist
    mint, // public address of token
    toWallet.publicKey);

    // Mint 1 new token to the "fromTokenAccount" account we just created
    // https://solana-labs.github.io/solana-program-library/token/js/modules.html#mintTo
    let signature = await splToken.mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1000000000,
        []
    );
    console.log('mint tx:', signature);

    // Transfer the new token to the "toTokenAccount" we just created
    // https://solana-labs.github.io/solana-program-library/token/js/modules.html#transfer
    signature = await splToken.transfer(
        connection,
        fromWallet, // who pays fees
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey, // owner of source account
        1000000000, // amount
        []
    );
    console.log('transfer tx:', signature);})();
