/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import ByteFunctions from "./ByteFunctions"
import CryptoFunctions from "./CryptoFunctions"
import FileFunctions from "./FileFunctions"
import HTTPFunctions from "./HTTPFunctions"
import ImageFunctions from "./ImageFunctions"
import UtilFunctions from "./UtilFunctions"

export default class Functions {
    public static byte = ByteFunctions
    public static crypto = CryptoFunctions
    public static file = FileFunctions
    public static http = HTTPFunctions
    public static image = ImageFunctions
    public static util = UtilFunctions

    public static timeout = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}