/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {View, Text} from "react-native"
import ScalableHaptic from "../../ui/ScalableHaptic"
import {useThemeSelector, useMiscDialogActions, useFlagSelector, useFlagActions, useMiscDialogSelector} from "../../store"
import {createStylesheet} from "./styles/PageButtons.styles"

interface Props {
    page: number
    setPage: (page: number) => void
    totalPages: number
    hideEndArrow?: boolean
    marginTop?: number
    marginBottom?: number
}

const PageButtons: React.FunctionComponent<Props> = ({page, setPage, totalPages, 
    hideEndArrow, marginBottom, marginTop}) => {
    const {colors} = useThemeSelector()
    const styles = createStylesheet(colors)
    const {showPageDialog} = useMiscDialogSelector()
    const {setShowPageDialog} = useMiscDialogActions()
    const {pageFlag} = useFlagSelector()
    const {setPageFlag} = useFlagActions()

    useEffect(() => {
        if (pageFlag !== null) {
            let page = Math.max(1, Math.min(pageFlag, totalPages))
            setPage(page)
            setPageFlag(null)
        }
    }, [pageFlag])
    
    const getPageNumbers = () => {
        const numbers: number[] = []
        const buttonAmount = Math.min(3, totalPages)

        let start = page - Math.floor(buttonAmount / 2)
        let end = start + buttonAmount - 1

        if (start < 1) {
            start = 1
            end = buttonAmount
        }

        if (end > totalPages) {
            end = totalPages
            start = totalPages - buttonAmount + 1
        }

        for (let i = start; i <= end; i++) {
            numbers.push(i)
        }

        return numbers
    }

    const pageDialog = () => {
        setShowPageDialog(!showPageDialog)
    }

    const pageNumbers = getPageNumbers()

    return (
        <View style={[styles.container, {marginBottom, marginTop}]}>
            {page > 1 && (
                <ScalableHaptic scaleFactor={0.92} style={styles.button} onPress={() => setPage(Math.max(page - 1, 1))}>
                    <Text style={styles.text}>{"<"}</Text>
                </ScalableHaptic>
            )}

            {pageNumbers.map((num) => (
                <ScalableHaptic
                    scaleFactor={0.92}
                    key={num}
                    style={[styles.button, num === page ? styles.activeButton : undefined]}
                    onPress={() => setPage(num)}>
                    <Text style={styles.text}>{num}</Text>
                </ScalableHaptic>
            ))}

            {page < totalPages && (
                <ScalableHaptic scaleFactor={0.92} style={styles.button} onPress={() => setPage(Math.min(page + 1, totalPages))}>
                    <Text style={styles.text}>{">"}</Text>
                </ScalableHaptic>
            )}

            {!hideEndArrow && page < totalPages && (
                <ScalableHaptic scaleFactor={0.92} style={styles.button} onPress={() => setPage(totalPages)}>
                    <Text style={styles.text}>{">>"}</Text>
                </ScalableHaptic>
            )}

            {totalPages > 0 && (
                <ScalableHaptic scaleFactor={0.92} style={styles.button} onPress={pageDialog}>
                    <Text style={styles.text}>{"?"}</Text>
                </ScalableHaptic>
            )}
        </View>
    )
}

export default PageButtons