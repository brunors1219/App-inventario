import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './components/welcome';
import Cadastro from './components/cadastro'; // Exemplo de tela de login
import Login from './components/login';
import Cadprod from './components/cadProd';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="CadProd" component={Cadprod}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}