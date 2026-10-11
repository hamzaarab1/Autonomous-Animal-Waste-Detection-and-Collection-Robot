import { Alert, Platform } from 'react-native';

/** Simple message popup. React Native's Alert is a no-op on web, so the browser's alert is used there. */
export function notify(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}
