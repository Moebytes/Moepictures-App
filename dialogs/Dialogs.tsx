/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import PageDialog from "./misc/PageDialog"
import SizeDialog from "./search/SizeDialog"
import SortDialog from "./search/SortDialog"
import PageMultiplierDialog from "./search/PageMultiplierDialog"
import EditCommentDialog from "./comment/EditCommentDialog"
import EditBioDialog from "./user/EditBioDialog"
import AliasTagDialog from "./tag/AliasTagDialog"
import ParentDialog from "./post/ParentDialog"
import GroupDialog from "./group/GroupDialog"
import FavgroupDialog from "./group/FavgroupDialog"

const Dialogs: React.FunctionComponent = () => {
    return (
        <>
        <PageDialog/>
        <SizeDialog/>
        <SortDialog/>
        <PageMultiplierDialog/>
        <EditCommentDialog/>
        <EditBioDialog/>
        <AliasTagDialog/>
        <ParentDialog/>
        <GroupDialog/>
        <FavgroupDialog/>
        </>
    )
}

export default Dialogs