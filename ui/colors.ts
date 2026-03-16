/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const baseColors = {
    artistTagColor: "#ff1994",
    characterTagColor: "#ff1ce6",
    seriesTagColor: "#b32fff",
    metaTagColor: "#339fff",
    appearanceTagColor: "#8928ff",
    outfitTagColor: "#ff29b5",
    accessoryTagColor: "#2be941",
    actionTagColor: "#ff8e2b",
    sceneryTagColor: "#2b6aff",
    tagColor: "#641fff"
}

export const LightTheme = {
    ...baseColors,
    switchOn: "#FF579D",
    switchOff: "#FFDAEF",
    transparent: "rgba(0, 0, 0, 0.5)",
    iconColor: "#FF579D",
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
	itemBG: "#FFF1F8"
}

export const DarkTheme = {
    ...baseColors,
    switchOn: "#FF579D",
    switchOff: "#FFDAEF",
    transparent: "rgba(0, 0, 0, 0)",
    iconColor: "#FF4891",
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
	profileBG: "#1e0411",
	profileSeperator: "#4a092a",
	profileLogin: "#361128",
	itemBG: "#1B0B12"
}

export type ThemeColors = typeof LightTheme