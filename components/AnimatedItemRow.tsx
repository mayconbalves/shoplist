import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInUp, Layout } from 'react-native-reanimated'
import { BRL } from '../utils/currency'

type Props = {
  item: any
  onDelete: (id: string) => void
}

export default function AnimatedItemRow({ item, onDelete }: Props) {
  return (
    <Animated.View entering={FadeInUp.delay(50)} layout={Layout.springify()} style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {item.quantity} x {BRL.format(Number(item.price) || 0)} ={' '}
          {BRL.format((Number(item.price) || 0) * (item.quantity || 1))}
        </Text>
      </View>

      <Pressable style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
        <Text style={styles.deleteTxt}>🗑️</Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
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
  details: { fontSize: 16, color: '#555', marginTop: 4 },
  deleteBtn: {
    marginLeft: 12,
    width: 36,
    height: 36,
    backgroundColor: '#e11d48',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteTxt: { color: '#fff', fontSize: 18 }
})
