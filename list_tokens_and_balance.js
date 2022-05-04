const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const splTokenRegistry = require('@solana/spl-token-registry');

(async () => {
  const list = new splTokenRegistry.TokenListProvider().resolve().then((tokens) => {
    const tokenList = tokens.filterByClusterSlug('devnet').getList();
    //console.log(tokenList);
  });

  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );

  var keypair = web3.Keypair.generate();

  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new web3.PublicKey('4gvfWihbkmoFib26HLLFjAswL2TRTBBbFHPfdGFFrBq8'),
    {
      programId: splToken.TOKEN_PROGRAM_ID 
    }
  )
  tokenAccounts.value.forEach((e) => {
    const accountInfo = splToken.AccountLayout.decode(e.account.data)
    console.log(`${new web3.PublicKey(accountInfo.mint)}   ${accountInfo.amount}`);
  })

})();
