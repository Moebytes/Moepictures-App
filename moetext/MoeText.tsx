/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moepictures - A cute and moe anime image board ❤          *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import functions from "../functions/Functions"
import {View, Image, Pressable, TextStyle, Platform} from "react-native"
import Text from "./TextFallback"
import Video from "react-native-video"
import {createStylesheet} from "./styles/MoeText.styles"
import {Session} from "../types/Types"
import {siteURL} from "../ui/site"
import {ThemeColors} from "../ui/colors"
import SpoilerText from "./SpoilerText"
import ExpandDetails from "./ExpandDetails"
import FavivonLink from "./FaviconLink"
import Link from "./Link"
import React from "react"

type MoeTextNode = {
    kind: "format" | "color" | "details" | "code" | "link" | "url"
    value: string
    children: (string | MoeTextNode)[]
    summary?: (string | MoeTextNode)[]
}

type OpenSegment = {
    opener: string
    closer: string
    node: MoeTextNode
    children: (string | MoeTextNode)[]
}

export default class MoeText {
    public static parseMarkup = (text: string) => {
        const root: (string | MoeTextNode)[] = []
        const stack: OpenSegment[] = []
        const children = () => stack[stack.length - 1]?.children ?? root

        const appendText = (value: string) => {
            const target = children()
            if (typeof target[target.length - 1] === "string") {
                target[target.length - 1] = (target[target.length - 1] as string) + value
            } else if (value) {
                target.push(value)
            }
        }

        const open = (kind: MoeTextNode["kind"], value: string, opener: string, closer: string) => {
            const node: MoeTextNode = {kind, value, children: []}
            stack.push({opener, closer, node, children: node.children})
        }

        const close = () => {
            const current = stack.pop()!
            if (current.node.kind === "details" && typeof current.node.children[0] === "string") {
                current.node.children[0] = current.node.children[0].trimStart()
            }
            children().push(current.node)
        }

        const tokenPatterns = {
            code: /```/,
            link: /\[[^\]\n]*\]\([^\n)]*\)/,
            url: /https?:\/\/\S+/,
            email: /\b[A-Za-z0-9._%+-]+[@＠][A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
            emoji: /:[^\s:]+:/,
            color: /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\{/,
            detailsEnd: /\|\|>>/,
            detailsStart: /<</,
            bold: /\*\*/,
            italic: /\/\//,
            underline: /__/,
            strikethrough: /~~/,
            spoiler: /\|\|/,
            highlight: /==/,
            colorEnd: /}/
        }

        const tokens = new RegExp(Object.values(tokenPatterns).map((pattern) => pattern.source).join("|"), "g")
        let position = 0
        let match: RegExpExecArray | null

        while ((match = tokens.exec(text))) {
            appendText(text.slice(position, match.index))
            const token = match[0]
            position = tokens.lastIndex
            const current = stack[stack.length - 1]

            if (token === "```") {
                const end = text.indexOf("```", position)
                if (end === -1) {
                    appendText(token)
                } else {
                    children().push({kind: "code", value: text.slice(position, end), children: []})
                    position = tokens.lastIndex = end + 3
                }
            } else if (token.startsWith("[")) {
                const separator = token.indexOf("](")
                const label = token.slice(1, separator)
                const destination = token.slice(separator + 2, -1)
                children().push({kind: "link", value: destination, children: this.parseMarkup(label)})
            } else if (token.startsWith("http://") || token.startsWith("https://")) {
                let end = token.length
                for (const parent of stack) {
                    const index = token.indexOf(parent.closer, token.indexOf("://") + 3)
                    if (index !== -1) end = Math.min(end, index)
                }
                children().push({kind: "url", value: token.slice(0, end), children: []})
                position = tokens.lastIndex = match.index + end
            } else if (token.includes("@") || token.includes("＠") || token.startsWith(":")) {
                appendText(token)
            } else if (current && token === current.closer) {
                if (current.node.kind === "details" && !current.node.summary) {
                    appendText(token)
                } else {
                    close()
                }
            } else if (token === "||" && current?.node.kind === "details" && !current.node.summary) {
                current.node.summary = current.children
                current.node.children = current.children = []
            } else if (token === "<<") {
                open("details", "", token, "||>>")
            } else if (token.startsWith("#")) {
                open("color", token.slice(0, -1), token, "}")
            } else if (token === "}" || token === "||>>") {
                appendText(token)
            } else {
                open("format", token, token, token)
            }
        }

        appendText(text.slice(position))

        while (stack.length) {
            const current = stack.pop()!
            appendText(current.opener)
            if (current.node.summary) {
                children().push(...current.node.summary)
                appendText("||")
            }
            children().push(...current.children)
        }

