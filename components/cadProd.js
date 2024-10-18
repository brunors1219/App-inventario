import {React, useState} from "react";
import { Text, View, TextInput, StyleSheet} from "react-native";

export default function Cadprod(){


const [id, setId] = useSate("");
const [quant, setQuant] = useSate("");
const [pos, setPos] = useSate("");

const hadleRegistre = () =>{
 console.log({id, quant, pos});
setId("");
setQuant("");
setPos("");
};



    return(

        <View style={styles.container}>
            <Text style={styles.text}>Cadastro de produto</Text>
            <TextInput placeholder="Codigo"style={styles.input}
valeu={} />
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