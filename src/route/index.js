// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// =========================USER=======================================
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

class User_product {
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
  id = User_product.getId()

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
    const product = User_product.getById(Number(id))

    if (product) {
      User_product.update(product, data)
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

  const product = new User_product(name, price, description)

  User_product.addProduct(product)

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
  const list = User_product.getList()
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
  const product = User_product.getById(Number(id))
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
    User_product.updateById(id, {
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
  if (User_product.deleteById(Number(id))) {
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
// =======================PURCHASE=========================================

// ================================================================
class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count //гнеруємо унікальний id
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    //прибираємо елемент з заданим id
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )
    //Рандомно сортуємо список
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    //залишаємо перші 3 елементи списку
    return shuffledList.splice(0, 3)
  }
}
class Purchase {
  static DELYVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = price * Purchase.#BONUS_FACTOR
    const currentBalance = Purchase.getBonusBalance(email)
    const updatedBalace = currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalace)
    console.log(email, updatedBalace)
    return amount
  }
  constructor(data, product) {
    this.id = ++Purchase.#count //гнеруємо унікальний id

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null
    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }

  static getList = () => {
    return Purchase.#list
      .reverse()
      .map(({ id, product, totalPrice, ...data }) => {
        const { title, ...arr } = product
        const bonus = this.calcBonusAmount(totalPrice)
        return { id, totalPrice, title, bonus }
      })
  }