        return root
    }


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

    public static generateMarkup = (items: {text: any, type?: string, jsx: any}[], colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        let jsx = [] as React.ReactElement[]
        let skipFlag = false
        items.forEach((item, index) => {
            if (skipFlag) { 
                skipFlag = false 
                return 
            }
            if (item.jsx) {
                jsx.push(React.cloneElement(item.jsx, {key: index}))
            } else {
                const nextItem = items[index + 1]

                if (nextItem?.type === "faviconlink" && 
                    item.text.length < 100 && nextItem?.text > 50) {
                    skipFlag = true
                    jsx.push(
                        <View style={styles.groupContainer}>
                            <Text key={index} style={styles.text} 
                            selectable uiTextView selectionColor={colors.borderColor}>
                                {functions.render.trimStartNewline(item.text)}
                            </Text>
                            {nextItem.jsx}
                        </View>
                    )
                } else {
                    jsx.push(<Text key={index} style={styles.text} 
                        selectable uiTextView selectionColor={colors.borderColor}>
                            {functions.render.trimStartNewline(item.text)}
                        </Text>)
                }
            }
        })
        return (
            <View style={styles.markupContainer}>
                {jsx}
            </View>
        )
    }

    public static parseBullets = (text: string) => {
        return text.replace(/(^|\n)-\s+/g, "$1▪ ")
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
                items.push({text: null, jsx: <Image key={index} style={styles.emoji} src={emojis[key]}/>})
            } else {
                items.push({text: part, jsx: null})
            }
        })
        return items
    }

    public static linkReplacements = async (text: string, session: Session) => {
        let parsed = text

        const postMatches = Array.from(parsed.matchAll(/\bPost\s+#(\d+)\b/gi))
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
        let items = [] as {text: any, type?: string, jsx: any}[]
        const parts = text.split(/(\[.*?\]\(.*?\)|https?:\/\/[^\s]+)/g)


        parts.forEach((part, index) => {
            if (part.match(/^\[.*?\]\(.*?\)$/)) {
                const match = part.match(/^\[(.*?)\]\((.*?)\)$/)
                if (match) {
                    const [_, name, link] = match
                    items.push({text: null, jsx: <Link key={index} style={{fontWeight: "bold"}} href={link}>{name}</Link>})
                }
            } else if (part.match(/(https?:\/\/[^\s]+)/g)) {
                let href = part
                let name = part
                let tagLink = false
                let postID = ""
                if (name.includes(`${siteURL}/post`)) {
                    postID = name.replace(siteURL, "").match(/\d+/)?.[0] || ""
                    name = `Post #${postID}`
                    href = part.replace(siteURL, "moepics:/")
                }
                if (name.includes(`${siteURL}/tag`)) {
                    name = `${name.replace(siteURL, "").match(/(?<=\/tag\/)(.+)/)?.[0] || ""}`
                    tagLink = true
                    href = part.replace(siteURL, "moepics:/")
                }
                if (name.includes(`${siteURL}/thread`)) name = `Thread #${name.replace(siteURL, "").match(/\d+/)?.[0] || ""}`
                if (name.includes(`${siteURL}/message`)) name = `Message #${name.replace(siteURL, "").match(/\d+/)?.[0] || ""}`
                if (name.includes(`${siteURL}/user`)) name = `${name.replace(siteURL, "").match(/(?<=\/user\/)(.+)/)?.[0] || ""}`
                
                if (functions.util.arrayIncludes(name, ["Post"])) {
                    items.push({text: null, jsx: <Link key={index} href={href}>{name}</Link>})
                } else if (functions.util.arrayIncludes(name, ["Thread", "Message"]) || tagLink) {
                    items.push({text: null, jsx: <Link key={index} href={href}>{name}</Link>})
                } else if (functions.file.isImage(part) || functions.file.isGIF(part)) {
                    items.push({text: null, jsx: <Image key={index} style={styles.image} src={href}/>})
                } else if (functions.file.isVideo(part)) {
                    items.push({text: null, jsx: <Video key={index} style={styles.video} source={{uri: href}} muted controls/>})
                } else {
                    items.push({text: name, type: "faviconlink", jsx: <FavivonLink key={index} href={href}>{name}</FavivonLink>})
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

    public static renderCommentaryText = (text: string, emojis: any, colors: ThemeColors) => {
        if (!text) return []
        let items = this.parseLinks(text, colors)
        items = this.appendChain(items, this.parseEmails, colors)
        items = this.appendParamChain(items, emojis, this.parseEmojis, colors)
        return this.generateMarkup(items, colors)
    }

    public static commonChain = (text: string, emojis: any, colors: ThemeColors) => {
        const styles = createStylesheet(colors)
        type Item = {text: any, type?: string, jsx: any}

        const formatStyles: Record<string, TextStyle> = {
            "**": {...styles.boldText, fontWeight: "bold"},
            "//": {...styles.italicText, fontStyle: "italic"},
            "__": {textDecorationLine: "underline"},
            "~~": {textDecorationLine: "line-through"},
            "==": {color: colors.highlightColor}
        }

        const render = (nodes: (string | MoeTextNode)[], inherited: TextStyle = {}, inLink = false) => {
            const styleElement = (element: React.ReactElement<any>): React.ReactElement<any> => {
                if (element.type === Image || element.type === Video) return element
                return React.cloneElement(element, {style: [element.props.style, inherited]})
            }
            
            return nodes.flatMap((node): Item[] => {
                if (typeof node === "string") {
                    let items: Item[] = [{text: node, jsx: null}]
                    if (!inLink) items = this.appendChain(items, this.parseEmails, colors)
                    items = this.appendParamChain(items, emojis, this.parseEmojis, colors)
                    return items.filter((item) => item.jsx || item.text).map((item, index) => ({
                        ...item, jsx: item.jsx ? styleElement(item.jsx) : (
                            <Text key={index} style={[styles.text, inherited]} selectable uiTextView
                                selectionColor={colors.borderColor}>{item.text}</Text>
                        )
                    }))
                }
                if (node.kind === "code") {
                    return [{text: null, jsx: (
                        <Text style={[inherited, styles.codeText, {color: inherited.color ?? styles.text.color}]} 
                        selectable uiTextView selectionColor={colors.borderColor}>{node.value}</Text>
                    )}]
                }
                if (node.kind === "url") {
                    if (inLink) return [{text: null, jsx: <Text style={[styles.text, inherited]}>{node.value}</Text>}]
                    return this.parseLinks(node.value, colors).filter((item) => item.jsx).map((item) => ({
                        ...item, jsx: styleElement(item.jsx)
                    }))
                }
                if (node.kind === "link") {
                    const label = this.generateMarkup(render(node.children, {
                        color: colors.highlightColor, fontWeight: "bold", ...inherited
                    }, true), colors)
                    return [{text: null, jsx: inLink ? label : (
                        <Link block href={node.value}>{label}</Link>
                    )}]
                }
                if (node.kind === "details") {
                    return [{text: null, jsx: (
                        <ExpandDetails style={[styles.text, inherited]}
                        summary={this.generateMarkup(render(node.summary ?? [], inherited, inLink), colors)}
                        details={this.generateMarkup(render(node.children, inherited, inLink), colors)}/>
                    )}]
                }
                if (node.value === "||") {
                    return [{text: null, jsx: (
                        <SpoilerText style={[styles.text, inherited]}>
                            {this.generateMarkup(render(node.children, inherited, inLink), colors)}
                        </SpoilerText>
                    )}]
                }
                const own = node.kind === "color" ? {color: node.value} : formatStyles[node.value]
                const combined = {...inherited, ...own}
                if (node.value === "**" || node.value === "//") combined.color = inherited.color ?? styles.text.color
                if (inherited.textDecorationLine && own.textDecorationLine &&
                    inherited.textDecorationLine !== own.textDecorationLine) {
                    combined.textDecorationLine = "underline line-through"
                }
                // Fallback to system font since the bundled fonts don't support bold and italic at the same time
                if (combined.fontWeight === "bold" && combined.fontStyle === "italic") {
                    combined.fontFamily = Platform.OS === "ios" ? "System" : "sans-serif"
                    combined.fontSize = styles.boldText.fontSize
                }
                return render(node.children, combined, inLink)
            })
        }

        const bullets = this.parseBullets(text)
        return render(this.parseMarkup(bullets))
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
        const grouped: string[] = []
        for (const piece of pieces) {
            const previous = grouped[grouped.length - 1]
            if (previous !== undefined && !previous.startsWith(">") && !piece.startsWith(">")) {
                grouped[grouped.length - 1] += piece
            } else {
                grouped.push(piece)
            }
        }
        for (let i = 0; i < grouped.length; i++) {
            const piece = grouped[i]
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
        return (
            <View style={styles.markupContainer}>
                {jsx}
            </View>
        )
    }

    public static resizeElements = (rendered: React.ReactNode, fontSize: number, imageSize: number) => {
        const resizeElement = (element: React.ReactElement<any>, index: number): React.ReactElement<any> => {
            if (element.type === Image) {
                return React.cloneElement(element, {
                    key: index,
                    style: [element.props.style, {width: imageSize, height: imageSize}]
                })
            }

            const children = React.Children.map(element.props.children, (child, childIndex) => {
                if (!React.isValidElement(child)) return child
                return resizeElement(child, childIndex)
            })

            return React.cloneElement(element, {
                key: index,
                ...(element.type === Text ? {style: [element.props.style, {fontSize}]} : {}),
                ...(element.type === ExpandDetails ? {
                    summary: this.resizeElements(element.props.summary, fontSize, imageSize),
                    details: this.resizeElements(element.props.details, fontSize, imageSize)
                } : {}),
                children
            })
        }

        return React.Children.map(rendered, (element, index) => {
            if (!React.isValidElement(element)) return element
            return resizeElement(element, index)
        })
    }
}