"use client"

import {
    defineSchema,
    EditorProvider,
    PortableTextEditable,
    useEditor,
    useEditorSelector,
} from '@portabletext/editor'
import type {
    PortableTextBlock,
    RenderDecoratorFunction,
    RenderStyleFunction,
    RenderListItemFunction,
    RenderAnnotationFunction
} from '@portabletext/editor'
import * as selectors from '@portabletext/editor/selectors'
import { EventListenerPlugin } from '@portabletext/editor/plugins'
import {
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Type,
    List,
    ListOrdered,
    Link as LinkIcon,
    ImageIcon,
    Trash2,
    Heading4,
    Heading5,
    Heading6
} from "lucide-react"
import { MediaPicker } from "@/components/admin/media/MediaPicker"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import React from 'react'
import { cn } from "@/lib/utils"
import { urlFor } from '@/sanity/lib/image'

const schemaDefinition = defineSchema({
    decorators: [
        { name: 'strong', title: 'Bold' },
        { name: 'em', title: 'Italic' },
        { name: 'underline', title: 'Underline' }
    ],
    styles: [
        { name: 'normal', title: 'Normal' },
        { name: 'h1', title: 'Heading 1' },
        { name: 'h2', title: 'Heading 2' },
        { name: 'h3', title: 'Heading 3' },
        { name: 'h4', title: 'Heading 4' },
        { name: 'h5', title: 'Heading 5' },
        { name: 'h6', title: 'Heading 6' },
        { name: 'blockquote', title: 'Quote' },
    ],
    lists: [
        { name: 'bullet', title: 'Bullet List' },
        { name: 'number', title: 'Numbered List' }
    ],
    annotations: [
        {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
                {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                },
            ],
        },
    ],
    inlineObjects: [],
    blockObjects: [
        {
            name: 'image',
            title: 'Image',
            type: 'object',
            fields: [
                {
                    name: 'url',
                    type: 'string',
                },
                {
                    name: 'asset',
                    type: 'object',
                    fields: [
                        { name: '_ref', type: 'string' },
                        { name: '_type', type: 'string' }
                    ]
                }
            ]
        }
    ],
})

const icons: Record<string, any> = {
    strong: Bold,
    em: Italic,
    underline: Underline,
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
    h5: Heading5,
    h6: Heading6,
    blockquote: Quote,
    normal: Type,
    bullet: List,
    number: ListOrdered,
    link: LinkIcon
}

function ToolbarButton({
    isActive,
    onClick,
    icon: Icon,
    title
}: {
    isActive: boolean,
    onClick: (e: React.MouseEvent) => void,
    icon: any,
    title: string
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={onClick}
                    className={cn("h-8 w-8 p-0", isActive && "bg-muted text-foreground")}
                    type="button"
                >
                    <Icon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{title}</p>
            </TooltipContent>
        </Tooltip>
    )
}

