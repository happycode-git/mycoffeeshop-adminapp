import { View } from "react-native";
import {
  IconButtonTwo,
  SideBySide,
  TextView,
  layout,
  secondaryThemedTextColor,
} from "../EVERYTHING/BAGEL/Things";

export function TopOne({ icon, onPress, theme }) {
  return (
    <View style={[layout.padding_horizontal, layout.padding_vertical_small]}>
      <IconButtonTwo
        name={icon !== undefined ? icon : "chevron-back-outline"}
        theme={theme}
        onPress={
          onPress !== undefined
            ? onPress
            : () => {
                console.log("PRESSED");
              }
        }
      />
    </View>
  );
}
export function TopTwo({
  iconLeft,
  iconRight,
  onLeftPress,
  onRightPress,
  theme,
}) {
  return (
    <View
      style={[
        layout.padding_horizontal,
        layout.padding_vertical_small,
        layout.separate_horizontal,
      ]}
    >
      <IconButtonTwo
        name={iconLeft !== undefined ? iconLeft : "chevron-back-outline"}
        theme={theme}
        onPress={
          onLeftPress !== undefined
            ? onLeftPress
            : () => {
                console.log("PRESSED");
              }
        }
      />
      <IconButtonTwo
        name={iconRight !== undefined ? iconRight : "search-outline"}
        theme={theme}
        onPress={
          onRightPress !== undefined
            ? onRightPress
            : () => {
                console.log("PRESSED");
              }
        }
      />
    </View>
  );
}
export function TopThree({ icon, title, onPress, theme }) {
  return (
    <View style={[layout.padding_horizontal, layout.padding_vertical_small]}>
      <SideBySide>
        <IconButtonTwo
          name={icon !== undefined ? icon : "chevron-back-outline"}
          theme={theme}
          onPress={
            onPress !== undefined
              ? onPress
              : () => {
                  console.log("PRESSED");
                }
          }
        />
        <TextView theme={theme} size={20}>
          {title !== undefined ? title : "Hello, Bagel!"}
        </TextView>
      </SideBySide>
    </View>
  );
}
export function TopFour({
  iconLeft,
  iconRight,
  title,
  onLeftPress,
  onRightPress,
  theme,
}) {
  return (
    <View
      style={[
        layout.padding_horizontal,
        layout.padding_vertical_small,
        layout.separate_horizontal,
      ]}
    >
      <SideBySide>
        <IconButtonTwo
          name={iconLeft !== undefined ? iconLeft : "chevron-back-outline"}
          theme={theme}
          onPress={
            onLeftPress !== undefined
              ? onLeftPress
              : () => {
                  console.log("PRESSED");
                }
          }
        />
        <TextView theme={theme} size={20}>
          {title !== undefined ? title : "Hello, Bagel!"}
        </TextView>
      </SideBySide>
      <IconButtonTwo
        name={iconRight !== undefined ? iconRight : "search-outline"}
        theme={theme}
        onPress={
          onRightPress !== undefined
            ? onRightPress
            : () => {
                console.log("PRESSED");
              }
        }
      />
    </View>
  );
}
export function TopFive({ title, caption, theme }) {
  return (
    <View style={[layout.padding_horizontal, layout.padding_vertical_small]}>
      <TextView size={24} theme={theme}>
        {title !== undefined ? title : "Hello, Bagel!"}
      </TextView>
      {caption !== undefined && (
        <TextView theme={theme} size={20} color={secondaryThemedTextColor(theme)}>
          {caption}
        </TextView>
      )}
    </View>
  );
}
export function TopSix({ title, caption, icon, onPress, theme }) {
  return (
    <View
      style={[
        layout.padding_horizontal,
        layout.padding_vertical_small,
        layout.separate_horizontal,
      ]}
    >
      <View>
        <TextView size={24} theme={theme}>
          {title !== undefined ? title : "Hello, Bagel!"}
        </TextView>
        {caption !== undefined && (
          <TextView theme={theme} size={20} color={secondaryThemedTextColor(theme)}>
            {caption}
          </TextView>
        )}
      </View>
      <IconButtonTwo
        theme={theme}
        name={icon !== undefined ? icon : "search-outline"}
        onPress={
          onPress !== undefined
            ? onPress
            : () => {
                console.log("PRESSED");
              }
        }
      />
    </View>
  );
}
