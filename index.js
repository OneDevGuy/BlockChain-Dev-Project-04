const express = require('express')
const app = express()
const parser = require('body-parser')
const Block = require('./block')
const Blockchain = require('./simpleChain')
const blockchain = new Blockchain();
const ValidateStar = require('./validateStar')


validateAddressParameter = async (req, res, next) => {
  try {
    const validate = new ValidateStar(req)
    validate.validateAddressParameter()
    next()
  } catch (error) {
    res.status(400).json({
      "status": 400,
      "message": error.message
    })
  }
}

validateSignatureParameter = async (req, res, next) => {
  try {
    const validate = new ValidateStar(req)
    validate.validateSignatureParameter()
    next()
  } catch (error) {
    res.status(400).json({
      "status": 400,
      "message": error.message
    })
  }
}

validateNewStarRequest = async (req, res, next) => {
  try {
    const validate = new ValidateStar(req)
    validate.validateNewStarRequest()
    next()
  } catch (error) {
    res.status(400).json({
      "status": 400,
      "message": error.message
    })
  }
}


app.listen(8000, () => console.log('Simple Chain API listening on port 8000'))
app.use(parser.json())
app.get('/', (req, res) => res.status(404).json({
  "status": 404,
  "message": "Invalid endpoint. Available endpoints are POST /block or GET /block/{BLOCK_NUMBER}"
}))

/**
 * GET Block endpoint using URL path with block number parameter.
 * URL path http://localhost:8000/block/{BLOCK_NUMBER}
 */
app.get('/block/:height', async (req, res) => {
  try {
    const response = await blockchain.getBlock(req.params.height)
    res.send(response)
  } catch (error) {
    res.status(404).json({
      "status": 404,
      "message": "Block not found"
    })
  }
})

/**
 * POST Star registration Endpoint.
 * URL path http://localhost:8000/block
 */
app.post('/block', [validateNewStarRequest], async (req, res) => {
  const validate = new ValidateStar(req)

  try {
    const isValid = await validate.isValid()

    if (!isValid) {
      throw new Error('Signature is not valid')
    }
  } catch (error) {
    res.status(401).json({
      "status": 401,
      "message": error.message
    })

    return
  }

  const body = { address, star } = req.body
  const story = star.story

  body.star = {
    dec: star.dec,
    ra: star.ra,
    story: new Buffer(story).toString('hex'),
    mag: star.mag,
    con: star.con
  }

  await blockchain.addBlock(new Block(body))
  const height = await blockchain.getBlockHeight()
  const response = await blockchain.getBlock(height)

  validate.invalidate(address)

  res.status(201).send(response)
})


app.post('/requestValidation', [validateAddressParameter], async (req, res) => {
  const validate = new ValidateStar(req)
  const address = req.body.address

  try {
    data = await validate.getPendingAddressRequest(address)
  } catch (error) {
    data = await validate.saveNewRequestValidation(address)
  }

  res.json(data)
})


app.post('/message-signature/validate', [validateAddressParameter, validateSignatureParameter], async (req, res) => {
  const validate = new ValidateStar(req)

  try {
    const { address, signature } = req.body
    const response = await validate.validateMessageSignature(address, signature)

    if (response.registerStar) {
      res.json(response)
    } else {
      res.status(401).json(response)
    }
  } catch (error) {
    res.status(404).json({
      "status": 404,
      "message": error.message
    })
  }
})


 /**
  * GET Star endpoint using URL path with wallet address parameter.
  * URL path http://localhost:8000/star/address:<address>
  */
app.get('/stars/address:address', async (req, res) => {
  try {
    const address = req.params.address.slice(1)
    const response = await blockchain.getBlocksByAddress(address)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      "status": 404,
      "message": 'Block not found'
    })
  }
})

/**
 * GET Star endpoint using URL path with block hash parameter.
 * URL path http://localhost:8000/star/hash:<hash>
 */
app.get('/stars/hash:hash', async (req, res) => {
  try {
    const hash = req.params.hash.slice(1)
    const response = await blockchain.getBlockByHash(hash)

    res.send(response)
  } catch (error) {
    res.status(404).json({
      "status": 404,
      "message": 'Block not found'
    })
  }
})
