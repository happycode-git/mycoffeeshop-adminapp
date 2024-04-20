import { useEffect, useState } from "react";
import {
  ButtonOne,
  Grid,
  Icon,
  IconButtonTwo,
  ModalView,
  OptionsView,
  SafeArea,
  SegmentedPickerTwo,
  SeparatedView,
  SideBySide,
  Spacer,
  TextIconPill,
  TextView,
  checkDate,
  compareDates,
  firebase_GetAllDocumentsListenerOrdered,
  firebase_GetDocument,
  firebase_UpdateDocument,
  format,
  getInDevice,
  layout,
  reduceArray,
  secondaryThemedBackgroundColor,
  secondaryThemedTextColor,
  sendPushNotification,
  themedBackgroundColor,
  width,
} from "../EVERYTHING/BAGEL/Things";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { TopFive } from "../SCREEN_COMPONENTS/Top";

export function Orders({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [theme, setTheme] = useState("");
const [me, setMe] = useState({})

  const [section, setSection] = useState("Preparing");
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [showPreparingOptions, setShowPreparingOptions] = useState(false);
  const [chosenOrderID, setChosenOrderID] = useState("");
  const [readyOrders, setReadyOrders] = useState([]);
  const [showReadyOptions, setShowReadyOptions] = useState(false);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showCompletedOptions, setShowCompletedOptions] = useState(false);
  const [chosenPhone, setChosenPhone] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [chosenOrder, setChosenOrder] = useState({})
  const [tax, setTax] = useState(8.75);

  useEffect(() => {
    getInDevice("theme", setTheme);
    getInDevice("user", (person) => {
      setMe(person)
      firebase_GetAllDocumentsListenerOrdered(
        setLoading,
        `Orders-${person.id}`,
        setPreparingOrders,
        0,
        "asc",
        "Date",
        "Status",
        "==",
        "Preparing",
        false,
        null,
        null,
        () => {},
        () => {},
        () => {}
      );
      firebase_GetAllDocumentsListenerOrdered(
        setLoading,
        `Orders-${person.id}`,
        setReadyOrders,
        0,
        "asc",
        "Date",
        "Status",
        "==",
        "Ready",
        false,
        null,
        null,
        () => {},
        () => {},
        () => {}
      );
      firebase_GetAllDocumentsListenerOrdered(
        setLoading,
        `Orders-${person.id}`,
        setCompletedOrders,
        0,
        "asc",
        "Date",
        "Status",
        "==",
        "Completed",
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
            title={"Orders"}
            caption={"Manage your orders."}
            theme={theme}
          />
        </SideBySide>
      </View>
      {/* BODY */}
      <View style={[layout.padding_horizontal]}>
        <SegmentedPickerTwo
          options={["Preparing", "Ready", "Completed"]}
          theme={theme}
          value={section}
          setter={setSection}
          textSize={24}
          paddingV={14}
        />
        <Spacer height={10} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {section === "Preparing" && (
              <View>
                {preparingOrders.length === 0 && (
                  <TextView theme={theme} size={22}>No orders yet.</TextView>
                )}
                <View style={[layout.horizontal]}>
                  <Grid columns={3} gap={10}>
                    {preparingOrders.map((order, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            {
                              backgroundColor:
                                secondaryThemedBackgroundColor(theme),
                              // width: "100%",
                              minHeight: width * 0.33,
                            },
                            layout.padding,
                          ]}
                          onPress={() => {
                            setChosenPhone(order.Phone);
                            setChosenOrderID(order.id);
                            setShowPreparingOptions(true);
                          }}
                        >
                          <TextView
                            theme={theme}
                            size={26}
                            bold={true}
                            styles={[format.all_caps]}
                          >
                            Order #{order.id.slice(-8)}
                          </TextView>
                          <TextView
                            theme={theme}
                            size={20}
                            styles={[format.all_caps]}
                          >
                            {order.FullName}
                          </TextView>
                          <SeparatedView>
                            <View>
                              <TextView
                                theme={theme}
                                size={20}
                                color={"#117DFA"}
                              >
                                {order.PickUp} pick up
                              </TextView>
                            </View>
                            {order.Arrived && (
                              <View style={[layout.padding_vertical_small]}>
                                <TextIconPill
                                  icon={"car-outline"}
                                  text={"Arrived"}
                                  iconSize={25}
                                  lightIconColor={"white"}
                                  darkIconColor={"white"}
                                  textSize={21}
                                  lightBackgroundColor={"#D6133B"}
                                  darkBackgroundColor={"#D6133B"}
                                />
                              </View>
                            )}
                          </SeparatedView>
                          <Spacer height={10} />
                          <View style={[layout.vertical]}>
                            {order.Items.map((item, it) => {
                              return (
                                <View key={it}>
                                  <SideBySide>
                                    <TextView size={20} theme={theme}>
                                      {item.Quantity}x
                                    </TextView>
                                    <TextView size={20} theme={theme}>
                                      {item.Item.Name}
                                    </TextView>
                                  </SideBySide>
                                  <View style={[layout.padding_horizontal]}>
                                    {item.ChosenOptions.map((opt, o) => {
                                      return (
                                        <SideBySide key={o}>
                                          <TextView theme={theme} size={20}>
                                            {opt.Name}
                                          </TextView>
                                          <TextView theme={theme} size={20}>
                                            {opt.OptionQuantity}x
                                          </TextView>
                                        </SideBySide>
                                      );
                                    })}
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </Grid>
                </View>
              </View>
            )}
            {section === "Ready" && (
              <View>
                {readyOrders.length === 0 && (
                  <TextView theme={theme} size={22}>No orders yet.</TextView>
                )}
                <View style={[layout.horizontal]}>
                  <Grid columns={3} gap={10}>
                    {readyOrders.map((order, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            {
                              backgroundColor:
                                secondaryThemedBackgroundColor(theme),
                              // width: "100%",
                              minHeight: width * 0.33,
                            },
                            layout.padding,
                          ]}
                          onPress={() => {
                            setChosenPhone(order.Phone);
                            setChosenOrderID(order)
                            setChosenOrderID(order.id);
                            setShowReadyOptions(true);
                          }}
                        >
                          <TextView
                            theme={theme}
                            size={26}
                            bold={true}
                            styles={[format.all_caps]}
                          >
                            Order #{order.id.slice(-8)}
                          </TextView>
                          <TextView
                            theme={theme}
                            size={20}
                            styles={[format.all_caps]}
                          >
                            {order.FullName}
                          </TextView>
                          <SeparatedView>
                            <View>
                              <TextView
                                theme={theme}
                                size={20}
                                color={"#117DFA"}
                              >
                                {order.PickUp} pick up
                              </TextView>
                            </View>
                            {order.Arrived && (
                              <View style={[layout.padding_vertical_small]}>
                                <TextIconPill
                                  icon={"car-outline"}
                                  text={"Arrived"}
                                  iconSize={25}
                                  lightIconColor={"white"}
                                  darkIconColor={"white"}
                                  textSize={21}
                                  lightBackgroundColor={"#D6133B"}
                                  darkBackgroundColor={"#D6133B"}
                                />
                              </View>
                            )}
                          </SeparatedView>
                          <Spacer height={10} />
                          <View style={[layout.vertical]}>
                            {order.Items.map((item, it) => {
                              return (
                                <View key={it}>
                                  <SideBySide>
                                    <TextView size={20} theme={theme}>
                                      {item.Quantity}x
                                    </TextView>
                                    <TextView size={20} theme={theme}>
                                      {item.Item.Name}
                                    </TextView>
                                  </SideBySide>
                                  <View style={[layout.padding_horizontal]}>
                                    {item.ChosenOptions.map((opt, o) => {
                                      return (
                                        <View key={o}>
                                          <SideBySide>
                                            <TextView theme={theme} size={20}>
                                              {opt.Name}
                                            </TextView>
                                            <TextView theme={theme} size={20}>
                                              {opt.OptionQuantity}x
                                            </TextView>
                                          </SideBySide>
                                        </View>
                                      );
                                    })}
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </Grid>
                </View>
              </View>
            )}
            {section === "Completed" && (
              <View>
                {completedOrders.length === 0 && (
                  <TextView theme={theme}>No orders yet.</TextView>
                )}
                <View style={[layout.horizontal]}>
                  <Grid columns={3} gap={10}>
                    {completedOrders.map((order, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            {
                              backgroundColor:
                                secondaryThemedBackgroundColor(theme),
                              // width: "100%",
                              minHeight: width * 0.33,
                            },
                            layout.padding,
                          ]}
                          onPress={() => {
                            setChosenPhone(order.Phone);
                            setChosenOrderID(order.id);
                            setShowCompletedOptions(true);
                          }}
                        >
                          <TextView
                            theme={theme}
                            size={26}
                            bold={true}
                            styles={[format.all_caps]}
                          >
                            Order #{order.id.slice(-8)}
                          </TextView>
                          <TextView
                            theme={theme}
                            size={20}
                            styles={[format.all_caps]}
                          >
                            {order.FullName}
                          </TextView>
                          <View>
                            <TextView theme={theme} size={20} color={"#117DFA"}>
                              {order.PickUp} pick up
                            </TextView>
                          </View>
                          <Spacer height={10} />
                          <View style={[layout.vertical]}>
                            {order.Items.map((item, it) => {
                              return (
                                <View key={it}>
                                  <SideBySide>
                                    <TextView size={22} theme={theme}>
                                      {item.Quantity}x
                                    </TextView>
                                    <TextView size={22} theme={theme}>
                                      {item.Item.Name}
                                    </TextView>
                                  </SideBySide>
                                  <SeparatedView>
                                    <View></View>
                                    <SideBySide>
                                      {item.Discounted > 0 && (
                                        <TextView
                                          theme={theme}
                                          size={20}
                                          styles={[format.strike]}
                                        >
                                          ${item.Item.Price.toFixed(2)}
                                        </TextView>
                                      )}
                                      <TextView theme={theme} size={24}>
                                        $
                                        {(
                                          item.Item.Price -
                                          item.Item.Price *
                                            item.Discounted *
                                            0.01
                                        ).toFixed(2)}
                                      </TextView>
                                    </SideBySide>
                                  </SeparatedView>
                                  <View style={[layout.padding_horizontal]}>
                                    {item.ChosenOptions.map((opt, o) => {
                                      return (
                                        <View key={o}>
                                          <SeparatedView>
                                            <View style={[{ flex: 1 }]}>
                                              <SideBySide>
                                                <TextView
                                                  theme={theme}
                                                  size={20}
                                                >
                                                  {opt.Name}
                                                </TextView>
                                                <TextView
                                                  theme={theme}
                                                  size={20}
                                                >
                                                  {opt.OptionQuantity}x
                                                </TextView>
                                              </SideBySide>
                                            </View>
                                            <TextView size={20} theme={theme}>
                                              ${opt.Amount.toFixed(2)}
                                            </TextView>
                                          </SeparatedView>
                                        </View>
                                      );
                                    })}
                                  </View>
                                  <View
                                    style={[
                                      {
                                        borderTopColor:
                                          secondaryThemedTextColor(theme),
                                        borderTopWidth: 1,
                                        marginVertical: 8,
                                      },
                                    ]}
                                  ></View>
                                  <SeparatedView>
                                    <View></View>
                                    <TextView
                                      theme={theme}
                                      size={24}
                                      bold={true}
                                      color={"#117DFA"}
                                    >
                                      ${item.Total.toFixed(2)}
                                    </TextView>
                                  </SeparatedView>
                                </View>
                              );
                            })}
                          </View>
                          <Spacer height={20} />
                          <View>
                            <SeparatedView>
                              <TextView theme={theme} size={20}>
                                Subtotal:{" "}
                              </TextView>
                              <TextView theme={theme} size={20}>
                                ${reduceArray(order.Items, "Total").toFixed(2)}
                              </TextView>
                            </SeparatedView>
                            <SeparatedView>
                              <TextView theme={theme} size={20}>
                                Tax:{" "}
                              </TextView>
                              <TextView theme={theme} size={20}>
                                $
                                {(
                                  reduceArray(order.Items, "Total") *
                                  tax *
                                  0.01
                                ).toFixed(2)}
                              </TextView>
                            </SeparatedView>
                            <SeparatedView>
                              <TextView
                                theme={theme}
                                size={28}
                                bold={true}
                                color={"#117DFA"}
                              >
                                Total:{" "}
                              </TextView>
                              <TextView
                                theme={theme}
                                size={28}
                                bold={true}
                                color={"#117DFA"}
                              >
                                $
                                {(
                                  reduceArray(order.Items, "Total") +
                                  reduceArray(order.Items, "Total") * tax * 0.01
                                ).toFixed(2)}
                              </TextView>
                            </SeparatedView>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </Grid>
                </View>
              </View>
            )}
          </View>
          <Spacer height={60} />
        </ScrollView>
      </View>

      {/*  */}
      {showPreparingOptions && (
        <OptionsView
          setToggle={setShowPreparingOptions}
          options={[
            {
              Icon: "call",
              Option: "Show Phone Number",
              Text: "Show the phone number of the customer.",
              Func: () => {
                setShowPhone(true);
                setShowPreparingOptions(false);
              },
            },
            {
              Icon: "hand-left",
              Option: "Mark As Ready",
              Text: "Select if the order has finished being prepared.",
              Func: () => {
                firebase_UpdateDocument(setLoading, `Orders-${me.id}`, chosenOrderID, {
                  Status: "Ready",
                });
                const chosenOrder = preparingOrders.find(
                  (ting) => ting.id === chosenOrderID
                );
                firebase_GetDocument(
                  setLoading,
                  "Users",
                  chosenOrder.UserID,
                  (user) => {
                    const token = user.Token;
                    if (token !== undefined) {
                      sendPushNotification(
                        token,
                        "Order Is Ready!",
                        "Please stop by soon to pick up your order."
                      );
                    }
                  }
                );
                setShowPreparingOptions(false);
                setChosenOrderID("");
              },
            },
          ]}
          theme={theme}
        />
      )}
      {showReadyOptions && (
        <OptionsView
          setToggle={setShowReadyOptions}
          options={[
            {
              Icon: "call",
              Option: "Show Phone Number",
              Text: "Show the phone number of the customer.",
              Func: () => {
                setShowPhone(true);
                setShowPreparingOptions(false);
              },
            },
            {
              Icon: "checkmark",
              Option: "Mark As Complete",
              Text: "Select if the order has been picked up by the customer.",
              Func: () => {
                firebase_UpdateDocument(setLoading, `Orders-${me.id}`, chosenOrderID, {
                  Status: "Completed",
                });
                firebase_GetDocument(
                  setLoading,
                  "Users",
                  chosenOrder.UserID,
                  (user) => {
                    const token = user.Token;
                    if (token !== undefined) {
                      sendPushNotification(
                        token,
                        "Order Complete",
                        "Thank you for your order! Please enjoy :)"
                      );
                    }
                  }
                );
                setShowReadyOptions(false);
                setChosenOrderID("");
              },
            },
          ]}
          theme={theme}
        />
      )}
      {showCompletedOptions && (
        <OptionsView
          setToggle={setShowCompletedOptions}
          options={[
            {
              Icon: "call",
              Option: "Show Phone Number",
              Text: "Show the phone number of the customer.",
              Func: () => {
                setShowPhone(true);
                setShowPreparingOptions(false);
              },
            },
          ]}
          theme={theme}
        />
      )}
      {showPhone && (
        <ModalView theme={theme} setToggle={setShowPhone}>
          <View style={[layout.padding, layout.center]}>
            <SideBySide>
              <Icon name={"call"} size={34} theme={theme} />
              <TextView theme={theme} size={38} bold={true}>
                {chosenPhone}
              </TextView>
            </SideBySide>
          </View>
        </ModalView>
      )}
    </SafeArea>
  );
}
