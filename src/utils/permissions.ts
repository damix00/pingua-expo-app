import * as Notifications from "expo-notifications";

export async function allowsNotificationsAsync() {
    const settings = await Notifications.getPermissionsAsync();
    return (
        settings.granted ||
        settings.ios?.status ===
            Notifications.IosAuthorizationStatus.PROVISIONAL
    );
}

export async function requestNotificationsAsync() {
    const result = await Notifications.requestPermissionsAsync({
        ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
        },
    });

    return (
        result.granted ||
        result.ios?.status == Notifications.IosAuthorizationStatus.PROVISIONAL
    );
}
