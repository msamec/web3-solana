const web3 = require('@solana/web3.js');

(async () => {
  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );

  var fromWallet = web3.Keypair.generate();
  var toWallet = web3.Keypair.generate();
  console.log("From wallet balance: " + await connection.getBalance(fromWallet.publicKey));
  console.log("To wallet balance: " + await connection.getBalance(toWallet.publicKey));

  console.log("Airdroping sol to fromWallet...")
  fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(fromAirdropSignature);
  console.log("From wallet balance after airdrop: " + await connection.getBalance(fromWallet.publicKey));
  console.log("Sending sol from fromWallet to toWallet...")

  var transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toWallet.publicKey,
      kamports: web3.LAMPORTS_PER_SOL / 100,
    })
  );

  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  )
  console.log('SIGNATURE', signature)
  console.log("From wallet balance: " + await connection.getBalance(fromWallet.publicKey));
})();
