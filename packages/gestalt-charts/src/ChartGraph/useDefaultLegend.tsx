import { ReactNode, useCallback } from 'react';
import { Box, Flex, Text } from 'gestalt';
import LegendIcon from './LegendIcon';

type ReferenceAreaSummaryItem = {
  label: string;
  style?: 'default';
};

export default function useDefaultLegend({
  isHorizontalBiaxialLayout,
  isVerticalBiaxialLayout,
  isRtl,
  height,
  labelMap,
  setLegendHeight,
  referenceAreaSummary,
}: {
  isHorizontalBiaxialLayout: boolean;
  isVerticalBiaxialLayout: boolean;
  isRtl: boolean;
  height: number;
  labelMap:
    | {
        [key: string]: string;
      }
    | null
    | undefined;
  setLegendHeight: (arg1: number) => void;
  referenceAreaSummary: null | ReadonlyArray<ReferenceAreaSummaryItem>;
}): (arg1: {
  payload: ReadonlyArray<{
    payload: {
      color: string | null | undefined;
      dataKey: string;
      fill: string | null | undefined;
      name: string;
      stroke: string | null | undefined;
      strokeDasharray: string | number | null | undefined;
      value: number;
    };
  }>;
}) => ReactNode {
  return useCallback(
    ({ payload }) => {
      const series = payload.map(
        ({
          payload: payloadData,
        }: {
          payload: {
            color: string | null | undefined;
            dataKey: string;
            fill: string | null | undefined;
            name: string;
            stroke: string | null | undefined;
            strokeDasharray: string | number | null | undefined;
            value: number;
          };
        }) => (
          <Flex key={payloadData.dataKey} gap={{ row: 2, column: 0 }}>
            <LegendIcon payloadData={{ ...payloadData, isLegend: true }} />
            <Text size="200">{labelMap?.[payloadData.dataKey] || payloadData.dataKey}</Text>
          </Flex>
        ),
      );

      const referenceAreas =
        referenceAreaSummary?.map(({ label }: ReferenceAreaSummaryItem) => (
          <Flex key={label} gap={{ row: 2, column: 0 }}>
            <LegendIcon payloadData={{ referenceArea: 'default', isLegend: true }} />
            <Text size="200">{label}</Text>
          </Flex>
        )) || [];

      const legendItemsArray = [...series, ...referenceAreas];

      if (isHorizontalBiaxialLayout) {
        return (
          <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <Box color="transparent" marginBottom={6} width="100%">
              <Flex justifyContent="between">{legendItemsArray.slice(0, 2)}</Flex>
            </Box>
          </div>
        );
      }

      if (isVerticalBiaxialLayout) {
        return (
          <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <Box
              alignContent="end"
              color="transparent"
              dangerouslySetInlineStyle={{ __style: { top: '-15px' } }}
              display="flex"
              height={height}
              position="absolute"
            >
              <Flex direction="column" justifyContent="between">
                {legendItemsArray.slice(0, 2)}
              </Flex>
            </Box>
          </div>
        );
      }

      return (
        <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          <Box
            ref={(ref) => {
              if (ref) setLegendHeight(ref.getBoundingClientRect().height);
            }}
            color="transparent"
            width="100%"
          >
            <Flex gap={{ row: 4, column: 0 }} wrap>
              {legendItemsArray}
            </Flex>
          </Box>
        </div>
      );
    },
    [
      isHorizontalBiaxialLayout,
      isVerticalBiaxialLayout,
      isRtl,
      height,
      labelMap,
      setLegendHeight,
      referenceAreaSummary,
    ],
  );
}
