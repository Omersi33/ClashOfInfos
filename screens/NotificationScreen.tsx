import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../services/NotificationService";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      setNotifications((prev) => [...prev, notification.request.content.body || "Notification reçue"]);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  notification: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
});

export default NotificationScreen;