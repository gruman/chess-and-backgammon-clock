import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ContextProvider } from './state/context';

// Create a stack navigator
const Stack = createStackNavigator();

// Import your screens
import Home from './screens/Home';
import Settings from './screens/Settings';

// App component
const App = () => {
  return (
    // Wrap the entire app with the ContextProvider to provide the context to all components
    <ContextProvider>
      {/* NavigationContainer is the root component for navigation */}
      <NavigationContainer>
        {/* Stack Navigator for handling navigation between screens */}
        <Stack.Navigator
          initialRouteName='Home' // Set the initial route to Home
        >
          {/* Define screens with their respective components */}
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;
