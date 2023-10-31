// @flow strict
import { type Node, useEffect, useRef } from 'react';
import { FloatingFocusManager } from '@floating-ui/react';
import classnames from 'classnames';
import usePopover, { DIRECTIONS_MAP, SIDES_MAP } from './usePopover.js';
import borders from '../Borders.css';
import Caret from '../Caret.js';
import colors from '../Colors.css';
import styles from '../Contents.css';
import { type MainDirections } from '../utils/positioningTypes.js';
import { CARET_HEIGHT, CARET_WIDTH } from '../utils/positioningUtils.js';

export type Role = 'dialog' | 'listbox' | 'menu' | 'tooltip';

type Props = {
  accessibilityLabel?: string,
  anchor: HTMLElement,
  bgColor: 'blue' | 'darkGray' | 'orange' | 'red' | 'white',
  border?: boolean,
  caret?: boolean,
  children?: Node,
  id: ?string,
  idealDirection?: MainDirections,
  onKeyDown: (event: SyntheticKeyboardEvent<HTMLElement>) => void,
  role: ?Role,
  rounding?: 2 | 4,
  shouldFocus?: boolean,
  width: ?number,
  scrollBoundary?: HTMLElement,
};

export default function Contents({
  accessibilityLabel,
  anchor,
  bgColor,
  border = true,
  caret = true,
  children,
  id,
  idealDirection,
  role,
  rounding,
  width,
  shouldFocus = true,
  onKeyDown,
  scrollBoundary,
}: Props): Node {
  const caretRef = useRef<HTMLElement | null>(null);
  const idealPlacement = idealDirection ? DIRECTIONS_MAP[idealDirection] : 'top';

  const { refs, placement, floatingStyles, middlewareData, context } = usePopover({
    anchor,
    caretElement: caretRef.current,
    direction: idealPlacement,
    scrollBoundary,
  });

  const caretOffset = middlewareData.arrow;
  const visibility = middlewareData.hide?.referenceHidden === true ? 'hidden' : 'visible';
  const background = bgColor === 'white' ? `${bgColor}BgElevated` : `${bgColor}Bg`;
  const bgColorElevated = bgColor === 'white' ? 'whiteElevated' : bgColor;
  const isCaretVertical = placement === 'top' || placement === 'bottom';

  const popoverCaret = (
    <div
      ref={caretRef}
      className={classnames(colors[bgColorElevated], styles.caret)}
      style={{
        left: caretOffset?.x != null ? `${caretOffset.x}px` : '',
        top: caretOffset?.y != null ? `${caretOffset.y}px` : '',
        [placement]: '100%',
      }}
    >
      <Caret
        direction={SIDES_MAP[placement]}
        height={isCaretVertical ? CARET_HEIGHT : CARET_WIDTH}
        width={isCaretVertical ? CARET_WIDTH : CARET_HEIGHT}
      />
    </div>
  );

  useEffect(() => {
    if (shouldFocus && refs.floating.current) {
      refs.floating.current.focus();
    }
  }, [refs.floating, shouldFocus]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <FloatingFocusManager context={context}>
      <div
        ref={refs.setFloating}
        tabIndex={-1}
        className={classnames(
          styles.container,
          rounding === 2 && borders.rounding2,
          rounding === 4 && borders.rounding4,
          styles.contents,
          styles.maxDimensions,
          width !== null && styles.minDimensions,
        )}
        style={{ ...floatingStyles, visibility }}
      >
        {caret && popoverCaret}

        <div
          aria-label={accessibilityLabel}
          id={id}
          role={role}
          className={classnames(
            border && styles.border,
            colors[background],
            colors[bgColorElevated],
            rounding === 2 && borders.rounding2,
            rounding === 4 && borders.rounding4,
            styles.innerContents,
            styles.maxDimensions,
            width !== null && styles.minDimensions,
          )}
          style={{
            maxWidth: width,
          }}
        >
          {children}
        </div>
      </div>
    </FloatingFocusManager>
  );
}
