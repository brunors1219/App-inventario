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

import './i18n.js'; // importa a configuração do i18n
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator();

export default function App() {
  const { t } = useTranslation();

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
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{ headerShown: false, title: t("welcome") }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ title: t("login") }}
            />
            <Stack.Screen
              name="Cadastro"
              component={Cadastro}
              options={{ title: t("cadastro") }}
            />
            <Stack.Screen
              name="Inventário"
              component={Tabs}
              options={{ title: t("inventario") }}
            />
            <Stack.Screen
              name="Resert_password"
              component={ResetPasswordScreen}
              options={{ title: t("reset_password") }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LayoutComRodape>
    </AppProvider>
  );
}