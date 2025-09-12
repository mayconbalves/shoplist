import { Platform, StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
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