  static getById = (id) => {
    return this.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname) {
        purchase.firstname = data.firstname
      }
      if (data.lastname) {
        purchase.lastname = data.lastname
      }
      if (data.phone) {
        purchase.phone = data.phone
      }
      if (data.email) {
        purchase.email = data.email
      }
      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER23', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

Product.add(
  'https://picsum.photos/id/1/200/300',
  `Комп'ютер Artline Gaming (X43v31)`,
  `AMD Ryzen 5 3600 / Gigabyte B450M S2H / 16ГБ DDR4  `,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)
Product.add(
  'https://picsum.photos/id/1/200/300',
  `Комп'ютер Artline Gaming (X43v31)`,
  `AMD Ryzen 5 3600 / Gigabyte B450M S2H / 16ГБ DDR4  `,
  [{ id: 2, text: 'Топ продажів' }],
  32000,
  10,
)
Product.add(
  'https://picsum.photos/id/1/200/300',
  `Комп'ютер Artline Gaming (X43v31)`,
  `AMD Ryzen 5 3600 / Gigabyte B450M S2H / 16ГБ DDR4  `,
  [{ id: 1, text: 'Готовий до відправки' }],
  25000,
  10,
)
Product.add(
  'https://picsum.photos/id/1/200/300',
  `Комп'ютер Artline Gaming (X43v31)`,
  `AMD Ryzen 1 3600 / Gigabyte B450M S2H / 16ГБ DDR4  `,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  11000,
  10,
)
Product.add(
  'https://picsum.photos/id/1/200/300',
  `Комп'ютер Artline Gaming (X43v31)`,
  `AMD Ryzen 5 3600 / Gigabyte B450M S2H / 16ГБ DDR4  `,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  44000,
  10,
)

Purchase.add(
  {
    totalPrice: 250,
    productPrice: 100,
    deliveryPrice: 150,
    amount: 1,
    firstname: 'Dmytro',
    lastname: 'Pustovyi',
    email: 'cswjcnhb@gmail.com',
    phone: '38254555',
  },
  Product.getById(2),
)
Purchase.add(
  {
    totalPrice: 950,
    productPrice: 100,
    deliveryPrice: 150,
    amount: 1,
    firstname: 'Dmytro',
    lastname: 'Pustovyi',
    email: 'cswjcnhb@gmail.com',
    phone: '38254555',
  },
  Product.getById(1),
)
Purchase.add(
  {
    totalPrice: 450,
    productPrice: 100,
    deliveryPrice: 150,
    amount: 1,
    firstname: 'Dmytro',
    lastname: 'Pustovyi',
    email: 'cswjcnhb@gmail.com',
    phone: '38254555',
  },
  Product.getById(3),
)

router.get('/purchase', function (req, res) {
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})
//=======================================================================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})
//=======================================================================
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка виконання дії',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)
  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка виконання дії',
        info: 'Товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message:
          'Помилка виконання дії || Кількість товару обмежена',
        info: `Наразі на складі залишилось ${product.amount} одиниць продукції`,
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELYVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',
    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount})шт`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELYVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELYVERY_PRICE,
      amount: amount,
      bonus,
    },
  })
})
//=======================================================================
// router.get('/purchase-create', function (req, res) {
//   res.render('purchase-create', {
//     // вказуємо назву папки контейнера, в якій знаходяться наші стилі
//     style: 'purchase-create',
//     data: {
//       cart: [
//         {
//           text: `шт`,
//           price: 1,
//         },
//         {
//           text: `Доставка`,
//           price: 1,
//         },
//       ],
//     },
//   })
// })
//=======================================================================
router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)
  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
    firstname,
    lastname,
    email,
    phone,
    promocode,
    bonus,
    comment,
  } = req.body
  const product = Product.getById(id)
  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })
  }
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)
  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (!firstname || !lastname || !phone || !email) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Заповніть обов`язкові поля',
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }
  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) {
    totalPrice = 0
  }

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      firstname,
      lastname,
      email,
      phone,
      promocode,
      bonus,
      comment,
    },
    product,
  )

  //=====
  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Товар створений',
      link: '/purchase-list',
    },
  })
})
//=======================================================================
router.get('/purchase-list', function (req, res) {
  const purchaseList = Purchase.getList()
  // console.log(purchaseList)

  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      purchaseList,
    },
  })
})
//=======================================================================
router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)
  const bonus = Purchase.calcBonusAmount(
    purchase.totalPrice,
  )
  console.log(purchase)
  res.render('purchase-info', {
    style: 'purchase-info',
    data: { purchase, bonus },
  })
})
//=======================================================================
router.post('/purchase-update', function (req, res) {
  const upd__id = Number(req.query.id)
  let { id, firstname, lastname, phone, email } = req.body
  // console.log(
  //   id,
  //   upd__id,
  //   firstname,
  //   lastname,
  //   phone,
  //   email,
  // )
  res.render('purchase-update', {
    style: 'purchase-update',
    data: {
      id,
      firstname,
      lastname,
      phone,
      email,
    },
  })
})
//=======================================================================
router.post('/purchase-updated', function (req, res) {
  const id = Number(req.query.id)
  let { firstname, lastname, phone, email } = req.body
  const data = { firstname, lastname, phone, email }
  // Purchase.updateById(upd__id, data)
  if (Purchase.updateById(id, data)) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Успішне виконання дії',
        info: 'Дані замовлення успішно змінено',
        link: '/purchase-list',
      },
    })
  } else {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилкавиконання дії',
        info: 'Дані замовлення не змінено',
        link: '/purchase-list',
      },
    })
  }
})

// ========================SPOTIFY========================================

class Track {
  static #list = [
    {
      id: 1,
      name: 'name',
      author: 'author',
      image: 'https://picsum.photos/100/100',
    },
  ]

  constructor(name, author) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = 'https://picsum.photos/100/100'
  }

  static create = (name, author, image) => {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList = () => {
    return this.#list.reverse()
  }

  static getById = (id) => {
    return this.#list.find((track) => track.id === id)
  }
}
Track.create('Waiting For Love', 'Avicii')
Track.create('Heroes', 'Alesso, Tove Lo')
Track.create('Wake me up', 'Avicii')
Track.create('Alone', 'Alan Walker')
Track.create('Stole the show', 'Kygo, Person James')
Track.create('Runaway', 'Galantis')
Track.create('Tomorow newer comes', 'Vicetone')

class PlayList {
  static #list = []

