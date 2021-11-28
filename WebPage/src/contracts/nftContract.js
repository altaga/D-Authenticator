exports.content = () =>{ return `

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract MyToken is ERC721URIStorage {
    
    address public owner;
    address public actualAddress;
    uint256 public price;
    uint256 public actualBid;
    string public tokenURI;
    bool public flag = false;
    
    // Product Checker 
    address constant public nftRev = 0x50eECbDc306c3e756EFfb022f8E102Ae28294018;
    bool public revCheck = false;
    bool public cancelFlag = false;
    
    modifier onlyOwner{
        require(msg.sender == owner);
        _; // Close Modifier
    }
    
    modifier onlyRev{
        require(msg.sender == nftRev);
        _; // Close Modifier
    }
    
    constructor() ERC721('NFT', 'MyNFT') {
        owner = msg.sender;
    }
    
    function mintNFT(string memory _tokenURI, uint256 _price) public onlyOwner returns (uint256)
    {
        tokenURI = _tokenURI;
        _mint(owner, 1);
        _setTokenURI(1, tokenURI);
        price = _price;
        flag = true;
        return 1;
    }
    
    function bidUp() public payable {
        require(msg.value > actualBid);
        require(msg.value > price);
        require(flag == true);
        require (cancelFlag == false);
        require(revCheck == true);
        if(actualBid>0){
          payable(actualAddress).transfer(actualBid);  
        }
        actualAddress = msg.sender;
        actualBid = msg.value;
        price = msg.value;
    }
    
    function changePrice(uint256 _price) public onlyOwner {
        require(0 == actualBid);
        price = _price;
    }
    
    function revactivate() public onlyRev{
        revCheck = true;
    }
    
    function activate() public onlyOwner{
        flag = true;
    }
    
    function cancelWbid() public onlyRev payable{
        payable(actualAddress).transfer(actualBid);
        cancelFlag = true;
        flag = false;
    }
    
    function cancelWObid() public onlyRev payable{
        require(actualBid == 0);
        cancelFlag = true;
        flag = false;
    }
    
    function finish() public onlyOwner payable {
        require (cancelFlag == false);
        _transfer(owner, actualAddress, 1);
        actualBid = 0;
        flag = false;
        payable(nftRev).transfer(address(this).balance/50); // Commition
        payable(owner).transfer(address(this).balance); // send MATIC to the seller
        owner = actualAddress;
    }
}
`}

