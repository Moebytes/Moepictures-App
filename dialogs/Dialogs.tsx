/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import PageDialog from "./misc/PageDialog"
import SizeDialog from "./search/SizeDialog"
import SortDialog from "./search/SortDialog"

const Dialogs: React.FunctionComponent = () => {
    return (
        <>
        <PageDialog/>
        <SizeDialog/>
        <SortDialog/>
        </>
    )
}

export default Dialogs