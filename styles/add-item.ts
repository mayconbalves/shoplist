import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
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
