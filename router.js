import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import Cadprod from "./components/cadProd";
import InventarioS from "./components/invetarios";
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
              } else if (route.name === 'Inventário') {
                iconName = focused ? 'archive-outline' : 'archive-outline';
              } else if (route.name === 'Digitação') {
                iconName = focused ? 'calculator-outline' : 'calculator-outline';
              }
    
              return <Ionicons name={iconName} size={size} color={color}/>;
            },
            headerShown: false,
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}>
            <Tab.Screen name="Digitação" component={InventarioS}/>            
            <Tab.Screen name="Posição" component={Position}/>
            <Tab.Screen name="ListPn" component={ListPn}/>
            
        </Tab.Navigator>
    );
    
}