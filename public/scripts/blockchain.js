let SHA256 = require('crypto-js/sha256');
let NodeRSA = require('node-rsa');

class Transaction {
  constructor(sender, receiver, amount) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
  }

  get description() {
    return (
      'Q.' + this.amount + ' de ' + this.sender + ' para ' + this.receiver + '.'
    );
  }
}

class Block {
  constructor(number, transaction, previousHash, securityNumber) {
    this.number = number;
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.securityNumber = securityNumber;
    this.isMined = false;
  }

  mineBlock() {
    let nonceNumber = 0;

    while (!this.isMined) {
      let minedData = SHA256(
        this.number +
          nonceNumber.toString() +
          this.transaction.description +
          this.previousHash
      ).toString();

      if (
        minedData.slice(0, this.securityNumber) ==
        '0'.repeat(this.securityNumber)
      ) {
        this.isMined = true;
        this.nonce = nonceNumber.toLocaleString();
        this.hash = minedData;
      } else {
        nonceNumber += 1;
      }
    }
  }

  isBlockMined() {
    return this.isMined;
  }

  changeSecurityNumber(newSecurityNumber) {
    this.securityNumber = newSecurityNumber;
    this.isMined = false;
  }
}

class Blockchain {
  constructor(sender, receiver, amount, securityNumber) {
    let firstTransaction = new Transaction(sender, receiver, amount);
    let genesisBlock = new Block(
      1,
      firstTransaction,
      '0'.repeat(64),
      securityNumber
    );
    // genesisBlock.mineBlock();

    this.blockList = [genesisBlock];
    this.length = 1;
    this.securityNumber = securityNumber;
  }

  addBlock(sender, receiver, amount) {
    let newTransaction = new Transaction(sender, receiver, amount);
    let newBlock = new Block(
      this.length + 1,
      newTransaction,
      this.blockList[this.length - 1].hash,
      this.securityNumber
    );
    // newBlock.mineBlock();

    this.length += 1;
    this.blockList.push(newBlock);
  }

  remineBlocks() {
    for (let i = 0; i < this.blockList.length; i++) {
      this.blockList[i].changeSecurityNumber(this.securityNumber);
      this.blockList[i].mineBlock();

      if (i != 0) {
        this.blockList[i].previousHash = this.blockList[i - 1].hash;
      }
    }
  }

  changeSecurityNumber(newSecurityNumber) {
    this.securityNumber = newSecurityNumber;
    this.remineBlocks();
  }

  get description() {
    let data = '';
    console.log('Number of blocks: ' + this.blockList.length);

    for (let i = 0; i < this.blockList.length; i++) {
      data +=
        'Block number: ' +
        this.blockList[i].number +
        '\n' +
        'Transaction: ' +
        this.blockList[i].transaction.description +
        '\n' +
        'Nonce: ' +
        this.blockList[i].nonce +
        '\n' +
        'Hash: ' +
        this.blockList[i].hash +
        '\n' +
        'Previous hash: ' +
        this.blockList[i].previousHash +
        '\n';

      if (i !== this.blockList.length - 1) {
        data += '\n';
      }
    }

    return data;
  }
}

let names = [
  'Alejandro',
  'Daniel',
  'Hernán',
  'Luis',
  'Raúl',
  'Enrique',
  'Lucía',
  'Ricardo',
  'María',
  'Mauricio',
  'Paula',
  'Laura',
  'Andrea',
  'Ana',
  'Claudia',
  'David',
  'Pablo',
  'Adrián',
  'Javier',
  'Álvaro',
  'Diego',
  'Carla',
  'Cristina',
  'Iván',
  'Carolina',
];

let amount = document.getElementById('amount');
let sender = document.getElementById('sender');
let receiver = document.getElementById('receiver');
let addBlockButton = document.getElementById('add-trx-button');
let randomButton = document.getElementById('random-trx-button');
let undoButton = document.getElementById('undo-trx-button');
let blockchainSpace = document.getElementById('blockchain');

let blockchain;
let blockNumber = 0;
let securityNumber = 4;

assignRandomValues();

function assignRandomValues() {
  let firstNumber = Math.floor(Math.random() * names.length);
  let secondNumber = Math.floor(Math.random() * names.length);

  while (secondNumber == firstNumber) {
    secondNumber = Math.floor(Math.random() * names.length);
  }

  sender.value = names[firstNumber];
  receiver.value = names[secondNumber];
  amount.value =
    Math.floor(Math.random() * (100 * 100 - 1 * 100) + 1 * 100) / (1 * 100);
}

function canAddBlocks() {
  for (let i = 0; i < blockchain.blockList.length; i++) {
    if (!blockchain.blockList[i].isMined) {
      return false;
    }
  }

  return true;
}

