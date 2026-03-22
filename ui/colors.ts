/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const noRotation = {
    black: "#000000",
    white: "#ffffff",
    
    artistTagColor: "#ff1994",
    characterTagColor: "#ff1ce6",
    seriesTagColor: "#b32fff",
    metaTagColor: "#339fff",
    appearanceTagColor: "#8928ff",
    outfitTagColor: "#ff29b5",
    accessoryTagColor: "#2be941",
    actionTagColor: "#ff8e2b",
    sceneryTagColor: "#2b6aff",
    tagColor: "#641fff",

    artistTagColorGlass: "rgba(255, 25, 148, 0.41)",
    characterTagColorGlass: "rgba(255, 28, 230, 0.41)",
    seriesTagColorGlass: "rgba(179, 47, 255, 0.41)",
    metaTagColorGlass: "rgba(51, 159, 255, 0.41)",
    appearanceTagColorGlass: "rgba(137, 40, 255, 0.41)",
    outfitTagColorGlass: "rgba(255, 41, 181, 0.41)",
    accessoryTagColorGlass: "rgba(43, 233, 65, 0.41)",
    actionTagColorGlass: "rgba(255, 142, 43, 0.41)",
    sceneryTagColorGlass: "rgba(43, 106, 255, 0.41)",
    tagColorGlass: "rgba(100, 31, 255, 0.41)"
}

export const sharedColors = {
    buttonColorGlass: "rgba(255, 87, 157, 0.57)"
}

export const LightTheme = {
    ...noRotation,
    ...sharedColors,
    switchOn: "#FF579D",
    switchOff: "#FFDAEF",
    transparent: "rgba(0, 0, 0, 0.5)",
    iconColor: "#FF579D",
    iconActive: "#ff8dbd",
    background: "#FFFFFF",
    borderColor: "#FF459F",
    textColor: "#000000",
    textColor2: "#FFFFFF",
    buttonColor: "#FF579D",
    mainColor: "#FFD6EB",
    searchBG: "#FFFFFF",
    pageNumFill: "#FFDFEC",
    pageNumColor: "#000000",
    headingColor: "#FF388B",
    moeTextA: "#FF307F",
    moeTextB: "#FF5099",
	profileItem: "#ffedf3",
    profileItemPressed: "#FFA3CB",
	profileBG: "#ffc6e3",
	profileSeperator: "#ffc6e3",
	profileLogin: "#ffe3f2",
	itemBG: "#FFF1F8",
    drawerTitle: "#ff2d8c",
    glassTint: "rgba(255, 160, 212, 0.5)"
}

export const DarkTheme = {
    ...noRotation,
    ...sharedColors,
    switchOn: "#FF579D",
    switchOff: "#FFDAEF",
    transparent: "rgba(0, 0, 0, 0)",
    iconColor: "#FF4891",
    iconActive: "#ff8dbd",
    background: "#10030C",
    borderColor: "#FF459F",
    textColor: "#FFFFFF",
    textColor2: "#000000",
    buttonColor: "#FF579D",
    mainColor: "#1C0713",
    searchBG: "#1C0713",
    pageNumFill: "#520025",
    pageNumColor: "#FFFFFF",
    headingColor: "#FF388B",
    moeTextA: "#FF307F",
    moeTextB: "#FF5099",
	profileItem: "#28111f",
    profileItemPressed: "#611B47",
	profileBG: "#1A040F",
	profileSeperator: "#4a092a",
	profileLogin: "#361128",
	itemBG: "#1B0B12",
    drawerTitle: "#ff2d8c",
    glassTint: "rgba(72, 13, 47, 0.2)"
}

export type ThemeColors = typeof LightTheme