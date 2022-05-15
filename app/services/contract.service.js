const { ethers } = require('ethers');
const Transaction = require('../schemas/USDT-transaction');
const abi = require('../../abi/erc20abi');

exports.contractEventEmitter = async () => {
  const provider = await new ethers.providers.EtherscanProvider(
    process.env.NETWORK,
    process.env.ETHERSCAN_API_KEY_TOKEN
  );

  const contract = await new ethers.Contract(
    abi.contract_address,
    abi.ERC20_ABi,
    provider
  );

  contract.on('Transfer', async (from, to, value, event) => {
    const balance = await contract.balanceOf(abi.address);
    const transaction = {
      balance: ethers.utils.formatEther(balance),
      from,
      to,
      value: ethers.utils.formatEther(value),
      data: event,
      createdAt: Date.now(),
    };
    Transaction.find(
      { 'data.transactionHash': transaction.data.transactionHash },
      (err, docs) => {
        if (docs) {
          if (!docs.length) {
            Transaction.create(transaction);
          }
        }
      }
    );
  });
};
