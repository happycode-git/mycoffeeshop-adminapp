import { useEffect, useState } from "react";
import {
  AsyncImage,
  ButtonOne,
  Grid,
  IconButtonTwo,
  SafeArea,
  SeparatedView,
  SideBySide,
  TextPill,
  TextView,
  firebase_GetAllDocuments,
  firebase_GetAllDocumentsListener,
  firebase_GetAllDocumentsListenerOrdered,
  getInDevice,
  layout,
  removeDuplicates,
  secondaryThemedBackgroundColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";

export function Menu({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [items, setItems] = useState([]);
  const [chosenCategory, setChosenCategory] = useState("");
  //

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      firebase_GetAllDocumentsListenerOrdered(
        setLoading,
        `Items-${person.id}`,
        setItems,
        0,
        "asc",
        "Category",
        "",
        "",
        "",
        false,
        null,
        null,
        () => {},
        () => {},
        () => {}
      );
    });
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      {/* TOP */}
      <View style={[layout.padding_horizontal]}>
        <SeparatedView>
          <SideBySide>
            <IconButtonTwo
              theme={theme}
              size={26}
              name={"arrow-back-outline"}
              onPress={() => {
                navigation.navigate("options");
              }}
            />
            <TopFive
              title={"Menu"}
              caption={"Manage your menu items."}
              theme={theme}
            />
          </SideBySide>
          <ButtonOne
            backgroundColor={secondaryThemedBackgroundColor(theme)}
            radius={100}
            onPress={() => {
              navigation.navigate("new-item", { items, setItems });
            }}
          >
            <View style={[layout.padding_horizontal]}>
              <TextView size={18} theme={theme}>
                New Item
              </TextView>
            </View>
          </ButtonOne>
        </SeparatedView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Grid columns={2} gap={10}>
            {/* LEFT */}
            <View>
              {removeDuplicates(
                items.map((ting) => {
                  return ting.Category;
                })
              ).map((category, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      {
                        backgroundColor: secondaryThemedBackgroundColor(theme),
                      },
                      layout.padding,
                    ]}
                    onPress={() => {
                      setChosenCategory(category);
                    }}
                  >
                    <TextView theme={theme} size={24}>
                      {category}
                    </TextView>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* RIGHT */}
            <View>
              <Grid columns={2} gap={4}>
                {items
                  .filter((ting) => ting.Category === chosenCategory)
                  .map((item, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[layout.relative]}
                        onPress={() => {
                          navigation.navigate("edit-item", {
                            chosenItem: item,
                            items,
                            setItems,
                          });
                        }}
                      >
                        <AsyncImage
                          path={
                            item.ImagePath !== undefined
                              ? item.ImagePath
                              : "coffee.jpg"
                          }
                          width={"100%"}
                          height={width * 0.25}
                          radius={0}
                        />
                        <View
                          style={[
                            layout.absolute,
                            { bottom: 4, right: 4, left: 4 },
                          ]}
                        >
                          <View></View>
                          <View>
                            <TextPill
                              text={item.Name}
                              textSize={20}
                              theme={theme}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </Grid>
            </View>
          </Grid>
        </View>
      </ScrollView>
    </SafeArea>
  );
}
