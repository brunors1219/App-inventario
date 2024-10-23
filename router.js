import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Cadprod from "./components/cadProd";
import Inventario from "./components/invetario";
import { Ionicons } from '@expo/vector-icons';
import Welcome from "./components/welcome";



const Tab = createBottomTabNavigator();
export default function Tabs(){
    return(
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
    
              if (route.name === 'Cadastro_produto') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Inventario') {
                iconName = focused ? 'duplicate' : 'duplicate-outline';
              }
    
              return <Ionicons name={iconName} size={size} color={color}/>;
            },
            headerShown: false,
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}>
            <Tab.Screen name="Cadastro_produto" component={Cadprod}/>
            <Tab.Screen name="Inventario" component={Inventario}/>
            
        </Tab.Navigator>
    );
    
}