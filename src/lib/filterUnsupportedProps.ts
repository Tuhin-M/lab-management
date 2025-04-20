// Utility to filter out unsupported data-lov-* and data-component-* props
export function filterUnsupportedProps(props: Record<string, any>) {
  const filtered: Record<string, any> = {};
  Object.keys(props).forEach(key => {
    if (!key.startsWith('data-lov-') && !key.startsWith('data-component-')) {
      filtered[key] = props[key];
    }
  });
  return filtered;
}
