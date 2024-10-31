import { React, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./src/service/firebase";

export default function ListPn({Position}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('')
   
    

    useEffect(() => {
        const fetchData = async () => {

            try {
                const res = await fetch(`https://receiver-sand.vercel.app/api/invproducts?position=${Position}`)
                const data = await res.json()
                console.log(data)
                setData(data)
                setRows(data)
                // const querySnapshot = await getDocs(collection(db, 'Inventario'));
                // const dataList = querySnapshot.docs.map(doc => ({
                //     id: doc.id,
                //     ...doc.data(),
                // }));
                //setData(dataList);
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
        ? data.filter(item => item.id.includes(searchId))
        : data;


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
                numColumns={2}
                columnWrapperStyle={styles.column}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>PN: {item.PN}</Text>
                        <Text>Descrição: {item.Description}</Text>
                        <Text>Posição: {item.Position}</Text>
                        <Text>{item.action}</Text>
                    </View>
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
        margin: 20
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
