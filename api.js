const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}


/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  //if (!product) {
  //  return next()
  //}
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.json(product)
}

/**
 * Create a product
 * @param {object} req 
 * @param {object} res 
 */
async function createProduct(req, res) {
  const product = await Products.create(req.body)
  res.json(product)
}

async function editProduct (req, res, next) {
  const change = req.body

  const product = await Products.edit(req.params.id, change)

  res.json(product)
}

async function deleteProduct (req, res, next) {
  const response = await Products.destroy(req.params.id)

  res.json(response)
}

async function createOrder (req, res, next) {
  const order = await Orders.create(req.body)

  res.json(order)
}

async function listOrders (req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const orders = await Orders.list({ 
    offset: Number(offset), 
    limit: Number(limit),
    productId, 
    status 
  })

  res.json(orders)
}

/**
 * Edit an existing order
 * @param {object} req
 * @param {object} res
 */
async function editOrder(req, res, next) {
  const change = req.body;
  const { id } = req.params;

  try {
    const updatedOrder = await Orders.edit(id, change);
    res.json(updatedOrder);
  } catch (err) {
    next(err); // Pass to error handler if order not found
  }
}

/**
 * Delete an order
 * @param {object} req
 * @param {object} res
 */
async function deleteOrder(req, res, next) {
  const { id } = req.params;

  try {
    await Orders.destroy(id);
    res.status(204).send(); // No content response for successful deletion
  } catch (err) {
    next(err); // Pass to error handler if order not found
  }
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  listOrders,
  createOrder,
  editOrder,
  deleteOrder
});
