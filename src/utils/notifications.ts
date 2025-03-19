import * as Notifications from "expo-notifications";
import { allowsNotificationsAsync } from "./permissions";
import { t } from "i18next";

export async function scheduleReminderNotifications() {
    const granted = await allowsNotificationsAsync();

    if (!granted) {
        return;
    }

    // Get a notification channel for the reminder
    const channel = await Notifications.getNotificationChannelAsync(
        "study-reminder"
    );

    // If the channel doesn't exist, create it
    if (!channel) {
        await Notifications.setNotificationChannelAsync("study-reminder", {
            name: "Study Reminder",
            importance: Notifications.AndroidImportance.HIGH,
        });
    }

    const count = 15;

    let notifications = [];

    for (let i = 1; i <= count; i++) {
        notifications.push({
            title: t(`notifications.reminders.r${i}.title`),
            body: t(`notifications.reminders.r${i}.body`),
        });
    }

    // 1 notification every day, for 7 days, at 2 PM
    for (let i = 1; i <= 7; i++) {
        const trigger = new Date();
        trigger.setHours(14, 0, 0, 0);
        trigger.setDate(trigger.getDate() + i);

        console.log(`Notification scheduled for ${trigger}`);

        const randomNotif: {
            title: string;
            body: string;
        } =
            i == 7
                ? {
                      title: t("notifications.reminders.final.title"),
                      body: t("notifications.reminders.final.body"),
                  }
                : notifications[
                      Math.floor(Math.random() * notifications.length)
                  ];

        // Remove the notification from the array so it doesn't repeat
        notifications = notifications.filter((n) => n !== randomNotif);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: randomNotif.title,
                body: randomNotif.body,
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: (trigger.getTime() - Date.now()) / 1000 + 5,
                channelId: "study-reminder",
                repeats: false,
            },
        });
    }
}

export async function cancelReminderNotifications() {
    console.log("Cancelling all scheduled notifications");

    await Notifications.cancelAllScheduledNotificationsAsync();
}
