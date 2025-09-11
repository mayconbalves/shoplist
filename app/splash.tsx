import { useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

export default function WelcomeScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/')
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/images/splash.json')}
        autoPlay
        loop={false}
        style={{ width: 300, height: 300 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})
