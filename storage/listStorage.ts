import AsyncStorage from '@react-native-async-storage/async-storage'

export type Product = {
  id: string
  name: string
  quantity: number
  price: number
}

export type ShoppingList = {
  id: string
  name: string
  createdAt: number
  products: Product[]
}

const KEY = '@shoplist/lists'

export async function loadLists(): Promise<ShoppingList[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.warn('Erro ao carregar listas:', e)
    return []
  }
}

export async function saveLists(lists: ShoppingList[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(lists))
  } catch (e) {
    console.warn('Erro ao salvar listas:', e)
  }
}
