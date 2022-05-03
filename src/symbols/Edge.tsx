import React, { FC, useMemo } from 'react';
import { useSpring, a } from '@react-spring/three';
import { Arrow } from './Arrow';
import { Label } from './Label';
import {
  animationConfig,
  getMidPoint,
  getRotation,
  getPoints,
  EdgeVector
} from '../utils';
import { Line } from './Line';
import { Theme } from '../utils/themes';

export interface EdgeProps {
  theme: Theme;
  id: string;
  label?: string;
  size?: number;
  position: EdgeVector;
  labelVisible?: boolean;
  from: any;
  to: any;
}

export const Edge: FC<EdgeProps> = ({
  from,
  to,
  position,
  label,
  theme,
  labelVisible,
  size
}) => {
  const arrowSize = Math.max(size * 0.3, 1);
  const points = useMemo(
    () => getPoints({ from, to: { ...to, size: to.size + arrowSize + 6 } }),
    [from, to, arrowSize]
  );

  const realPoints = useMemo(() => getPoints({ from, to }), [from, to]);
  const midPoint = useMemo(() => getMidPoint(position), [position]);

  // TODO: Improve this
  const rotation = useMemo(() => getRotation(position), [position]);

  const selectionOpacity = 0.5;
  const { labelPosition } = useSpring({
    from: {
      labelPosition: [0, 0, 2]
    },
    to: {
      labelPosition: [midPoint.x, midPoint.y, 2]
    },
    config: animationConfig
  });

  return (
    <group>
      <Line
        color={theme.edge.fill}
        opacity={selectionOpacity}
        points={points}
        size={size}
      />
      <Arrow
        position={realPoints}
        color={theme.arrow.fill}
        opacity={selectionOpacity}
        size={arrowSize}
      />
      {labelVisible && label && (
        <a.group position={labelPosition as any}>
          <Label
            text={label}
            color={theme.edge.color}
            opacity={selectionOpacity}
            rotation={rotation}
            padding={80}
            fontSize={6}
          />
        </a.group>
      )}
    </group>
  );
};

Edge.defaultProps = {
  labelVisible: false,
  size: 1
};
