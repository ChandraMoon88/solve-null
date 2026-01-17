'use client'

import { useAutoTranslate } from '@/hooks/useTranslation'
import { ReactNode } from 'react'

interface TranslateProps {
  children: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * Component that automatically translates its text content based on selected language
 * @example
 * <Translate>Hello World</Translate>
 * <Translate as="h1" className="text-2xl">Welcome</Translate>
 */
export function Translate({ children, className, as: Component = 'span' }: TranslateProps) {
  const translatedText = useAutoTranslate(children)
  
  return <Component className={className}>{translatedText}</Component>
}

interface TranslateHTMLProps {
  html: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * Component that automatically translates HTML content
 * @example
 * <TranslateHTML html="<p>Hello World</p>" />
 */
export function TranslateHTML({ html, className, as: Component = 'div' }: TranslateHTMLProps) {
  const translatedText = useAutoTranslate(html)
  
  return <Component className={className} dangerouslySetInnerHTML={{ __html: translatedText }} />
}
