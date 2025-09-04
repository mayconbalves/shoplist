import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Item } from '../storage/listStorage'

type Props = {
  item: Item
  onDelete: (id: string) => void
}

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ItemRow({ item, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        {item.price != null && <Text style={styles.price}>{BRL.format(item.price)}</Text>}
      </View>
      <Pressable
        accessibilityLabel={`Remover ${item.name}`}
        onPress={() => onDelete(item.id)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteTxt}>Remover</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
    gap: 8
  },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, opacity: 0.7, marginTop: 2 },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fee2e2'
  },
  deleteTxt: { color: '#b91c1c', fontWeight: '700' }
})
