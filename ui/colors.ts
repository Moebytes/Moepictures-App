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
    tagColorGlass: "rgba(100, 31, 255, 0.41)",

    favoriteBorder: "#e72d95",
    favgroupBorder: "#c22de7",
    variationBorder: "#1664de",
    parentBorder: "#1eab3c",
    childBorder: "#c59f23",
    groupBorder: "#ff5c2e",
    takendownBorder: "#7f0a0a",
    lockedBorder: "#b40e1d",

    userColor: "#4b48ff",
    contributorColor: "#b948ff",
    curatorColor: "#fc279f",
    premiumColor: "#ff22e5",
    systemColor: "#ffa923",
    modColor: "#1365f6",
    adminColor: "#d70c67"
}

export const noRotationLight = {
    blueIcon: "#628FFF",
    optionBlueActive: "#76AAFF",
    optionBlueInactive: "#E7F0FF",
    redIcon: "#ff3277",
    optionRedActive: "#e2296a",
    optionRedInactive: "#ffc8da",
    optionReset: "#F2F0F7"
}

export const noRotationDark = {
    blueIcon: "#628FFF",
    optionBlueActive: "#76AAFF",
    optionBlueInactive: "#182945",
    redIcon: "#ff3277",
    optionRedActive: "#ff377d",
    optionRedInactive: "#451823",
    optionReset: "#F2F0F7"
}

export const sharedColors = {
    buttonColorGlass: "rgba(255, 87, 157, 0.57)",
    toastColor: "#FF63B4",
    drawerTitle: "#ff4cc6"
}

export const LightTheme = {
    ...noRotation,
    ...noRotationLight,
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
	profileBG: "#FFC6E3",
	profileSeperator: "#ffc6e3",
	profileLogin: "#ffe3f2",
	itemBG: "#FFF1F8",
    glassTint: "rgba(255, 160, 212, 0.5)",
    optionActive: "#FF4F91",
    optionInactive: "#FFEAF6"
}

export const DarkTheme = {
    ...noRotation,
    ...noRotationDark,
    ...sharedColors,
    switchOn: "#FF579D",
    switchOff: "#FFDAEF",
    transparent: "rgba(0, 0, 0, 0)",
    iconColor: "#FF4891",
    iconActive: "#ffc6de",
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
    glassTint: "rgba(72, 13, 47, 0.2)",
    optionActive: "#FF4F91",
    optionInactive: "#331928"
}

export type ThemeColors = typeof LightTheme