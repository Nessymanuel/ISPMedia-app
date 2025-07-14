import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import axios from "axios";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = process.env.API_BASE_URL!;
type ArtistDetailRouteProp = RouteProp<RootStackParamList, "ArtistDetail">;

export default function ArtistDetailScreen() {
    const route = useRoute<ArtistDetailRouteProp>();
    const navigation = useNavigation();
    const { id } = route.params;

    const [artist, setArtist] = useState<any | null>(null);
    const [musicas, setMusicas] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const resArtista = await axios.get(`${BASE_URL}/api/Artista/${id}`);
                setArtist(resArtista.data);
            } catch (err) {
                console.error("Erro ao buscar artista:", err);
                setArtist(null);
                return;
            }

            try {
                const resMusicas = await axios.get(`${BASE_URL}/api/Musica/Artista/${id}`);
                setMusicas(resMusicas.data);
            } catch {
                setMusicas([]);
            }

            try {
                const resVideos = await axios.get(`${BASE_URL}/api/Video/Artista/${id}`);
                setVideos(resVideos.data);
            } catch {
                setVideos([]);
            }

            setLoading(false);
        };

        fetchAll();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    if (!artist) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Artista não encontrado.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#4f46e5" />
                <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            <Image source={{ uri: BASE_URL + artist.fotoArtista }} style={styles.avatar} />
            <Text style={styles.name}>{artist.nomeArtista}</Text>
            <Text style={styles.detail}>🎵 Gênero: {artist.generoMusical}</Text>
            <Text style={styles.detail}>🌍 Nacionalidade: {artist.nacionalidade}</Text>
            <Text style={styles.detail}>📝 Biografia: {artist.biografia}</Text>
            <Text style={styles.detail}>👤 Utilizador: {artist.nomeUtilizador}</Text>

            <View style={styles.mediaSection}>
                <Text style={styles.sectionTitle}>Músicas</Text>
                {musicas.length === 0 ? (
                    <Text style={styles.emptyText}>Sem músicas disponíveis.</Text>
                ) : (
                    musicas.map((m) => (
                        <View key={m.id} style={styles.mediaItem}>
                            <Image source={{ uri: BASE_URL + m.ficheiroPath }} style={styles.mediaImage} />
                            <Text style={styles.mediaText}>{m.titulo}</Text>
                        </View>
                    ))
                )}
            </View>

            <View style={styles.mediaSection}>
                <Text style={styles.sectionTitle}>Vídeos</Text>
                {videos.length === 0 ? (
                    <Text style={styles.emptyText}>Sem vídeos disponíveis.</Text>
                ) : (
                    videos.map((v) => (
                        <View key={v.id} style={styles.mediaItem}>
                            <Image source={{ uri: BASE_URL + v.ficheiroPath }} style={styles.mediaImage} />
                            <Text style={styles.mediaText}>{v.titulo}</Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    backText: {
        marginLeft: 6,
        fontSize: 16,
        color: "#4f46e5",
    },
    avatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignSelf: "center",
        marginBottom: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
    },
    detail: {
        fontSize: 15,
        marginBottom: 4,
        textAlign: "center",
    },
    mediaSection: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    mediaItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    mediaImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    mediaText: {
        fontSize: 15,
    },
    emptyText: {
        fontStyle: "italic",
        color: "#888",
    },
    error: {
        fontSize: 16,
        color: "red",
    },
});
