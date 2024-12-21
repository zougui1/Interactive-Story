import Markdown, { RuleType, type MarkdownToJSX } from 'markdown-to-jsx';

import { cn } from '@renderer/utils';

const renderRule = (
  next: () => React.ReactNode,
  node: MarkdownToJSX.ParserResult,
  renderChildren: MarkdownToJSX.RuleOutput,
  state: MarkdownToJSX.State,
): React.ReactNode => {
  if (node.type === RuleType.image && node.alt) {
    const [name, value] = node.alt.split('=');

    if (name.trim() !== 'color') {
      return next();
    }

    return (
      <span key={state.key} style={{ color: value }}>
        {node.target}
      </span>
    );
  }

  return next();
}

export const AppMarkdown = ({ className, ...rest }: AppMarkdownProps) => {
  return (
    <Markdown
      {...rest}
      options={{ renderRule, forceBlock: true }}
      className={cn('overflow-y-auto', className)}
    />
  );
}

export interface AppMarkdownProps extends Omit<React.HTMLAttributes<Element>, 'children'> {
  children: string;
}
