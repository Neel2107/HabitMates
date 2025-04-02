import React from 'react'
import { Stack } from 'expo-router'

const AddHabitLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}

export default AddHabitLayout
