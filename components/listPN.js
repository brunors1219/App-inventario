import { React, useEffect, useState, useContext, useRef } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Pressable } from "react-native";
import { AppContext } from "./src/context/AppContext";
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ListPn({navigation}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('')
    
    const { URL, gPosition, userProfile} = useContext(AppContext)
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [scannedShow, setScannedShow] = useState(false);

    const [isChecked, setIsChecked] = useState(false);

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
        ? data.filter(item => item.PN.includes(searchId))
        : data;

    const handlerSelectItem = (item) => {
        return;

        //Anselmo - Comentei aqui pois não consegui fazer funcionar

        // setGPN(item.PN)
        // setGPosition(item.Position)
        // setGDescription(item.Description)
        // navigation.navigate("Digitação");
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
                    placeholder="🔍 Digite o código do produto"
                    value={searchId}
                    onChangeText={(text) => setSearchId(text)} />
                <Pressable onPress={()=>setScannedShow(!scannedShow)} >
                    <Ionicons name='barcode-outline' size={50} color='green'/>
                </Pressable>
            </View>
            <View style={{alignItems:'flex-start', justifyContent:'flex-end', paddingRight:20, display:'flex', flexDirection:'row'}}>
                <TouchableOpacity style={styles.checkbox} onPress={()=>setIsChecked(!isChecked)}>
                    {isChecked && <View style={styles.checkmark} />}
                </TouchableOpacity>
                <Text>{isChecked ? 'Listando todos PN' : 'Listando apenas Pendente'}</Text>
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
                        {isChecked || (!isChecked && !item.Qty)
                            ? 
                                <View  key={item.PN} 
                                    style={{backgroundColor: item.Qty ? '#ccffcc' : '#f9f9f9',
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
                                        marginLeft: 10}} >
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
                                                                backgroundColor:'#cceeff', 
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
                            : null
                        }
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
        width: '75%'
    },
    column: {
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#4CAF50',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        width: 12,
        height: 12,
        backgroundColor: '#4CAF50',
    },      
});
