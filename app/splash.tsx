import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/')
    }, 2000)
    return () => clearTimeout(timer)
  })

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/favicon.png')} style={styles.logo} />
      <Text style={styles.title}>Minha Lista de Compras</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 20
  },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' }
})
