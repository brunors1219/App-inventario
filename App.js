import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './components/welcome';
import Cadastro from './components/cadastro'; // Exemplo de tela de login
import Login from './components/login';
import LayoutComRodape from './components/rodape';
import Tabs from './router';

import { AppProvider } from './components/src/context/AppContext';
import ResetPasswordScreen from './components/password';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <LayoutComRodape>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#76bc21', // Cor verde
              },
              headerTintColor: '#fff', // Cor do texto
            }}>
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="Inventário" component={Tabs}/>
            <Stack.Screen name="Resert_password" component={ResetPasswordScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </LayoutComRodape>
    </AppProvider>
  );
}