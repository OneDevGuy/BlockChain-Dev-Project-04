# Blockhain Notary Service
The project has been developed using [Node.js](https://nodejs.org/en/) and the [Express.js](https://expressjs.com/) framwork for the API endpoints.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the [Node.js web site](https://nodejs.org/en/).

### Setup

After you have Node and NPM installed you can clone this repo and simply run  
```
npm install
```
To start the server
```
node index.js
```

### Usage

### Wallet Address Validation  
Retuns a message to sign with your address.
```
POST http://localhost:8000/requestValidation

curl -X POST \
  http://localhost:8000/requestValidation \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "address":"1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6"
}'
```
Response.
```
{
    "address": "1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6",
    "message": "1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6:1543977423438:starRegistry",
    "requestTimeStamp": 1543977423438,
    "validationWindow": 300
}
```

### Message Signature Validation
Post your signed message to validate your address.
```
POST http://localhost:8000/message-signature/validate

curl -X POST \
  http://localhost:8000/message-signature/validate \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
"address":"1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6",
 "signature":"H8K4+1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
}'
```
Response  
```
{
    "registerStar": true,
    "status": {
        "address": "1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6",
        "message": "1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6:1543977423438:starRegistry",
        "requestTimeStamp": 1543977423438,
        "validationWindow": 268,
        "messageSignature": "valid"
    }
}
```

### Star Registration
Enter Star details to post to the blockchain.
```
POST http://localhost:8000/block

curl -X POST \
  http://localhost:8000/block \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
"address": "1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6",
	"star": {
		"dec": "-36, 24, 19.5",
		"ra": "12h 36m 4.0s",
		"story": "Test Star added to SimpleChain"
	}
}'
```
Response
```
{
    "hash": "41e5ceaf4d9b9727a3c8869be600673046df87ba5a86c766d74740ec5b8e2280",
    "height": 1,
    "body": {
        "address": "1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6",
        "star": {
            "dec": "-36, 24, 19.5",
            "ra": "12h 36m 4.0s",
            "story": "54657374205374617220616464656420746f2053696d706c65436861696e",
            "storyDecoded": "Test Star added to SimpleChain"
        }
    },
    "time": "1543977681",
    "previousBlockHash": "945f89a628ae7d1b6e9347b4b6e0075b36ddb62b5be7b68700b2d53554e63ac9"
}
```
### Find Star in Registry
You can serach by block height, address, or block hash.
```
GET http://localhost:8000/block/:height

curl "http://localhost:8000/block/2"
```

```
GET http://localhost:8000/stars/address:address
curl "http://localhost:8000/stars/address:1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6"

```

```
GET http://localhost:8000/stars/hash:hash
curl "http://localhost:8000/stars/hash:41e5ceaf4d9b9727a3c8869be600673046df87ba5a86c766d74740ec5b8e2280"

```
Response from GET request.
```
{
    "hash": "41e5ceaf4d9b9727a3c8869be600673046df87ba5a86c766d74740ec5b8e2280",
    "height": 1,
    "body": {
        "address": "1KqjKws8qcgNuWciDC5FjubcjwoUKwPiH6",
        "star": {
            "dec": "-36, 24, 19.5",
            "ra": "12h 36m 4.0s",
            "story": "54657374205374617220616464656420746f2053696d706c65436861696e",
            "storyDecoded": "Test Star added to SimpleChain"
        }
    },
    "time": "1543977681",
    "previousBlockHash": "945f89a628ae7d1b6e9347b4b6e0075b36ddb62b5be7b68700b2d53554e63ac9"
}
```
