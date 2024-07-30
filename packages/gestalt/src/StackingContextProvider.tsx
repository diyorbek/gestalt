import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

type ZIndexMap = Record<string, number>;

const StackingContext = createContext<ZIndexMap>({});

export function useZIndexLabel(label?: string): number | undefined {
  const zIndexMap = useContext(StackingContext);

  if (!label) return undefined;

  if (!(label in zIndexMap))
    throw new Error(
      `Component with zIndexLabel="${label}" is not registered in the StackingContextProvider.`,
    );

  return zIndexMap[label];
}

type Props = PropsWithChildren<{
  label?: string;
  labels: string[];
}>;

export default function StackingContextProvider({ children, label: currentLabel, labels }: Props) {
  const zIndex = useZIndexLabel(currentLabel);
  const zIndexMap: ZIndexMap = useMemo(
    () => labels.reduce((map, label, i) => ({ ...map, [label]: i + 1 }), {} as ZIndexMap),
    [labels],
  );

  return (
    <StackingContext.Provider value={zIndexMap}>
      <div style={{ isolation: 'isolate', zIndex }}>{children}</div>;
    </StackingContext.Provider>
  );
}
