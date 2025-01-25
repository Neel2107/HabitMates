import { Stack } from 'expo-router';

export default function HabitLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Habits',
                }}
            />
            <Stack.Screen
                name="add"
                options={{
                    title: 'Add Profile',
                    presentation: 'modal'
                }}
            />
        </Stack>
    );
}
