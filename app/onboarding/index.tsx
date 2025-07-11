import React from "react";
import Swiper from "react-native-swiper";
import Page1 from "./page1";
import Page2 from "./page2";
import Page3 from "./page3";
import SplashScreen from "./splash1";
import Splash2 from "./splash2";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from "react-native";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>

      <Swiper
        showsPagination={true}
        loop={false}
        horizontal={true}
        index={0}
      >
        <SplashScreen />
        <Splash2 />
        <Page1 />
        <Page2 />
        <Page3 />
      </Swiper>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F5',
  },
});
