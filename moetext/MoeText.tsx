/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "../functions/Functions"
import {View, Image, Pressable} from "react-native"
import {UITextView as Text} from "react-native-uitextview"
import Video from "react-native-video"
import {createStylesheet} from "./styles/MoeText.styles"
import {Session} from "../types/Types"
import {siteURL} from "../ui/site"
import {ThemeColors} from "../ui/colors"
import SpoilerText from "./SpoilerText"
import ExpandDetails from "./ExpandDetails"
import FavivonLink from "./FaviconLink"
import Link from "./Link"

export default class MoeText {
    public static appendChain = (items: {text: any, jsx: any}[], 
        func: (text: string, colors: ThemeColors) => {text: any, jsx: any}[],
        colors: ThemeColors) => {
        let result = [] as {text: any, jsx: any}[]
        for (const item of items) {
            if (item.jsx) {
                result.push(item)
            } else {
                result.push(...func(item.text, colors))
            }
        }
        return result
    }

    public static appendParamChain = (items: {text: any, jsx: any}[], param: any, 
        func: (text: string, param: any, colors: ThemeColors) => {text: any, jsx: any}[],
        colors: ThemeColors) => {
        let result = [] as {text: any, jsx: any}[]
        for (const item of items) {
            if (item.jsx) {
                result.push(item)
            } else {
                result.push(...func(item.text, param, colors))
            }
        }
        return result
    }

    public static generateMarkup = (items: {text: any, jsx: any}[], colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let jsx = [] as React.ReactElement[]
        items.forEach((item, index) => {
            if (item.jsx) {
                jsx.push(item.jsx)
            } else {
                jsx.push(<Text key={index} style={styles.text} 
                    selectable uiTextView selectionColor={colors.borderColor}>
                        {functions.render.trimStartNewline(item.text)}
                    </Text>)
            }
        })
        return jsx
    }

    public static parseBullets = (text: string) => {
        return [{text: text.replace(/(^|\n)-\s+/g, "$1▪ "), jsx: null}]
    }