function Toolbar() {
    const editor = useEditor()

    const activeState = useEditorSelector(editor, (snapshot) => ({
        decorators: {
            strong: selectors.isActiveDecorator('strong')(snapshot),
            em: selectors.isActiveDecorator('em')(snapshot),
            underline: selectors.isActiveDecorator('underline')(snapshot),
        },
        styles: {
            normal: selectors.isActiveStyle('normal')(snapshot),
            h1: selectors.isActiveStyle('h1')(snapshot),
            h2: selectors.isActiveStyle('h2')(snapshot),
            h3: selectors.isActiveStyle('h3')(snapshot),
            h4: selectors.isActiveStyle('h4')(snapshot),
            h5: selectors.isActiveStyle('h5')(snapshot),
            h6: selectors.isActiveStyle('h6')(snapshot),
            blockquote: selectors.isActiveStyle('blockquote')(snapshot),
        },
        lists: {
            bullet: selectors.isActiveListItem('bullet')(snapshot),
            number: selectors.isActiveListItem('number')(snapshot),
        },
        link: selectors.isActiveAnnotation('link')(snapshot)
    }))

    const toggleStyle = (style: string, e: React.MouseEvent) => {
        e.preventDefault()
        editor.send({ type: 'style.toggle', style })
        editor.send({ type: 'focus' })
    }

    const toggleDecorator = (decorator: string, e: React.MouseEvent) => {
        e.preventDefault()
        editor.send({ type: 'decorator.toggle', decorator })
        editor.send({ type: 'focus' })
    }

    const toggleList = (list: string, e: React.MouseEvent) => {
        e.preventDefault()
        editor.send({ type: 'list item.toggle', listItem: list })
        editor.send({ type: 'focus' })
    }

    const toggleLink = (e: React.MouseEvent) => {
        e.preventDefault()

        if (activeState.link) {
            const snapshot = editor.getSnapshot()
            const activeAnnotations = selectors.getActiveAnnotations(snapshot)
            const activeLink = activeAnnotations.find(a => a._type === 'link')

            if (activeLink) {
                editor.send({
                    type: 'annotation.toggle',
                    annotation: { name: 'link', value: activeLink }
                })
            }
            editor.send({ type: 'focus' })
        } else {
            const href = window.prompt('Enter Link URL')
            if (href) {
                editor.send({
                    type: 'annotation.toggle',
                    annotation: { name: 'link', value: { href } }
                })
                editor.send({ type: 'focus' })
            }
        }
    }

    const insertImage = (asset: { _id: string, url: string }) => {
        editor.send({
            type: 'insert.block',
            placement: 'after',
            block: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                },
                url: asset.url
            }
        })
        editor.send({ type: 'focus' })
    }



    return (
        <TooltipProvider>
            <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap sticky top-0 z-10">
                {/* Decorators */}
                {schemaDefinition.decorators.map((decorator) => {
                    const Icon = icons[decorator.name] || Type
                    const isActive = activeState.decorators[decorator.name as keyof typeof activeState.decorators]
                    return (
                        <ToolbarButton
                            key={decorator.name}
                            isActive={isActive}
                            onClick={(e) => toggleDecorator(decorator.name, e)}
                            icon={Icon}
                            title={decorator.title}
                        />
                    )
                })}

                <Select
                    value={schemaDefinition.styles.find(s => activeState.styles[s.name as keyof typeof activeState.styles])?.name || 'normal'}
                    onValueChange={(value) => {
                        editor.send({ type: 'style.toggle', style: value })
                        editor.send({ type: 'focus' })
                    }}
                >
                    <SelectTrigger className="h-8 w-[130px] border-none bg-transparent shadow-none focus:ring-0">
                        <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                        {schemaDefinition.styles.map((style) => (
                            <SelectItem key={style.name} value={style.name}>
                                {style.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists */}
                {schemaDefinition.lists.map((list) => {
                    const Icon = icons[list.name] || List
                    const isActive = activeState.lists[list.name as keyof typeof activeState.lists]
                    return (
                        <ToolbarButton
                            key={list.name}
                            isActive={isActive}
                            onClick={(e) => toggleList(list.name, e)}
                            icon={Icon}
                            title={list.title}
                        />
                    )
                })}

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Link */}
                <ToolbarButton
                    isActive={activeState.link}
                    onClick={toggleLink}
                    icon={LinkIcon}
                    title="Link"
                />

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Image */}
                <MediaPicker
                    onSelect={insertImage}
                    trigger={
                        <div className="inline-flex">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        title="Insert Image"
                                        type="button"
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Insert Image</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    }
                />

                <Separator orientation="vertical" className="h-6 mx-1" />


            </div>
        </TooltipProvider>
    )
}

type Props = {
    value: Array<PortableTextBlock> | undefined
    setValue: (value: Array<PortableTextBlock> | undefined) => void
}

