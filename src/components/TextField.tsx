import { useColorModeValue } from '@chakra-ui/react'
import style from '../styles/TextField.module.css'

interface InputProps {
    style?: {}
    type?: string
    value?: any
    readOnly?: boolean
    placeholder?: string
    onChange?: (value: any) => void
    onKeyDown?: (value: any) => void
}

export default function TextField(props: InputProps) {
    return (
        <input
            style={props.style}
            type={props.type ?? 'text'}
            value={props.value}
            readOnly={props.readOnly}
            placeholder={props.placeholder}
            onChange={e => props.onChange?.(e.target.value)}
            onKeyDown={e => props.onKeyDown?.(e)}
            className={useColorModeValue(style.TextField, style.TextFieldDark)}
        />
    )
}