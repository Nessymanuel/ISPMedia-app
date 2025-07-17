export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    Profile: undefined;
    EditProfile: undefined;
    PlaylistScreen: undefined;
    MyUploads: undefined;
    MyPlaylists: undefined;
    GruposListScreen: undefined;
    MyNotification: undefined;
    ContentDetail: { id: string };
    MusicPlayer: {
    music: {
      title: string;
      artist: string;
      capa: string;
    };
  };

    VideoPlayer: { video: { id: number; tituloVideo: string; nomeArtista: string } };

    Dashboard: undefined;
    MusicListScreen: undefined;
    MusicPlayerScreen: { music: { title: string; artist: string } };
    ArtistList: undefined;
    AlbumList: undefined;
    Radio: undefined;
    Notifications: undefined;
    Library: undefined;
    ArtistDetail: { id: number };
    AlbumDetail: { id: number };
    RadioList: undefined;
};