export function CustomPortableTextEditor({ value, setValue }: Props) {


    const renderStyle: RenderStyleFunction = (props) => {
        if (props.schemaType.value === 'h1') {
            return <h1 className="text-3xl font-bold mt-6 mb-2">{props.children}</h1>
        }
        if (props.schemaType.value === 'h2') {
            return <h2 className="text-2xl font-semibold mt-5 mb-2">{props.children}</h2>
        }
        if (props.schemaType.value === 'h3') {
            return <h3 className="text-xl font-medium mt-4 mb-2">{props.children}</h3>
        }
        if (props.schemaType.value === 'h4') {
            return <h4 className="text-lg font-medium mt-3 mb-2">{props.children}</h4>
        }
        if (props.schemaType.value === 'h5') {
            return <h5 className="text-md font-medium mt-2 mb-2">{props.children}</h5>
        }
        if (props.schemaType.value === 'h6') {
            return <h6 className="text-sm font-medium mt-1 mb-2">{props.children}</h6>
        }
        if (props.schemaType.value === 'blockquote') {
            return <blockquote className="border-l-4 border-primary pl-4 italic my-4">{props.children}</blockquote>
        }
        if (props.schemaType.value === 'normal') {
            return <p className="mb-2 leading-relaxed">{props.children}</p>
        }
        return <>{props.children}</>
    }

    const renderDecorator: RenderDecoratorFunction = (props) => {
        if (props.value === 'strong') {
            return <strong className="font-bold">{props.children}</strong>
        }
        if (props.value === 'em') {
            return <em className="italic">{props.children}</em>
        }
        if (props.value === 'underline') {
            return <u className="underline underline-offset-4">{props.children}</u>
        }
        return <>{props.children}</>
    }

    const renderListItem: RenderListItemFunction = (props) => {
        if (props.schemaType.value === 'bullet') {
            return <li className="list-disc ml-4 mb-1">{props.children}</li>
        }
        if (props.schemaType.value === 'number') {
            return <li className="list-decimal ml-4 mb-1">{props.children}</li>
        }
        return <li className="ml-4">{props.children}</li>
    }

    const renderAnnotation: RenderAnnotationFunction = (props) => {
        if (props.schemaType.name === 'link') {
            const value = props.value as { href?: string } | undefined
            return (
                <a
                    href={value?.href}
                    className="text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer"
                    onClick={(e) => {
                        if (e.metaKey || e.ctrlKey) return;
                        e.preventDefault();
                        if (value?.href) window.open(value.href, '_blank');
                    }}
                    title="Click to open in new tab"
                >
                    {props.children}
                </a>
            )
        }
        return <>{props.children}</>
    }

    const renderBlock = (props: any) => {
        if (props.schemaType.name === 'image') {
            let imageUrl = props.value.url
            if (!imageUrl && props.value.asset) {
                try {
                    imageUrl = urlFor(props.value.asset).url()
                } catch (e) {
                    // Fallback or ignore
                }
            }



            return (
                <div className="my-8 relative group">
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imageUrl}
                            alt="Inserted image"
                            className="max-w-96 h-auto rounded-md border"
                        />
                    ) : (
                        <div className="bg-muted p-4 rounded-md text-center text-sm text-muted-foreground">
                            Image reference (preview unavailable)
                        </div>
                    )}
                </div>
            )
        }
        return <div className="mb-8">{props.children}</div>
    }

    return (
        <div className="border rounded-lg overflow-hidden bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring transition-all">
            <EditorProvider
                initialConfig={{
                    schemaDefinition,
                    initialValue: value,
                }}
            >
                <EventListenerPlugin
                    on={(event) => {
                        if (event.type === 'mutation') {
                            setValue(event.value)
                        }
                    }}
                />
                <Toolbar />
                <div className="p-4 min-h-[300px] max-w-none focus:outline-none">
                    <PortableTextEditable
                        style={{ outline: 'none' }}
                        renderStyle={renderStyle}
                        renderDecorator={renderDecorator}
                        renderListItem={renderListItem}
                        renderAnnotation={renderAnnotation}
                        renderBlock={renderBlock}
                        placeholder="Start writing your amazing content here..."
                        spellCheck
                    />
                </div>
            </EditorProvider>
        </div>
    )
}
