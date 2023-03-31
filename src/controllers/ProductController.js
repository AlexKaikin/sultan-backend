import ProductModel from '../models/Product.js'

export const getAll = async (req, res) => {
  const q = req.query.q ? req.query.q : null
  const category = req.query.category ? req.query.category : null
  const subCategory = req.query.sub_category ? req.query.sub_category : null
  const maker = req.query.maker ? req.query.maker.split('_') : []
  const _sort = req.query._sort ? req.query._sort : null
  const priceFrom = req.query.price_gte ? req.query.price_gte : 1
  const priceTo = req.query.price_lte ? req.query.price_lte : 10000000
  const _order = req.query._order ? req.query._order : null
  const _limit = req.query._limit ? parseInt(req.query._limit) : 10
  const _page = req.query._page ? parseInt(req.query._page) : 1

  try {
    let productAll = null
    let productQuery = null

    if (q && category) {
      productAll = await ProductModel.find({
        title: new RegExp(q, 'i'),
        category: category,
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
      productQuery = await ProductModel.find({
        title: new RegExp(q, 'i'),
        category: category,
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
        .sort({ [_sort]: _order === 'desc' ? -1 : 1 })
        .limit(_limit)
        .skip(_limit * (_page - 1))
        .exec()
    } else if (category && subCategory && maker.length) {
      productAll = await ProductModel.find({
        $and: [
          { category: category },
          { subCategory: { $all: [subCategory] } },
          { maker: { $in: maker } },
        ],
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
      productQuery = await ProductModel.find({
        $and: [
          { category: category },
          { subCategory: { $all: [subCategory] } },
          { maker: { $in: maker } },
        ],
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
        .sort({ [_sort]: _order === 'desc' ? -1 : 1 })
        .limit(_limit)
        .skip(_limit * (_page - 1))
        .exec()
    } else if (category && maker.length) {
      productAll = await ProductModel.find({
        $and: [{ category: category }, { maker: { $in: maker } }],
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
      productQuery = await ProductModel.find({
        $and: [{ category: category }, { maker: { $in: maker } }],
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
        .sort({ [_sort]: _order === 'desc' ? -1 : 1 })
        .limit(_limit)
        .skip(_limit * (_page - 1))
        .exec()
    } else if (category && subCategory) {
      productAll = await ProductModel.find({
        $and: [
          { category: category },
          { subCategory: { $all: [subCategory] } },
        ],
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
      productQuery = await ProductModel.find({
        $and: [
          { category: category },
          { subCategory: { $all: [subCategory] } },
        ],
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
        .sort({ [_sort]: _order === 'desc' ? -1 : 1 })
        .limit(_limit)
        .skip(_limit * (_page - 1))
        .exec()
    } else if (category) {
      productAll = await ProductModel.find({
        category,
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
      productQuery = await ProductModel.find({
        category,
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
        .sort({ [_sort]: _order === 'desc' ? -1 : 1 })
        .limit(_limit)
        .skip(_limit * (_page - 1))
        .exec()
    } else if (q) {
      productAll = await ProductModel.find({
        title: new RegExp(q, 'i'),
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
      productQuery = await ProductModel.find({
        title: new RegExp(q, 'i'),
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
        .sort({ [_sort]: _order === 'desc' ? -1 : 1 })
        .limit(_limit)
        .skip(_limit * (_page - 1))
        .exec()
    } else {
      productAll = await ProductModel.find({
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
      productQuery = await ProductModel.find({
        quantity: { $gte: 1 },
        price: { $gte: priceFrom, $lte: priceTo },
      })
        .sort({ [_sort]: _order === 'desc' ? -1 : 1 })
        .limit(_limit)
        .skip(_limit * (_page - 1))
        .exec()
    }

    res.append('x-total-count', productAll.length)
    res.append('Access-Control-Expose-Headers', 'X-Total-Count')
    res.json(productQuery)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Не удалось получить товары' })
  }
}

export const getOne = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    ProductModel.findOneAndUpdate(
      { id: productId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' },
      (err, doc) => {
        if (err) {
          console.log(err)
          return res.status(500).json({ message: 'Не удалось получить товар' })
        }
        if (!doc) return res.status(404).json({ message: 'Товар не найден' })
        res.json(doc)
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Не удалось получить товар' })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new ProductModel({
      id: +new Date().getTime(),
      title: req.body.title,
      sizeType: req.body.sizeType,
      size: req.body.size,
      code: req.body.code,
      maker: req.body.maker,
      brand: req.body.brand,
      text: req.body.text,
      imgUrl: req.body.imgUrl,
      price: req.body.price,
      currency: req.body.currency,
      quantity: req.body.quantity,
      category: req.body.category,
      subCategory: req.body.subCategory,
      created: new Date().toLocaleString(),
      user: req.userId,
    })

    const product = await doc.save()
    res.json(product)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Не удалось создать товар' })
  }
}

export const update = async (req, res) => {
  try {
    //const productId = req.params.id
    await ProductModel.updateOne(
      { id: req.body.id },
      {
        title: req.body.title,
        sizeType: req.body.sizeType,
        size: req.body.size,
        code: req.body.code,
        maker: req.body.maker,
        brand: req.body.brand,
        text: req.body.text,
        imgUrl: req.body.imgUrl,
        price: req.body.price,
        currency: req.body.currency,
        quantity: req.body.quantity,
        category: req.body.category,
        subCategory: req.body.subCategory,
        updated: new Date().toLocaleString(),
        user: req.userId,
      }
    )
    res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Не удалось обновить товар' })
  }
}

export const remove = async (req, res) => {
  try {
    const productId = req.params.id
    ProductModel.findOneAndDelete({ id: productId }, (err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ message: 'Не удалось удалить товар' })
      }
      if (!doc) return res.status(404).json({ message: 'Товар не найден' })
      return res.json({ success: true })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Не удалось удалить товар' })
  }
}
