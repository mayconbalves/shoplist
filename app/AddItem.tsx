import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Item, loadItems, saveItems } from '../storage/listStorage'

export default function AddItemScreen() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const router = useRouter()

  async function onSave() {
    const p = Number(String(price).replace(',', '.'))

    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do produto.')
      return
    }

    if (isNaN(p) || p < 0) {
      Alert.alert('Preço inválido', 'Informe um preço válido (ex: 12.50)')
      return
    }

    const newItem: Item = {
      id: Date.now().toString(),
      name: name.trim(),
      price: p
    }

    // Carrega lista existente
    const items = await loadItems()
    // Adiciona o novo item
    const updated = [newItem, ...items]
    // Salva lista atualizada
    await saveItems(updated)

    // Volta para a tela anterior (HomeScreen)
    router.back()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Produto</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex: Arroz 5kg"
        style={styles.input}
      />

      <Text style={styles.label}>Preço (R$)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Ex: 25,90"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <Pressable style={styles.btn} onPress={onSave}>
        <Text style={styles.btnTxt}>Salvar</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  label: { fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16
  },
  btn: {
    marginTop: 12,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 }
})
