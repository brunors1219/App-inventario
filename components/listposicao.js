import { React, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./src/service/firebase";

export default function Posicao({navigation}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');
    


    useEffect(() => {
        const fetchData = async () => {

            try {
                // const querySnapshot = await getDocs(collection(db, 'produto'));
                // const dataList = querySnapshot.docs.map(doc => ({
                //     id: doc.id,
                //     ...doc.data(),
                // }));
                const res = await fetch('https://receiver-sand.vercel.app/api/invproducts?selection=position')
                const data = await res.json()
                setData(data)
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



    const handlerSelectItem = (item) => {
        navigation.navigate("ListPn", { Position: item });
    }

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="🔍 Digite a posição"
                value={searchId}
                onChangeText={(text) => setSearchId(text)} />
            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                
            
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        {/* <Text style={styles.title}>Codigo do produto: {item.PN}</Text>
                        <Text style={styles.text}>Quantidade: {item.Description}</Text> */}
                        <TouchableOpacity onPress={() => handlerSelectItem(item)}>
                            <View >
                                <Text style={styles.text}>{item.Position}</Text>
                            </View>
                        </TouchableOpacity>

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
        fontSize: 18,
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
        justifyContent: 'center',
      },
});
