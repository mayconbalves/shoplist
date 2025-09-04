import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import ItemRow from '../components/ItemRow'
import { Item, loadItems, saveItems } from '../storage/listStorage'

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([])
  const router = useRouter()

  const refreshItems = useCallback(async () => {
    const loaded = await loadItems()
    setItems(loaded)
  }, [])

  // Carrega itens na primeira renderização
  useEffect(() => {
    refreshItems()
  }, [refreshItems])

  // Recarrega itens sempre que a tela voltar a ficar ativa
  useFocusEffect(
    useCallback(() => {
      refreshItems()
    }, [refreshItems])
  )

  const total = useMemo(() => items.reduce((acc, it) => acc + (Number(it.price) || 0), 0), [items])
  const BRL = useMemo(
    () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const updated = items.filter((it) => it.id !== id)
      setItems(updated)
      await saveItems(updated) // salva a lista atualizada no AsyncStorage
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
          renderItem={({ item }) => <ItemRow item={item} onDelete={handleDelete} />}
          contentContainerStyle={{ paddingBottom: 100 }}
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
  empty: { textAlign: 'center', marginTop: 40, opacity: 0.6 },
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
