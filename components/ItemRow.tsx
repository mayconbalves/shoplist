import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Item } from '../storage/listStorage'

type Props = {
  item: Item
  onDelete: (id: string) => void
  onUpdate: (updatedItem: Item) => void
}

export default function ItemRow({ item, onDelete, onUpdate }: Props) {
  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  const handleQuantityChange = (text: string) => {
    const quantity = Number(text) || 0
    onUpdate({ ...item, quantity })
  }

  const handlePriceChange = (text: string) => {
    const price = Number(text.replace(',', '.')) || 0
    onUpdate({ ...item, price })
  }

  return (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={item.quantity.toString()}
        onChangeText={handleQuantityChange}
      />

      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={item.price.toString()}
        onChangeText={handlePriceChange}
      />

      <Text style={styles.total}>{BRL.format(item.price * item.quantity)}</Text>

      <Pressable onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteTxt}>🗑️</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 10,
    backgroundColor: '#f5f5f5'
  },
  name: { flex: 2, fontSize: 16, fontWeight: '600' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    height: 36
  },
  total: { width: 80, textAlign: 'right', fontWeight: '600' },
  deleteBtn: { marginLeft: 8 },
  deleteTxt: { fontSize: 18 }
})
