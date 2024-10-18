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



            <Text style={styles.label}>Código do produto: </Text>
            <TextInput placeholder="Digite código"style={styles.input}
valeu={id}
onChangeText={setId}
 />



<Text style={styles.label}>Quantidade: </Text>
            <TextInput placeholder="Digitei quantidade"style={styles.input}
valeu={quant} 
onChangeText={setQuant}/>


<Text style={styles.label}>Posição: </Text>
            <TextInput placeholder="Digitei posição"style={styles.input}
valeu={pos}
onChangeText={setPos}/>

        </View>
    )
}

styles = StyleSheet.create({
 container:{
 flex:1,
 padding:20,
 justifyContent:'center'
},

 text:{
  fontsize:20,
 },

label:{
 fontSize: 16,
 marginaBottom:5,
 color:#333
},
input:{
 boderColor:"black",
 borderWidth:1,
 marginaBottom:15,
 paddingHorizontal:10,
 borderRadius:5

},
});