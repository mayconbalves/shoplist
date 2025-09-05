import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Item, loadItems, saveItems } from '../storage/listStorage'

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([])
  const router = useRouter()

  const refreshItems = useCallback(async () => {
    const loaded = await loadItems()
    setItems(loaded)
  }, [])

  useEffect(() => {
    refreshItems()
  }, [refreshItems])

  useFocusEffect(
    useCallback(() => {
      refreshItems()
    }, [refreshItems])
  )

  const total = useMemo(
    () => items.reduce((acc, it) => acc + (Number(it.price) || 0) * (it.quantity || 1), 0),
    [items]
  )
  const BRL = useMemo(
    () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const updated = items.filter((it) => it.id !== id)
      setItems(updated)
      await saveItems(updated)
    },
    [items]
  )

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <Text style={styles.empty}>Sua lista está vazia. Toque em Adicionar para começar.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>
                  {item.quantity} x {BRL.format(Number(item.price) || 0)} ={' '}
                  {BRL.format((Number(item.price) || 0) * (item.quantity || 1))}
                </Text>
              </View>

              <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteTxt}>🗑️</Text>
              </Pressable>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{BRL.format(total)}</Text>
      </View>

      <Pressable style={styles.fab} onPress={() => router.push('AddItem')}>
        <Text style={styles.fabTxt}>Adicionar</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { textAlign: 'center', marginTop: 40, opacity: 0.6, fontSize: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    minHeight: 60
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  details: { fontSize: 14, color: '#555', marginTop: 4 },
  deleteBtn: {
    marginLeft: 12,
    width: 36,
    height: 36,
    backgroundColor: '#e11d48',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteTxt: { color: '#fff', fontSize: 18 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '800' },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 72,
    backgroundColor: '#111827',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    elevation: 3
  },
  fabTxt: { color: '#fff', fontWeight: '700' }
})
