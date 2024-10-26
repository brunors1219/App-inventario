import { React, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./src/service/firebase";

export default function ConsultIn() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Inventario'));
                const dataList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(dataList);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            };
        }
        fetchData();
    }, []);

   


    if (loading) {
        return <Text>Carregando dados...</Text>
    }
    const filteredData = searchId
    ? data.filter(item => item.cod.includes(searchId))
    : data;

    return (
        <View>
            <TextInput
            style={styles.input}
            placeholder="🔍 Digite codigo"
            value={searchId}
            onChangeText={(text)=>setSearchId(text)}/>
            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>Condigo do produto:{item.cod}</Text>
                        <Text>Nome Usuario: {item.nomeus}</Text>
                        <Text>Quantidade: {item.quantidade}</Text>
                        <Text>Numero de Contagem: {item.numbercontacao}</Text>
                        <Text>Posição: {item.posicao}</Text>
                        <Text>
                            Data: {
                                item.date && item.date.toDate
                                    ? item.date.toDate().toLocaleDateString()
                                    : 'Data inválida'
                            }
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    input:{
        borderRadius:5,
        borderColor:"black",
        borderWidth:1,
        padding:10,
        fontSize:15,
    }
});
