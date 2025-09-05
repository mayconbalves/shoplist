import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Item, loadItems, saveItems } from '../storage/listStorage'

const PRODUCTS = ['Arroz', 'Feijão', 'Leite', 'Pão', 'Macarrão']

type TempItem = {
  id: string
  name: string
  quantity: number
  price: string
}

export default function AddItemScreen() {
  const router = useRouter()
  const [items, setItems] = useState<TempItem[]>(
    PRODUCTS.map((name) => ({ id: name, name, quantity: 0, price: '' }))
  )

  const incrementQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    )
  }

  const decrementQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      )
    )
  }

  const updatePrice = (id: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, price: value } : item)))
  }

  const onSave = async () => {
    const validItems = items.filter((i) => i.quantity > 0 && Number(i.price.replace(',', '.')) > 0)

    if (!validItems.length) {
      Alert.alert('Nenhum item válido', 'Informe quantidade e preço de pelo menos um item.')
      return
    }

    const existingItems = await loadItems()

    const mergedItems: Item[] = [...existingItems]

    validItems.forEach((newItem) => {
      const index = mergedItems.findIndex((it) => it.name === newItem.name)
      const priceNumber = Number(newItem.price.replace(',', '.'))

      if (index !== -1) {
        // Se já existe, somar quantidade e atualizar preço
        mergedItems[index] = {
          ...mergedItems[index],
          quantity: (mergedItems[index].quantity || 0) + newItem.quantity,
          price: priceNumber
        }
      } else {
        mergedItems.push({
          id: Date.now().toString() + Math.random(),
          name: newItem.name,
          quantity: newItem.quantity,
          price: priceNumber
        })
      }
    })

    await saveItems(mergedItems)
    router.back()
  }

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {items.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>

            <Pressable style={styles.qtyBtn} onPress={() => decrementQuantity(item.id)}>
              <Text style={styles.qtyBtnText}>-</Text>
            </Pressable>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <Pressable style={styles.qtyBtn} onPress={() => incrementQuantity(item.id)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>

            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={item.price}
              onChangeText={(text) => updatePrice(item.id, text)}
              placeholder="Preço"
            />

            <Text style={styles.total}>
              {BRL.format(item.quantity * (Number(item.price.replace(',', '.')) || 0))}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Pressable style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveBtnTxt}>Salvar Todos</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    minHeight: 60
  },
  name: { flex: 2, fontSize: 16, fontWeight: '600' },
  qtyBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#111827',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4
  },
  qtyBtnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  qtyText: { width: 32, textAlign: 'center', fontWeight: '600', fontSize: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    height: 40,
    fontSize: 16
  },
  total: { width: 90, textAlign: 'right', fontWeight: '600', fontSize: 16 },
  saveBtn: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  saveBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 }
})
