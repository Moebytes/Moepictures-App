import React, {useRef, useEffect, useState} from "react"
import {Animated, LayoutChangeEvent, ViewStyle} from "react-native"
import {useLayoutActions} from "../../store"

interface Props {
  visible: boolean
  children: React.ReactElement[]
  style?: ViewStyle
  duration?: number
}

const AnimatedHeaderWrapper: React.FunctionComponent<Props> = (props) => {
    const [localHeight, setLocalHeight] = useState(0)
    const {setHeaderHeight} = useLayoutActions()
    const translateY = useRef(new Animated.Value(0)).current

    const onLayout = (event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height
        if (height !== localHeight) {
            setLocalHeight(height)
            setHeaderHeight(height)
        }
    }

    useEffect(() => {
        Animated.timing(translateY, {
        toValue: props.visible ? 0 : -localHeight,
        duration: props.duration ?? 300,
        useNativeDriver: true
        }).start()
    }, [props.visible, localHeight, props.duration])

    return (
        <Animated.View onLayout={onLayout}
        style={[{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            transform: [{translateY}]
            }, props.style]}>
        {props.children}
        </Animated.View>
    )
}

export default AnimatedHeaderWrapper