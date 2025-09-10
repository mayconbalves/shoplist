import * as Print from 'expo-print'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View
} from 'react-native'
import { ShoppingList, loadLists, saveLists } from '../storage/listStorage'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function HomeScreen() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newListName, setNewListName] = useState('')
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

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedId(expandedId === id ? null : id)
  }

  const handleCreateList = () => {
    if (lists.length >= 5) {
      Alert.alert('Limite atingido', 'Você só pode criar até 5 listas.')
      return
    }
    setNewListName('')
    setShowModal(true)
  }

  const saveNewList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Aviso', 'Dê um título para a lista.')
      return
    }

    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      createdAt: Date.now(),
      products: []
    }

    const updatedLists = [...lists, newList]
    setLists(updatedLists)
    await saveLists(updatedLists)
    setShowModal(false)
    router.push(`/AddItem?id=${newList.id}`)
  }

  const deleteList = async (id: string) => {
    const updated = lists.filter((l) => l.id !== id)
    setLists(updated)
    await saveLists(updated)
  }

  const exportPDF = async (list: ShoppingList) => {
    if (!list.products || list.products.length === 0) {
      Alert.alert('Lista vazia', 'Não há itens para exportar.')
      return
    }

    const total = list.products.reduce((sum, p) => sum + (p.price || 0), 0)
    const html = `
      <html>
        <body>
          <h1>${list.name}</h1>
          <ul>
            ${list.products.map((p) => `<li>${p.name} — R$ ${p.price?.toFixed(2) || '0,00'}</li>`).join('')}
          </ul>
          <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
        </body>
      </html>
    `

    try {
      await Print.printAsync({ html }) // abre o diálogo nativo de impressão/exportação
    } catch (e) {
      console.error('Erro ao gerar PDF', e)
      Alert.alert('Erro', 'Não foi possível gerar o PDF.')
    }
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
            const isExpanded = expandedId === item.id
            const total = item.products.reduce((sum, p) => sum + (p.price || 0), 0)

            return (
              <View style={styles.accordion}>
                {/* Cabeçalho */}
                <Pressable style={styles.accordionHeader} onPress={() => toggleExpand(item.id)}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listName}>{item.name}</Text>
                    <Text style={styles.listDate}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
                  <Pressable style={styles.deleteBtn} onPress={() => deleteList(item.id)}>
                    <Text style={styles.deleteTxt}>🗑️</Text>
                  </Pressable>
                </Pressable>

                {/* Conteúdo expandido */}
                {isExpanded && (
                  <View style={styles.accordionContent}>
                    {item.products.length === 0 ? (
                      <Text style={styles.noProducts}>Nenhum produto adicionado</Text>
                    ) : (
                      <>
                        {item.products.map((p, idx) => (
                          <View key={idx} style={styles.noteLine}>
                            <Text style={styles.noteText}>
                              {p.name} — R$ {p.price?.toFixed(2) || '0,00'}
                            </Text>
                          </View>
                        ))}

                        {/* Total + botão editar + exportar PDF */}
                        <View style={styles.totalRow}>
                          <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

                          <View style={styles.buttonsContainer}>
                            <Pressable
                              style={styles.editBtn}
                              onPress={() => router.push(`/AddItem?id=${item.id}`)}
                            >
                              <Text style={styles.editTxt}>✏️ Editar</Text>
                            </Pressable>

                            <Pressable
                              style={[styles.editBtn, { marginLeft: 8 }]}
                              onPress={() => exportPDF(item)}
                            >
                              <Text style={styles.editTxt}>📄 Exportar</Text>
                            </Pressable>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                )}
              </View>
            )
          }}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
        />
      )}

      {/* Botão flutuante */}
      <Pressable style={styles.fab} onPress={handleCreateList}>
        <Text style={styles.fabTxt}>Adicionar Lista</Text>
      </Pressable>

      {/* Modal para título */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nome da Lista</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Compras do mês"
              value={newListName}
              onChangeText={setNewListName}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={styles.cancel}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={saveNewList}>
                <Text style={styles.save}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  empty: { textAlign: 'center', marginTop: 40, opacity: 0.6, fontSize: 16 },

  accordion: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden'
  },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  listName: { fontSize: 16, fontWeight: '600' },
  listDate: { fontSize: 12, color: '#6b7280' },
  arrow: { marginLeft: 8, fontSize: 14 },
  deleteBtn: { marginLeft: 12, padding: 6 },
  deleteTxt: { fontSize: 18 },

  accordionContent: {
    backgroundColor: '#fffaf0',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  noProducts: { fontStyle: 'italic', color: '#9ca3af' },
  noteLine: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingVertical: 6 },
  noteText: { fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  total: { fontWeight: '700', fontSize: 16 },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#111827',
    borderRadius: 8
  },
  editTxt: { color: '#fff', fontWeight: '600' },

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
  fabTxt: { color: '#fff', fontWeight: '700' },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: { width: '85%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16 },
  cancel: { color: '#ef4444', fontWeight: '600' },
  save: { color: '#111827', fontWeight: '700' }
})