    public static parseBold = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(\*\*[^*]+\*\*)/g)
        parts.forEach((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                const boldText = part.slice(2, -2)
                items.push({text: null, jsx: <Text key={index} style={[styles.boldText, {fontWeight: "bold"}]} 
                    selectable uiTextView selectionColor={colors.borderColor}>{boldText}</Text>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseItalic = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(\/\/[^/]+\/\/)/g)
        parts.forEach((part, index) => {
            if (part.startsWith("//") && part.endsWith("//")) {
                const italicText = part.slice(2, -2)
                items.push({text: null, jsx: <Text key={index} style={[styles.italicText, {fontStyle: "italic"}]} 
                    selectable uiTextView selectionColor={colors.borderColor}>{italicText}</Text>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseUnderline = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(\_\_[^_]+\_\_)/g)
        parts.forEach((part, index) => {
            if (part.startsWith("__") && part.endsWith("__")) {
                const underlineText = part.slice(2, -2)
                items.push({text: null, jsx: <Text key={index} style={[styles.text, {textDecorationLine: "underline"}]} 
                    selectable uiTextView selectionColor={colors.borderColor}>{underlineText}</Text>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseStrikethrough = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(\~\~[^~]+\~\~)/g)
        parts.forEach((part, index) => {
            if (part.startsWith("~~") && part.endsWith("~~")) {
                const strikethroughText = part.slice(2, -2)
                items.push({text: null, jsx: <Text key={index} style={[styles.text, {textDecorationLine: "line-through"}]} 
                    selectable uiTextView selectionColor={colors.borderColor}>{strikethroughText}</Text>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseSpoiler = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(\|\|[^|]+\|\|)/g)
        parts.forEach((part, index) => {
            if (part.startsWith("||") && part.endsWith("||")) {
                const spoilerText = part.slice(2, -2)
                items.push({text: null, jsx: <SpoilerText key={index} style={styles.text}>{spoilerText}</SpoilerText>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseHighlight = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(\=\=[^=]+\=\=)/g)
        parts.forEach((part, index) => {
            if (part.startsWith("==") && part.endsWith("==")) {
                const highlightText = part.slice(2, -2)
                items.push({text: null, jsx: <Text key={index} style={styles.highlightText} 
                    selectable uiTextView selectionColor={colors.borderColor}>{highlightText}</Text>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseColor = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        let index = 0
    
        while (index < text.length) {
            const hashIndex = text.indexOf("#", index)
    
            if (hashIndex === -1) {
                items.push({text: text.slice(index), jsx: null})
                break
            }
    
            if (hashIndex > index) {
                items.push({text: text.slice(index, hashIndex), jsx: null})
            }
    
            const hexColor = text.slice(hashIndex + 1, hashIndex + 7)
            if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(hexColor)) {
                const openingBraceIndex = text.indexOf("{", hashIndex + 7)
                const closingBraceIndex = text.indexOf("}", openingBraceIndex)
    
                if (openingBraceIndex !== -1 && closingBraceIndex !== -1) {
                    const colorText = text.slice(openingBraceIndex + 1, closingBraceIndex)
                    items.push({text: null, jsx: <Text key={items.length} style={[styles.text, {color: `#${hexColor}`}]} 
                        selectable uiTextView selectionColor={colors.borderColor}>{colorText}</Text>})
                    index = closingBraceIndex + 1
                    continue
                }
            }
            items.push({text: text.slice(hashIndex, hashIndex + 7), jsx: null})
            index = hashIndex + 7
        }
        return items
    }

    public static parseDetails = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        
        const parts = text.split(/(<<[\s\S]*?\|\|>>)/g)

        parts.forEach((part, index) => {
            if (part.startsWith("<<") && part.endsWith("||>>")) {
                const innerText = part.slice(2, -2)

                const firstDelim = innerText.indexOf("||")
                const lastDelim = innerText.lastIndexOf("||")

                const summary = innerText.slice(0, firstDelim).trim()
                const details = innerText.slice(firstDelim + 2, lastDelim).trim()

                items.push({text: null, jsx: <ExpandDetails key={index} style={styles.text}
                    summary={summary} details={details}/>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseCode = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(\`\`\`[\s\S]*?\`\`\`)/g)
        parts.forEach((part, index) => {
            if (part.startsWith("```") && part.endsWith("```")) {
                const codeText = part.slice(3, -3)
                items.push({text: null, jsx: <Text key={index} style={styles.codeText} 
                    selectable uiTextView selectionColor={colors.borderColor}>{codeText}</Text>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseMention = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(@\w+)/g)
        parts.forEach((part, index) => {
            if (part.startsWith("@")) {
                items.push({text: null, jsx: <Text key={index} style={styles.mentionText} 
                    selectable uiTextView selectionColor={colors.borderColor}>{part}</Text>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseEmojis = (text: string, emojis: any, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(:[^\s]+:)/g)
        parts.forEach((part, index) => {
            if (part.match(/(:[^\s]+:)/g)) {
                let key = part.split(":")[1]
                items.push({text: null, jsx: <Image key={index} style={styles.emoji} source={{uri: emojis[key]}}/>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static linkReplacements = async (text: string, session: Session) => {
        let parsed = text

        const postMatches = [...parsed.matchAll(/\bPost\s+#(\d+)\b/gi)]
        for (const match of postMatches) {
            const full = match[0]
            const id = match[1]

            try {
                const post = await functions.http.get(`/api/post`, {postID: id}, session)
                const link = `${siteURL}/post/${id}${post?.slug ? `/${post.slug}` : ""}`
                parsed = parsed.replace(full, link)
            } catch {
                parsed = parsed.replace(full, `${siteURL}/post/${id}`)
            }
        }

        parsed = parsed.replace(/\b(Thread|Message)\s+#(\d+)\b/gi, (match, type, id) => {
            const lower = type.toLowerCase()
            return `${siteURL}/${lower}/${id}`
        })

        parsed = parsed.replace(/\[\[([^\]\s]+)\]\]/g, (match, tag) => {
            return `${siteURL}/tag/${tag}`
        })

        return parsed
    }

    public static undoLinkReplacements = (text: string) => {
        const escapedDomain = siteURL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        let parsed = text

        let postRegex = new RegExp(`${escapedDomain}/post/(\\d+)(?:/[^\\s]+)?`, "gi")
        parsed = parsed.replace(postRegex, (match, id) => `Post #${id}`)

        let threadRegex = new RegExp(`${escapedDomain}/thread/(\\d+)`, "gi")
        parsed = parsed.replace(threadRegex, (match, id) => `Thread #${id}`)

        let messageRegex = new RegExp(`${escapedDomain}/message/(\\d+)`, "gi")
        parsed = parsed.replace(messageRegex, (match, id) => `Message #${id}`)

        let userRegex = new RegExp(`${escapedDomain}/user/([^\\s/]+)`, "gi")
        parsed = parsed.replace(userRegex, (match, username) => username)

        let tagRegex = new RegExp(`${escapedDomain}/tag/([^\\s/]+)`, "gi")
        parsed = parsed.replace(tagRegex, (match, tag) => `[[${tag}]]`)

        return parsed
    }

    public static parseLinks = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(\[.*?\]\(.*?\)|https?:\/\/[^\s]+)/g)


        parts.forEach((part, index) => {
            if (part.match(/^\[.*?\]\(.*?\)$/)) {
                const match = part.match(/^\[(.*?)\]\((.*?)\)$/)
                if (match) {
                    const [_, name, link] = match
                    items.push({text: null, jsx: <Link key={index} style={{fontWeight: "bold"}} href={link}>{name}</Link>})
                }
            } else if (part.match(/(https?:\/\/[^\s]+)/g)) {
                let name = part
                let tagLink = false
                let postID = ""
                if (name.includes(`${siteURL}/post`)) {
                    postID = name.replace(siteURL, "").match(/\d+/)?.[0] || ""
                    name = `Post #${postID}`
                }
                if (name.includes(`${siteURL}/thread`)) name = `Thread #${name.replace(siteURL, "").match(/\d+/)?.[0] || ""}`
                if (name.includes(`${siteURL}/message`)) name = `Message #${name.replace(siteURL, "").match(/\d+/)?.[0] || ""}`
                if (name.includes(`${siteURL}/user`)) name = `${name.replace(siteURL, "").match(/(?<=\/user\/)(.+)/)?.[0] || ""}`
                if (name.includes(`${siteURL}/tag`)) {
                    name = `${name.replace(siteURL, "").match(/(?<=\/tag\/)(.+)/)?.[0] || ""}`
                    tagLink = true
                }

                if (functions.util.arrayIncludes(name, ["Post"])) {
                    items.push({text: null, jsx: <Link key={index} href={part}>{name}</Link>})
                } else if (functions.util.arrayIncludes(name, ["Thread", "Message"]) || tagLink) {
                    items.push({text: null, jsx: <Link key={index} href={part}>{name}</Link>})
                } else if (functions.file.isImage(part) || functions.file.isGIF(part)) {
                    items.push({text: null, jsx: <Image key={index} style={styles.image} source={{uri: part}}/>})
                } else if (functions.file.isVideo(part)) {
                    items.push({text: null, jsx: <Video key={index} style={styles.image} source={{uri: part}} muted controls/>})
                } else {
                    items.push({text: null, jsx: <FavivonLink key={index} href={part}>{name}</FavivonLink>})
                }
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static parseEmails = (text: string, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let items = [] as {text: any, jsx: any}[]
        const parts = text.split(/(\b[A-Za-z0-9._%+-]+[@\uFF20][A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g)
        parts.forEach((part, index) => {
            if (part.match(/\b[A-Za-z0-9._%+-]+[@\uFF20][A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)) {
                items.push({text: null, jsx: (
                    <FavivonLink key={index} img={`${siteURL}/static/image/email.png`} href={`mailto:${part}`}>{part}</FavivonLink>
                )})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static renderCommentaryText = (text: string, colors: ThemeColors) => {
        if (!text) return []
        let items = this.parseLinks(text, colors)
        items = this.appendChain(items, this.parseEmails, colors)
        return this.generateMarkup(items, colors)
    }

    public static commonChain = (text: string, emojis: any, colors: ThemeColors) => {
        let items = this.parseBullets(text)
        items = this.appendChain(items, this.parseLinks, colors)
        items = this.appendChain(items, this.parseEmails, colors)
        items = this.appendParamChain(items, emojis, this.parseEmojis, colors)
        items = this.appendChain(items, this.parseDetails, colors)
        items = this.appendChain(items, this.parseHighlight, colors)
        items = this.appendChain(items, this.parseBold, colors)
        items = this.appendChain(items, this.parseItalic, colors)
        items = this.appendChain(items, this.parseUnderline, colors)
        items = this.appendChain(items, this.parseStrikethrough, colors)
        items = this.appendChain(items, this.parseSpoiler, colors)
        items = this.appendChain(items, this.parseColor, colors)
        items = this.appendChain(items, this.parseCode, colors)
        return items
    }

    public static renderCommentText = (text: string, emojis: any, colors: ThemeColors) => {
        let items = this.commonChain(text, emojis, colors)
        return this.generateMarkup(items, colors)
    }

    public static renderText = (text: string, emojis: any, colors: ThemeColors, 
        clickFunc?: (id: string) => any) => {
        const styles = createStylesheet(colors)
        const pieces = functions.render.parsePieces(text)
        let jsx = [] as React.ReactElement[]
        for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i]
            if (piece.startsWith(">")) {
                const matchPart = piece.match(/(>>>(\[\d+\])?)(.*?)(?=$|>)/gm)?.[0] ?? ""
                const userPart = matchPart.replace(/(>>>(\[\d+\])?\s*)/, "")
                const id = matchPart.match(/(?<=\[)\d+(?=\])/)?.[0] ?? ""
                let username = ""
                let said = ""
                if (userPart) {
                    username = functions.util.toProperCase(userPart.split(/ +/g)[0])
                    said = userPart.split(/ +/g).slice(1).join(" ")
                }
                const text = piece.replace(matchPart.replace(">>>", ""), "").replace(/>/g, "")
                jsx.push(
                    <View key={i} style={styles.quoteContainer}>
                        {userPart ? (
                            <Pressable onPress={() => clickFunc?.(id)}>
                                <Text style={styles.quoteUser} selectable uiTextView>{`${username.trim()} ${said.trim()}`}</Text>
                            </Pressable>
                         ) : null}
                        {this.renderCommentText(text, emojis, colors)}
                    </View>
                )
            } else {
                jsx.push(<>{this.renderCommentText(piece, emojis, colors)}</>)
            }
        }
        return jsx
    }
}