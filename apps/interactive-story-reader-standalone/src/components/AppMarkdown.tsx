import { memo } from 'react';
import Markdown, { RuleType, type MarkdownToJSX } from 'markdown-to-jsx';

import { cn } from '~/utils';

const renderRule = (
  next: () => React.ReactNode,
  node: MarkdownToJSX.ParserResult,
  _renderChildren: MarkdownToJSX.RuleOutput,
  state: MarkdownToJSX.State,
): React.ReactNode => {
  if (node.type === RuleType.newlineCoalescer) {
    return <br />;
  }

  if (node.type === RuleType.image && node.alt) {
    const [name, value] = node.alt.split('=');

    if (name.trim() !== 'color') {
      return next();
    }

    return (
      <span key={state.key} style={{ color: value }}>
        {[node.target, node.title].filter(Boolean).join(' ')}
      </span>
    );
  }

  return next();
}

export const AppMarkdown = memo(({ className, forceNewLines, children, ...rest }: AppMarkdownProps) => {
  return (
    <Markdown
      {...rest}
      options={{ renderRule, forceBlock: true }}
      className={cn('overflow-y-auto', className)}
    >
      {forceNewLines ? children.replaceAll('\n', '\n\n') : children}
    </Markdown>
  );
});

AppMarkdown.displayName = 'AppMarkdown';

export interface AppMarkdownProps extends Omit<React.HTMLAttributes<Element>, 'children'> {
  children: string;
  forceNewLines?: boolean;
}
