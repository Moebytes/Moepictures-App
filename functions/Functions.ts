/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import ByteFunctions from "./ByteFunctions"
import CacheFunctions from "./CacheFunctions"
import CryptoFunctions from "./CryptoFunctions"
import DateFunctions from "./DateFunctions"
import FileFunctions from "./FileFunctions"
import HTTPFunctions from "./HTTPFunctions"
import ImageFunctions from "./ImageFunctions"
import LinkFunctions from "./LinkFunctions"
import TagFunctions from "./TagFunctions"
import UtilFunctions from "./UtilFunctions"

export default class Functions {
    public static byte = ByteFunctions
    public static cache = CacheFunctions
    public static crypto = CryptoFunctions
    public static date = DateFunctions
    public static file = FileFunctions
    public static http = HTTPFunctions
    public static image = ImageFunctions
    public static link = LinkFunctions
    public static tag = TagFunctions
    public static util = UtilFunctions

    public static timeout = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}