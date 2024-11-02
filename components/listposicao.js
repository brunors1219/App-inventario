import { React, useEffect, useState, useContext, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Pressable } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { AppContext } from "./src/context/AppContext";

// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./src/service/firebase";

export default function Posicao({navigation}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');
    
    const { URL, setGPosition, setGPN } = useContext(AppContext)
    
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [scannedShow, setScannedShow] = useState(false);

    useEffect(() => {
        loadDataDB();
    }, []);

    useFocusEffect(
        useCallback(() => {
            // console.log("carregando...." + gPN +" - " + gPosition)
            // loadData()
            loadDataDB();
            return () => {
                // Código a ser executado quando a tela perder foco, se necessário
                setGPN("");
                setGPosition("");        
            };
        }, [])
    );    

    const loadDataDB = () => {
        const fetchData = async () => {

            try {
                // const querySnapshot = await getDocs(collection(db, 'produto'));
                // const dataList = querySnapshot.docs.map(doc => ({
                //     id: doc.id,
                //     ...doc.data(),
                // }));
                console.log(`${URL}/api/invproducts?selection=position`);
                const res = await fetch(`${URL}/api/invproducts?selection=position`)
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
    }

    if (loading) {
        return <Text>Carregando dados...</Text>
    }

    const filteredData = searchId
        ? data.filter(item => item.Position.includes(searchId))
        : data;

    const handlerSelectItem = (item) => {
        setGPosition(item.Position)
        navigation.navigate("ListPn");
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScannedData(data);
        setScannedShow(false);
        setSearchId(data);
      };

    return (
        <View>
            <View style={{padding:0, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                <TextInput
                    style={styles.input}
                    placeholder="🔍 Digite a posição"
                    value={searchId}
                    onChangeText={(text) => setSearchId(text)} />
                <Pressable onPress={()=>setScannedShow(!scannedShow)} >
                    <Ionicons name='barcode-outline' size={50} color='green'/>
                </Pressable>
            </View>
            {!scannedShow 
                ? null
                :
                    <View style={{ flex: 1, alignItems: 'center', zIndex: 100 }}>
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                            style={{ height: 400, width: 400 }}
                        />
                    </View>
                }

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                
            
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlerSelectItem(item)}>
                        <View  key={item.Posicao} style={styles.item}>
                        {/* <Text style={styles.title}>Codigo do produto: {item.PN}</Text>
                        <Text style={styles.text}>Quantidade: {item.Description}</Text> */}
                            <View >
                                <Text style={styles.text}>{item.Position}</Text>
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
        width: '75%'
    },
    column: {
        justifyContent: 'center',
      },
});
