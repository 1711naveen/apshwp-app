import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import Page1 from "./page1";
import Page2 from "./page2";
import Page3 from "./page3";

export default function OnboardingScreen() {
  return (
    <Swiper
      showsPagination={true}
      loop={false}
      horizontal={true}
      index={0}
    >
      <Page1 />
      <Page2 />
      <Page3 />
    </Swiper>
  );
}
