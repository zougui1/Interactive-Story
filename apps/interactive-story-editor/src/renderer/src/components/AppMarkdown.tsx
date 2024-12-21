import Markdown, { RuleType, type MarkdownToJSX } from 'markdown-to-jsx';

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

    console.log(node);
    return (
      <span key={state.key} style={{ color: value }}>
        {node.target}
      </span>
    );
  }

  return next();
}

export const AppMarkdown = (props: AppMarkdownProps) => {
  return (
    <Markdown
      {...props}
      options={{ renderRule, forceBlock: true }}
    />
  );
}

export interface AppMarkdownProps extends Omit<React.HTMLAttributes<Element>, 'children'> {
  children: string;
}
