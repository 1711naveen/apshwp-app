import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from "react-native-swiper";
import Colors from "../../constants/Colors";
import Page1 from "./page1";
import Page2 from "./page2";
import Page3 from "./page3";
import Page4 from "./page4";
import Splash2 from "./splash2";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>

      <Swiper
        showsPagination={true}
        loop={false}
        horizontal={true}
        index={0}
      >
        {/* <SplashScreen /> */}
        <Splash2 />
        <Page1 />
        <Page2 />
        <Page3 />
        <Page4 />
      </Swiper>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
});
