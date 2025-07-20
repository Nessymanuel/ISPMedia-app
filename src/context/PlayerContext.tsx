import React, { createContext, useState, useRef, useContext } from "react";
import { Audio } from "expo-av";

type Musica = {
  id: number;
  tituloMusica: string;
  nomeArtista: string;
  capaMusica: string;
  ficheiroMusica: string;
};

interface PlayerContextType {
  currentMusic: Musica | null;
  isPlaying: boolean;
  playMusic: (musica: Musica) => void;
  togglePlayPause: () => void;
  setCurrentMusic: (musica: Musica) => void;
}

const PlayerContext = createContext<PlayerContextType>({} as PlayerContextType);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentMusic, setCurrentMusic] = useState<Musica | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const playMusic = async (musica: Musica) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: `${process.env.API_BASE_URL}${musica.ficheiroMusica}` },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setCurrentMusic(musica);
      setIsPlaying(true);
    } catch (error) {
      console.error("Erro ao tocar música:", error);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded) {
      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <PlayerContext.Provider value={{ currentMusic, isPlaying, playMusic, togglePlayPause, setCurrentMusic }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);