// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }
  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((user) => user.id === id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = User.getById(id)

    if (user) {
      User.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

class Product {
  static #list = [
    {
      id: 10001,
      name: 'Product 1',
      price: 100,
      description: 'some text',
      createDate: new Date(),
    },
    {
      id: 10002,
      name: 'Product 2',
      price: 200,
      description:
        'some text some textsome textsome textsome textsome textsome textsome textsome text',
      createDate: new Date(),
    },
    {
      id: 10003,
      name: 'Product 3',
      price: 300,
      description: 'some text',
      createDate: new Date(),
    },
  ]
  id = Product.getId()

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.createDate = new Date()
  }

  static getId = () => {
    let res = ''
    for (let i = 0; i < 5; i++) {
      res += Math.round(Math.random() * 9)
    }
    return Number(res)
  }

  static getList = () => {
    return this.#list
  }

  static addProduct = (product) => {
    this.#list.push(product)
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = Product.getById(Number(id))

    if (product) {
      Product.update(product, data)
      return true
    } else {
      return false
    }
  }
  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }
}
// ================================================================
router.get('/', function (req, res) {
  res.render('index', {
    style: 'index',
  })
})
// ========================USER====================================
router.get('/user', function (req, res) {
  const list = User.getList()

  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================
router.post('/user-create', function (req, res) {
  // console.log(req.body)
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('user-success-info', {
    style: 'user-success-info',
    info: `Користувач створений`,
  })
})

// ================================================================
router.get('/user-delete', function (req, res) {
  // console.log(req.body)
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('user-success-info', {
    style: 'user-success-info',
    info: `Користувач видалений`,
  })
})

// ================================================================
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body
  let result = false
  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('user-success-info', {
    style: 'user-success-info',
    info: result
      ? `Дані користувача змінено`
      : `Помилка обробки данних`,
  })
})
// ========================PRODUCT=================================
router.get('/product', function (req, res) {
  res.render('product', {
    style: 'product',
  })
})

router.post('/product-created', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.addProduct(product)

  // console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішне виконання дії',
      info: 'Товар успішно доданий',
      link: '/product-list',
    },
  })
})

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

router.get('/product-list', function (req, res) {
  const list = Product.getList()
  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))
  console.log(product)
  res.render('product-edit', {
    style: 'product-edit',
    product,
  })
})
router.post('/product-edited', function (req, res) {
  const { name, price, id, description } = req.body

  let res1 = false
  let res2 = false
  if (
    Product.updateById(id, {
      name,
      price,
      description,
    })
  ) {
    res2 = true
    res1 = true
  }
  res.render('alert', {
    style: 'alert',

    data: {
      message: res1
        ? `Успішне виконання дії`
        : `Помилка обробки`,
      info: res2
        ? 'Товар успішно видалений'
        : 'Товар відсутній в системі',
      link: '/product-list',
    },
  })
})

router.post('/product-delete', function (req, res) {
  const { id } = req.body
  let res1 = false
  let res2 = false
  if (Product.deleteById(Number(id))) {
    res2 = true
    res1 = true
  }
  res.render('alert', {
    style: 'alert',
    data: {
      message: res1
        ? `Успішне виконання дії`
        : `Помилка обробки`,
      info: res2
        ? 'Товар успішно видалений'
        : 'Товар відсутній в системі',
      link: '/product-list',
    },
  })
})

router.get('/alert', function (req, res) {
  res.render('alert', {
    style: 'alert',
  })
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
