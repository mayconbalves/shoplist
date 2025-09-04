import AsyncStorage from '@react-native-async-storage/async-storage'

export type Item = {
  id: string
  name: string
  price: number
}

const KEY = '@shoplist/items'

export async function loadItems(): Promise<Item[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.warn('Erro ao carregar itens:', e)
    return []
  }
}

export async function saveItems(items: Item[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('Erro ao salvar itens:', e)
  }
}
