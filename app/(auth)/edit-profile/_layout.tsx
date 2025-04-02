import { Stack } from 'expo-router'
import React from 'react'

const EditProfileLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}

export default EditProfileLayout
