import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Test from "./Test";
import { useEffect } from "react";
import { Options } from "./MAIN/Options";
import { Menu } from "./MAIN/Menu";
import { NewItem } from "./MAIN/NewItem";
import { EditItem } from "./MAIN/EditItem";
import { Rewards } from "./MAIN/Rewards";
import { Specials } from "./MAIN/Specials";
import { Settings } from "./MAIN/Settings";
import { Orders } from "./MAIN/Orders";
import { SalesReport } from "./MAIN/SalesReport";
import { Updates } from "./MAIN/Updates";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // function_NotificationsSetup();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="options">
        <Stack.Screen
          name="options"
          component={Options}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="menu"
          component={Menu}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="new-item"
          component={NewItem}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="edit-item"
          component={EditItem}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="rewards"
          component={Rewards}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="specials"
          component={Specials}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="settings"
          component={Settings}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="orders"
          component={Orders}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="sales-report"
          component={SalesReport}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="updates"
          component={Updates}
          options={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="test"
          component={Test}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
