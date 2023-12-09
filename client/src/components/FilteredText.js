import React, { useMemo } from "react";

export default function FilteredText({ text }) {
    const filteredText = useMemo(() => {

        const newText = text.split(/(\[[^\]]*\]\([^\)]*\))/);
        const result = newText.map((segment, index) => {
            const match = segment.match(/\[(?<name>[^\]]*)\]\((?<hyperlink>[^\)]*)\)/);
            if (match == null) {
                return <span key={index}>{segment}</span>
            }
            const { name, hyperlink } = match.groups;
            return <a key={index} href={hyperlink} target="_blank">{name}</a>;
        })
        return result;
    }, [text]);
    
    return (
        <>
            {filteredText}
        </>
    )
}