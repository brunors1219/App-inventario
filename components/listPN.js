import { React, useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { AppContext } from "./src/context/AppContext";

export default function ListPn({navigation}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('')
    
    const { URL, setGPN, gPosition, setGPosition, setGDescription} = useContext(AppContext)

    useEffect(() => {
        const fetchData = async () => {

            try {
                const res = await fetch(`${URL}/api/invproducts?position=${gPosition}`)
                const data = await res.json()
                console.log(data)
                setData(data)
            } catch (error) {
                
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            };
        }
        fetchData();
    }, [gPosition]);

    if (loading) {
        return <Text>Carregando dados...</Text>
    }

    const filteredData = searchId
        ? data.filter(item => item.id.includes(searchId))
        : data;

    const handlerSelectItem = (item) => {
        return;

        //Anselmo - Comentei aqui pois não consegui fazer funcionar

        // setGPN(item.PN)
        // setGPosition(item.Position)
        // setGDescription(item.Description)
        // navigation.navigate("Digitação");
    }
    
    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="🔍 Digite o código do produto"
                value={searchId}
                onChangeText={(text) => setSearchId(text)} />
            
            <FlatList                
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlerSelectItem(item)}>
                        <View  key={item.PN} style={styles.item} >
                            <View style={{display:'flex', flexDirection:'row'}}>
                                <View  style={{width:'80%'}} >
                                    <Text style={styles.title}>PN: {item.PN}</Text>
                                    <Text>Descrição: {item.Description}</Text>
                                    <Text>Posição: {item.Position}</Text>
                                    <Text>Contagem: {item.Score}</Text>
                                </View>
                                {item.Qty
                                    ?
                                        <View  
                                                style={{alignItems:'center', 
                                                        justifyContent:'center', 
                                                        backgroundColor:'#D3D3D3', 
                                                        padding:3,
                                                        width: '20%'}} >
                                            <Text>Contado</Text>
                                            <Text style={{fontSize:25}} >{item.Qty}</Text>
                                            <Text style={{fontSize:8}} >{item.name}</Text>
                                        </View>

                                    : null
                                }

                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f9f9f9',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: '95%',
        marginLeft: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        borderRadius: 5,
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
        fontSize: 15,
        margin: 10,

    },
    column: {
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: 8,
      },
});
