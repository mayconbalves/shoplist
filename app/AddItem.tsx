import { PRODUCTS } from '@/data/products'
import { Product, ShoppingList, loadLists, saveLists } from '@/storage/listStorage'
import { styles } from '@/styles/add-item'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Platform, Pressable, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

type TempItem = Product & { priceStr: string }

export default function AddItemScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [list, setList] = useState<ShoppingList | null>(null)
  const [items, setItems] = useState<TempItem[]>([])

  useEffect(() => {
    const loadList = async () => {
      const lists = await loadLists()
      const currentList = lists.find((l) => l.id === id)
      if (!currentList) return
      setList(currentList)

      const temp: TempItem[] = Object.entries(PRODUCTS).flatMap(([category, names]) =>
        names.map((name) => {
          const existing = currentList.products.find((p) => p.name === name)
          return {
            id: `${category}-${name}`,
            name,
            quantity: existing?.quantity || 0,
            price: existing?.price || 0,
            priceStr: existing?.price.toString() || ''
          }
        })
      )
      setItems(temp)
    }
    loadList()
  }, [id])

  const updateQuantity = (id: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Number(numericValue) } : item))
    )
  }

  const updatePrice = (id: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, priceStr: value } : item)))
  }

  const onSave = async () => {
    if (!list) return
    const validItems = items.filter(
      (i) => i.quantity > 0 && Number(i.priceStr.replace(',', '.')) > 0
    )

    if (!validItems.length) {
      Alert.alert('Nenhum item válido', 'Informe quantidade e preço de pelo menos um item.')
      return
    }

    const updatedProducts: Product[] = validItems.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: Number(i.priceStr.replace(',', '.'))
    }))

    const allLists = await loadLists()
    const index = allLists.findIndex((l) => l.id === list.id)
    if (index !== -1) {
      allLists[index] = { ...list, products: updatedProducts }
      await saveLists(allLists)
    }
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
              const item = items.find((it) => it.name === name)
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
                    value={item.priceStr}
                    onChangeText={(text) => updatePrice(item.id, text)}
                    placeholder="Preço"
                  />
                  <Text style={styles.total}>
                    {BRL.format(item.quantity * (Number(item.priceStr.replace(',', '.')) || 0))}
                  </Text>
                </View>
              )
            })}
          </View>
        ))}

        <Pressable style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveBtnTxt}>Salvar Lista</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  )
}