exports.abi = () => {
    return [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "activate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "actualAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "actualBid",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "bidUp",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "cancelFlag",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "cancelWObid",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "cancelWbid",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "changePrice",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "finish",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "flag",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_tokenURI",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "mintNFT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "nftRev",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "price",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "revCheck",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "revactivate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "_data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
  };
  
  exports.bytecode = () => {
    return("60806040526000600c60006101000a81548160ff0219169083151502179055506000600c60016101000a81548160ff0219169083151502179055506000600c60026101000a81548160ff0219169083151502179055503480156200006257600080fd5b506040518060400160405280600381526020017f4e465400000000000000000000000000000000000000000000000000000000008152506040518060400160405280600581526020017f4d794e46540000000000000000000000000000000000000000000000000000008152508160009080519060200190620000e79291906200014a565b508060019080519060200190620001009291906200014a565b50505033600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506200025f565b8280546200015890620001fa565b90600052602060002090601f0160209004810192826200017c5760008555620001c8565b82601f106200019757805160ff1916838001178555620001c8565b82800160010185558215620001c8579182015b82811115620001c7578251825591602001919060010190620001aa565b5b509050620001d79190620001db565b5090565b5b80821115620001f6576000816000905550600101620001dc565b5090565b600060028204905060018216806200021357607f821691505b602082108114156200022a576200022962000230565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6137b6806200026f6000396000f3fe6080604052600436106101cc5760003560e01c80635afa3a72116100f7578063a035b1fe11610095578063bc8e9e1611610064578063bc8e9e1614610613578063c87b56dd1461061d578063d56b28891461065a578063e985e9c514610664576101cc565b8063a035b1fe1461056d578063a22cb46514610598578063a2b40d19146105c1578063b88d4fde146105ea576101cc565b8063890eba68116100d1578063890eba68146104c15780638da5cb5b146104ec57806395d89b411461051757806396af085c14610542576101cc565b80635afa3a721461040a5780636352211e1461044757806370a0823114610484576101cc565b80630f957acb1161016f57806342842e0e1161013e57806342842e0e146103a2578063449107b6146103cb578063449f4ac5146103f657806351c4b35814610400576101cc565b80630f957acb1461030c57806323b872dd146103375780632c6a80a1146103605780633c130d9014610377576101cc565b806307a8759e116101ab57806307a8759e14610264578063081812fc1461028f578063095ea7b3146102cc5780630f15f4c0146102f5576101cc565b8062b2e78a146101d157806301ffc9a7146101fc57806306fdde0314610239575b600080fd5b3480156101dd57600080fd5b506101e66106a1565b6040516101f39190612bbf565b60405180910390f35b34801561020857600080fd5b50610223600480360381019061021e91906127b8565b6106b9565b6040516102309190612c26565b60405180910390f35b34801561024557600080fd5b5061024e61079b565b60405161025b9190612c41565b60405180910390f35b34801561027057600080fd5b5061027961082d565b6040516102869190612c26565b60405180910390f35b34801561029b57600080fd5b506102b660048036038101906102b1919061286e565b610840565b6040516102c39190612bbf565b60405180910390f35b3480156102d857600080fd5b506102f360048036038101906102ee9190612778565b6108c5565b005b34801561030157600080fd5b5061030a6109dd565b005b34801561031857600080fd5b50610321610a54565b60405161032e9190612c26565b60405180910390f35b34801561034357600080fd5b5061035e60048036038101906103599190612662565b610a67565b005b34801561036c57600080fd5b50610375610ac7565b005b34801561038357600080fd5b5061038c610b30565b6040516103999190612c41565b60405180910390f35b3480156103ae57600080fd5b506103c960048036038101906103c49190612662565b610bbe565b005b3480156103d757600080fd5b506103e0610bde565b6040516103ed9190612bbf565b60405180910390f35b6103fe610c04565b005b610408610c97565b005b34801561041657600080fd5b50610431600480360381019061042c9190612812565b610d86565b60405161043e9190612e63565b60405180910390f35b34801561045357600080fd5b5061046e6004803603810190610469919061286e565b610ee7565b60405161047b9190612bbf565b60405180910390f35b34801561049057600080fd5b506104ab60048036038101906104a691906125f5565b610f99565b6040516104b89190612e63565b60405180910390f35b3480156104cd57600080fd5b506104d6611051565b6040516104e39190612c26565b60405180910390f35b3480156104f857600080fd5b50610501611064565b60405161050e9190612bbf565b60405180910390f35b34801561052357600080fd5b5061052c61108a565b6040516105399190612c41565b60405180910390f35b34801561054e57600080fd5b5061055761111c565b6040516105649190612e63565b60405180910390f35b34801561057957600080fd5b50610582611122565b60405161058f9190612e63565b60405180910390f35b3480156105a457600080fd5b506105bf60048036038101906105ba9190612738565b611128565b005b3480156105cd57600080fd5b506105e860048036038101906105e3919061286e565b61113e565b005b3480156105f657600080fd5b50610611600480360381019061060c91906126b5565b6111b1565b005b61061b611213565b005b34801561062957600080fd5b50610644600480360381019061063f919061286e565b611357565b6040516106519190612c41565b60405180910390f35b6106626114a9565b005b34801561067057600080fd5b5061068b60048036038101906106869190612622565b6116cb565b6040516106989190612c26565b60405180910390f35b7350eecbdc306c3e756effb022f8e102ae2829401881565b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061078457507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061079457506107938261175f565b5b9050919050565b6060600080546107aa906130b9565b80601f01602080910402602001604051908101604052809291908181526020018280546107d6906130b9565b80156108235780601f106107f857610100808354040283529160200191610823565b820191906000526020600020905b81548152906001019060200180831161080657829003601f168201915b5050505050905090565b600c60019054906101000a900460ff1681565b600061084b826117c9565b61088a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161088190612dc3565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006108d082610ee7565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610941576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161093890612e23565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610960611835565b73ffffffffffffffffffffffffffffffffffffffff16148061098f575061098e81610989611835565b6116cb565b5b6109ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109c590612d03565b60405180910390fd5b6109d8838361183d565b505050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a3757600080fd5b6001600c60006101000a81548160ff021916908315150217905550565b600c60029054906101000a900460ff1681565b610a78610a72611835565b826118f6565b610ab7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aae90612e43565b60405180910390fd5b610ac28383836119d4565b505050565b7350eecbdc306c3e756effb022f8e102ae2829401873ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b1357600080fd5b6001600c60016101000a81548160ff021916908315150217905550565b600b8054610b3d906130b9565b80601f0160208091040260200160405190810160405280929190818152602001828054610b69906130b9565b8015610bb65780601f10610b8b57610100808354040283529160200191610bb6565b820191906000526020600020905b815481529060010190602001808311610b9957829003601f168201915b505050505081565b610bd9838383604051806020016040528060008152506111b1565b505050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b7350eecbdc306c3e756effb022f8e102ae2829401873ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c5057600080fd5b6000600a5414610c5f57600080fd5b6001600c60026101000a81548160ff0219169083151502179055506000600c60006101000a81548160ff021916908315150217905550565b7350eecbdc306c3e756effb022f8e102ae2829401873ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610ce357600080fd5b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600a549081150290604051600060405180830381858888f19350505050158015610d4d573d6000803e3d6000fd5b506001600c60026101000a81548160ff0219169083151502179055506000600c60006101000a81548160ff021916908315150217905550565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610de257600080fd5b82600b9080519060200190610df8929190612409565b50610e26600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001611c30565b610ebb6001600b8054610e38906130b9565b80601f0160208091040260200160405190810160405280929190818152602001828054610e64906130b9565b8015610eb15780601f10610e8657610100808354040283529160200191610eb1565b820191906000526020600020905b815481529060010190602001808311610e9457829003601f168201915b5050505050611dfe565b816009819055506001600c60006101000a81548160ff0219169083151502179055506001905092915050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610f90576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8790612d43565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561100a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161100190612d23565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600c60009054906101000a900460ff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606060018054611099906130b9565b80601f01602080910402602001604051908101604052809291908181526020018280546110c5906130b9565b80156111125780601f106110e757610100808354040283529160200191611112565b820191906000526020600020905b8154815290600101906020018083116110f557829003601f168201915b5050505050905090565b600a5481565b60095481565b61113a611133611835565b8383611e72565b5050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461119857600080fd5b600a546000146111a757600080fd5b8060098190555050565b6111c26111bc611835565b836118f6565b611201576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111f890612e43565b60405180910390fd5b61120d84848484611fdf565b50505050565b600a54341161122157600080fd5b600954341161122f57600080fd5b60011515600c60009054906101000a900460ff1615151461124f57600080fd5b60001515600c60029054906101000a900460ff1615151461126f57600080fd5b60011515600c60019054906101000a900460ff1615151461128f57600080fd5b6000600a54111561130657600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600a549081150290604051600060405180830381858888f19350505050158015611304573d6000803e3d6000fd5b505b33600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034600a8190555034600981905550565b6060611362826117c9565b6113a1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161139890612da3565b60405180910390fd5b60006006600084815260200190815260200160002080546113c1906130b9565b80601f01602080910402602001604051908101604052809291908181526020018280546113ed906130b9565b801561143a5780601f1061140f5761010080835404028352916020019161143a565b820191906000526020600020905b81548152906001019060200180831161141d57829003601f168201915b50505050509050600061144b61203b565b90506000815114156114615781925050506114a4565b60008251111561149657808260405160200161147e929190612b9b565b604051602081830303815290604052925050506114a4565b61149f84612052565b925050505b919050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461150357600080fd5b60001515600c60029054906101000a900460ff1615151461152357600080fd5b611573600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660016119d4565b6000600a819055506000600c60006101000a81548160ff0219169083151502179055507350eecbdc306c3e756effb022f8e102ae2829401873ffffffffffffffffffffffffffffffffffffffff166108fc6032476115d19190612f9e565b9081150290604051600060405180830381858888f193505050501580156115fc573d6000803e3d6000fd5b50600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f19350505050158015611665573d6000803e3d6000fd5b50600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff166118b083610ee7565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000611901826117c9565b611940576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161193790612ce3565b60405180910390fd5b600061194b83610ee7565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806119ba57508373ffffffffffffffffffffffffffffffffffffffff166119a284610840565b73ffffffffffffffffffffffffffffffffffffffff16145b806119cb57506119ca81856116cb565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff166119f482610ee7565b73ffffffffffffffffffffffffffffffffffffffff1614611a4a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a4190612de3565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611aba576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ab190612ca3565b60405180910390fd5b611ac58383836120f9565b611ad060008261183d565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b209190612fcf565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b779190612f48565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611ca0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c9790612d83565b60405180910390fd5b611ca9816117c9565b15611ce9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ce090612c83565b60405180910390fd5b611cf5600083836120f9565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611d459190612f48565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050565b611e07826117c9565b611e46576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e3d90612d63565b60405180910390fd5b80600660008481526020019081526020016000209080519060200190611e6d929190612409565b505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611ee1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ed890612cc3565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611fd29190612c26565b60405180910390a3505050565b611fea8484846119d4565b611ff6848484846120fe565b612035576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161202c90612c63565b60405180910390fd5b50505050565b606060405180602001604052806000815250905090565b606061205d826117c9565b61209c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161209390612e03565b60405180910390fd5b60006120a661203b565b905060008151116120c657604051806020016040528060008152506120f1565b806120d084612295565b6040516020016120e1929190612b9b565b6040516020818303038152906040525b915050919050565b505050565b600061211f8473ffffffffffffffffffffffffffffffffffffffff166123f6565b15612288578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02612148611835565b8786866040518563ffffffff1660e01b815260040161216a9493929190612bda565b602060405180830381600087803b15801561218457600080fd5b505af19250505080156121b557506040513d601f19601f820116820180604052508101906121b291906127e5565b60015b612238573d80600081146121e5576040519150601f19603f3d011682016040523d82523d6000602084013e6121ea565b606091505b50600081511415612230576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161222790612c63565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161491505061228d565b600190505b949350505050565b606060008214156122dd576040518060400160405280600181526020017f300000000000000000000000000000000000000000000000000000000000000081525090506123f1565b600082905060005b6000821461230f5780806122f89061311c565b915050600a826123089190612f9e565b91506122e5565b60008167ffffffffffffffff81111561232b5761232a613252565b5b6040519080825280601f01601f19166020018201604052801561235d5781602001600182028036833780820191505090505b5090505b600085146123ea576001826123769190612fcf565b9150600a856123859190613165565b60306123919190612f48565b60f81b8183815181106123a7576123a6613223565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a856123e39190612f9e565b9450612361565b8093505050505b919050565b600080823b905060008111915050919050565b828054612415906130b9565b90600052602060002090601f016020900481019282612437576000855561247e565b82601f1061245057805160ff191683800117855561247e565b8280016001018555821561247e579182015b8281111561247d578251825591602001919060010190612462565b5b50905061248b919061248f565b5090565b5b808211156124a8576000816000905550600101612490565b5090565b60006124bf6124ba84612ea3565b612e7e565b9050828152602081018484840111156124db576124da613286565b5b6124e6848285613077565b509392505050565b60006125016124fc84612ed4565b612e7e565b90508281526020810184848401111561251d5761251c613286565b5b612528848285613077565b509392505050565b60008135905061253f81613724565b92915050565b6000813590506125548161373b565b92915050565b60008135905061256981613752565b92915050565b60008151905061257e81613752565b92915050565b600082601f83011261259957612598613281565b5b81356125a98482602086016124ac565b91505092915050565b600082601f8301126125c7576125c6613281565b5b81356125d78482602086016124ee565b91505092915050565b6000813590506125ef81613769565b92915050565b60006020828403121561260b5761260a613290565b5b600061261984828501612530565b91505092915050565b6000806040838503121561263957612638613290565b5b600061264785828601612530565b925050602061265885828601612530565b9150509250929050565b60008060006060848603121561267b5761267a613290565b5b600061268986828701612530565b935050602061269a86828701612530565b92505060406126ab868287016125e0565b9150509250925092565b600080600080608085870312156126cf576126ce613290565b5b60006126dd87828801612530565b94505060206126ee87828801612530565b93505060406126ff878288016125e0565b925050606085013567ffffffffffffffff8111156127205761271f61328b565b5b61272c87828801612584565b91505092959194509250565b6000806040838503121561274f5761274e613290565b5b600061275d85828601612530565b925050602061276e85828601612545565b9150509250929050565b6000806040838503121561278f5761278e613290565b5b600061279d85828601612530565b92505060206127ae858286016125e0565b9150509250929050565b6000602082840312156127ce576127cd613290565b5b60006127dc8482850161255a565b91505092915050565b6000602082840312156127fb576127fa613290565b5b60006128098482850161256f565b91505092915050565b6000806040838503121561282957612828613290565b5b600083013567ffffffffffffffff8111156128475761284661328b565b5b612853858286016125b2565b9250506020612864858286016125e0565b9150509250929050565b60006020828403121561288457612883613290565b5b6000612892848285016125e0565b91505092915050565b6128a481613003565b82525050565b6128b381613015565b82525050565b60006128c482612f05565b6128ce8185612f1b565b93506128de818560208601613086565b6128e781613295565b840191505092915050565b60006128fd82612f10565b6129078185612f2c565b9350612917818560208601613086565b61292081613295565b840191505092915050565b600061293682612f10565b6129408185612f3d565b9350612950818560208601613086565b80840191505092915050565b6000612969603283612f2c565b9150612974826132a6565b604082019050919050565b600061298c601c83612f2c565b9150612997826132f5565b602082019050919050565b60006129af602483612f2c565b91506129ba8261331e565b604082019050919050565b60006129d2601983612f2c565b91506129dd8261336d565b602082019050919050565b60006129f5602c83612f2c565b9150612a0082613396565b604082019050919050565b6000612a18603883612f2c565b9150612a23826133e5565b604082019050919050565b6000612a3b602a83612f2c565b9150612a4682613434565b604082019050919050565b6000612a5e602983612f2c565b9150612a6982613483565b604082019050919050565b6000612a81602e83612f2c565b9150612a8c826134d2565b604082019050919050565b6000612aa4602083612f2c565b9150612aaf82613521565b602082019050919050565b6000612ac7603183612f2c565b9150612ad28261354a565b604082019050919050565b6000612aea602c83612f2c565b9150612af582613599565b604082019050919050565b6000612b0d602983612f2c565b9150612b18826135e8565b604082019050919050565b6000612b30602f83612f2c565b9150612b3b82613637565b604082019050919050565b6000612b53602183612f2c565b9150612b5e82613686565b604082019050919050565b6000612b76603183612f2c565b9150612b81826136d5565b604082019050919050565b612b958161306d565b82525050565b6000612ba7828561292b565b9150612bb3828461292b565b91508190509392505050565b6000602082019050612bd4600083018461289b565b92915050565b6000608082019050612bef600083018761289b565b612bfc602083018661289b565b612c096040830185612b8c565b8181036060830152612c1b81846128b9565b905095945050505050565b6000602082019050612c3b60008301846128aa565b92915050565b60006020820190508181036000830152612c5b81846128f2565b905092915050565b60006020820190508181036000830152612c7c8161295c565b9050919050565b60006020820190508181036000830152612c9c8161297f565b9050919050565b60006020820190508181036000830152612cbc816129a2565b9050919050565b60006020820190508181036000830152612cdc816129c5565b9050919050565b60006020820190508181036000830152612cfc816129e8565b9050919050565b60006020820190508181036000830152612d1c81612a0b565b9050919050565b60006020820190508181036000830152612d3c81612a2e565b9050919050565b60006020820190508181036000830152612d5c81612a51565b9050919050565b60006020820190508181036000830152612d7c81612a74565b9050919050565b60006020820190508181036000830152612d9c81612a97565b9050919050565b60006020820190508181036000830152612dbc81612aba565b9050919050565b60006020820190508181036000830152612ddc81612add565b9050919050565b60006020820190508181036000830152612dfc81612b00565b9050919050565b60006020820190508181036000830152612e1c81612b23565b9050919050565b60006020820190508181036000830152612e3c81612b46565b9050919050565b60006020820190508181036000830152612e5c81612b69565b9050919050565b6000602082019050612e786000830184612b8c565b92915050565b6000612e88612e99565b9050612e9482826130eb565b919050565b6000604051905090565b600067ffffffffffffffff821115612ebe57612ebd613252565b5b612ec782613295565b9050602081019050919050565b600067ffffffffffffffff821115612eef57612eee613252565b5b612ef882613295565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000612f538261306d565b9150612f5e8361306d565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612f9357612f92613196565b5b828201905092915050565b6000612fa98261306d565b9150612fb48361306d565b925082612fc457612fc36131c5565b5b828204905092915050565b6000612fda8261306d565b9150612fe58361306d565b925082821015612ff857612ff7613196565b5b828203905092915050565b600061300e8261304d565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b838110156130a4578082015181840152602081019050613089565b838111156130b3576000848401525b50505050565b600060028204905060018216806130d157607f821691505b602082108114156130e5576130e46131f4565b5b50919050565b6130f482613295565b810181811067ffffffffffffffff8211171561311357613112613252565b5b80604052505050565b60006131278261306d565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561315a57613159613196565b5b600182019050919050565b60006131708261306d565b915061317b8361306d565b92508261318b5761318a6131c5565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000602082015250565b7f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008201527f726f206164647265737300000000000000000000000000000000000000000000602082015250565b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f45524337323155524953746f726167653a2055524920717565727920666f722060008201527f6e6f6e6578697374656e7420746f6b656e000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960008201527f73206e6f74206f776e0000000000000000000000000000000000000000000000602082015250565b7f4552433732314d657461646174613a2055524920717565727920666f72206e6f60008201527f6e6578697374656e7420746f6b656e0000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008201527f776e6572206e6f7220617070726f766564000000000000000000000000000000602082015250565b61372d81613003565b811461373857600080fd5b50565b61374481613015565b811461374f57600080fd5b50565b61375b81613021565b811461376657600080fd5b50565b6137728161306d565b811461377d57600080fd5b5056fea2646970667358221220d363cf2b82b810b06a6e794871833cefc3d76ede3f09a05ac76eb01525cb2fe264736f6c63430008070033")
  }