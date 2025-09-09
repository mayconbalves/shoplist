import { PRODUCTS } from '@/data/products'
import { Item, loadItems, saveItems } from '@/storage/listStorage'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

type TempItem = {
  id: string
  name: string
  quantity: number
  price: string
}

export default function AddItemScreen() {
  const router = useRouter()

  // transforma o objeto PRODUCTS em uma lista plana de itens
  const initialItems: TempItem[] = Object.entries(PRODUCTS).flatMap(([category, names]) =>
    names.map((name) => ({
      id: `${category}-${name}`,
      name,
      quantity: 0,
      price: ''
    }))
  )

  const [items, setItems] = useState<TempItem[]>(initialItems)

  const itemMap = new Map(items.map((it) => [it.name, it]))

  const updateQuantity = (id: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Number(numericValue) } : item))
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
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        extraScrollHeight={Platform.OS === 'ios' ? 120 : 140}
        enableOnAndroid={true}
        enableAutomaticScroll
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {Object.entries(PRODUCTS).map(([category, names]) => (
          <View key={category} style={{ marginBottom: 20 }}>
            <Text style={styles.category}>{category}</Text>

            {names.map((name) => {
              const item = itemMap.get(name)
              if (!item) return null

              return (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.name}>{item.name}</Text>

                  <TextInput
                    style={styles.qtyInput}
                    keyboardType="numeric"
                    value={item.quantity.toString()}
                    onChangeText={(text) => updateQuantity(item.id, text)}
                    placeholder="Qtd"
                  />

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
              )
            })}
          </View>
        ))}

        <Pressable style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveBtnTxt}>Salvar Todos</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  category: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1f2937',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    paddingLeft: 6
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 10,
    minHeight: 60
  },
  name: { flex: 2, fontSize: 16, fontWeight: '600' },
  qtyInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    height: 40,
    fontSize: 16,
    backgroundColor: '#f3f4f6'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    height: 40,
    fontSize: 16,
    backgroundColor: '#f3f4f6'
  },
  total: { width: 90, textAlign: 'right', fontWeight: '600', fontSize: 16 },
  saveBtn: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12
  },
  saveBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 }
})