  constructor(
    name,
    image = '/img/default.png',
    tracks = [],
  ) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = tracks
    this.image = image
    this.length = tracks.length
  }

  static create = (
    name,
    image = '/img/default.png',
    tracks = [],
  ) => {
    const newPlayList = new PlayList(name, image, tracks)
    this.#list.push(newPlayList)
    return newPlayList
  }

  static getList = () => {
    return this.#list.reverse()
  }

  static makeMix = (playList) => {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playList.tracks.push(...randomTracks)
    playList.length = playList.tracks.length
  }

  static getById = (id) => {
    return (
      PlayList.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById = (trackId) => {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
    this.length = this.tracks.length
  }

  addTrackById = (trackId) => {
    const track = Track.getById(Number(trackId))
    this.tracks.push(track)
    this.length = this.tracks.length
    // return this.tracks
  }

  getTracksLength = () => {
    return this.length
  }

  static searchListByValue = (value) => {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(value.toLowerCase()),
    )
  }
}
PlayList.makeMix(
  PlayList.create('Улюблене', '/img/liked.png', [
    Track.getById(1),
  ]),
)
PlayList.makeMix(
  PlayList.create('Мішанина', '/img/Mishanyna.png'),
)

PlayList.create('Інь Янь', '/img/JinJan.png')
//=======================================================================
router.get('/spotify-index', function (req, res) {
  const playlists = PlayList.getList()
  console.log(playlists)
  res.render('spotify-index', {
    style: 'spotify-index',
    data: { playlists },
  })
})
//=======================================================================
router.get('/spotify-search', function (req, res) {
  const playlists = PlayList.getList()
  console.log(playlists)
  res.render('spotify-search', {
    style: 'spotify-search',
    data: { playlists },
  })
})

router.post('/spotify-search', function (req, res) {
  const text = req.body.text
  const playlists = PlayList.searchListByValue(text)
  console.log(playlists)
  res.render('spotify-search', {
    style: 'spotify-search',
    data: { playlists },
  })
})
//=======================================================================
router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
})
//=======================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  res.render('spotify-create', {
    style: 'spotify-create',
    data: { isMix },
  })
})
//=======================================================================
router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Введіть назву',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }
  const playlist = PlayList.create(name)
  if (isMix) {
    PlayList.makeMix(playlist)
  }
  // res.render('alert', {
  //   style: 'alert',
  //   data: {
  //     message: 'Успішне виконання дії',
  //     info: 'Плейлист успішно створений',
  //     link: `/spotify-playlist?id=${playlist.id}`,
  //   },
  // })
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
//=======================================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = PlayList.getById(id)

  if (!playlist) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Плейлиста з даним іменем не існує',
        link: '/spotify-index',
      },
    })
  }
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
      length: playlist.getTracksLength(),
    },
  })
})
//=======================================================================
router.get('/spotify-delete', function (req, res) {
  const trackId = Number(req.query.trackId)
  const playListId = Number(req.query.playListId)
  const playlist = PlayList.getById(playListId)

  if (!playlist) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Плейлиста з даним іменем не знайдено',
        link: `/spotify-playlist?playListId=${playListId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
//=======================================================================
router.get('/spotify-playlist-add', function (req, res) {
  const playListId = Number(req.query.playListId)

  const playlist = PlayList.getById(playListId)
  const trackList = Track.getList()
  if (!playlist || !playListId) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Плейлиста з даним іменем не знайдено',
        link: '/spotify-choose',
      },
    })
  }

  const tracks = trackList.filter((track) => {
    return playlist.tracks.includes(track) ? 0 : 1
  })

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      tracks,
      playlist,
      playListId,
    },
  })
})
//=======================================================================
router.get('/spotify-track-add', function (req, res) {
  const playListId = Number(req.query.playListId)
  const trackId = Number(req.query.trackId)
  const playlist = PlayList.getById(playListId)

  if (!playlist) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Плейлиста з даним іменем не знайдено',
        link: '/spotify-choose',
      },
    })
  }

  playlist.addTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playListId: playlist.id,
      tracks: playlist.tracks.reverse(),
      name: playlist.name,
    },
  })
})

//=======================================================================
router.get('/alert', function (req, res) {
  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішне виконання дії',
      info: 'Товар успішно доданий',
      link: '/purchase',
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
