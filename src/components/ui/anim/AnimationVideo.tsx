import { useVideoPlayer, VideoView, VideoViewProps } from "expo-video";
import { StyleProp } from "react-native";

export default function AnimationVideo({
    source,
    ...props
}: {
    source: any;
} & VideoViewProps) {
    const player = useVideoPlayer(source, (player) => {
        player.loop = true;
        player.audioMixingMode = "mixWithOthers";
        player.showNowPlayingNotification = false;
        player.play();
    });

    return <VideoView nativeControls={false} {...props} player={player} />;
}
