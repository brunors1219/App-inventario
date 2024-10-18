import React from "react";
import { Text, View, TextInput, StyleSheet} from "react-native";

export default function Cadprod(){
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Cadastro de produto</Text>
            <TextInput placeholder="Codigo"style={styles.input}/>
        </View>
    )
}

styles = StyleSheet.create{
 container:{
 flex:1,
 padding:20,
 justifyContent:'center'
},

 text:{
  fontsize:10
 },
input:{
 

}
}