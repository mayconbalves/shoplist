import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { ShoppingList, loadLists, saveLists } from '../storage/listStorage'
import { BRL } from '../utils/currency'

export default function HomeScreen() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const router = useRouter()

  const refreshLists = useCallback(async () => {
    const loaded = await loadLists()
    setLists(loaded)
  }, [])

  useEffect(() => {
    refreshLists()
  }, [refreshLists])

  useFocusEffect(
    useCallback(() => {
      refreshLists()
    }, [refreshLists])
  )

  const createNewList = async () => {
    if (lists.length >= 5) {
      Alert.alert('Limite atingido', 'Você só pode criar até 5 listas.')
      return
    }

    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: `Lista ${lists.length + 1}`,
      createdAt: Date.now(),
      products: []
    }

    const updatedLists = [...lists, newList]
    setLists(updatedLists)
    await saveLists(updatedLists)
    router.push(`/AddItem?id=${newList.id}`)
  }

  const deleteList = async (id: string) => {
    const updated = lists.filter((l) => l.id !== id)
    setLists(updated)
    await saveLists(updated)
  }

  return (
    <View style={styles.container}>
      {lists.length === 0 ? (
        <Text style={styles.empty}>
          Você ainda não possui listas. Toque em Adicionar para começar.
        </Text>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const total = item.products.reduce(
              (acc, p) => acc + (Number(p.price) || 0) * (p.quantity || 1),
              0
            )

            return (
              <View style={styles.listRow}>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => router.push(`/AddItem?id=${item.id}`)}
                >
                  <Text style={styles.listName}>{item.name}</Text>
                  <Text style={styles.listDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.listTotal}>Total: {BRL.format(total)}</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={() => deleteList(item.id)}>
                  <Text style={styles.deleteTxt}>🗑️</Text>
                </Pressable>
              </View>
            )
          }}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
        />
      )}

      <Pressable style={styles.fab} onPress={createNewList}>
        <Text style={styles.fabTxt}>Adicionar Lista</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  empty: { textAlign: 'center', marginTop: 40, opacity: 0.6, fontSize: 16 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12
  },
  listName: { fontSize: 16, fontWeight: '600' },
  listDate: { fontSize: 12, color: '#6b7280' },
  listTotal: { fontSize: 14, fontWeight: '600', color: '#111827', marginTop: 4 },
  deleteBtn: { marginLeft: 12, padding: 6 },
  deleteTxt: { fontSize: 18 },
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