function addBlockToBlockchain(sender, receiver, amount) {
  if (blockNumber == 0) {
    blockchain = new Blockchain(sender, receiver, amount, securityNumber);
  } else {
    blockchain.addBlock(sender, receiver, amount);
  }

  blockNumber += 1;

  let block = document.createElement('div');
  block.id = 'blockchain-block-' + blockNumber.toString();
  block.classList.add('blockchain-block');

  let blockData = document.createElement('div');
  blockData.id = 'block-data';

  let numberTag = document.createElement('p');
  numberTag.classList.add('text');
  numberTag.innerHTML = 'Bloque #';

  let separatorDiv1 = document.createElement('div');
  separatorDiv1.style.height = '5px';
  let separatorDiv2 = document.createElement('div');
  separatorDiv2.style.height = '5px';
  let separatorDiv3 = document.createElement('div');
  separatorDiv3.style.height = '5px';
  let separatorDiv4 = document.createElement('div');
  separatorDiv4.style.height = '5px';
  let separatorDiv5 = document.createElement('div');
  separatorDiv5.style.height = '5px';

  let sepDiv1 = document.createElement('div');
  sepDiv1.classList.add('separator');
  let sepDiv2 = document.createElement('div');
  sepDiv2.classList.add('separator');
  let sepDiv3 = document.createElement('div');
  sepDiv3.classList.add('separator');
  let sepDiv4 = document.createElement('div');
  sepDiv4.classList.add('separator');
  let sepDiv5 = document.createElement('div');
  sepDiv5.classList.add('separator');

  let blockNum = document.createElement('input');
  blockNum.classList.add('block-info');
  blockNum.type = 'text';
  blockNum.value = blockNumber;

  let nonceTag = document.createElement('p');
  nonceTag.classList.add('text');
  nonceTag.innerHTML = 'Nonce:';

  let nonceVal = document.createElement('input');
  nonceVal.classList.add('block-info');
  nonceVal.id = 'nonce-' + blockNumber.toString();
  nonceVal.type = 'text';

  let trxTag = document.createElement('p');
  trxTag.classList.add('text');
  trxTag.innerHTML = 'Transacción:';

  let trxVal = document.createElement('input');
  trxVal.classList.add('block-info');
  trxVal.type = 'text';
  trxVal.value = blockchain.blockList[blockNumber - 1].transaction.description;

  let hashTag = document.createElement('p');
  hashTag.classList.add('text');
  hashTag.innerHTML = 'Hash:';

  let hashVal = document.createElement('input');
  hashVal.classList.add('block-info');
  hashVal.id = 'hash-' + blockNumber.toString();
  hashVal.type = 'text';

  let prevHashTag = document.createElement('p');
  prevHashTag.classList.add('text');
  prevHashTag.innerHTML = 'Hash Anterior:';

  let prevHashVal = document.createElement('input');
  prevHashVal.classList.add('block-info');
  prevHashVal.type = 'text';
  prevHashVal.value = blockchain.blockList[blockNumber - 1].previousHash;

  let mineButton = document.createElement('button');
  mineButton.id = 'mine-button-' + blockNumber;
  mineButton.classList.add('mine-single-block');
  mineButton.innerHTML = 'Minar Bloque';

  mineButton.onclick = function () {
    this.classList.remove('mine-single-block');
    this.classList.add('loading-button');

    setTimeout(() => {
      let blockToMine = parseInt(
        this.id.toString()[this.id.toString().length - 1]
      );

      blockchain.blockList[blockToMine - 1].mineBlock();
      console.log(blockchain.description);

      document.getElementById('nonce-' + blockToMine).value =
        blockchain.blockList[blockToMine - 1].nonce;
      document.getElementById('hash-' + blockToMine).value =
        blockchain.blockList[blockToMine - 1].hash;

      if (canAddBlocks()) {
        addBlockButton.classList.remove('disabled');
        addBlockButton.classList.add('enabled');

        undoButton.classList.remove('disabled');
        undoButton.classList.add('enabled');

        document
          .getElementById('blockchain-block-' + blockToMine)
          .classList.add('block-mined');

        this.classList.remove('loading-button');
        this.classList.add('already-mined');
      }
    }, 0);
  };

  blockData.appendChild(numberTag);
  blockData.appendChild(separatorDiv1);
  blockData.appendChild(blockNum);
  blockData.appendChild(sepDiv1);
  blockData.appendChild(nonceTag);
  blockData.appendChild(separatorDiv2);
  blockData.appendChild(nonceVal);
  blockData.appendChild(sepDiv2);
  blockData.appendChild(trxTag);
  blockData.appendChild(separatorDiv3);
  blockData.appendChild(trxVal);
  blockData.appendChild(sepDiv3);
  blockData.appendChild(hashTag);
  blockData.appendChild(separatorDiv4);
  blockData.appendChild(hashVal);
  blockData.appendChild(sepDiv4);
  blockData.appendChild(prevHashTag);
  blockData.appendChild(separatorDiv5);
  blockData.appendChild(prevHashVal);
  blockData.appendChild(sepDiv5);
  blockData.appendChild(mineButton);

  block.appendChild(blockData);
  blockchainSpace.appendChild(block);

  // console.log(blockchain.description);
}

addBlockButton.onclick = function () {
  if (blockNumber == 0 || canAddBlocks()) {
    addBlockButton.classList.add('disabled');
    addBlockButton.classList.remove('enabled');

    addBlockToBlockchain(
      sender.value.toString(),
      receiver.value.toString(),
      parseFloat(amount.value.toString())
    );
  }

  addBlockButton.classList.remove('enabled');
  addBlockButton.classList.add('disabled');
  undoButton.classList.remove('enabled');
  undoButton.classList.add('disabled');
};

randomButton.onclick = assignRandomValues;

undoButton.onclick = function () {
  if (canAddBlocks()) {
    let sender = blockchain.blockList[blockNumber - 1].transaction.receiver;
    let receiver = blockchain.blockList[blockNumber - 1].transaction.sender;
    let amount = blockchain.blockList[blockNumber - 1].transaction.amount;

    addBlockToBlockchain(sender, receiver, amount);

    addBlockButton.classList.remove('enabled');
    addBlockButton.classList.add('disabled');
    undoButton.classList.remove('enabled');
    undoButton.classList.add('disabled');
  }
};
