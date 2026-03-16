/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {useRef} from "react"
import {NativeSyntheticEvent, NativeScrollEvent} from "react-native"
import {useLayoutSelector} from "../../store"

export const useAutoHideScroll = (onVisibilityChange?: (visible: boolean) => void, threshold = 10) => {
    const {tabBarHeight} = useLayoutSelector()
    const lastOffset = useRef(0)

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offset = event.nativeEvent.contentOffset.y
        const layoutHeight = event.nativeEvent.layoutMeasurement.height
        const contentHeight = event.nativeEvent.contentSize.height

        if (offset <= 0) {
            lastOffset.current = offset
            return onVisibilityChange?.(true)
        }

        if (offset + layoutHeight >= contentHeight - tabBarHeight) {
            lastOffset.current = offset
            return onVisibilityChange?.(true)
        }

        if (Math.abs(offset - lastOffset.current) < threshold) return

        if (offset > lastOffset.current) {
            onVisibilityChange?.(false)
        } else {
            onVisibilityChange?.(true)
        }

        lastOffset.current = offset
    }

  return {handleScroll}
}