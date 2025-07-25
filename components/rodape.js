// LayoutComRodape.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';

const LayoutComRodape = ({ children }) => {

    const { t } = useTranslation();
    
    return (
        <View style={styles.container}>
            <View style={styles.content}>{children}</View>
            <View style={styles.footer}>
                <Text>© 2024 By Data Access - v{Constants.expoConfig?.version}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingBottom: 50, // Espaço para o rodapé
    },
    footer: {
        height: 30,
        backgroundColor: '#f1f1f1',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});

export default LayoutComRodape;
