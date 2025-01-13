import Store from 'electron-store'

type StoreSChema = {
  test: string
}

const store = new Store<StoreSChema>()

console.log(store.get('test'))
// store.set('test', 'Hello')
