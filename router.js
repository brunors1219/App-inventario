import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import Cadprod from "./components/cadProd";
import Inventario from "./components/invetario";
import { Ionicons } from '@expo/vector-icons';
import ListPn from "./components/listPN";
import Position from "./components/listposicao";

const Tab = createBottomTabNavigator();
export default function Tabs(){
    return(
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
    
              
              if (route.name === 'Posição') {
                iconName = focused ? 'construct' : 'construct-outline';
              }else if (route.name === 'ListPn') {
                iconName = focused ? 'clipboard' : 'clipboard-outline';
              // }else if (route.name === 'Cadastro_produto') {
              //   iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Cadastro') {
                iconName = focused ? 'duplicate' : 'duplicate-outline';
              }
    
              return <Ionicons name={iconName} size={size} color={color}/>;
            },
            headerShown: false,
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}>
            <Tab.Screen name="Posição" component={Position}/>
            <Tab.Screen name="ListPn" component={ListPn}/>
            <Tab.Screen name="Cadastro" component={Inventario}/>
            
            
        </Tab.Navigator>
    );
    
}